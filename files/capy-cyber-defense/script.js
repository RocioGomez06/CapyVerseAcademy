/* =============================================
   CAPY CYBER DEFENSE — GAME SCRIPT
   Galaxian-inspired cybersecurity arcade game
============================================= */

'use strict';

// ═══════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════

const COUNTERS = {
  'identify-report':  { en: 'Identify & Report',      es: 'Identificar y Reportar' },
  'strong-pass-2fa':  { en: 'Strong Password + 2FA',  es: 'Contraseña Segura + 2FA' },
  'spam-filter':      { en: 'Spam Filter',             es: 'Filtro de Spam' },
  'antivirus':        { en: 'Antivirus',               es: 'Antivirus' },
  'antivirus-2fa':    { en: 'Antivirus + 2FA',         es: 'Antivirus + 2FA' },
  'vpn':              { en: 'VPN',                     es: 'VPN' },
  'vpn-https':        { en: 'VPN + HTTPS',             es: 'VPN + HTTPS' },
  'firewall':         { en: 'Firewall',                es: 'Firewall' },
  'backup-antivirus': { en: 'Backup + Antivirus',      es: 'Copia de Seguridad + Antivirus' },
  'system-update':    { en: 'System Update / Patch',   es: 'Actualización del Sistema' },
};

const THREATS = {
  phishing: {
    hp: 1, damage: 2, speed: 5,
    counter: 'identify-report',
    distractors: ['spam-filter', 'antivirus', 'vpn'],
    emoji: '🎣', color: '#E69F00',
    en: { name: 'Phishing', desc: 'A fake message tricks you into giving up passwords or personal data.' },
    es: { name: 'Phishing', desc: 'Un mensaje falso te engaña para que entregues contraseñas o datos personales.' },
    wrongEn: {
      'spam-filter': 'A spam filter may catch some, but phishing needs you to identify and report it yourself.',
      'antivirus':   'Antivirus can\'t stop you from being tricked. You must recognize the scam and report it.',
      'vpn':         'A VPN hides your traffic, but it won\'t stop a phishing trick. Identify and report it!',
    },
    wrongEs: {
      'spam-filter': 'El filtro puede ayudar, pero el phishing requiere que lo identifiques y reportes tú mismo.',
      'antivirus':   'El antivirus no te protege de ser engañado. Debes reconocer y reportar el intento.',
      'vpn':         'Una VPN oculta tu tráfico, pero no evita el engaño. ¡Identifícalo y repórtalo!',
    },
  },
  weakpass: {
    hp: 1, damage: 2, speed: 4,
    counter: 'strong-pass-2fa',
    distractors: ['antivirus', 'firewall', 'spam-filter'],
    emoji: '🔑', color: '#56B4E9',
    en: { name: 'Weak Password', desc: 'A short or common password that attackers can easily guess or brute-force.' },
    es: { name: 'Contraseña Débil', desc: 'Una contraseña corta o común que los atacantes pueden adivinar fácilmente.' },
    wrongEn: {
      'antivirus':  'Antivirus deals with malicious software, not weak login credentials.',
      'firewall':   'A firewall blocks network traffic, but it can\'t fix a weak password.',
      'spam-filter':'A spam filter won\'t stop someone from cracking your password.',
    },
    wrongEs: {
      'antivirus':  'El antivirus combate software malicioso, no contraseñas débiles.',
      'firewall':   'Un firewall bloquea tráfico de red, pero no soluciona contraseñas inseguras.',
      'spam-filter':'El filtro de spam no evita que descifren tu contraseña.',
    },
  },
  spam: {
    hp: 1, damage: 1, speed: 5,
    counter: 'spam-filter',
    distractors: ['identify-report', 'firewall', 'antivirus'],
    emoji: '📧', color: '#009E73',
    en: { name: 'Spam', desc: 'Unsolicited bulk messages that clutter your inbox and may hide malicious links.' },
    es: { name: 'Spam', desc: 'Mensajes masivos no deseados que llenan tu bandeja y pueden ocultar enlaces maliciosos.' },
    wrongEn: {
      'identify-report': 'Reporting helps, but a spam filter automates the defense at scale.',
      'firewall':        'A firewall blocks network intrusions, not email spam.',
      'antivirus':       'Antivirus targets malware, not spam. Use a spam filter!',
    },
    wrongEs: {
      'identify-report': 'Reportar ayuda, pero un filtro automatiza la defensa a gran escala.',
      'firewall':        'El firewall bloquea intrusiones de red, no correo no deseado.',
      'antivirus':       'El antivirus combate malware, no spam. ¡Usa un filtro!',
    },
  },
  malware: {
    hp: 2, damage: 3, speed: 3,
    counter: 'antivirus',
    distractors: ['firewall', 'vpn', 'spam-filter'],
    emoji: '🦠', color: '#D55E00',
    en: { name: 'Malware', desc: 'Malicious software designed to damage, disrupt, or gain unauthorized access to systems.' },
    es: { name: 'Malware', desc: 'Software malicioso diseñado para dañar, interrumpir o acceder sin autorización a sistemas.' },
    wrongEn: {
      'firewall':   'A firewall blocks network entry points, but malware already inside needs antivirus to remove it.',
      'vpn':        'A VPN encrypts your connection, but won\'t detect or remove malware from your device.',
      'spam-filter':'A spam filter only handles email. Malware needs antivirus to be found and removed.',
    },
    wrongEs: {
      'firewall':   'El firewall bloquea puertos, pero el malware ya dentro necesita antivirus para ser eliminado.',
      'vpn':        'La VPN cifra tu conexión, pero no detecta ni elimina malware de tu dispositivo.',
      'spam-filter':'El filtro solo maneja correo. El malware necesita antivirus para ser detectado y eliminado.',
    },
  },
  keylogger: {
    hp: 2, damage: 3, speed: 3,
    counter: 'antivirus-2fa',
    distractors: ['antivirus', 'vpn', 'spam-filter'],
    emoji: '⌨️', color: '#CC79A7',
    en: { name: 'Keylogger', desc: 'Hidden software that records every keystroke — including passwords — and sends them to an attacker.' },
    es: { name: 'Keylogger', desc: 'Software oculto que registra cada tecla pulsada, incluidas contraseñas, y las envía al atacante.' },
    wrongEn: {
      'antivirus':  'Antivirus helps detect keyloggers, but you also need 2FA so stolen passwords are useless alone.',
      'vpn':        'A VPN encrypts traffic, but the keylogger captures keystrokes before encryption happens.',
      'spam-filter':'A spam filter won\'t detect keylogger software running on your device.',
    },
    wrongEs: {
      'antivirus':  'El antivirus ayuda, pero también necesitas 2FA para que las contraseñas robadas sean inútiles.',
      'vpn':        'La VPN cifra el tráfico, pero el keylogger captura las teclas antes del cifrado.',
      'spam-filter':'El filtro de spam no detecta software keylogger en tu dispositivo.',
    },
  },
  fakewifi: {
    hp: 2, damage: 3, speed: 3,
    counter: 'vpn',
    distractors: ['firewall', 'spam-filter', 'antivirus'],
    emoji: '📶', color: '#56B4E9',
    en: { name: 'Fake Wi-Fi', desc: 'A rogue access point that mimics a legitimate network to intercept your traffic.' },
    es: { name: 'Wi-Fi Falso', desc: 'Un punto de acceso falso que imita una red legítima para interceptar tu tráfico.' },
    wrongEn: {
      'firewall':   'A firewall on your device doesn\'t protect you from a rogue access point that already sees your data.',
      'spam-filter':'Spam filter handles email, not Wi-Fi network threats.',
      'antivirus':  'Antivirus won\'t protect your data on a rogue network. A VPN encrypts it end-to-end.',
    },
    wrongEs: {
      'firewall':   'El firewall no te protege de un punto de acceso falso que ya intercepta tu tráfico.',
      'spam-filter':'El filtro de spam maneja correo, no amenazas de red Wi-Fi.',
      'antivirus':  'El antivirus no protege tus datos en una red falsa. Una VPN los cifra de extremo a extremo.',
    },
  },
  mitm: {
    hp: 3, damage: 4, speed: 2,
    counter: 'vpn-https',
    distractors: ['vpn', 'antivirus', 'firewall'],
    emoji: '👤', color: '#0072B2',
    en: { name: 'Man-in-the-Middle', desc: 'An attacker secretly intercepts and possibly alters communication between two parties.' },
    es: { name: 'Man-in-the-Middle', desc: 'Un atacante intercepta y posiblemente altera la comunicación entre dos partes.' },
    wrongEn: {
      'vpn':       'A VPN alone is good, but you also need HTTPS to ensure end-to-end encryption and authentication.',
      'antivirus': 'Antivirus targets local malware, not a live interception of your network traffic.',
      'firewall':  'A firewall blocks port-level attacks, but MITM happens at the traffic level — VPN + HTTPS is the fix.',
    },
    wrongEs: {
      'vpn':       'La VPN ayuda, pero también necesitas HTTPS para cifrado y autenticación de extremo a extremo.',
      'antivirus': 'El antivirus combate malware local, no la interceptación activa del tráfico.',
      'firewall':  'El firewall bloquea puertos, pero MITM opera en el nivel de tráfico. Necesitas VPN + HTTPS.',
    },
  },
  ddos: {
    hp: 3, damage: 3, speed: 2,
    counter: 'firewall',
    distractors: ['antivirus', 'vpn', 'spam-filter'],
    emoji: '💥', color: '#D55E00',
    en: { name: 'DDoS Attack', desc: 'A flood of traffic from many sources overwhelms a server and makes it unavailable.' },
    es: { name: 'Ataque DDoS', desc: 'Una avalancha de tráfico de múltiples fuentes satura un servidor dejándolo inaccesible.' },
    wrongEn: {
      'antivirus':  'Antivirus targets software threats on your device, not massive network floods.',
      'vpn':        'A VPN hides your IP but won\'t stop a coordinated traffic flood hitting the server.',
      'spam-filter':'Spam filter handles email, not volumetric network attacks.',
    },
    wrongEs: {
      'antivirus':  'El antivirus combate amenazas locales, no inundaciones masivas de red.',
      'vpn':        'La VPN oculta tu IP pero no detiene una avalancha coordinada al servidor.',
      'spam-filter':'El filtro de spam maneja correo, no ataques volumétricos de red.',
    },
  },
  ransomware: {
    hp: 4, damage: 5, speed: 2,
    counter: 'backup-antivirus',
    distractors: ['antivirus', 'firewall', 'system-update'],
    emoji: '💰', color: '#CC79A7',
    en: { name: 'Ransomware', desc: 'Malware that encrypts your files and demands payment to restore access.' },
    es: { name: 'Ransomware', desc: 'Malware que cifra tus archivos y exige un pago para restaurar el acceso.' },
    wrongEn: {
      'antivirus':     'Antivirus helps detect ransomware, but without a backup you still lose your files if hit.',
      'firewall':      'A firewall blocks network entry but won\'t restore your files if ransomware gets in.',
      'system-update': 'Updates close vulnerabilities, but backups are critical — they let you restore without paying.',
    },
    wrongEs: {
      'antivirus':     'El antivirus ayuda a detectarlo, pero sin copia de seguridad igual pierdes los archivos.',
      'firewall':      'El firewall bloquea entradas, pero no restaura archivos si el ransomware ya está dentro.',
      'system-update': 'Las actualizaciones cierran brechas, pero las copias de seguridad son clave para recuperarte.',
    },
  },
  zeroday: {
    hp: 4, damage: 5, speed: 1,
    counter: 'system-update',
    distractors: ['antivirus', 'firewall', 'vpn'],
    emoji: '⚡', color: '#F0E442',
    en: { name: 'Zero-Day Exploit', desc: 'An attack targeting a software flaw unknown to the vendor, with no patch yet available.' },
    es: { name: 'Exploit Zero-Day', desc: 'Un ataque que explota una vulnerabilidad desconocida para el fabricante, sin parche disponible.' },
    wrongEn: {
      'antivirus': 'Antivirus signatures may not detect brand-new zero-day exploits. Patching closes the hole.',
      'firewall':  'A firewall limits exposure, but once a zero-day is known the real fix is the vendor\'s patch.',
      'vpn':       'A VPN encrypts your connection but doesn\'t close the vulnerability in the software itself.',
    },
    wrongEs: {
      'antivirus': 'El antivirus puede no detectar exploits completamente nuevos. El parche cierra la brecha.',
      'firewall':  'El firewall limita la exposición, pero el arreglo real de un zero-day es el parche del fabricante.',
      'vpn':       'La VPN cifra la conexión pero no cierra la vulnerabilidad en el software.',
    },
  },
};

