/* ==========================================================
 * CAPY MUSIC PLAYER
 * Tiny Win95-style audio reproductor that lives in every page
 * of CapyVerse Academy. The host page configures it via
 *   window.CAPY_MUSIC = { basePath, credit, playlist: [{title,file}] };
 * BEFORE this script tag runs.
 * State (open/closed, volume, last-track) persists in localStorage.
 * ========================================================== */
(function () {
  'use strict';

  const cfg = window.CAPY_MUSIC;
  if (!cfg || !Array.isArray(cfg.playlist) || cfg.playlist.length === 0) {
    console.warn('[capy-music-player] No CAPY_MUSIC config; player disabled.');
    return;
  }

  const STORAGE_KEY = 'capy_music_v1';
  const credit  = cfg.credit  || 'Matías Ramírez';
  const baseUrl = (cfg.basePath || '').replace(/\/?$/, '/');
  const playlist = cfg.playlist;

  // ── persisted state ───────────────────────────────────────
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        open:       typeof parsed.open === 'boolean' ? parsed.open : false,
        volume:     Number.isFinite(parsed.volume)    ? Math.min(1, Math.max(0, parsed.volume))    : 0.6,
        sfxVolume:  Number.isFinite(parsed.sfxVolume) ? Math.min(1, Math.max(0, parsed.sfxVolume)) : 0.7,
      };
    } catch {
      return { open: false, volume: 0.6, sfxVolume: 0.7 };
    }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }
  const state = loadState();

  // ── DOM build ─────────────────────────────────────────────
  const root = document.createElement('div');
  root.className = 'cmp' + (state.open ? ' is-open' : '');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'Music player');

  // Tab handle (always present; hidden when open via CSS)
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'cmp-tab';
  tab.setAttribute('aria-expanded', String(state.open));
  tab.setAttribute('aria-controls', 'cmp-window');
  tab.setAttribute('title', 'Open music player');
  tab.innerHTML = '<span class="cmp-tab-icon" aria-hidden="true">♪</span><span>MUSIC</span>';

  // Window
  const win = document.createElement('div');
  win.id = 'cmp-window';
  win.className = 'cmp-window';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', 'Music player controls');

  win.innerHTML = `
    <div class="cmp-titlebar">
      <span class="cmp-titlebar-icon" aria-hidden="true">♪</span>
      <span class="cmp-titlebar-text">Now Playing&hellip;</span>
      <button class="cmp-close" type="button" aria-label="Close music player" title="Close">✕</button>
    </div>
    <div class="cmp-body">
      <div class="cmp-nowplaying-label">TRACK</div>
      <div class="cmp-song" id="cmp-song" aria-live="polite"></div>
      <div class="cmp-credit" id="cmp-credit"></div>
      <div class="cmp-progress-wrap">
        <span class="cmp-time" id="cmp-time-cur">0:00</span>
        <div class="cmp-progress" id="cmp-progress" role="slider"
             aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
          <div class="cmp-progress-bar" id="cmp-progress-bar"></div>
        </div>
        <span class="cmp-time" id="cmp-time-tot">0:00</span>
      </div>
      <div class="cmp-controls">
        <button class="cmp-btn" id="cmp-prev"  type="button" aria-label="Previous track" title="Previous">⏮</button>
        <button class="cmp-btn" id="cmp-play"  type="button" aria-label="Play"           title="Play / Pause">▶</button>
        <button class="cmp-btn" id="cmp-next"  type="button" aria-label="Next track"     title="Next">⏭</button>
      </div>
      <div class="cmp-volume-row">
        <span>MUS</span>
        <input class="cmp-volume" id="cmp-volume" type="range" min="0" max="100" step="1" aria-label="Music volume" />
      </div>
      <div class="cmp-volume-row">
        <span>SFX</span>
        <input class="cmp-volume" id="cmp-sfx-volume" type="range" min="0" max="100" step="1" aria-label="Sound effects volume" />
      </div>
    </div>
  `;

  root.appendChild(win);
  root.appendChild(tab);
  document.body.appendChild(root);

  // ── audio engine ──────────────────────────────────────────
  let trackIdx = Math.floor(Math.random() * playlist.length);
  const audio = new Audio();
  audio.preload = 'metadata';
  audio.volume = state.volume;
  // Publish current volume so capySfx can pick the same level.
  window.capyMusicVolume = state.volume;

  // ── DOM refs ──────────────────────────────────────────────
  const elSong     = win.querySelector('#cmp-song');
  const elCredit   = win.querySelector('#cmp-credit');
  const elProgress = win.querySelector('#cmp-progress');
  const elBar      = win.querySelector('#cmp-progress-bar');
  const elTimeCur  = win.querySelector('#cmp-time-cur');
  const elTimeTot  = win.querySelector('#cmp-time-tot');
  const elPlay     = win.querySelector('#cmp-play');
  const elPrev     = win.querySelector('#cmp-prev');
  const elNext     = win.querySelector('#cmp-next');
  const elVol      = win.querySelector('#cmp-volume');
  const elSfxVol   = win.querySelector('#cmp-sfx-volume');
  const elClose    = win.querySelector('.cmp-close');

  elCredit.textContent = `— ${credit}`;
  elVol.value    = Math.round(state.volume    * 100);
  elSfxVol.value = Math.round(state.sfxVolume * 100);
  window.capySfxVolume = state.sfxVolume;

  function fmtTime(s) {
    if (!Number.isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${r}`;
  }

  function loadTrack(i, autoplay) {
    trackIdx = ((i % playlist.length) + playlist.length) % playlist.length;
    const t = playlist[trackIdx];
    audio.src = baseUrl + encodeURI(t.file);
    elSong.textContent = t.title;
    elBar.style.width = '0%';
    elTimeCur.textContent = '0:00';
    if (autoplay) {
      audio.play().catch(() => updatePlayButton(false));
    }
  }

  function updatePlayButton(playing) {
    elPlay.textContent = playing ? '❚❚' : '▶';
    elPlay.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    elPlay.classList.toggle('is-active', playing);
  }

  // ── controls ──────────────────────────────────────────────
  elPlay.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(()=>{}); else audio.pause();
  });
  elPrev.addEventListener('click', () => loadTrack(trackIdx - 1, true));
  elNext.addEventListener('click', () => loadTrack(trackIdx + 1, true));
  elClose.addEventListener('click', () => setOpen(false));
  tab.addEventListener('click', () => setOpen(true));

  elVol.addEventListener('input', () => {
    const v = Number(elVol.value) / 100;
    audio.volume = v;
    state.volume = v;
    window.capyMusicVolume = v;
    saveState();
  });

  elSfxVol.addEventListener('input', () => {
    const v = Number(elSfxVol.value) / 100;
    state.sfxVolume = v;
    window.capySfxVolume = v; // capy-sfx reads this on next play
    saveState();
  });

  function seekFromEvent(e) {
    const rect = elProgress.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    if (Number.isFinite(audio.duration)) audio.currentTime = pct * audio.duration;
  }
  elProgress.addEventListener('click', seekFromEvent);
  elProgress.addEventListener('keydown', e => {
    if (!Number.isFinite(audio.duration)) return;
    if (e.key === 'ArrowLeft')  { audio.currentTime = Math.max(0, audio.currentTime - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); e.preventDefault(); }
  });

  // ── audio events ──────────────────────────────────────────
  audio.addEventListener('play',  () => updatePlayButton(true));
  audio.addEventListener('pause', () => updatePlayButton(false));
  audio.addEventListener('ended', () => loadTrack(trackIdx + 1, true));
  audio.addEventListener('loadedmetadata', () => {
    elTimeTot.textContent = fmtTime(audio.duration);
    elProgress.setAttribute('aria-valuemax', String(Math.floor(audio.duration)));
  });
  audio.addEventListener('timeupdate', () => {
    if (!Number.isFinite(audio.duration) || audio.duration === 0) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    elBar.style.width = pct + '%';
    elTimeCur.textContent = fmtTime(audio.currentTime);
    elProgress.setAttribute('aria-valuenow', String(Math.floor(audio.currentTime)));
  });
  audio.addEventListener('error', () => {
    console.warn('[capy-music-player] failed to load track:', playlist[trackIdx]?.file);
  });

  // ── open/close ────────────────────────────────────────────
  function setOpen(open) {
    state.open = open;
    root.classList.toggle('is-open', open);
    tab.setAttribute('aria-expanded', String(open));
    saveState();
  }

  // ── cross-frame coordination ──────────────────────────────
  // When the same player runs inside an iframe (e.g. a game opened in
  // the academy overlay), the iframe's player takes over and asks the
  // parent's player to pause. On iframe unload, parent resumes if it
  // was playing before. Prevents two reproductores stomping each other.
  const inIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
  let parentWasPlaying = false;

  if (inIframe) {
    try { window.parent.postMessage({ source: 'capy-music', action: 'pause-parent' }, '*'); } catch {}
    // Tell parent to resume when our document goes away.
    const sendResume = () => {
      try { window.parent.postMessage({ source: 'capy-music', action: 'resume-parent' }, '*'); } catch {}
    };
    window.addEventListener('pagehide', sendResume);
    window.addEventListener('beforeunload', sendResume);
  } else {
    // Parent: when a game's player takes over, fully hide our widget so
    // its popup doesn't sit behind the iframe's identical-looking one.
    const hideForIframe = () => {
      parentWasPlaying = parentWasPlaying || !audio.paused;
      audio.pause();
      root.style.display = 'none';
    };
    const showAfterIframe = () => {
      root.style.display = '';
      if (parentWasPlaying) audio.play().catch(() => {});
      parentWasPlaying = false;
    };

    window.addEventListener('message', (e) => {
      if (!e.data || e.data.source !== 'capy-music') return;
      if (e.data.action === 'pause-parent')  hideForIframe();
      if (e.data.action === 'resume-parent') showAfterIframe();
    });
    // Fallback fired by the academy's openGame/closeGame — runs even if
    // the iframe's beforeunload/postMessage gets dropped during teardown.
    window.addEventListener('capy-game:opened', hideForIframe);
    window.addEventListener('capy-game:closed', showAfterIframe);
  }

  // ── initial load ──────────────────────────────────────────
  loadTrack(trackIdx, false);
  updatePlayButton(false);

  // ── autoplay on entry ─────────────────────────────────────
  // Inside an iframe (game opened from the academy), the parent click
  // already provides user activation so audio.play() usually succeeds.
  // On the parent page itself (academy load/refresh), most browsers
  // block autoplay until any user gesture, so we attempt it once and
  // — if blocked — arm a one-shot listener that starts playback on the
  // user's very first click/keypress/tap anywhere on the page.
  function attemptAutoplay() {
    audio.play().catch(() => {
      const events = ['click', 'keydown', 'touchstart', 'pointerdown'];
      const start = () => {
        audio.play().catch(() => {});
        events.forEach(ev => document.removeEventListener(ev, start, true));
      };
      events.forEach(ev => document.addEventListener(ev, start, true));
    });
  }

  // Small delay lets metadata land first so the play() promise is reliable.
  setTimeout(attemptAutoplay, 150);
})();
