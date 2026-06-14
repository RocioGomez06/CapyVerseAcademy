// =============================================
// CAPY DATA DUNGEON — SCRIPT
// SQL puzzle dungeon. Each room = a SQL challenge.
// Uses sql.js (SQLite compiled to WebAssembly).
// =============================================

'use strict';

let levels        = [];
let currentLevel  = null;
let currentLang   = (window.CapyLang && window.CapyLang.get()) || 'en';
let sqlReady      = null;       // Promise resolving to SQL.js module
let dbCache       = new Map();  // level.id → Database

// ── TRANSLATIONS ────────────────────────────────
const T = {
  en: {
    gameTitle:        'Capy Data Dungeon',
    startSubtitle:    'Capy is trapped beneath the Archive of Forgotten Tables.<br/>Cast SQL queries to open doors, banish foes, and escape.',
    startButton:      '▶ ENTER DUNGEON',
    selectRoomTitle:  'SELECT ROOM',
    selectSubtitle:   'Each room hides a database puzzle.',
    backToStart:      '⟵ Start',
    backToLevels:     '⟵ Rooms',
    tablesTitle:      'TABLES',
    queryTitle:       'QUERY',
    castButton:       '▶ CAST QUERY',
    hintButton:       '💡 HINT',
    resultHint:       'Results will appear here.',
    readyMessage:     'Ready. Read the scene, write the query, cast it.',
    nextLevel:        'Next Room ⟶',
    play:             'ENTER',
    playAgain:        'ENTER AGAIN',
    locked:           'LOCKED 🔒',
    lockedMsg:        'Clear the previous room first.',
    completed:        '✓ Cleared',
    msgWin:           '🗝️ The door opens! The room yields.',
    msgWrong:         '⚡ The runes flicker — the result does not match. Try again.',
    msgError:         '✖ Your spell fizzles (SQL error). Check the syntax.',
    msgEmpty:         'Write a query and press CAST.',
    howtoTitle:       'How to Play',
    howtoClose:       'Light the Torch ▶',
    goalLabel:        'Goal:',
    goalText:         ' Escape every room of the Archive by writing a SQL query that solves the puzzle.',
    howToPlayLabel:   'How to play:',
    howToPlayText:    ' Read the scene on the left. The tables on the right show what you can query. Type a SELECT statement, press CAST QUERY. If your result matches the door\'s lock, the door opens.',
    objectiveLabel:   'Objective',
    expected:         'Expected result',
    yourResult:       'Your result',
    loadingSql:       'Loading SQL engine…',
    hintTitle:        '💡 Hint',
    hintClose:        'Got it ▶',
    finalWinTitle:    '🏆 DUNGEON CLEARED!',
    finalWinMsg:      'Capy has escaped the Archive of Forgotten Tables. Every room conquered, every lock picked.',
    finalWinRooms:    '⟵ Back to Rooms',
    finalWinClose:    'Close',
  },
  es: {
    gameTitle:        'Capy Data Dungeon',
    startSubtitle:    'Capy está atrapado bajo el Archivo de Tablas Olvidadas.<br/>Lanza consultas SQL para abrir puertas, vencer enemigos y escapar.',
    startButton:      '▶ ENTRAR A LA MAZMORRA',
    selectRoomTitle:  'SELECCIONAR SALA',
    selectSubtitle:   'Cada sala esconde un puzzle de base de datos.',
    backToStart:      '⟵ Inicio',
    backToLevels:     '⟵ Salas',
    tablesTitle:      'TABLAS',
    queryTitle:       'CONSULTA',
    castButton:       '▶ LANZAR CONSULTA',
    hintButton:       '💡 PISTA',
    resultHint:       'Los resultados aparecerán aquí.',
    readyMessage:     'Listo. Lee la escena, escribe la consulta, lánzala.',
    nextLevel:        'Siguiente Sala ⟶',
    play:             'ENTRAR',
    playAgain:        'ENTRAR DE NUEVO',
    locked:           'BLOQUEADO 🔒',
    lockedMsg:        'Completa la sala anterior primero.',
    completed:        '✓ Superada',
    msgWin:           '🗝️ ¡La puerta se abre! La sala cede.',
    msgWrong:         '⚡ Las runas parpadean — el resultado no coincide. Intenta de nuevo.',
    msgError:         '✖ Tu hechizo falla (error SQL). Revisa la sintaxis.',
    msgEmpty:         'Escribe una consulta y presiona LANZAR.',
    howtoTitle:       'Cómo Jugar',
    howtoClose:       'Encender la Antorcha ▶',
    goalLabel:        'Objetivo:',
    goalText:         ' Escapa de cada sala del Archivo escribiendo una consulta SQL que resuelva el puzzle.',
    howToPlayLabel:   'Cómo jugar:',
    howToPlayText:    ' Lee la escena a la izquierda. Las tablas a la derecha muestran lo que puedes consultar. Escribe un SELECT, presiona LANZAR. Si tu resultado coincide con la cerradura, la puerta se abre.',
    objectiveLabel:   'Objetivo',
    expected:         'Resultado esperado',
    yourResult:       'Tu resultado',
    loadingSql:       'Cargando motor SQL…',
    hintTitle:        '💡 Pista',
    hintClose:        'Entendido ▶',
    finalWinTitle:    '🏆 ¡MAZMORRA SUPERADA!',
    finalWinMsg:      'Capy escapó del Archivo de Tablas Olvidadas. Cada sala conquistada, cada cerradura abierta.',
    finalWinRooms:    '⟵ Volver a Salas',
    finalWinClose:    'Cerrar',
  },
  pt: {
    gameTitle:        'Capy Data Dungeon',
    startSubtitle:    'Capy está preso embaixo do Arquivo das Tabelas Esquecidas.<br/>Lance consultas SQL para abrir portas, banir inimigos e escapar.',
    startButton:      '▶ ENTRAR NA MASMORRA',
    selectRoomTitle:  'SELECIONAR SALA',
    selectSubtitle:   'Cada sala esconde um puzzle de banco de dados.',
    backToStart:      '⟵ Início',
    backToLevels:     '⟵ Salas',
    tablesTitle:      'TABELAS',
    queryTitle:       'CONSULTA',
    castButton:       '▶ LANÇAR CONSULTA',
    hintButton:       '💡 DICA',
    resultHint:       'Os resultados aparecerão aqui.',
    readyMessage:     'Pronto. Leia a cena, escreva a consulta, lance-a.',
    nextLevel:        'Próxima Sala ⟶',
    play:             'ENTRAR',
    playAgain:        'ENTRAR DE NOVO',
    locked:           'BLOQUEADO 🔒',
    lockedMsg:        'Conclua a sala anterior primeiro.',
    completed:        '✓ Concluída',
    msgWin:           '🗝️ A porta se abre! A sala cede.',
    msgWrong:         '⚡ As runas piscam — o resultado não bate. Tente de novo.',
    msgError:         '✖ Seu feitiço falha (erro SQL). Verifique a sintaxe.',
    msgEmpty:         'Escreva uma consulta e pressione LANÇAR.',
    howtoTitle:       'Como Jogar',
    howtoClose:       'Acender a Tocha ▶',
    goalLabel:        'Objetivo:',
    goalText:         ' Escape de cada sala do Arquivo escrevendo uma consulta SQL que resolva o puzzle.',
    howToPlayLabel:   'Como jogar:',
    howToPlayText:    ' Leia a cena à esquerda. As tabelas à direita mostram o que você pode consultar. Escreva um SELECT, pressione LANÇAR. Se seu resultado bater com a fechadura, a porta abre.',
    objectiveLabel:   'Objetivo',
    expected:         'Resultado esperado',
    yourResult:       'Seu resultado',
    loadingSql:       'Carregando motor SQL…',
    hintTitle:        '💡 Dica',
    hintClose:        'Entendi ▶',
    finalWinTitle:    '🏆 MASMORRA VENCIDA!',
    finalWinMsg:      'Capy escapou do Arquivo das Tabelas Esquecidas. Cada sala vencida, cada fechadura aberta.',
    finalWinRooms:    '⟵ Voltar às Salas',
    finalWinClose:    'Fechar',
  },
};