const GAMEMODES = [
  { id: 1, waves: 3,        newThreats: ['phishing', 'weakpass', 'spam'],
    en: { name: 'First Contact',     sub: '3 waves · Intro threats' },
    es: { name: 'Primer Contacto',   sub: '3 oleadas · Amenazas iniciales' } },
  { id: 2, waves: 5,        newThreats: ['malware', 'keylogger'],
    en: { name: 'Device Under Attack', sub: '5 waves · New device threats' },
    es: { name: 'Dispositivo Atacado', sub: '5 oleadas · Amenazas al dispositivo' } },
  { id: 3, waves: 10,       newThreats: ['fakewifi', 'mitm', 'ddos'],
    en: { name: 'Network Breach',    sub: '10 waves · Network threats' },
    es: { name: 'Brecha de Red',     sub: '10 oleadas · Amenazas de red' } },
  { id: 4, waves: 15,       newThreats: ['ransomware', 'zeroday'],
    en: { name: 'Critical Systems',  sub: '15 waves · High-severity threats' },
    es: { name: 'Sistemas Críticos', sub: '15 oleadas · Amenazas críticas' } },
  { id: 5, waves: Infinity, newThreats: [],
    en: { name: '∞ Deep Space',      sub: 'Infinite · All threats · High score' },
    es: { name: '∞ Espacio Profundo', sub: 'Infinito · Todas las amenazas · Puntaje máximo' } },
];

