/* ==========================================================
 * CAPY SFX — shared sound-effects helper backed by Web Audio
 * Host page declares:
 *   window.CAPY_SFX = {
 *     basePath: 'sfx/',
 *     sounds:   { 'zap': 'zap.mp3', ... }
 *   };
 * BEFORE this script runs. After load:
 *   capySfx.play('zap');
 *
 * Volume model:
 *   SFX play through a single master GainNode whose gain is set
 *   to musicVolume * SFX_BOOST (clamped to MAX_GAIN). This keeps
 *   every effect at the same level relative to the music and lets
 *   SFX sit above the music since GainNode can exceed 1.0
 *   (HTMLMediaElement.volume cannot).
 * ========================================================== */
(function () {
  'use strict';

  const cfg = window.CAPY_SFX;
  if (!cfg || !cfg.sounds || typeof cfg.sounds !== 'object') {
    console.warn('[capy-sfx] No CAPY_SFX config; SFX disabled.');
    return;
  }

  const SFX_BOOST = 1.8;   // master gain target = musicVolume * this
  const MAX_GAIN  = 2.2;   // safety ceiling on the master gain

  const baseUrl = (cfg.basePath || '').replace(/\/?$/, '/');

  // Normalize sound config: each entry can be a string filename OR an
  // object { file, gain } for per-sound boost layered on top of the
  // master gain. Per-sound gain is unbounded — use sparingly.
  const sounds = {};
  for (const key in cfg.sounds) {
    const v = cfg.sounds[key];
    sounds[key] = (typeof v === 'string')
      ? { file: v, gain: 1 }
      : { file: v.file, gain: Number.isFinite(v.gain) ? v.gain : 1 };
  }

  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) {
    console.warn('[capy-sfx] Web Audio not available; SFX disabled.');
    return;
  }

  let ctx = null;
  let master = null;
  const buffers = {};      // decoded audio buffers, keyed by sound name
  const pending = {};      // in-flight fetch promises

  function ensureContext() {
    if (ctx) return ctx;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
    return ctx;
  }

  function currentMusicVolume() {
    if (typeof window.capyMusicVolume === 'number') return window.capyMusicVolume;
    try {
      const raw = localStorage.getItem('capy_music_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Number.isFinite(parsed.volume)) return Math.max(0, Math.min(1, parsed.volume));
      }
    } catch {}
    return 0.6;
  }

  function syncMasterGain() {
    if (!master) return;
    const target = Math.min(MAX_GAIN, currentMusicVolume() * SFX_BOOST);
    master.gain.setTargetAtTime(target, ctx.currentTime, 0.01);
  }

  async function loadBuffer(name) {
    if (buffers[name]) return buffers[name];
    if (pending[name])  return pending[name];
    ensureContext();
    const def = sounds[name];
    if (!def) throw new Error('unknown sound: ' + name);
    const url = baseUrl + encodeURI(def.file);
    pending[name] = fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => new Promise((resolve, reject) =>
        ctx.decodeAudioData(buf, resolve, reject)
      ))
      .then(decoded => { buffers[name] = decoded; delete pending[name]; return decoded; })
      .catch(err => { delete pending[name]; console.warn('[capy-sfx] failed to load', name, err); throw err; });
    return pending[name];
  }

  // Kick off background preloads now so the first play has no fetch delay.
  // decodeAudioData works without a user gesture — only ctx.resume() requires one.
  for (const k in sounds) loadBuffer(k).catch(() => {});

  async function play(name) {
    try {
      ensureContext();
      // Some browsers start the AudioContext suspended until a user gesture;
      // first call from a click handler will unblock it.
      if (ctx.state === 'suspended') await ctx.resume();
      const buffer = await loadBuffer(name);
      syncMasterGain();
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const def = sounds[name];
      if (def.gain !== 1) {
        // Layer a per-sound gain stage so this specific effect can sit
        // louder (or softer) than the master line without affecting others.
        const perSoundGain = ctx.createGain();
        perSoundGain.gain.value = def.gain;
        src.connect(perSoundGain).connect(master);
      } else {
        src.connect(master);
      }
      src.start();
    } catch (e) {
      console.warn('[capy-sfx] play failed:', name, e);
    }
  }

  window.capySfx = { play };
})();