function t(key)              { return (T[currentLang] || T.en)[key] || key; }
function lvl(level, field)   {
  if (!level) return '';
  return level[field + '_' + currentLang] || level[field] || '';
}

// ── PROGRESS ────────────────────────────────────
function getProgress() {
  try { return JSON.parse(localStorage.getItem('cdd_progress') || '{}'); }
  catch { return {}; }
}
function setLevelCompleted(id) {
  const p = getProgress(); p[id] = true;
  try { localStorage.setItem('cdd_progress', JSON.stringify(p)); } catch {}
}
function isCompleted(id) { return !!getProgress()[id]; }
function isLocked(id)    { return id > 1 && !isCompleted(id - 1); }

// ── SQL ENGINE ──────────────────────────────────
function loadSqlEngine() {
  if (sqlReady) return sqlReady;
  sqlReady = window.initSqlJs({
    locateFile: f => `https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/${f}`,
  });
  return sqlReady;
}

async function getDbForLevel(level) {
  if (dbCache.has(level.id)) return dbCache.get(level.id);
  const SQL = await loadSqlEngine();
  const db = new SQL.Database();
  db.exec(level.schema);
  dbCache.set(level.id, db);
  return db;
}

function runQuery(db, sql) {
  // Returns { columns: string[], rows: any[][] } or throws
  const res = db.exec(sql);
  if (!res || res.length === 0) return { columns: [], rows: [] };
  const r = res[0];
  return { columns: r.columns, rows: r.values };
}

function rowsEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ra = a[i], rb = b[i];
    if (ra.length !== rb.length) return false;
    for (let j = 0; j < ra.length; j++) {
      if (String(ra[j]) !== String(rb[j])) return false;
    }
  }
  return true;
}

// ── SCENE RENDERING ────────────────────────────
// Each scene is a 5×3 grid of tiles. `h` marks the hero (capy),
// `g` marks the goal tile, `.` marks a dim background tile.
const SCENE_LIB = {
  cell: {
    tag: '📜 prisoners',
    grid: [
      ['🪨','🕯️','🪨','🪨','🪨'],
      ['⛓️','🦫|h','📜','🪨','🚪|g'],
      ['🦴','🪨|.','🪨|.','🪨|.','🪨'],
    ],
  },
  keys: {
    tag: '🔑 keys',
    grid: [
      ['🗝️','🪙','🗝️','🪙','🗝️'],
      ['🦫|h','🗝️','🔑','🗝️','🚪|g'],
      ['🪨|.','🗝️','🪨|.','🗝️','🪨|.'],
    ],
  },
  goblins: {
    tag: '⚔️ goblins',
    grid: [
      ['🏺','🔥','🏺','🔥','💰'],
      ['🦫|h','👺','👹','👺','💰|g'],
      ['🪨|.','⚔️','🛡️','⚔️','🪨|.'],
    ],
  },
  bridge: {
    tag: '🪨 bridge',
    grid: [
      ['🌫️|.','🌫️|.','🌫️|.','🌫️|.','🏰'],
      ['🦫|h','🪨','🌉','🪨','🏰|g'],
      ['🕳️','🌫️|.','🕳️','🌫️|.','🕳️'],
    ],
  },
  lich: {
    tag: '🔮 throne',
    grid: [
      ['🕯️','💀','💀','💀','🕯️'],
      ['🦫|h','💀','☠️','💀','👑|g'],
      ['🦴','🕸️','💀','🕸️','🦴'],
    ],
  },
  scribe: {
    tag: '📜 scrolls',
    grid: [
      ['🕯️','📜','📜','📜','🕯️'],
      ['🦫|h','📜','🪶','📜','🚪|g'],
      ['🪨|.','📜','🖋️','📜','🪨|.'],
    ],
  },
  twin: {
    tag: '⚗️ potions',
    grid: [
      ['🕯️','🧪','⚗️','🧪','🕯️'],
      ['🦫|h','🩷','🔵','🟢','🚪|g'],
      ['🔒','🧪','🪙','🧪','🔒'],
    ],
  },
  library: {
    tag: '📚 tomes',
    grid: [
      ['📚','📚','👻','📚','📚'],
      ['🦫|h','📕','📗','📘','🚪|g'],
      ['🪨|.','📚','🕯️','📚','🪨|.'],
    ],
  },
  champion: {
    tag: '🏛️ pillar',
    grid: [
      ['🏆','⚔️','🏛️','🛡️','🏆'],
      ['🦫|h','🥇','🥈','🥉','🚪|g'],
      ['🪨|.','⚔️','🪨','🛡️','🪨|.'],
    ],
  },
  census: {
    tag: '🦇 beasts',
    grid: [
      ['🕸️','🦇','🕷️','🦇','🕸️'],
      ['🦫|h','🦇','🐀','🦇','🚪|g'],
      ['🦴','🐍','🦴','🦇','🦴'],
    ],
  },
  default: {
    tag: 'room',
    grid: [
      ['🪨','🪨','❓','🪨','🪨'],
      ['🦫|h','🪨','❓','🪨','🚪|g'],
      ['🪨','🪨','❓','🪨','🪨'],
    ],
  },
};