const TRANSLATIONS = {
  en: {
    'name-entry-title': 'INSERT CALLSIGN',
    'name-prompt':      'ENTER YOUR CALLSIGN:',
    'name-hint':        'Up to 12 characters',
    'name-confirm':     '▶ CONFIRM',
    'name-entry-hint':  'Your name is saved locally. No account needed.',
    'name-error':       'You need a callsign to continue!',
    'switch-player':    '⇄ SWITCH PLAYER',
    'podium-title':     '★ TOP DEFENDERS ★',
    'select-mode':      'SELECT GAMEMODE',
    'menu-hint':        'Complete each gamemode to unlock the next one.',
    'briefing-tag':     'THREAT BRIEFING',
    'briefing-sub':     'New threats detected in your sector. Know your enemy.',
    'skip':             'SKIP ▶▶',
    'briefing-launch':  '▶ LAUNCH DEFENSE',
    'score-label':      'SCORE',
    'toolbar-hint':     'SELECT COUNTER FIRST, THEN CLICK THREAT',
    'counter-question': 'HOW DO YOU COUNTER THIS?',
    'popup-resume-hint':'Click the correct counter to resume',
    'resume':           '▶ RESUME',
    'syllabus-btn':     '📖 SYLLABUS',
    'back-menu':        '⌂ BACK TO MENU',
    'syllabus-title':   '📖 THREAT SYLLABUS',
    'quit-title':       'QUIT GAME?',
    'quit-msg':         'Progress will be lost. Are you sure?',
    'quit-yes':         'YES, QUIT',
    'quit-no':          'CANCEL',
    'win-title':        'SECTOR SECURED!',
    'next-gm':          'NEXT SECTOR ▶',
    'play-again':       '↺ PLAY AGAIN',
    'gameover-title':   'SYSTEM COMPROMISED',
    'gameover-sub':     'All defenses were overwhelmed.',
    'try-again':        '↺ TRY AGAIN',
    'waves-label':      'WAVES',
    'threats-label':    'THREATS STOPPED',
    'accuracy-label':   'ACCURACY',
    'highscore-label':  '★ NEW HIGH SCORE',
    'counter-for':      'COUNTER:',
    'locked-label':     '🔒 LOCKED',
    'completed-label':  '✓ COMPLETED',
    'wave-text':        'WAVE',
    'gm5-hi':          'YOUR BEST:',
    'unknown-threat':   '???',
    'toolbar-none':     'No counter selected',
  },
  es: {
    'name-entry-title': 'INGRESA TU NOMBRE',
    'name-prompt':      'INGRESA TU INDICATIVO:',
    'name-hint':        'Máximo 12 caracteres',
    'name-confirm':     '▶ CONFIRMAR',
    'name-entry-hint':  'Tu nombre se guarda localmente. No necesitas cuenta.',
    'name-error':       'Debes ingresar un nombre para continuar.',
    'switch-player':    '⇄ CAMBIAR JUGADOR',
    'podium-title':     '★ MEJORES DEFENSORES ★',
    'select-mode':      'SELECCIONAR MODO',
    'menu-hint':        'Completa cada modo para desbloquear el siguiente.',
    'briefing-tag':     'INFORME DE AMENAZAS',
    'briefing-sub':     'Nuevas amenazas detectadas en tu sector. Conoce al enemigo.',
    'skip':             'SALTAR ▶▶',
    'briefing-launch':  '▶ INICIAR DEFENSA',
    'score-label':      'PUNTAJE',
    'toolbar-hint':     'SELECCIONA CONTRAMEDIDA Y LUEGO CLICK EN AMENAZA',
    'counter-question': '¿CÓMO CONTRARRESTA ESTO?',
    'popup-resume-hint':'Haz click en la contramedida correcta para continuar',
    'resume':           '▶ CONTINUAR',
    'syllabus-btn':     '📖 TEMARIO',
    'back-menu':        '⌂ VOLVER AL MENÚ',
    'syllabus-title':   '📖 TEMARIO DE AMENAZAS',
    'quit-title':       '¿ABANDONAR PARTIDA?',
    'quit-msg':         'Se perderá el progreso. ¿Estás seguro/a?',
    'quit-yes':         'SÍ, SALIR',
    'quit-no':          'CANCELAR',
    'win-title':        '¡SECTOR ASEGURADO!',
    'next-gm':          'SIGUIENTE SECTOR ▶',
    'play-again':       '↺ VOLVER A JUGAR',
    'gameover-title':   'SISTEMA COMPROMETIDO',
    'gameover-sub':     'Todas las defensas fueron superadas.',
    'try-again':        '↺ INTENTAR DE NUEVO',
    'waves-label':      'OLEADAS',
    'threats-label':    'AMENAZAS DETENIDAS',
    'accuracy-label':   'PRECISIÓN',
    'highscore-label':  '★ NUEVO RÉCORD',
    'counter-for':      'CONTRAMEDIDA:',
    'locked-label':     '🔒 BLOQUEADO',
    'completed-label':  '✓ COMPLETADO',
    'wave-text':        'OLEADA',
    'gm5-hi':          'TU MEJOR:',
    'unknown-threat':   '???',
    'toolbar-none':     'Sin contramedida seleccionada',
  }
};

// ═══════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════

const state = {
  lang: 'en',
  players: [],         // array of { name, completed: [], highScore }
  currentPlayerIdx: 0,

  currentGamemode: 0,  // index into GAMEMODES
  currentWave: 0,      // 0-based wave index within the gamemode
  lives: 3,
  score: 0,
  scoreMultiplier: 1,
  threatsInWave: 0,
  threatsResolved: 0,
  threatCounter: 0,
  activeThreatObjects: {},  // id -> { key, hp, el }
  spawnTimers: [],
  gamePaused: false,
  popupOpen: false,
  currentThreatId: null,
  gameRunning: false,
  gm5SelectedCounter: null,

  // Stats tracking for result screen
  sessionThreatsDestroyed: 0,
  sessionCorrectAnswers: 0,
  sessionTotalAnswers: 0,
  wavesCleared: 0,
};

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════

function t(key) {
  return TRANSLATIONS[state.lang][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.textContent = val;
  });
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getThreatName(key) {
  return THREATS[key][state.lang].name;
}

function getCounterName(key) {
  return COUNTERS[key] ? COUNTERS[key][state.lang] : key;
}

function getPlayer() {
  return state.players[state.currentPlayerIdx];
}