// Map emojis → sprite filenames in ./assets/. Anything not listed here
// falls through to the emoji glyph. Arrays = variant pool; the variant is
// picked deterministically from the tile index so the same grid renders the
// same way every time (no reshuffle on re-render) while neighbouring tiles
// of the same kind still look different.
const SPRITE_MAP = {
  // ── capybaras
  '🦫':   'capy_mage.png',                            // hero
  '👺':   'capy_goblin_01.png',
  '👹':   'capy_goblin_02.png',
  '💀':   ['capy_undead_minion_01.png', 'capy_undead_minion_02.png'],
  '☠️':   'capy_lich.png',
  '👻':   'capy_ghost.png',
  // ── architecture / props
  '🚪':   'door.png',
  '🔒':   'lock.png',
  '🗝️':   'key.png',
  '🔑':   'key.png',
  '🪨':   ['rock_01.png', 'rock_02.png', 'rock_03.png'],
  '🔥':   'torch.png',
  '🕯️':   ['candle_01.png', 'candle_02.png'],
  '🏺':   ['urn_01.png', 'urn_02.png'],
  '⛓️':   ['chains_01.png', 'chains_02.png'],
  '👑':   'crown.png',
  // ── loot / writing
  '💰':   'coins.png',
  '🪙':   'coins.png',
  '📜':   'scroll.png',
  '🪶':   ['pen_feather_01.png', 'pen_feather_02.png'],
  '🖋️':   ['pen_feather_01.png', 'pen_feather_02.png'],
  '📚':   ['pile_of_books_01.png', 'pile_of_books_02.png'],
  '📕':   'book_01.png',
  '📗':   'book_02.png',
  '📘':   'book_03.png',
  // ── combat
  '⚔️':   'sword.png',
  '🛡️':   'shield.png',
  // ── beasts
  '🕷️':   'spider.png',
  '🦇':   'bat.png',
  '🐀':   'rat.png',
  '🐍':   'snake.png',
  '🦴':   ['bones_01.png', 'bones_02.png'],
  '🕸️':   ['spider_web_01.png', 'spider_web_02.png'],
  // ── environment
  '🌫️':   ['mist_01.png', 'mist_02.png'],
  '🕳️':   ['hole_01.png', 'hole_02.png'],
  '🌉':   'stone_bridge.png',
  '🏰':   'castle.png',
  '🏛️':   'pillar.png',
  // ── trophies / medals
  '🏆':   'trophy.png',
  '🥇':   'medal_gold.png',
  '🥈':   'medal_silver.png',
  '🥉':   'medal_bronze.png',
  // ── potions / alchemy (Bang Wong palette only — no red)
  '⚗️':   'alchemy.png',
  '🩷':   'potion_pink.png',                          // Twin Locks target color
  '🔵':   'potion_blue.png',
  '🟢':   'potion_green.png',
  '🧪':   'potion_yellow.png',                        // decorative
};

function pickSprite(emoji, idx, seenSoFar) {
  const v = SPRITE_MAP[emoji];
  if (!v) return null;
  if (Array.isArray(v)) {
    // Cycle through variants in declaration order based on how many of this
    // emoji we've already placed in the grid — guarantees neighbouring tiles
    // of the same kind always land on different sprites.
    const n = seenSoFar[emoji] || 0;
    seenSoFar[emoji] = n + 1;
    return v[n % v.length];
  }
  return v;
}

function renderScene(level) {
  const el = document.getElementById('scene');
  if (!el) return;
  const def = SCENE_LIB[level.scene] || SCENE_LIB.default;
  const variantCounts = {};
  const tiles = def.grid.flat().map((cell, idx) => {
    const [emoji, flag] = cell.split('|');
    const cls = flag === 'h' ? 'scene-tile hero'
              : flag === 'g' ? 'scene-tile goal'
              : flag === '.' ? 'scene-tile dim'
              : 'scene-tile';
    const sprite = pickSprite(emoji, idx, variantCounts);
    const inner = sprite
      ? `<img src="assets/${sprite}" alt="" class="scene-sprite" />`
      : emoji;
    return `<span class="${cls}">${inner}</span>`;
  }).join('');
  el.innerHTML = `<div class="scene-grid">${tiles}</div><span class="scene-tag">${def.tag}</span>`;
}

// ── TABLES VIEW ────────────────────────────────
async function renderTablesView(level) {
  const view = document.getElementById('tables-view');
  if (!view) return;
  const db = await getDbForLevel(level);
  view.innerHTML = '';
  level.tables.forEach(tname => {
    let res;
    try { res = db.exec(`SELECT * FROM ${tname}`); } catch (e) { return; }
    if (!res || res.length === 0) return;
    const r = res[0];
    const block = document.createElement('div');
    block.className = 'table-block';
    const head = `<div class="table-name">${tname}</div>`;
    const ths  = r.columns.map(c => `<th>${c}</th>`).join('');
    const trs  = r.values.map(row => `<tr>${row.map(v => `<td>${v}</td>`).join('')}</tr>`).join('');
    block.innerHTML = `${head}<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    view.appendChild(block);
  });
}

// ── RESULT PANEL ───────────────────────────────
function renderResultTable(result) {
  const panel = document.getElementById('result-panel');
  if (!panel) return;
  if (!result.columns.length) {
    panel.innerHTML = `<div class="result-hint">(empty result)</div>`;
    return;
  }
  const ths = result.columns.map(c => `<th>${c}</th>`).join('');
  const trs = result.rows.map(row => `<tr>${row.map(v => `<td>${v}</td>`).join('')}</tr>`).join('');
  panel.innerHTML = `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
}

function renderResultError(err) {
  const panel = document.getElementById('result-panel');
  if (!panel) return;
  panel.innerHTML = `<div class="sql-error">${String(err.message || err)}</div>`;
}

// ── CAST QUERY ─────────────────────────────────
async function castQuery() {
  if (!currentLevel) return;
  const input = document.getElementById('query-input');
  const sql   = (input?.value || '').trim();
  if (!sql) { setMessage(t('msgEmpty'), 'error'); return; }

  let db;
  try { db = await getDbForLevel(currentLevel); }
  catch (e) { setMessage(t('msgError'), 'error'); renderResultError(e); return; }

  let playerResult, expectedResult;
  try { playerResult = runQuery(db, sql); }
  catch (e) { setMessage(t('msgError'), 'error'); renderResultError(e); return; }

  renderResultTable(playerResult);

  try { expectedResult = runQuery(db, currentLevel.expected_query); }
  catch (e) { setMessage(t('msgError'), 'error'); return; }

  if (rowsEqual(playerResult.rows, expectedResult.rows) &&
      playerResult.columns.length === expectedResult.columns.length) {
    onRoomWin();
  } else {
    setMessage(t('msgWrong'), 'error');
  }
}

function onRoomWin() {
  setMessage(t('msgWin'), 'win');
  setLevelCompleted(currentLevel.id);
  const scene = document.getElementById('scene');
  scene?.classList.add('win-flash');
  setTimeout(() => scene?.classList.remove('win-flash'), 1400);
  const nextBtn = document.getElementById('btn-next-level');
  if (nextBtn && levels.some(l => l.id === currentLevel.id + 1)) {
    nextBtn.classList.remove('hidden');
  } else if (levels.every(l => isCompleted(l.id))) {
    setTimeout(showFinalWin, 900);
  }
}

function showFinalWin() {
  const overlay = document.getElementById('final-win-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  const close = () => overlay.classList.add('hidden');
  document.getElementById('final-win-close')?.addEventListener('click', close, { once: true });
  document.getElementById('final-win-rooms')?.addEventListener('click', () => {
    close();
    renderLevelList();
    showScreen('screen-levels');
  }, { once: true });
}

// ── HINT POPUP ─────────────────────────────────
// Per-concept teaching content. Uses a DIFFERENT example table than
// the level's own — the hint teaches the shape, not the answer.
const TEACH = {
  'SELECT *': {
    en: `<h3>SELECT *</h3>
      <p><code>SELECT *</code> means "give me every column and every row" from a table.</p>
      <p>Pattern:</p>
      <pre>SELECT * FROM &lt;table_name&gt;;</pre>
      <p>Example — if a table <code>cats</code> existed:</p>
      <pre>SELECT * FROM cats;</pre>
      <p class="hint-note">Look at the table this room gives you and apply the same shape.</p>`,
    es: `<h3>SELECT *</h3>
      <p><code>SELECT *</code> significa "dame todas las columnas y todas las filas" de una tabla.</p>
      <p>Patrón:</p>
      <pre>SELECT * FROM &lt;nombre_tabla&gt;;</pre>
      <p>Ejemplo — si existiera una tabla <code>cats</code>:</p>
      <pre>SELECT * FROM cats;</pre>
      <p class="hint-note">Mira la tabla de esta sala y aplica la misma forma.</p>`,
    pt: `<h3>SELECT *</h3>
      <p><code>SELECT *</code> significa "me dê todas as colunas e todas as linhas" de uma tabela.</p>
      <p>Padrão:</p>
      <pre>SELECT * FROM &lt;nome_tabela&gt;;</pre>
      <p>Exemplo — se existisse uma tabela <code>cats</code>:</p>
      <pre>SELECT * FROM cats;</pre>
      <p class="hint-note">Olhe a tabela desta sala e aplique a mesma forma.</p>`,
  },
  'SELECT column': {
    en: `<h3>SELECT &lt;column&gt;</h3>
      <p>Instead of <code>*</code> (every column), you can name the exact column(s) you want. Separate multiple columns with commas.</p>
      <p>Pattern:</p>
      <pre>SELECT &lt;column&gt; FROM &lt;table&gt;;
SELECT &lt;col1&gt;, &lt;col2&gt; FROM &lt;table&gt;;</pre>
      <p>Example — a <code>cats</code> table with <code>id</code>, <code>name</code>, <code>color</code>. To see only the names:</p>
      <pre>SELECT name FROM cats;</pre>
      <p class="hint-note">Pick out the column the room asks for and only that one.</p>`,
    es: `<h3>SELECT &lt;columna&gt;</h3>
      <p>En lugar de <code>*</code> (todas las columnas), puedes nombrar la(s) columna(s) exacta(s). Separa con comas.</p>
      <p>Patrón:</p>
      <pre>SELECT &lt;columna&gt; FROM &lt;tabla&gt;;
SELECT &lt;col1&gt;, &lt;col2&gt; FROM &lt;tabla&gt;;</pre>
      <p>Ejemplo — tabla <code>cats</code> con <code>id</code>, <code>name</code>, <code>color</code>. Para ver solo los nombres:</p>
      <pre>SELECT name FROM cats;</pre>
      <p class="hint-note">Elige solo la columna que pide la sala.</p>`,
    pt: `<h3>SELECT &lt;coluna&gt;</h3>
      <p>Em vez de <code>*</code> (todas as colunas), você pode nomear a(s) coluna(s) exata(s). Separe por vírgulas.</p>
      <p>Padrão:</p>
      <pre>SELECT &lt;coluna&gt; FROM &lt;tabela&gt;;
SELECT &lt;col1&gt;, &lt;col2&gt; FROM &lt;tabela&gt;;</pre>
      <p>Exemplo — tabela <code>cats</code> com <code>id</code>, <code>name</code>, <code>color</code>. Para ver só os nomes:</p>
      <pre>SELECT name FROM cats;</pre>
      <p class="hint-note">Escolha só a coluna que a sala pede.</p>`,
  },
  "WHERE = 'value'": {
    en: `<h3>WHERE column = 'value'</h3>
      <p><code>WHERE</code> filters rows. Use <code>=</code> to match an exact text value (quotes around the text).</p>
      <p>Pattern:</p>
      <pre>SELECT * FROM &lt;table&gt; WHERE &lt;column&gt; = '&lt;value&gt;';</pre>
      <p>Example — a <code>cats</code> table with a <code>color</code> column, finding all black cats:</p>
      <pre>SELECT * FROM cats WHERE color = 'black';</pre>
      <p class="hint-note">Identify the column the room asks about, and the value to match.</p>`,
    es: `<h3>WHERE columna = 'valor'</h3>
      <p><code>WHERE</code> filtra filas. Usa <code>=</code> para coincidir con un texto exacto (con comillas).</p>
      <p>Patrón:</p>
      <pre>SELECT * FROM &lt;tabla&gt; WHERE &lt;columna&gt; = '&lt;valor&gt;';</pre>
      <p>Ejemplo — una tabla <code>cats</code> con columna <code>color</code>, buscando gatos negros:</p>
      <pre>SELECT * FROM cats WHERE color = 'black';</pre>
      <p class="hint-note">Identifica la columna y el valor que pide la sala.</p>`,
    pt: `<h3>WHERE coluna = 'valor'</h3>
      <p><code>WHERE</code> filtra linhas. Use <code>=</code> para combinar texto exato (com aspas).</p>
      <p>Padrão:</p>
      <pre>SELECT * FROM &lt;tabela&gt; WHERE &lt;coluna&gt; = '&lt;valor&gt;';</pre>
      <p>Exemplo — uma tabela <code>cats</code> com coluna <code>color</code>, buscando gatos pretos:</p>
      <pre>SELECT * FROM cats WHERE color = 'black';</pre>
      <p class="hint-note">Identifique a coluna e o valor que a sala pede.</p>`,
  },
  'WHERE column < value': {
    en: `<h3>WHERE column &lt; value</h3>
      <p><code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> compare numbers — no quotes around numbers.</p>
      <p>Pattern:</p>
      <pre>SELECT &lt;column&gt; FROM &lt;table&gt; WHERE &lt;column&gt; &lt; &lt;number&gt;;</pre>
      <p>Example — a <code>students</code> table with an <code>age</code> column, finding the names of students under 18:</p>
      <pre>SELECT name FROM students WHERE age &lt; 18;</pre>
      <p class="hint-note">Note that <code>SELECT name</code> returns only that column, not every column.</p>`,
    es: `<h3>WHERE columna &lt; valor</h3>
      <p><code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> comparan números — sin comillas en los números.</p>
      <p>Patrón:</p>
      <pre>SELECT &lt;columna&gt; FROM &lt;tabla&gt; WHERE &lt;columna&gt; &lt; &lt;número&gt;;</pre>
      <p>Ejemplo — tabla <code>students</code> con columna <code>age</code>, buscando nombres de menores de 18:</p>
      <pre>SELECT name FROM students WHERE age &lt; 18;</pre>
      <p class="hint-note"><code>SELECT name</code> devuelve solo esa columna, no todas.</p>`,
    pt: `<h3>WHERE coluna &lt; valor</h3>
      <p><code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> comparam números — sem aspas em números.</p>
      <p>Padrão:</p>
      <pre>SELECT &lt;coluna&gt; FROM &lt;tabela&gt; WHERE &lt;coluna&gt; &lt; &lt;número&gt;;</pre>
      <p>Exemplo — tabela <code>students</code> com coluna <code>age</code>, buscando nomes de menores de 18:</p>
      <pre>SELECT name FROM students WHERE age &lt; 18;</pre>
      <p class="hint-note"><code>SELECT name</code> retorna só essa coluna, não todas.</p>`,
  },
  'WHERE AND': {
    en: `<h3>WHERE ... AND ...</h3>
      <p><code>AND</code> chains two conditions — a row only passes if <strong>both</strong> are true.</p>
      <p>Pattern:</p>
      <pre>SELECT &lt;col&gt;
FROM &lt;table&gt;
WHERE &lt;cond1&gt; AND &lt;cond2&gt;;</pre>
      <p>Example — a <code>cats</code> table with <code>color</code> and <code>age</code>. To find black cats older than 5:</p>
      <pre>SELECT name
FROM cats
WHERE color = 'black' AND age &gt; 5;</pre>
      <p class="hint-note">Each condition still follows the same column = value or column &lt; number rules from earlier rooms.</p>`,
    es: `<h3>WHERE ... AND ...</h3>
      <p><code>AND</code> encadena dos condiciones — una fila pasa solo si <strong>ambas</strong> son verdaderas.</p>
      <p>Patrón:</p>
      <pre>SELECT &lt;col&gt;
FROM &lt;tabla&gt;
WHERE &lt;cond1&gt; AND &lt;cond2&gt;;</pre>
      <p>Ejemplo — tabla <code>cats</code> con <code>color</code> y <code>age</code>. Gatos negros con más de 5 años:</p>
      <pre>SELECT name
FROM cats
WHERE color = 'black' AND age &gt; 5;</pre>
      <p class="hint-note">Cada condición sigue las mismas reglas que aprendiste en las salas anteriores.</p>`,
    pt: `<h3>WHERE ... AND ...</h3>
      <p><code>AND</code> encadeia duas condições — uma linha passa só se <strong>ambas</strong> forem verdadeiras.</p>
      <p>Padrão:</p>
      <pre>SELECT &lt;col&gt;
FROM &lt;tabela&gt;
WHERE &lt;cond1&gt; AND &lt;cond2&gt;;</pre>
      <p>Exemplo — tabela <code>cats</code> com <code>color</code> e <code>age</code>. Gatos pretos com mais de 5 anos:</p>
      <pre>SELECT name
FROM cats
WHERE color = 'black' AND age &gt; 5;</pre>
      <p class="hint-note">Cada condição segue as regras que você aprendeu nas salas anteriores.</p>`,
  },
  'ORDER BY': {
    en: `<h3>ORDER BY</h3>
      <p><code>ORDER BY</code> sorts the rows. Add <code>DESC</code> for high → low, or <code>ASC</code> (the default) for low → high.</p>
      <p>Pattern:</p>
      <pre>SELECT &lt;cols&gt;
FROM &lt;table&gt;
ORDER BY &lt;col&gt; DESC;</pre>
      <p>Example — a <code>cats</code> table with <code>name</code> and <code>age</code>. To list every cat from oldest to youngest:</p>
      <pre>SELECT name, age
FROM cats
ORDER BY age DESC;</pre>
      <p class="hint-note">ORDER BY doesn't remove any rows — it only rearranges them.</p>`,
    es: `<h3>ORDER BY</h3>
      <p><code>ORDER BY</code> ordena las filas. Usa <code>DESC</code> de mayor a menor, o <code>ASC</code> (por defecto) de menor a mayor.</p>
      <p>Patrón:</p>
      <pre>SELECT &lt;cols&gt;
FROM &lt;tabla&gt;
ORDER BY &lt;col&gt; DESC;</pre>
      <p>Ejemplo — tabla <code>cats</code> con <code>name</code> y <code>age</code>. Listar gatos del más viejo al más joven:</p>
      <pre>SELECT name, age
FROM cats
ORDER BY age DESC;</pre>
      <p class="hint-note">ORDER BY no quita filas — solo las reordena.</p>`,
    pt: `<h3>ORDER BY</h3>
      <p><code>ORDER BY</code> ordena as linhas. Use <code>DESC</code> do maior pro menor, ou <code>ASC</code> (padrão) do menor pro maior.</p>
      <p>Patrão:</p>
      <pre>SELECT &lt;cols&gt;
FROM &lt;tabela&gt;
ORDER BY &lt;col&gt; DESC;</pre>
      <p>Exemplo — tabela <code>cats</code> com <code>name</code> e <code>age</code>. Listar gatos do mais velho ao mais novo:</p>
      <pre>SELECT name, age
FROM cats
ORDER BY age DESC;</pre>
      <p class="hint-note">ORDER BY não tira linhas — só as reordena.</p>`,
  },
  'ORDER BY + LIMIT': {
    en: `<h3>ORDER BY + LIMIT</h3>
      <p>Sort first, then keep only the top N rows with <code>LIMIT</code>. Together they give you "the best 3" or "the top 5".</p>
      <p>Pattern:</p>
      <pre>SELECT &lt;cols&gt;
FROM &lt;table&gt;
ORDER BY &lt;col&gt; DESC
LIMIT &lt;n&gt;;</pre>
      <p>Example — a <code>cats</code> table with <code>name</code> and <code>cuteness</code>. The five cutest cats:</p>
      <pre>SELECT name, cuteness
FROM cats
ORDER BY cuteness DESC
LIMIT 5;</pre>
      <p class="hint-note">Order matters: <code>ORDER BY</code> comes before <code>LIMIT</code>.</p>`,
    es: `<h3>ORDER BY + LIMIT</h3>
      <p>Primero ordenas, luego quedas solo con las N primeras filas con <code>LIMIT</code>. Juntas dan "los 3 mejores" o "los 5 mejores".</p>
      <p>Patrón:</p>
      <pre>SELECT &lt;cols&gt;
FROM &lt;tabla&gt;
ORDER BY &lt;col&gt; DESC
LIMIT &lt;n&gt;;</pre>
      <p>Ejemplo — tabla <code>cats</code> con <code>name</code> y <code>cuteness</code>. Los cinco gatos más tiernos:</p>
      <pre>SELECT name, cuteness
FROM cats
ORDER BY cuteness DESC
LIMIT 5;</pre>
      <p class="hint-note">El orden importa: <code>ORDER BY</code> va antes que <code>LIMIT</code>.</p>`,
    pt: `<h3>ORDER BY + LIMIT</h3>
      <p>Primeiro ordene, depois fique só com as N primeiras linhas com <code>LIMIT</code>. Juntos dão "os 3 melhores" ou "os 5 melhores".</p>
      <p>Padrão:</p>
      <pre>SELECT &lt;cols&gt;
FROM &lt;tabela&gt;
ORDER BY &lt;col&gt; DESC
LIMIT &lt;n&gt;;</pre>
      <p>Exemplo — tabela <code>cats</code> com <code>name</code> e <code>cuteness</code>. Os cinco gatos mais fofos:</p>
      <pre>SELECT name, cuteness
FROM cats
ORDER BY cuteness DESC
LIMIT 5;</pre>
      <p class="hint-note">A ordem importa: <code>ORDER BY</code> vem antes de <code>LIMIT</code>.</p>`,
  },
  'COUNT': {
    en: `<h3>COUNT(*)</h3>
      <p><code>COUNT(*)</code> returns a single number: how many rows your query matched.</p>
      <p>Pattern:</p>
      <pre>SELECT COUNT(*) FROM &lt;table&gt;;
SELECT COUNT(*) FROM &lt;table&gt; WHERE &lt;cond&gt;;</pre>
      <p>Example — a <code>cats</code> table. How many cats are orange?</p>
      <pre>SELECT COUNT(*)
FROM cats
WHERE color = 'orange';</pre>
      <p class="hint-note">The result is one row with one column — a number, not a list of names.</p>`,
    es: `<h3>COUNT(*)</h3>
      <p><code>COUNT(*)</code> devuelve un único número: cuántas filas coincidieron con tu consulta.</p>
      <p>Patrón:</p>
      <pre>SELECT COUNT(*) FROM &lt;tabla&gt;;
SELECT COUNT(*) FROM &lt;tabla&gt; WHERE &lt;cond&gt;;</pre>
      <p>Ejemplo — tabla <code>cats</code>. ¿Cuántos gatos son naranjas?</p>
      <pre>SELECT COUNT(*)
FROM cats
WHERE color = 'orange';</pre>
      <p class="hint-note">El resultado es una fila con una columna — un número, no una lista de nombres.</p>`,
    pt: `<h3>COUNT(*)</h3>
      <p><code>COUNT(*)</code> retorna um único número: quantas linhas bateram com a consulta.</p>
      <p>Padrão:</p>
      <pre>SELECT COUNT(*) FROM &lt;tabela&gt;;
SELECT COUNT(*) FROM &lt;tabela&gt; WHERE &lt;cond&gt;;</pre>
      <p>Exemplo — tabela <code>cats</code>. Quantos gatos são laranja?</p>
      <pre>SELECT COUNT(*)
FROM cats
WHERE color = 'orange';</pre>
      <p class="hint-note">O resultado é uma linha com uma coluna — um número, não uma lista de nomes.</p>`,
  },
  'JOIN ... ON ...': {
    en: `<h3>JOIN ... ON ...</h3>
      <p><code>JOIN</code> stitches two tables together using a shared id. The <code>ON</code> clause says which columns line up.</p>
      <p>Pattern:</p>
      <pre>SELECT t1.&lt;col&gt;
FROM &lt;t1&gt;
JOIN &lt;t2&gt; ON t1.&lt;fk&gt; = t2.&lt;id&gt;
WHERE t2.&lt;col&gt; = '&lt;value&gt;';</pre>
      <p>Example — <code>books(id, title, author_id)</code> and <code>authors(id, name)</code>. To list titles by an author named "Borges":</p>
      <pre>SELECT books.title
FROM books
JOIN authors ON books.author_id = authors.id
WHERE authors.name = 'Borges';</pre>
      <p class="hint-note">Use <code>table.column</code> so the engine knows which side each column comes from.</p>`,
    es: `<h3>JOIN ... ON ...</h3>
      <p><code>JOIN</code> une dos tablas por un id compartido. La cláusula <code>ON</code> indica qué columnas coinciden.</p>
      <p>Patrón:</p>
      <pre>SELECT t1.&lt;col&gt;
FROM &lt;t1&gt;
JOIN &lt;t2&gt; ON t1.&lt;fk&gt; = t2.&lt;id&gt;
WHERE t2.&lt;col&gt; = '&lt;valor&gt;';</pre>
      <p>Ejemplo — <code>books(id, title, author_id)</code> y <code>authors(id, name)</code>. Para listar títulos de un autor "Borges":</p>
      <pre>SELECT books.title
FROM books
JOIN authors ON books.author_id = authors.id
WHERE authors.name = 'Borges';</pre>
      <p class="hint-note">Usa <code>tabla.columna</code> para que el motor sepa de qué lado viene cada columna.</p>`,
    pt: `<h3>JOIN ... ON ...</h3>
      <p><code>JOIN</code> junta duas tabelas por um id compartilhado. A cláusula <code>ON</code> diz quais colunas se ligam.</p>
      <p>Padrão:</p>
      <pre>SELECT t1.&lt;col&gt;
FROM &lt;t1&gt;
JOIN &lt;t2&gt; ON t1.&lt;fk&gt; = t2.&lt;id&gt;
WHERE t2.&lt;col&gt; = '&lt;valor&gt;';</pre>
      <p>Exemplo — <code>books(id, title, author_id)</code> e <code>authors(id, name)</code>. Para listar títulos do autor "Borges":</p>
      <pre>SELECT books.title
FROM books
JOIN authors ON books.author_id = authors.id
WHERE authors.name = 'Borges';</pre>
      <p class="hint-note">Use <code>tabela.coluna</code> para o motor saber de onde vem cada coluna.</p>`,
  },
  'WHERE + ORDER BY + LIMIT': {
    en: `<h3>WHERE + ORDER BY + LIMIT</h3>
      <p>Combine three ideas: filter rows (<code>WHERE</code>), sort them (<code>ORDER BY</code>), and keep only the top few (<code>LIMIT</code>).</p>
      <p>Pattern:</p>
      <pre>SELECT &lt;col&gt;
FROM &lt;table&gt;
WHERE &lt;col&gt; = '&lt;value&gt;'
ORDER BY &lt;col&gt; DESC
LIMIT &lt;n&gt;;</pre>
      <p>Example — a <code>dragons</code> table with columns <code>name</code>, <code>element</code>, <code>fire_strength</code>. To find the name of the single fire dragon with the most fire_strength:</p>
      <pre>SELECT name
FROM dragons
WHERE element = 'fire'
ORDER BY fire_strength DESC
LIMIT 1;</pre>
      <p class="hint-note"><code>DESC</code> sorts high → low, <code>ASC</code> sorts low → high. <code>LIMIT 1</code> returns only the top row.</p>`,
    es: `<h3>WHERE + ORDER BY + LIMIT</h3>
      <p>Combina tres ideas: filtrar filas (<code>WHERE</code>), ordenarlas (<code>ORDER BY</code>) y quedarte solo con las primeras (<code>LIMIT</code>).</p>
      <p>Patrón:</p>
      <pre>SELECT &lt;col&gt;
FROM &lt;tabla&gt;
WHERE &lt;col&gt; = '&lt;valor&gt;'
ORDER BY &lt;col&gt; DESC
LIMIT &lt;n&gt;;</pre>
      <p>Ejemplo — tabla <code>dragons</code> con columnas <code>name</code>, <code>element</code>, <code>fire_strength</code>. Para el único dragón de fuego con más fire_strength:</p>
      <pre>SELECT name
FROM dragons
WHERE element = 'fire'
ORDER BY fire_strength DESC
LIMIT 1;</pre>
      <p class="hint-note"><code>DESC</code> ordena de mayor a menor, <code>ASC</code> al revés. <code>LIMIT 1</code> deja solo la primera fila.</p>`,
    pt: `<h3>WHERE + ORDER BY + LIMIT</h3>
      <p>Combine três ideias: filtrar linhas (<code>WHERE</code>), ordená-las (<code>ORDER BY</code>) e ficar só com as primeiras (<code>LIMIT</code>).</p>
      <p>Padrão:</p>
      <pre>SELECT &lt;col&gt;
FROM &lt;tabela&gt;
WHERE &lt;col&gt; = '&lt;valor&gt;'
ORDER BY &lt;col&gt; DESC
LIMIT &lt;n&gt;;</pre>
      <p>Exemplo — tabela <code>dragons</code> com colunas <code>name</code>, <code>element</code>, <code>fire_strength</code>. Para o único dragão de fogo com mais fire_strength:</p>
      <pre>SELECT name
FROM dragons
WHERE element = 'fire'
ORDER BY fire_strength DESC
LIMIT 1;</pre>
      <p class="hint-note"><code>DESC</code> ordena do maior pro menor, <code>ASC</code> ao contrário. <code>LIMIT 1</code> deixa só a primeira linha.</p>`,
  },
};

function showHint() {
  if (!currentLevel) return;
  const overlay = document.getElementById('hint-overlay');
  const body    = document.getElementById('hint-body');
  const closeBtn= document.getElementById('hint-close');
  if (!overlay || !body || !closeBtn) return;
  const teach = TEACH[currentLevel.concept];
  const html  = teach ? (teach[currentLang] || teach.en) :
    `<p>${lvl(currentLevel, 'objective')}</p>`;
  body.innerHTML = html;
  overlay.classList.remove('hidden');
  const close = () => {
    overlay.classList.add('hidden');
    closeBtn.removeEventListener('click', close);
    overlay.removeEventListener('click', onOverlay);
  };
  const onOverlay = (e) => { if (e.target === overlay) close(); };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', onOverlay);
}

function setMessage(text, type) {
  const el = document.getElementById('message');
  if (!el) return;
  el.textContent = text;
  el.className = 'message' + (type === 'win' ? ' msg-win' : type === 'error' ? ' msg-error' : '');
}

// ── LOAD LEVEL ─────────────────────────────────
async function loadLevel(id) {
  const level = levels.find(l => l.id === id);
  if (!level) return;
  currentLevel = level;

  const levelWord = currentLang === 'es' ? 'Sala' : currentLang === 'pt' ? 'Sala' : 'Room';
  document.getElementById('current-level-label').textContent = lvl(level, 'title');
  const sectorEl = document.getElementById('current-level-sector');
  if (sectorEl) sectorEl.textContent = `${levelWord} ${level.id} · ${lvl(level, 'sector')}`;

  document.getElementById('narration').innerHTML = lvl(level, 'narration');
  document.getElementById('objective').innerHTML =
    `<strong>${t('objectiveLabel')}:</strong> ${lvl(level, 'objective')}`;

  document.getElementById('query-input').value = '';
  document.getElementById('result-panel').innerHTML =
    `<div class="result-hint">${t('resultHint')}</div>`;
  document.getElementById('btn-next-level')?.classList.add('hidden');
  setMessage(t('readyMessage'));

  renderScene(level);
  showScreen('screen-game');
  await renderTablesView(level);
}

// ── LEVEL SELECT ───────────────────────────────
function renderLevelList() {
  const container = document.getElementById('levels-list');
  if (!container) return;
  container.innerHTML = '';

  levels.forEach(level => {
    const done   = isCompleted(level.id);
    const locked = isLocked(level.id);

    const card = document.createElement('div');
    card.className = 'level-card' + (done ? ' completed' : '') + (locked ? ' locked' : '');
    card.setAttribute('role', 'listitem');

    const info = document.createElement('div');
    info.className = 'level-info';

    const title = document.createElement('div');
    title.className = 'level-title';
    title.textContent = `#${level.id} ${lvl(level, 'title')}`;

    const sector = document.createElement('div');
    sector.className = 'level-sector';
    sector.textContent = lvl(level, 'sector');

    const concept = document.createElement('span');
    concept.className = 'level-concept';
    concept.textContent = level.concept;

    if (done) {
      const badge = document.createElement('span');
      badge.className = 'level-badge';
      badge.textContent = t('completed');
      info.appendChild(badge);
    }
    info.appendChild(title);
    info.appendChild(sector);
    info.appendChild(concept);

    const btn = document.createElement('button');
    btn.className = locked ? '' : 'primary';
    btn.textContent = locked ? t('locked') : (done ? t('playAgain') : t('play'));
    btn.disabled = locked;

    if (!locked) {
      btn.addEventListener('click', () => loadLevel(level.id));
    }

    card.appendChild(info);
    card.appendChild(btn);
    container.appendChild(card);
  });
}

// ── SCREENS ────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

// ── LANGUAGE ───────────────────────────────────
function changeLanguage(lang) {
  if (!T[lang]) return;
  currentLang = lang;
  if (window.CapyLang) window.CapyLang.set(lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  applyTranslations();
  if (document.getElementById('screen-levels')?.classList.contains('active')) renderLevelList();
  if (currentLevel) {
    const levelWord = currentLang === 'es' ? 'Sala' : currentLang === 'pt' ? 'Sala' : 'Room';
    document.getElementById('current-level-label').textContent = lvl(currentLevel, 'title');
    const sectorEl = document.getElementById('current-level-sector');
    if (sectorEl) sectorEl.textContent = `${levelWord} ${currentLevel.id} · ${lvl(currentLevel, 'sector')}`;
    document.getElementById('narration').innerHTML = lvl(currentLevel, 'narration');
    document.getElementById('objective').innerHTML =
      `<strong>${t('objectiveLabel')}:</strong> ${lvl(currentLevel, 'objective')}`;
    setMessage(t('readyMessage'));
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    const val = t(key);
    if (val !== key) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.innerHTML = val;
    }
  });
}

// ── HOW-TO MODAL ───────────────────────────────
function showHowToModal(onClose) {
  const overlay  = document.getElementById('howto-overlay');
  const closeBtn = document.getElementById('howto-close');
  if (!overlay || !closeBtn) { onClose(); return; }
  applyTranslations();
  overlay.classList.remove('hidden');
  const close = () => {
    overlay.classList.add('hidden');
    closeBtn.removeEventListener('click', close);
    overlay.removeEventListener('click', onOverlay);
    onClose();
  };
  const onOverlay = (e) => { if (e.target === overlay) close(); };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', onOverlay);
}

// ── FULLSCREEN ─────────────────────────────────
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
  else document.exitFullscreen().catch(() => {});
}

// Expose for inline onclick handlers
window.changeLanguage   = changeLanguage;
window.toggleFullscreen = toggleFullscreen;

// ── INIT ───────────────────────────────────────
async function init() {
  try {
    const res = await fetch('levels.json', { cache: 'no-store' });
    levels    = await res.json();
  } catch (e) { console.error('Failed to load levels.json', e); return; }

  changeLanguage(currentLang);
  // Warm up sql.js in background
  loadSqlEngine().catch(e => console.warn('sql.js failed to load', e));

  document.getElementById('btn-go-levels')?.addEventListener('click', () => {
    showHowToModal(() => {
      renderLevelList();
      showScreen('screen-levels');
    });
  });
  document.getElementById('btn-back-start')?.addEventListener('click', () => showScreen('screen-start'));
  document.getElementById('btn-back-levels')?.addEventListener('click', () => {
    currentLevel = null;
    renderLevelList();
    showScreen('screen-levels');
  });
  document.getElementById('btn-cast')?.addEventListener('click', castQuery);
  document.getElementById('btn-hint')?.addEventListener('click', showHint);
  document.getElementById('btn-next-level')?.addEventListener('click', () => {
    if (!currentLevel) return;
    const next = levels.find(l => l.id === currentLevel.id + 1);
    if (next) loadLevel(next.id);
  });

  // Ctrl/Cmd + Enter casts query
  document.getElementById('query-input')?.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); castQuery(); }
  });
}

document.addEventListener('DOMContentLoaded', init);