function getThreatsForGamemode(gmIdx) {
  const pool = [];
  for (let i = 0; i <= gmIdx && i < GAMEMODES.length - 1; i++) {
    pool.push(...GAMEMODES[i].newThreats);
  }
  if (gmIdx === 4) return Object.keys(THREATS);
  return pool;
}

function generateStars(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() < 0.8 ? 1 : (Math.random() < 0.5 ? 2 : 3);
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --dur:${1.5 + Math.random()*3}s;
      --delay:${Math.random()*3}s;
    `;
    container.appendChild(s);
  }
}

function generateFieldStars() {
  const container = document.getElementById('field-stars');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'field-star';
    const size = Math.random() < 0.7 ? 1 : 2;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --dur:${2 + Math.random()*4}s;
      --delay:${Math.random()*4}s;
    `;
    container.appendChild(s);
  }
}

// ═══════════════════════════════════════════
//  LOCALSTORAGE
// ═══════════════════════════════════════════

function loadPlayers() {
  try {
    const raw = localStorage.getItem('ccd_players');
    state.players = raw ? JSON.parse(raw) : [];
  } catch {
    state.players = [];
  }
}

function savePlayers() {
  try {
    localStorage.setItem('ccd_players', JSON.stringify(state.players));
  } catch {}
}

function addPlayer(name) {
  const exists = state.players.findIndex(p => p.name.toUpperCase() === name.toUpperCase());
  if (exists !== -1) {
    state.currentPlayerIdx = exists;
    return;
  }
  state.players.push({ name: name.toUpperCase(), completed: [], highScore: 0, syllabus: [] });
  state.currentPlayerIdx = state.players.length - 1;
  savePlayers();
}

function markGamemodeComplete(gmIdx) {
  const p = getPlayer();
  if (!p.completed.includes(gmIdx)) {
    p.completed.push(gmIdx);
    savePlayers();
  }
}

function isGamemodeUnlocked(gmIdx) {
  if (gmIdx === 0) return true;
  if (gmIdx === 4) {
    return getPlayer().completed.includes(3);
  }
  return getPlayer().completed.includes(gmIdx - 1);
}

function isGamemodeComplete(gmIdx) {
  return getPlayer().completed.includes(gmIdx);
}

function updateHighScore(score) {
  const p = getPlayer();
  if (score > p.highScore) {
    p.highScore = score;
    savePlayers();
    return true;
  }
  return false;
}

function addToSyllabus(threatKeys) {
  const p = getPlayer();
  threatKeys.forEach(k => {
    if (!p.syllabus) p.syllabus = [];
    if (!p.syllabus.includes(k)) p.syllabus.push(k);
  });
  savePlayers();
}

// ═══════════════════════════════════════════
//  SCREEN MANAGEMENT
// ═══════════════════════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');

  const pauseBtn = document.getElementById('btn-pause');
  pauseBtn.style.display = id === 'screen-game' ? 'inline-block' : 'none';
}

function hideAllOverlays() {
  ['overlay-pause', 'overlay-syllabus', 'overlay-counter', 'overlay-wave', 'overlay-quit'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

// ═══════════════════════════════════════════
//  SCREEN: NAME ENTRY
// ═══════════════════════════════════════════

function initNameEntry() {
  generateStars('stars-name', 80);
  const input = document.getElementById('name-input');
  input.value = '';
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmName();
  });
  setTimeout(() => input.focus(), 100);
}

function confirmName() {
  const input = document.getElementById('name-input');
  const errorEl = document.getElementById('name-error');
  const name = input.value.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 12);
  if (!name) {
    errorEl.textContent = t('name-error');
    errorEl.style.display = 'block';
    // Re-trigger shake animation
    errorEl.style.animation = 'none';
    requestAnimationFrame(() => { errorEl.style.animation = ''; });
    input.focus();
    return;
  }
  errorEl.style.display = 'none';
  addPlayer(name);
  initMenu();
  showScreen('screen-menu');
}

// ═══════════════════════════════════════════
//  SCREEN: MAIN MENU
// ═══════════════════════════════════════════

function initMenu() {
  generateStars('stars-menu', 100);

  const p = getPlayer();
  document.getElementById('greeting-line').textContent =
    `WELCOME, ${p.name}!`;

  const hiBest = p.highScore > 0
    ? `${t('gm5-hi')} ${String(p.highScore).padStart(6, '0')}`
    : '';
  document.getElementById('greeting-sub').textContent = hiBest;

  renderPodium();
  renderGamemodeList();
  applyTranslations();
}

function renderPodium() {
  const section = document.getElementById('podium-section');
  const display = document.getElementById('podium-display');

  const ranked = [...state.players]
    .filter(p => p.highScore > 0)
    .sort((a, b) => b.highScore - a.highScore)
    .slice(0, 3);

  if (state.players.length < 2 || ranked.length < 2) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  display.innerHTML = '';

  const medals = ['🥇', '🥈', '🥉'];
  const rankClasses = ['rank-1', 'rank-2', 'rank-3'];
  const order = ranked.length >= 2 ? [1, 0, 2] : [0];

  order.forEach(i => {
    if (!ranked[i]) return;
    const entry = document.createElement('div');
    entry.className = 'podium-entry';
    entry.setAttribute('role', 'listitem');
    entry.innerHTML = `
      <span class="podium-medal" aria-hidden="true">${medals[i]}</span>
      <div class="podium-block ${rankClasses[i]}">
        <span class="podium-name">${ranked[i].name}</span>
        <span class="podium-score">${String(ranked[i].highScore).padStart(6, '0')}</span>
      </div>
      <span class="podium-rank">#${i + 1}</span>
    `;
    display.appendChild(entry);
  });
}

function renderGamemodeList() {
  const list = document.getElementById('gamemode-list');
  list.innerHTML = '';

  GAMEMODES.forEach((gm, i) => {
    const unlocked = isGamemodeUnlocked(i);
    const completed = isGamemodeComplete(i);
    const isInfinite = i === 4;

    const card = document.createElement('div');
    card.className = `gm-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`;
    card.setAttribute('role', 'listitem');

    const gmData = gm[state.lang];
    const statusText = !unlocked
      ? t('locked-label')
      : completed
        ? t('completed-label')
        : (isInfinite ? '∞' : '');

    const statusClass = !unlocked ? 'status-locked'
      : completed ? 'status-done'
      : isInfinite ? 'status-infinite'
      : 'status-play';

    let btnHtml = '';
    if (!unlocked) {
      btnHtml = `<button class="btn-locked-gm" disabled aria-disabled="true">${t('locked-label')}</button>`;
    } else if (isInfinite) {
      const p = getPlayer();
      const hiLabel = p.highScore > 0 ? `▶ PLAY (HI: ${String(p.highScore).padStart(6,'0')})` : '▶ PLAY';
      btnHtml = `<button class="btn-infinite-gm" onclick="startBriefing(${i})">${hiLabel}</button>`;
    } else {
      const label = completed ? '↺ REPLAY' : '▶ PLAY';
      btnHtml = `<button class="btn-play-gm" onclick="startBriefing(${i})">${label}</button>`;
    }

    card.innerHTML = `
      <div class="gm-card-left">
        <span class="gm-card-num">GAMEMODE ${i + 1}</span>
        <span class="gm-card-name">${gmData.name}</span>
        <span class="gm-card-waves">${gmData.sub}</span>
      </div>
      ${statusText ? `<span class="gm-card-status ${statusClass}" aria-label="${statusText}">${statusText}</span>` : ''}
      ${btnHtml}
    `;

    list.appendChild(card);
  });
}

function switchPlayer() {
  stopGame();
  showScreen('screen-name');
  initNameEntry();
}

// ═══════════════════════════════════════════
//  SCREEN: BRIEFING
// ═══════════════════════════════════════════

function startBriefing(gmIdx) {
  state.currentGamemode = gmIdx;
  generateStars('stars-briefing', 90);

  const gm = GAMEMODES[gmIdx];
  const gmData = gm[state.lang];

  document.getElementById('briefing-title').textContent = gmData.name;

  // Add new threats to syllabus immediately
  const threatsToShow = gmIdx === 4 ? Object.keys(THREATS) : gm.newThreats;
  addToSyllabus(threatsToShow);

  // Build threat cards
  const cardsEl = document.getElementById('briefing-cards');
  cardsEl.innerHTML = '';
  threatsToShow.forEach(key => {
    const data = THREATS[key];
    const langData = data[state.lang];
    const card = document.createElement('div');
    card.className = 'threat-card';
    card.setAttribute('role', 'listitem');
    card.style.setProperty('--card-color', data.color);
    card.innerHTML = `
      <div class="threat-card-icon" aria-hidden="true" style="color:${data.color}">${data.emoji}</div>
      <div class="threat-card-info">
        <div class="threat-card-name">${langData.name}</div>
        <div class="threat-card-desc">${langData.desc}</div>
        <div class="threat-card-counter">${t('counter-for')} ${getCounterName(data.counter)}</div>
      </div>
    `;
    cardsEl.appendChild(card);
  });

  // Show skip button if replay
  const skipBtn = document.getElementById('btn-skip-briefing');
  skipBtn.style.display = isGamemodeComplete(gmIdx) ? 'inline-block' : 'none';

  showScreen('screen-briefing');
  applyTranslations();
}

function skipBriefing() { launchGame(); }

function launchGame() {
  showScreen('screen-game');
  initGameScreen();
  resetGameState();
  startGamemode(state.currentGamemode);
}

// ═══════════════════════════════════════════
//  GAME SCREEN INIT
// ═══════════════════════════════════════════

function initGameScreen() {
  generateFieldStars();

  const gm = GAMEMODES[state.currentGamemode];
  document.getElementById('hud-gm-name').textContent = gm[state.lang].name;

  // GM5: show counter toolbar
  const toolbar = document.getElementById('counter-toolbar');
  if (state.currentGamemode === 4) {
    toolbar.style.display = 'flex';
    buildCounterToolbar();
  } else {
    toolbar.style.display = 'none';
  }
}

function buildCounterToolbar() {
  const btns = document.getElementById('toolbar-buttons');
  btns.innerHTML = '';
  Object.keys(COUNTERS).forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'toolbar-counter-btn';
    btn.setAttribute('data-counter', key);
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = getCounterName(key);
    btn.onclick = () => selectToolbarCounter(key);
    btns.appendChild(btn);
  });
}

function selectToolbarCounter(key) {
  state.gm5SelectedCounter = key;
  document.querySelectorAll('.toolbar-counter-btn').forEach(b => {
    const active = b.dataset.counter === key;
    b.classList.toggle('selected', active);
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

// ═══════════════════════════════════════════
//  GAME STATE
// ═══════════════════════════════════════════

function resetGameState() {
  state.lives = 3;
  state.score = 0;
  state.scoreMultiplier = 1;
  state.currentWave = 0;
  state.threatsInWave = 0;
  state.threatsResolved = 0;
  state.threatCounter = 0;
  state.activeThreatObjects = {};
  state.spawnTimers = [];
  state.gamePaused = false;
  state.popupOpen = false;
  state.currentThreatId = null;
  state.gameRunning = true;
  state.gm5SelectedCounter = null;
  state.sessionThreatsDestroyed = 0;
  state.sessionCorrectAnswers = 0;
  state.sessionTotalAnswers = 0;
  state.wavesCleared = 0;

  updateHeartsDisplay();
  updateScoreDisplay();

  // Clear the game field of any leftover threats
  const field = document.getElementById('game-field');
  field.querySelectorAll('.threat').forEach(t => t.remove());
  document.getElementById('projectiles').innerHTML = '';
  field.classList.remove('paused');
}

function stopGame() {
  state.gameRunning = false;
  state.spawnTimers.forEach(clearTimeout);
  state.spawnTimers = [];
  const field = document.getElementById('game-field');
  if (field) {
    field.querySelectorAll('.threat').forEach(t => t.remove());
    field.classList.remove('paused');
  }
  hideAllOverlays();
}

// ═══════════════════════════════════════════
//  GAMEMODE / WAVE LOGIC
// ═══════════════════════════════════════════

function startGamemode(gmIdx) {
  const gm = GAMEMODES[gmIdx];
  document.getElementById('hud-gm-name').textContent = gm[state.lang].name;
  startWave(0);
}

function startWave(waveIdx) {
  if (!state.gameRunning) return;
  state.currentWave = waveIdx;
  state.threatsResolved = 0;

  const gm = GAMEMODES[state.currentGamemode];
  const isInfinite = state.currentGamemode === 4;

  let waveLabel = '';
  if (isInfinite) {
    waveLabel = `${t('wave-text')} ${waveIdx + 1}`;
    document.getElementById('hud-wave').textContent = waveLabel;
  } else {
    waveLabel = `${t('wave-text')} ${waveIdx + 1} / ${gm.waves}`;
    document.getElementById('hud-wave').textContent = waveLabel;
  }

  showWaveBanner(waveIdx + 1, () => {
    if (!state.gameRunning) return;
    spawnWave(state.currentGamemode, waveIdx);
  });
}

function spawnWave(gmIdx, waveIdx) {
  const isInfinite = gmIdx === 4;
  const availableThreats = getThreatsForGamemode(gmIdx);
  const gm = GAMEMODES[gmIdx];

  // How many threats in this wave
  const baseCount = isInfinite ? 4 + Math.floor(waveIdx * 1.4) : 3 + waveIdx * 2;
  const count = Math.min(baseCount, isInfinite ? 30 : 16);

  // Speed multiplier increases with waves
  const speedMult = 1 + waveIdx * (isInfinite ? 0.12 : 0.18);

  state.threatsInWave = count;
  state.spawnTimers = [];

  // Build spawn list: guarantee new threats appear in early waves
  let spawnList = [];
  if (!isInfinite && waveIdx < 2 && gm.newThreats.length > 0) {
    spawnList.push(...gm.newThreats);
  }
  while (spawnList.length < count) {
    spawnList.push(availableThreats[Math.floor(Math.random() * availableThreats.length)]);
  }
  spawnList = shuffleArray(spawnList);

  // Spawn with staggered delays
  spawnList.forEach((threatKey, i) => {
    const delay = 800 + i * (isInfinite ? 900 : 1200) + Math.random() * 400;
    const timer = setTimeout(() => {
      if (!state.gameRunning) return;
      spawnThreat(threatKey, speedMult);
    }, delay);
    state.spawnTimers.push(timer);
  });
}

function checkWaveComplete() {
  if (!state.gameRunning) return;
  if (state.threatsResolved >= state.threatsInWave) {
    state.wavesCleared++;
    const gm = GAMEMODES[state.currentGamemode];
    const isInfinite = state.currentGamemode === 4;

    if (!isInfinite && state.currentWave + 1 >= gm.waves) {
      // Gamemode complete
      setTimeout(gamemodeComplete, 600);
    } else {
      // Next wave
      setTimeout(() => startWave(state.currentWave + 1), 1200);
    }
  }
}

// ═══════════════════════════════════════════
//  THREAT SPAWNING
// ═══════════════════════════════════════════

function spawnThreat(threatKey, speedMult) {
  if (!state.gameRunning) return;
  const data = THREATS[threatKey];
  const id = 'threat-' + (++state.threatCounter);

  const el = document.createElement('div');
  el.className = 'threat';
  el.id = id;
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `${data[state.lang].name} — click to defend`);
  el.style.setProperty('--threat-color', data.color);

  const baseDur = (14 - data.speed * 2);
  const duration = Math.max(2, baseDur / speedMult);
  el.style.setProperty('--dur', duration + 's');
  el.style.left = (8 + Math.random() * 72) + '%';

  // HP dots
  let hpDots = '';
  for (let i = 0; i < data.hp; i++) hpDots += `<span class="hp-dot" aria-hidden="true"></span>`;

  el.innerHTML = `
    <div class="threat-emoji" aria-hidden="true" style="color:${data.color}">${data.emoji}</div>
    <div class="threat-hp" aria-label="${data.hp} HP">${hpDots}</div>
  `;

  // Track
  state.activeThreatObjects[id] = { key: threatKey, hp: data.hp, el };

  // Reached bottom
  el.addEventListener('animationend', () => {
    if (state.activeThreatObjects[id]) threatReachedBottom(id);
  });

  // Click / keyboard activation
  const handleActivate = () => {
    if (state.gamePaused || state.popupOpen) return;
    if (state.currentGamemode === 4) {
      // GM5: direct counter apply
      applyCounterDirect(id);
    } else {
      openCounterPopup(id);
    }
  };

  el.addEventListener('click', handleActivate);
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleActivate(); }
  });

  document.getElementById('game-field').appendChild(el);
}

// ═══════════════════════════════════════════
//  GM5: DIRECT COUNTER (no pause)
// ═══════════════════════════════════════════

function applyCounterDirect(threatId) {
  const obj = state.activeThreatObjects[threatId];
  if (!obj) return;
  const data = THREATS[obj.key];

  if (!state.gm5SelectedCounter) {
    obj.el.classList.add('hit');
    setTimeout(() => obj.el && obj.el.classList.remove('hit'), 300);
    return;
  }

  state.sessionTotalAnswers++;

  if (state.gm5SelectedCounter === data.counter) {
    state.sessionCorrectAnswers++;
    obj.hp--;
    updateHpDisplay(obj);
    fireProjectile(obj.el);

    if (obj.hp <= 0) {
      destroyThreat(threatId);
    } else {
      obj.el.classList.add('hit');
      setTimeout(() => obj.el && obj.el.classList.remove('hit'), 300);
    }
    addScore(data.damage * 10 * state.currentWave + 10);
    state.scoreMultiplier = Math.min(state.scoreMultiplier + .5, 5);
  } else {
    state.scoreMultiplier = 1;
    obj.el.classList.add('hit');
    obj.el.querySelector('.threat-emoji').style.filter = 'drop-shadow(0 0 12px #ff4466)';
    setTimeout(() => {
      if (obj.el) {
        obj.el.classList.remove('hit');
        obj.el.querySelector('.threat-emoji').style.filter = `drop-shadow(0 0 8px ${THREATS[obj.key].color})`;
      }
    }, 400);
  }
}

// ═══════════════════════════════════════════
//  COUNTER POPUP (GM1-4)
// ═══════════════════════════════════════════

function openCounterPopup(threatId) {
  const obj = state.activeThreatObjects[threatId];
  if (!obj) return;
  const data = THREATS[obj.key];

  state.popupOpen = true;
  state.currentThreatId = threatId;

  // Pause all threats
  document.getElementById('game-field').classList.add('paused');

  // Build option list
  const optionCount = Math.min(2 + Math.floor(state.currentWave / 2) + 1, 4);
  let options = [data.counter, ...shuffleArray(data.distractors).slice(0, optionCount - 1)];
  options = shuffleArray(options);
  if (!options.includes(data.counter)) { options[0] = data.counter; options = shuffleArray(options); }

  // Populate popup
  const display = document.getElementById('popup-threat-display');
  display.innerHTML = `
    <span class="popup-emoji" style="color:${data.color}">${data.emoji}</span>
    <span class="popup-threat-name">${data[state.lang].name}</span>
  `;

  document.getElementById('wrong-msg').style.display = 'none';
  document.getElementById('counter-question').textContent = t('counter-question');
  document.getElementById('popup-resume-hint').textContent = t('popup-resume-hint');

  const optionsEl = document.getElementById('counter-options');
  optionsEl.innerHTML = '';
  options.forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'counter-option-btn';
    btn.textContent = getCounterName(key);
    btn.setAttribute('data-counter', key);
    btn.setAttribute('aria-label', `Use ${getCounterName(key)}`);
    btn.onclick = () => selectCounter(threatId, key);
    optionsEl.appendChild(btn);
  });

  document.getElementById('overlay-counter').style.display = 'flex';

  // Focus first option
  setTimeout(() => { const f = optionsEl.querySelector('button'); if (f) f.focus(); }, 50);
}

function selectCounter(threatId, chosenKey) {
  const obj = state.activeThreatObjects[threatId];
  if (!obj) { closeCounterPopup(); return; }
  const data = THREATS[obj.key];

  state.sessionTotalAnswers++;

  if (chosenKey === data.counter) {
    // CORRECT
    state.sessionCorrectAnswers++;

    // Visual feedback on button
    const btn = document.querySelector(`[data-counter="${chosenKey}"]`);
    if (btn) btn.classList.add('correct');

    setTimeout(() => {
      // Re-fetch obj in case state changed during timeout
      const liveObj = state.activeThreatObjects[threatId];
      closeCounterPopup();

      if (!liveObj) return; // threat was already gone (e.g. reached bottom during popup)

      liveObj.hp--;
      updateHpDisplay(liveObj);
      fireProjectile(liveObj.el);

      if (liveObj.hp <= 0) {
        destroyThreat(threatId);
      } else {
        liveObj.el.classList.add('hit');
        setTimeout(() => liveObj.el && liveObj.el.classList.remove('hit'), 400);
      }

      addScore(data.damage * 10 * state.scoreMultiplier);
      state.scoreMultiplier = Math.min(state.scoreMultiplier + .5, 5);
    }, 300);

  } else {
    // WRONG
    state.scoreMultiplier = 1;

    // Highlight wrong button
    const wrongBtn = document.querySelector(`[data-counter="${chosenKey}"]`);
    if (wrongBtn) wrongBtn.classList.add('wrong-choice');

    // Shake popup
    const popup = document.getElementById('counter-popup');
    popup.classList.add('shake');
    popup.addEventListener('animationend', () => popup.classList.remove('shake'), { once: true });

    // Explanation
    const wrongMsgEl = document.getElementById('wrong-msg');
    const wrongKey = state.lang === 'en' ? 'wrongEn' : 'wrongEs';
    const msg = data[wrongKey]?.[chosenKey]
      || (state.lang === 'en'
          ? `${getCounterName(chosenKey)} won't work here. Try ${getCounterName(data.counter)}.`
          : `${getCounterName(chosenKey)} no funciona aquí. Intenta con ${getCounterName(data.counter)}.`);
    wrongMsgEl.textContent = msg;
    wrongMsgEl.style.display = 'block';
  }
}

function closeCounterPopup() {
  state.popupOpen = false;
  state.currentThreatId = null;
  document.getElementById('overlay-counter').style.display = 'none';
  document.getElementById('game-field').classList.remove('paused');
}

// ═══════════════════════════════════════════
//  THREAT DESTRUCTION / DAMAGE
// ═══════════════════════════════════════════

function updateHpDisplay(obj) {
  const dots = obj.el.querySelectorAll('.hp-dot');
  const spent = obj.el.querySelectorAll('.hp-dot.spent').length;
  if (dots[spent]) dots[spent].classList.add('spent');
}

function destroyThreat(threatId) {
  const obj = state.activeThreatObjects[threatId];
  if (!obj) return;
  delete state.activeThreatObjects[threatId];

  state.sessionThreatsDestroyed++;

  const el = obj.el;
  el.removeAttribute('tabindex');
  el.setAttribute('aria-hidden', 'true');
  el.style.pointerEvents = 'none';

  // Add class to the threat element so CSS selector .threat.destroying .threat-emoji works
  el.classList.add('destroying');

  setTimeout(() => {
    el.remove();
    state.threatsResolved++;
    checkWaveComplete();
  }, 450);
}

function threatReachedBottom(threatId) {
  if (!state.gameRunning) return;
  const obj = state.activeThreatObjects[threatId];
  if (!obj) return;
  delete state.activeThreatObjects[threatId];
  obj.el.remove();

  state.lives--;
  updateHeartsDisplay();

  // Flash ship
  const ship = document.getElementById('ship');
  ship.classList.add('hit');
  setTimeout(() => ship.classList.remove('hit'), 600);

  state.threatsResolved++;

  if (state.lives <= 0) {
    setTimeout(gameOver, 400);
  } else {
    checkWaveComplete();
  }
}

// ═══════════════════════════════════════════
//  PROJECTILE
// ═══════════════════════════════════════════

function fireProjectile(threatEl) {
  const field = document.getElementById('game-field');
  const ship  = document.getElementById('ship');
  if (!field || !ship || !threatEl) return;

  const fieldRect  = field.getBoundingClientRect();
  const shipRect   = ship.getBoundingClientRect();
  const threatRect = threatEl.getBoundingClientRect();

  const startX = shipRect.left - fieldRect.left + shipRect.width / 2;
  const startY = shipRect.top  - fieldRect.top;
  const endX   = threatRect.left - fieldRect.left + threatRect.width / 2;
  const endY   = threatRect.top  - fieldRect.top  + threatRect.height / 2;

  const proj = document.createElement('div');
  proj.className = 'projectile';
  proj.style.left = (startX - 2) + 'px';
  proj.style.top  = startY + 'px';
  proj.style.setProperty('--end-dx', (endX - startX) + 'px');
  proj.style.setProperty('--end-dy', (endY - startY) + 'px');

  const dist = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  proj.style.setProperty('--proj-dur', Math.max(.15, dist / 900) + 's');

  document.getElementById('projectiles').appendChild(proj);
  proj.addEventListener('animationend', () => proj.remove());
}

// ═══════════════════════════════════════════
//  HUD UPDATES
// ═══════════════════════════════════════════

function updateHeartsDisplay() {
  const container = document.getElementById('hud-hearts');
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const h = document.createElement('span');
    h.className = 'heart' + (i >= state.lives ? ' lost' : '');
    h.setAttribute('aria-hidden', 'true');
    h.textContent = '♥';
    container.appendChild(h);
  }
  container.setAttribute('aria-label', `${state.lives} lives remaining`);
}

function addScore(points) {
  state.score += Math.round(points);
  updateScoreDisplay();
}

function updateScoreDisplay() {
  const el = document.getElementById('hud-score');
  el.textContent = String(state.score).padStart(6, '0');
  el.setAttribute('aria-label', `Score: ${state.score}`);
}

// ═══════════════════════════════════════════
//  WAVE BANNER
// ═══════════════════════════════════════════

function showWaveBanner(waveNum, callback) {
  const overlay = document.getElementById('overlay-wave');
  const announce = document.getElementById('wave-announce');

  const isInfinite = state.currentGamemode === 4;
  announce.textContent = isInfinite
    ? `${t('wave-text')} ${waveNum}`
    : `${t('wave-text')} ${waveNum}`;

  overlay.style.display = 'flex';
  setTimeout(() => {
    overlay.style.display = 'none';
    if (callback) callback();
  }, 1600);
}

// ═══════════════════════════════════════════
//  PAUSE
// ═══════════════════════════════════════════

function togglePause() {
  if (!state.gameRunning) return;

  if (state.popupOpen) {
    closeCounterPopup();
    return;
  }

  state.gamePaused = !state.gamePaused;
  const field = document.getElementById('game-field');

  if (state.gamePaused) {
    field.classList.add('paused');
    document.getElementById('overlay-pause').style.display = 'flex';
    document.getElementById('btn-pause').textContent = '▶';
  } else {
    field.classList.remove('paused');
    document.getElementById('overlay-pause').style.display = 'none';
    document.getElementById('btn-pause').textContent = '⏸';
  }
}

// ═══════════════════════════════════════════
//  SYLLABUS
// ═══════════════════════════════════════════

function openSyllabus() {
  const p = getPlayer();
  const knownThreats = p.syllabus || [];
  const allKeys = Object.keys(THREATS);

  const body = document.getElementById('syllabus-body');
  body.innerHTML = '';

  document.getElementById('overlay-syllabus').style.display = 'flex';

  allKeys.forEach(key => {
    const known = knownThreats.includes(key);
    const data = THREATS[key];
    const entry = document.createElement('div');
    entry.className = 'syllabus-entry' + (known ? '' : ' unknown');
    entry.setAttribute('role', 'listitem');

    if (known) {
      entry.innerHTML = `
        <div class="syllabus-icon" aria-hidden="true" style="color:${data.color}">${data.emoji}</div>
        <div class="syllabus-info">
          <div class="syllabus-name">${data[state.lang].name}</div>
          <div class="syllabus-desc">${data[state.lang].desc}</div>
          <div class="syllabus-counter">${getCounterName(data.counter)}</div>
        </div>
      `;
    } else {
      entry.innerHTML = `
        <div class="syllabus-icon" aria-hidden="true">❓</div>
        <div class="syllabus-info">
          <div class="syllabus-name">${t('unknown-threat')}</div>
        </div>
      `;
      entry.setAttribute('aria-hidden', 'true');
    }
    body.appendChild(entry);
  });
}

function closeSyllabus() {
  document.getElementById('overlay-syllabus').style.display = 'none';
}

// ═══════════════════════════════════════════
//  QUIT
// ═══════════════════════════════════════════

function confirmQuit() {
  document.getElementById('overlay-pause').style.display = 'none';
  document.getElementById('overlay-quit').style.display = 'flex';
}

function cancelQuit() {
  document.getElementById('overlay-quit').style.display = 'none';
  if (state.gamePaused) {
    document.getElementById('overlay-pause').style.display = 'flex';
  }
}

// ═══════════════════════════════════════════
//  GAME OVER
// ═══════════════════════════════════════════

function gameOver() {
  stopGame();
  hideAllOverlays();

  let isNewHigh = false;
  if (state.currentGamemode === 4) {
    isNewHigh = updateHighScore(state.score);
  }

  generateStars('stars-gameover', 80);

  const statsEl = document.getElementById('gameover-stats');
  const acc = state.sessionTotalAnswers > 0
    ? Math.round((state.sessionCorrectAnswers / state.sessionTotalAnswers) * 100)
    : 0;

  statsEl.innerHTML = `
    <div class="stat-row"><span class="stat-label">${t('waves-label')}</span><span class="stat-value">${state.wavesCleared}</span></div>
    <div class="stat-row"><span class="stat-label">${t('threats-label')}</span><span class="stat-value">${state.sessionThreatsDestroyed}</span></div>
    <div class="stat-row"><span class="stat-label">${t('accuracy-label')}</span><span class="stat-value">${acc}%</span></div>
    <div class="stat-row"><span class="stat-label">SCORE</span><span class="stat-value">${String(state.score).padStart(6,'0')}</span></div>
    ${isNewHigh ? `<div class="stat-row highscore"><span class="stat-label">${t('highscore-label')}</span><span class="stat-value">★</span></div>` : ''}
  `;

  applyTranslations();
  showScreen('screen-gameover');
}

// ═══════════════════════════════════════════
//  GAMEMODE COMPLETE
// ═══════════════════════════════════════════

function gamemodeComplete() {
  stopGame();
  hideAllOverlays();

  const gmIdx = state.currentGamemode;
  markGamemodeComplete(gmIdx);

  generateStars('stars-win', 90);

  const gm = GAMEMODES[gmIdx];
  document.getElementById('win-gm-name').textContent = gm[state.lang].name;

  const hasNext = gmIdx < GAMEMODES.length - 1;
  const nextBtn = document.getElementById('btn-next-gm');
  nextBtn.style.display = hasNext ? 'inline-block' : 'none';

  const acc = state.sessionTotalAnswers > 0
    ? Math.round((state.sessionCorrectAnswers / state.sessionTotalAnswers) * 100)
    : 0;

  document.getElementById('win-stats').innerHTML = `
    <div class="stat-row"><span class="stat-label">${t('waves-label')}</span><span class="stat-value">${state.wavesCleared}</span></div>
    <div class="stat-row"><span class="stat-label">${t('threats-label')}</span><span class="stat-value">${state.sessionThreatsDestroyed}</span></div>
    <div class="stat-row"><span class="stat-label">${t('accuracy-label')}</span><span class="stat-value">${acc}%</span></div>
    <div class="stat-row"><span class="stat-label">SCORE</span><span class="stat-value">${String(state.score).padStart(6,'0')}</span></div>
  `;

  applyTranslations();
  showScreen('screen-win');
}

// ═══════════════════════════════════════════
//  RESULT SCREEN ACTIONS
// ═══════════════════════════════════════════

function replayGamemode() {
  stopGame();
  hideAllOverlays();
  startBriefing(state.currentGamemode);
}

function nextGamemode() {
  const next = state.currentGamemode + 1;
  if (next < GAMEMODES.length) {
    stopGame();
    hideAllOverlays();
    startBriefing(next);
  }
}

function goToMenu() {
  stopGame();
  hideAllOverlays();
  initMenu();
  showScreen('screen-menu');
}

// ═══════════════════════════════════════════
//  LANGUAGE
// ═══════════════════════════════════════════

function setLang(lang) {
  state.lang = lang;
  document.getElementById('html-root').setAttribute('lang', lang);
  applyTranslations();

  // Refresh dynamic content if on a screen
  const active = document.querySelector('.screen.active');
  if (active) {
    if (active.id === 'screen-menu')     renderGamemodeList();
    if (active.id === 'screen-briefing') startBriefing(state.currentGamemode);
  }
}

// ═══════════════════════════════════════════
//  FULLSCREEN
// ═══════════════════════════════════════════

function toggleFullscreen() {
  const cabinet = document.getElementById('cabinet');
  if (!document.fullscreenElement) {
    (cabinet.requestFullscreen || cabinet.webkitRequestFullscreen || cabinet.mozRequestFullScreen).call(cabinet);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen).call(document);
  }
}

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Show the standalone footer only when not embedded inside the Academy overlay
  if (window.self === window.top) {
    document.querySelectorAll('.standalone-only').forEach(el => el.style.display = '');
  }

  loadPlayers();

  if (state.players.length === 0) {
    showScreen('screen-name');
    initNameEntry();
  } else {
    state.currentPlayerIdx = 0;
    initMenu();
    showScreen('screen-menu');
  }

  applyTranslations();

  // Keyboard: escape to pause/close popup
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.popupOpen) { closeCounterPopup(); return; }
      if (document.getElementById('overlay-syllabus').style.display !== 'none') { closeSyllabus(); return; }
      if (document.getElementById('overlay-quit').style.display !== 'none') { cancelQuit(); return; }
      if (state.gameRunning) togglePause();
    }
  });
});
