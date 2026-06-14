// =============================================
// CAPY LOGIC LABS — SCRIPT
// Logic gates game: drag gates into circuit slots,
// evaluate the circuit, fix the megacomputer!
// =============================================

'use strict';

// ── STATE ─────────────────────────────────────────────────
let levels        = [];
let currentLevel  = null;
let slotAssignments = {};   // slotId → gate_type (e.g. "AND")
let currentLang   = (window.CapyLang && window.CapyLang.get()) || 'en';
let draggedGate   = null;   // currently dragged gate type

// ── GATE DEFINITIONS ──────────────────────────────────────
const GATE_DEF = {
  AND:  {
    label: 'AND',
    symbol: '&',
    inputs: 2,
    color: '#0072b2',
    fn: (vals) => (vals[0] & vals[1]),
  },
  OR:   {
    label: 'OR',
    symbol: '≥1',
    inputs: 2,
    color: '#56b4e9',
    fn: (vals) => (vals[0] | vals[1]),
  },
  NOT:  {
    label: 'NOT',
    symbol: '!',
    inputs: 1,
    color: '#e69f00',
    fn: (vals) => (vals[0] ^ 1),
  },
  NAND: {
    label: 'NAND',
    symbol: '!&',
    inputs: 2,
    color: '#d55e00',
    fn: (vals) => ((vals[0] & vals[1]) ^ 1),
  },
  NOR:  {
    label: 'NOR',
    symbol: '!≥',
    inputs: 2,
    color: '#cc79a7',
    fn: (vals) => ((vals[0] | vals[1]) ^ 1),
  },
};

// ── GATE INTRODUCTIONS ────────────────────────────────────
const GATE_INTRO = {
  AND: {
    icon: '⊓',
    title: { en: 'AND Gate',         es: 'Compuerta AND',     pt: 'Porta AND' },
    text: {
      en: 'The AND gate outputs <strong>1</strong> only when <strong>ALL</strong> inputs are 1. If any input is 0, the output is 0.',
      es: 'La compuerta AND produce <strong>1</strong> solo cuando <strong>TODOS</strong> los inputs son 1. Si alguno es 0, el output es 0.',
      pt: 'A porta AND produz <strong>1</strong> somente quando <strong>TODAS</strong> as entradas são 1. Se alguma for 0, a saída é 0.',
    },
    table: { headers: ['A','B','OUT'], rows: [[0,0,0],[0,1,0],[1,0,0],[1,1,1]] },
  },
  OR: {
    icon: '⊔',
    title: { en: 'OR Gate',          es: 'Compuerta OR',      pt: 'Porta OR' },
    text: {
      en: 'The OR gate outputs <strong>1</strong> when <strong>ANY</strong> input is 1. It only outputs 0 when all inputs are 0.',
      es: 'La compuerta OR produce <strong>1</strong> cuando <strong>ALGÚN</strong> input es 1. Solo produce 0 si todos los inputs son 0.',
      pt: 'A porta OR produz <strong>1</strong> quando <strong>QUALQUER</strong> entrada é 1. Produz 0 apenas quando todas as entradas são 0.',
    },
    table: { headers: ['A','B','OUT'], rows: [[0,0,0],[0,1,1],[1,0,1],[1,1,1]] },
  },
  NOT: {
    icon: '¬',
    title: { en: 'NOT Gate',         es: 'Compuerta NOT',     pt: 'Porta NOT' },
    text: {
      en: 'The NOT gate <strong>inverts</strong> its single input. 0 becomes 1, and 1 becomes 0.',
      es: 'La compuerta NOT <strong>invierte</strong> su único input. 0 se convierte en 1, y 1 en 0.',
      pt: 'A porta NOT <strong>inverte</strong> sua única entrada. 0 vira 1, e 1 vira 0.',
    },
    table: { headers: ['A','OUT'], rows: [[0,1],[1,0]] },
  },
  NAND: {
    icon: '⊼',
    title: { en: 'NAND Gate',        es: 'Compuerta NAND',    pt: 'Porta NAND' },
    text: {
      en: 'NAND is AND followed by NOT. It outputs <strong>0</strong> only when <strong>ALL</strong> inputs are 1 — the opposite of AND.',
      es: 'NAND es AND seguido de NOT. Produce <strong>0</strong> solo cuando <strong>TODOS</strong> los inputs son 1 — lo opuesto al AND.',
      pt: 'NAND é AND seguido de NOT. Produz <strong>0</strong> somente quando <strong>TODAS</strong> as entradas são 1 — o oposto do AND.',
    },
    table: { headers: ['A','B','OUT'], rows: [[0,0,1],[0,1,1],[1,0,1],[1,1,0]] },
  },
  NOR: {
    icon: '⊽',
    title: { en: 'NOR Gate',         es: 'Compuerta NOR',     pt: 'Porta NOR' },
    text: {
      en: 'NOR is OR followed by NOT. It outputs <strong>1</strong> only when <strong>ALL</strong> inputs are 0 — the opposite of OR.',
      es: 'NOR es OR seguido de NOT. Produce <strong>1</strong> solo cuando <strong>TODOS</strong> los inputs son 0 — lo opuesto al OR.',
      pt: 'NOR é OR seguido de NOT. Produz <strong>1</strong> somente quando <strong>TODAS</strong> as entradas são 0 — o oposto do OR.',
    },
    table: { headers: ['A','B','OUT'], rows: [[0,0,1],[0,1,0],[1,0,0],[1,1,0]] },
  },
};

// ── GATE INFO (palette hover) ─────────────────────────────
const GATE_HOVER_TEXT = {
  AND:  { en: 'AND — outputs 1 only if all inputs are 1.',       es: 'AND — da 1 solo si todos los inputs son 1.',         pt: 'AND — saída 1 somente se todas as entradas forem 1.' },
  OR:   { en: 'OR — outputs 1 if any input is 1.',               es: 'OR — da 1 si algún input es 1.',                    pt: 'OR — saída 1 se qualquer entrada for 1.' },
  NOT:  { en: 'NOT — inverts the input. 0→1, 1→0.',              es: 'NOT — invierte el input. 0→1, 1→0.',               pt: 'NOT — inverte a entrada. 0→1, 1→0.' },
  NAND: { en: 'NAND — like AND but inverted. 0 when both are 1.', es: 'NAND — como AND pero invertido. 0 cuando ambos son 1.', pt: 'NAND — como AND mas invertido. 0 quando ambos são 1.' },
  NOR:  { en: 'NOR — like OR but inverted. 1 only when both are 0.', es: 'NOR — como OR pero invertido. 1 solo cuando ambos son 0.', pt: 'NOR — como OR mas invertido. 1 somente quando ambos são 0.' },
};

// ── TRANSLATIONS ──────────────────────────────────────────
const T = {
  en: {
    gameTitle:       'Capy Logic Labs',
    startSubtitle:   'Capy must repair the circuits of the megacomputer!<br />Learn logic gates by fixing each broken board.',
    startButton:     '▶ TAP TO START',
    selectLevelTitle:'SELECT LEVEL',
    selectSubtitle:  'Choose a broken circuit to repair.',
    goalLabel:       'Goal:',
    goalText:        ' Fix the broken circuit by dropping the correct logic gate into each empty slot.',
    howToPlayLabel:  'How to play:',
    howToPlayText:   ' Drag gates from the palette on the right into the circuit slots. Press CHECK to verify your solution.',
    backToStart:     '⟵ Start',
    backToLevels:    '⟵ Levels',
    zoneInput:       'INPUT',
    zoneCircuit:     'CIRCUIT',
    zoneOutput:      'OUTPUT',
    paletteTitle:    'GATES',
    gateInfoHint:    'Hover a gate to learn more.',
    checkButton:     '✔ CHECK',
    resetButton:     '↺ RESET',
    nextLevel:       'Next Level ⟶',
    readyMessage:    'Ready! Drag gates into the empty slots, then press CHECK.',
    msgWin:          '🎉 Circuit fixed! All outputs are correct!',
    msgIncomplete:   'Some slots are still empty. Fill all slots first!',
    msgWrong:        '⚡ Not quite! One or more outputs are wrong. Try again.',
    msgReset:        'Circuit reset. Try again!',
    clickToRemove:   'Click a filled gate to remove it.',
    play:            'PLAY',
    playAgain:       'PLAY AGAIN',
    locked:          'LOCKED 🔒',
    lockedMsg:       'Complete the previous level first.',
    completed:       '✓ Done',
    modalClose:      'Got it! ▶',
    howtoTitle:      'How to Play',
    howtoClose:      "Let's Go! ▶",
    finalWinTitle:   '🎉 ALL CIRCUITS REPAIRED!',
    finalWinMsg:     'Capy fixed every board in the lab. The megacomputer hums back to life.',
    finalWinLevels:  '⟵ Back to Levels',
    finalWinClose:   'Close',
  },
  es: {
    gameTitle:       'Capy Logic Labs',
    startSubtitle:   '¡Capy debe reparar los circuitos de la megacomputadora!<br />Aprende compuertas lógicas arreglando cada placa rota.',
    startButton:     '▶ TOCAR PARA INICIAR',
    selectLevelTitle:'SELECCIONAR NIVEL',
    selectSubtitle:  'Elige un circuito roto para reparar.',
    goalLabel:       'Objetivo:',
    goalText:        ' Arregla el circuito roto colocando la compuerta lógica correcta en cada ranura vacía.',
    howToPlayLabel:  'Cómo jugar:',
    howToPlayText:   ' Arrastra compuertas desde la paleta hacia las ranuras del circuito. Presiona VERIFICAR para comprobar tu solución.',
    backToStart:     '⟵ Inicio',
    backToLevels:    '⟵ Niveles',
    zoneInput:       'ENTRADA',
    zoneCircuit:     'CIRCUITO',
    zoneOutput:      'SALIDA',
    paletteTitle:    'COMPUERTAS',
    gateInfoHint:    'Pasa el cursor por una compuerta para saber más.',
    checkButton:     '✔ VERIFICAR',
    resetButton:     '↺ REINICIAR',
    nextLevel:       'Siguiente nivel ⟶',
    readyMessage:    '¡Listo! Arrastra compuertas a las ranuras vacías y luego presiona VERIFICAR.',
    msgWin:          '🎉 ¡Circuito reparado! Todas las salidas son correctas.',
    msgIncomplete:   'Algunas ranuras están vacías. ¡Rellena todas primero!',
    msgWrong:        '⚡ ¡No del todo! Una o más salidas son incorrectas. Intenta de nuevo.',
    msgReset:        '¡Circuito reiniciado. Intenta de nuevo!',
    clickToRemove:   'Haz clic en una compuerta instalada para quitarla.',
    play:            'JUGAR',
    playAgain:       'JUGAR OTRA VEZ',
    locked:          'BLOQUEADO 🔒',
    lockedMsg:       'Completa el nivel anterior primero.',
    completed:       '✓ Hecho',
    modalClose:      '¡Entendido! ▶',
    howtoTitle:      'Cómo Jugar',
    howtoClose:      '¡Vamos! ▶',
    finalWinTitle:   '🎉 ¡TODOS LOS CIRCUITOS REPARADOS!',
    finalWinMsg:     'Capy reparó cada placa del laboratorio. La megacomputadora vuelve a la vida.',
    finalWinLevels:  '⟵ Volver a Niveles',
    finalWinClose:   'Cerrar',
  },
  pt: {
    gameTitle:       'Capy Logic Labs',
    startSubtitle:   'Capy precisa reparar os circuitos do megacomputador!<br />Aprenda portas lógicas consertando cada placa quebrada.',
    startButton:     '▶ TOQUE PARA COMEÇAR',
    selectLevelTitle:'SELECIONAR NÍVEL',
    selectSubtitle:  'Escolha um circuito quebrado para reparar.',
    goalLabel:       'Objetivo:',
    goalText:        ' Conserte o circuito quebrado colocando a porta lógica correta em cada slot vazio.',
    howToPlayLabel:  'Como jogar:',
    howToPlayText:   ' Arraste portas da paleta para os slots do circuito. Pressione VERIFICAR para checar sua solução.',
    backToStart:     '⟵ Início',
    backToLevels:    '⟵ Níveis',
    zoneInput:       'ENTRADA',
    zoneCircuit:     'CIRCUITO',
    zoneOutput:      'SAÍDA',
    paletteTitle:    'PORTAS',
    gateInfoHint:    'Passe o cursor sobre uma porta para saber mais.',
    checkButton:     '✔ VERIFICAR',
    resetButton:     '↺ RESETAR',
    nextLevel:       'Próximo nível ⟶',
    readyMessage:    'Pronto! Arraste portas para os slots vazios e pressione VERIFICAR.',
    msgWin:          '🎉 Circuito consertado! Todas as saídas estão corretas!',
    msgIncomplete:   'Alguns slots ainda estão vazios. Preencha todos primeiro!',
    msgWrong:        '⚡ Quase! Uma ou mais saídas estão erradas. Tente novamente.',
    msgReset:        'Circuito resetado. Tente novamente!',
    clickToRemove:   'Clique em uma porta instalada para removê-la.',
    play:            'JOGAR',
    playAgain:       'JOGAR NOVAMENTE',
    locked:          'BLOQUEADO 🔒',
    lockedMsg:       'Complete o nível anterior primeiro.',
    completed:       '✓ Feito',
    modalClose:      'Entendido! ▶',
    howtoTitle:      'Como Jogar',
    howtoClose:      'Vamos! ▶',
    finalWinTitle:   '🎉 TODOS OS CIRCUITOS CONSERTADOS!',
    finalWinMsg:     'Capy consertou todas as placas do laboratório. O megacomputador volta à vida.',
    finalWinLevels:  '⟵ Voltar aos Níveis',
    finalWinClose:   'Fechar',
  },
};

function t(key) { return (T[currentLang] || T.en)[key] || key; }

// Localized level field accessor: returns level[field_<lang>] or falls back to level[field]
function lvl(level, field) {
  if (!level) return '';
  const localized = level[field + '_' + currentLang];
  return localized || level[field] || '';
}

// ── PROGRESS (localStorage) ───────────────────────────────
function getProgress() {
  try { return JSON.parse(localStorage.getItem('cllab_progress') || '{}'); }
  catch { return {}; }
}

function setLevelCompleted(id) {
  const p = getProgress();
  p[id] = true;
  try { localStorage.setItem('cllab_progress', JSON.stringify(p)); }
  catch {}
}

function isCompleted(id) { return !!getProgress()[id]; }
function isLocked(id)    { return id > 1 && !isCompleted(id - 1); }

// ── CIRCUIT EVALUATION ────────────────────────────────────
/**
 * Evaluate all nodes in the circuit given current slot assignments.
 * Returns a map: nodeId → computed_value (or null if slot not filled)
 */
function evaluateCircuit(level, assignments) {
  const values = {};

  // Input node values are known
  level.inputs.forEach(n => { values[n.id] = n.value; });

  // Topological evaluation of slots
  const resolved = new Set(level.inputs.map(n => n.id));
  let remaining  = [...level.slots];
  let maxPasses  = remaining.length + 1;

  while (remaining.length > 0 && maxPasses-- > 0) {
    remaining = remaining.filter(slot => {
      if (!slot.from.every(id => resolved.has(id))) return true; // not ready yet
      const gate = assignments[slot.id];
      if (!gate) {
        values[slot.id] = null; // slot not filled
        resolved.add(slot.id);
        return false;
      }
      const def = GATE_DEF[gate];
      if (!def) { values[slot.id] = null; resolved.add(slot.id); return false; }
      const inputVals = slot.from.map(id => values[id]);
      values[slot.id] = (inputVals.some(v => v === null)) ? null : def.fn(inputVals);
      resolved.add(slot.id);
      return false;
    });
  }

  // Output values
  level.outputs.forEach(o => {
    values[o.id] = values[o.from];
  });

  return values;
}

// ── NODE POSITION CALCULATION ─────────────────────────────
/**
 * Compute pixel positions for all nodes based on circuit topology.
 * Returns: { nodeId: { x, y } }
 */
function computePositions(level, canvasW, canvasH) {
  const PADDING_X = Math.round(canvasW / 6);
  const PADDING_Y = 50;

  // Assign depth to each node
  const depth = {};
  level.inputs.forEach(n => { depth[n.id] = 0; });

  const resolved = new Set(level.inputs.map(n => n.id));
  let remaining  = [...level.slots];
  let maxSlotDepth = 0;
  let safety = remaining.length + 2;

  while (remaining.length > 0 && safety-- > 0) {
    remaining = remaining.filter(slot => {
      if (!slot.from.every(id => resolved.has(id))) return true;
      const d = Math.max(...slot.from.map(id => depth[id])) + 1;
      depth[slot.id] = d;
      maxSlotDepth   = Math.max(maxSlotDepth, d);
      resolved.add(slot.id);
      return false;
    });
  }

  level.outputs.forEach(o => { depth[o.id] = maxSlotDepth + 1; });

  // Group nodes by depth
  const byDepth = {};
  const allNodes = [
    ...level.inputs,
    ...level.slots,
    ...level.outputs,
  ];
  allNodes.forEach(n => {
    const d = depth[n.id];
    if (!byDepth[d]) byDepth[d] = [];
    byDepth[d].push(n.id);
  });

  const totalCols = maxSlotDepth + 2; // input col + N gate cols + output col
  const usableW   = canvasW - PADDING_X * 2;
  const usableH   = canvasH - PADDING_Y * 2;
  const positions = {};

  Object.entries(byDepth).forEach(([d, ids]) => {
    const col = parseInt(d);
    const x   = PADDING_X + (col / (totalCols - 1)) * usableW;
    ids.forEach((id, i) => {
      const y = PADDING_Y + ((i + 0.5) / ids.length) * usableH;
      positions[id] = { x: Math.round(x), y: Math.round(y) };
    });
  });

  return positions;
}

// ── CANVAS DIMENSIONS ─────────────────────────────────────
function getCanvasDimensions(level) {
  const maxNodesInCol = Math.max(level.inputs.length, level.outputs.length, level.slots.length);
  const h = Math.max(260, maxNodesInCol * 110 + 70);
  return { h };
}

// ── CIRCUIT RENDERING ─────────────────────────────────────
function renderCircuit() {
  if (!currentLevel) return;

  const canvas = document.getElementById('circuit-canvas');
  const svg    = document.getElementById('wire-svg');

  const { h } = getCanvasDimensions(currentLevel);
  canvas.style.height = h + 'px';
  const w = canvas.clientWidth || 700;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);

  // Compute positions
  const pos = computePositions(currentLevel, w, h);

  // Remove old nodes (keep SVG)
  canvas.querySelectorAll('.node-input, .gate-slot, .node-output').forEach(el => el.remove());

  // ── Draw Input Nodes ──
  currentLevel.inputs.forEach(inp => {
    const p = pos[inp.id];
    const wrap = document.createElement('div');
    wrap.className = 'node-input';
    wrap.style.left = p.x + 'px';
    wrap.style.top  = p.y + 'px';

    const circle = document.createElement('div');
    circle.className = 'node-input-circle';
    circle.textContent = inp.value;
    circle.id = 'node-circle-' + inp.id;

    const label = document.createElement('div');
    label.className = 'node-input-label';
    label.textContent = inp.label;

    wrap.appendChild(circle);
    wrap.appendChild(label);
    canvas.appendChild(wrap);
  });

  // ── Draw Gate Slots ──
  currentLevel.slots.forEach(slot => {
    const p       = pos[slot.id];
    const filled  = slotAssignments[slot.id];
    const slotEl  = document.createElement('div');
    slotEl.className = 'gate-slot' + (filled ? ' filled gate-' + filled : '');
    slotEl.id        = 'slot-' + slot.id;
    slotEl.style.left = p.x + 'px';
    slotEl.style.top  = p.y + 'px';
    slotEl.setAttribute('data-slot-id', slot.id);
    slotEl.setAttribute('role', 'button');
    slotEl.setAttribute('aria-label', filled ? filled + ' gate' : 'Empty gate slot');
    slotEl.setAttribute('tabindex', '0');

    if (filled) {
      const gateColor = document.createElement('div');
      gateColor.style.cssText = `width:8px;height:8px;background:${GATE_DEF[filled]?.color || '#888'};margin-bottom:3px;`;
      const name = document.createElement('div');
      name.className = 'gate-slot-name';
      name.textContent = filled;
      slotEl.appendChild(gateColor);
      slotEl.appendChild(name);
    } else {
      const q = document.createElement('div');
      q.className = 'gate-slot-question';
      q.textContent = '?';
      const hint = document.createElement('div');
      hint.className = 'gate-slot-hint';
      hint.textContent = 'drop here';
      slotEl.appendChild(q);
      slotEl.appendChild(hint);
    }

    // Drag-and-drop events
    slotEl.addEventListener('dragover',  onSlotDragOver);
    slotEl.addEventListener('dragleave', onSlotDragLeave);
    slotEl.addEventListener('drop',      onSlotDrop);

    // Click to remove
    if (filled) {
      slotEl.addEventListener('click',   () => removeGateFromSlot(slot.id));
      slotEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') removeGateFromSlot(slot.id); });
    }

    canvas.appendChild(slotEl);
  });

  // ── Draw Output Nodes ──
  currentLevel.outputs.forEach(out => {
    const p    = pos[out.id];
    const wrap = document.createElement('div');
    wrap.className = 'node-output';
    wrap.style.left = p.x + 'px';
    wrap.style.top  = p.y + 'px';

    const circle = document.createElement('div');
    circle.className = 'node-output-circle';
    circle.textContent = out.expected;
    circle.id = 'output-circle-' + out.id;

    const label = document.createElement('div');
    label.className = 'node-output-label';
    label.textContent = out.label;

    wrap.appendChild(circle);
    wrap.appendChild(label);
    canvas.appendChild(wrap);
  });

  // ── Draw Wires ──
  drawWires(pos, svg, w, h);
}

function drawWires(pos, svg, w, h) {
  svg.innerHTML = '';

  const allEdges = [];

  // Edges: inputs → slots
  currentLevel.slots.forEach(slot => {
    slot.from.forEach(fromId => {
      allEdges.push({ from: fromId, to: slot.id });
    });
  });

  // Edges: slots → outputs
  currentLevel.outputs.forEach(out => {
    allEdges.push({ from: out.from, to: out.id });
  });

  allEdges.forEach(edge => {
    const from = pos[edge.from];
    const to   = pos[edge.to];
    if (!from || !to) return;

    // Start x: right edge of "from" node, end x: left edge of "to" node
    const NODE_RADIUS = 22;
    const SLOT_HALF_W = 40;

    const isFromInput = currentLevel.inputs.some(n => n.id === edge.from);
    const isToOutput  = currentLevel.outputs.some(n => n.id === edge.to);
    const isFromSlot  = currentLevel.slots.some(n => n.id === edge.from);

    const x1 = isFromInput ? from.x + NODE_RADIUS : from.x + SLOT_HALF_W;
    const y1 = from.y;
    const x2 = isToOutput  ? to.x - NODE_RADIUS   : to.x - SLOT_HALF_W;
    const y2 = to.y;

    // Bezier curve for smooth wire
    const cp1x = x1 + (x2 - x1) * 0.5;
    const cp1y = y1;
    const cp2x = x1 + (x2 - x1) * 0.5;
    const cp2y = y2;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`);
    path.setAttribute('class', 'wire-path');
    path.setAttribute('data-from', edge.from);
    path.setAttribute('data-to', edge.to);
    svg.appendChild(path);
  });
}

// ── DRAG AND DROP ─────────────────────────────────────────
function onPaletteDragStart(e, gateType) {
  draggedGate = gateType;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', gateType);
}

function onPaletteDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedGate = null;
}

function onSlotDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  e.currentTarget.classList.add('drag-over');
}

function onSlotDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onSlotDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');

  const gate   = e.dataTransfer.getData('text/plain') || draggedGate;
  const slotId = e.currentTarget.getAttribute('data-slot-id');
  if (!gate || !slotId) return;

  placeGateInSlot(slotId, gate);
}

function placeGateInSlot(slotId, gateType) {
  // Validate gate is in current level's available list
  if (!currentLevel.available_gates.includes(gateType)) return;

  // Validate gate input count matches slot's from count
  const slot = currentLevel.slots.find(s => s.id === slotId);
  if (!slot) return;

  const gateDef = GATE_DEF[gateType];
  if (!gateDef) return;

  // NOT takes 1 input; all others take 2
  if (gateDef.inputs === 1 && slot.from.length !== 1) {
    setMessage(`${gateType} gate needs exactly 1 input — this slot has ${slot.from.length}.`, 'error');
    return;
  }
  if (gateDef.inputs === 2 && slot.from.length !== 2) {
    setMessage(`${gateType} gate needs 2 inputs — this slot has ${slot.from.length}.`, 'error');
    return;
  }

  slotAssignments[slotId] = gateType;
  if (window.capySfx) window.capySfx.play('gate-placed');
  setMessage(t('readyMessage'));
  renderCircuit();
}

function removeGateFromSlot(slotId) {
  delete slotAssignments[slotId];
  setMessage(t('clickToRemove'));

  // Remove result classes from outputs
  document.querySelectorAll('.node-output-circle').forEach(el => {
    el.classList.remove('correct', 'wrong');
  });

  renderCircuit();
}

// ── CHECK SOLUTION ────────────────────────────────────────
function checkSolution() {
  if (!currentLevel) return;

  // Ensure all slots filled
  const allFilled = currentLevel.slots.every(s => slotAssignments[s.id]);
  if (!allFilled) {
    setMessage(t('msgIncomplete'), 'error');
    return;
  }

  const values  = evaluateCircuit(currentLevel, slotAssignments);
  let allCorrect = true;

  // Update output node circles
  currentLevel.outputs.forEach(out => {
    const computed = values[out.id];
    const circle   = document.getElementById('output-circle-' + out.id);
    if (!circle) return;

    if (computed === null) {
      circle.classList.remove('correct', 'wrong');
    } else if (computed === out.expected) {
      circle.classList.add('correct');
      circle.classList.remove('wrong');
    } else {
      circle.classList.add('wrong');
      circle.classList.remove('correct');
      allCorrect = false;
    }
  });

  // Update wire colors
  updateWireColors(values);

  if (allCorrect) {
    onLevelWin();
  } else {
    if (window.capySfx) window.capySfx.play('error');
    setMessage(t('msgWrong'), 'error');
  }
}

function updateWireColors(values) {
  const svg = document.getElementById('wire-svg');
  svg.querySelectorAll('.wire-path').forEach(path => {
    const fromId = path.getAttribute('data-from');
    const val    = values[fromId];
    path.classList.remove('active-1', 'active-0');
    if (val === 1) path.classList.add('active-1');
    else if (val === 0) path.classList.add('active-0');
  });
}

function onLevelWin() {
  if (window.capySfx) window.capySfx.play('win');
  setMessage(t('msgWin'), 'win');
  setLevelCompleted(currentLevel.id);

  // Flash animation
  const canvas = document.getElementById('circuit-canvas');
  canvas.classList.add('win-flash');
  setTimeout(() => canvas.classList.remove('win-flash'), 1400);

  // Show next level button
  const nextBtn = document.getElementById('btn-next-level');
  if (nextBtn) {
    const hasNext = levels.some(l => l.id === currentLevel.id + 1);
    if (hasNext) {
      nextBtn.classList.remove('hidden');
    } else if (levels.every(l => isCompleted(l.id))) {
      setTimeout(showFinalWin, 900);
    }
  }
}

function showFinalWin() {
  const overlay = document.getElementById('final-win-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  const close = () => overlay.classList.add('hidden');
  document.getElementById('final-win-close')?.addEventListener('click', close, { once: true });
  document.getElementById('final-win-levels')?.addEventListener('click', () => {
    close();
    renderLevelList();
    showScreen('screen-levels');
  }, { once: true });
}

function resetCircuit() {
  slotAssignments = {};

  document.querySelectorAll('.node-output-circle').forEach(el => {
    el.classList.remove('correct', 'wrong');
  });

  const svg = document.getElementById('wire-svg');
  if (svg) {
    svg.querySelectorAll('.wire-path').forEach(p => {
      p.classList.remove('active-1', 'active-0');
    });
  }

  document.getElementById('btn-next-level')?.classList.add('hidden');
  setMessage(t('msgReset'));
  renderCircuit();
}

// ── MESSAGE ───────────────────────────────────────────────
function setMessage(text, type) {
  const el = document.getElementById('message');
  if (!el) return;
  el.textContent = text;
  el.className = 'message' + (type === 'win' ? ' msg-win' : type === 'error' ? ' msg-error' : '');
}

// ── GATE PALETTE ──────────────────────────────────────────
function renderGatePalette(availableGates) {
  const palette = document.getElementById('gate-palette');
  if (!palette) return;
  palette.innerHTML = '';

  availableGates.forEach(gateType => {
    const def = GATE_DEF[gateType];
    if (!def) return;

    const btn = document.createElement('div');
    btn.className = 'palette-gate';
    btn.draggable = true;
    btn.setAttribute('role', 'listitem');
    btn.setAttribute('aria-label', `${gateType} gate — drag to slot`);
    btn.setAttribute('tabindex', '0');

    const colorDot = document.createElement('div');
    colorDot.className = `palette-gate-color gate-color-${gateType}`;

    const label = document.createElement('span');
    label.textContent = gateType;

    btn.appendChild(colorDot);
    btn.appendChild(label);

    btn.addEventListener('dragstart', (e) => onPaletteDragStart(e, gateType));
    btn.addEventListener('dragend',   onPaletteDragEnd);

    btn.addEventListener('mouseenter', () => showGateInfo(gateType));
    btn.addEventListener('mouseleave', () => hideGateInfo());

    // Keyboard: Enter/Space to select, then click a slot
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectGateKeyboard(gateType, btn);
      }
    });

    palette.appendChild(btn);
  });
}

// Keyboard accessibility: select gate, then click slot
let keyboardSelectedGate = null;

function selectGateKeyboard(gateType, btn) {
  // Deselect previous
  document.querySelectorAll('.palette-gate.kb-selected').forEach(el => el.classList.remove('kb-selected'));

  if (keyboardSelectedGate === gateType) {
    keyboardSelectedGate = null;
    return;
  }

  keyboardSelectedGate = gateType;
  btn.classList.add('kb-selected');
  setMessage(`${gateType} selected. Press Enter/Space on an empty slot to place it.`);

  // Allow slots to receive keyboard gate
  document.querySelectorAll('.gate-slot:not(.filled)').forEach(slot => {
    slot.addEventListener('keydown', placeByKeyboard, { once: true });
  });
}

function placeByKeyboard(e) {
  if ((e.key !== 'Enter' && e.key !== ' ') || !keyboardSelectedGate) return;
  e.preventDefault();
  const slotId = e.currentTarget.getAttribute('data-slot-id');
  placeGateInSlot(slotId, keyboardSelectedGate);
  keyboardSelectedGate = null;
  document.querySelectorAll('.palette-gate.kb-selected').forEach(el => el.classList.remove('kb-selected'));
}

function showGateInfo(gateType) {
  const panel = document.getElementById('gate-info');
  if (!panel) return;
  const text = GATE_HOVER_TEXT[gateType];
  if (!text) return;

  panel.innerHTML = `
    <div class="gate-info-title">${gateType} GATE</div>
    <div class="gate-info-text">${(text[currentLang] || text.en)}</div>
  `;
}

function hideGateInfo() {
  const panel = document.getElementById('gate-info');
  if (!panel) return;
  panel.innerHTML = `<p class="gate-info-hint">${t('gateInfoHint')}</p>`;
}

// ── GATE INTRO MODAL ──────────────────────────────────────
function showGateIntroModal(gateType, onClose) {
  const intro = GATE_INTRO[gateType];
  if (!intro) { onClose(); return; }

  const overlay = document.getElementById('modal-overlay');
  const title   = document.getElementById('modal-title');
  const icon    = document.getElementById('modal-gate-icon');
  const expEl   = document.getElementById('modal-explanation');
  const tableEl = document.getElementById('modal-truth-table');
  const closeBtn= document.getElementById('modal-close');

  title.textContent   = intro.title[currentLang] || intro.title.en;
  icon.textContent    = intro.icon;
  expEl.innerHTML     = intro.text[currentLang]  || intro.text.en;
  closeBtn.textContent = t('modalClose');

  // Build truth table
  const { headers, rows } = intro.table;
  const outIdx = headers.indexOf('OUT');
  let tableHTML = '<table><thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
  rows.forEach(row => {
    tableHTML += '<tr>' + row.map((cell, i) => {
      const cls = (i === outIdx) ? (cell === 1 ? 'out-1' : 'out-0') : '';
      return `<td class="${cls}">${cell}</td>`;
    }).join('') + '</tr>';
  });
  tableHTML += '</tbody></table>';
  tableEl.innerHTML = tableHTML;

  overlay.classList.remove('hidden');

  const close = () => {
    overlay.classList.add('hidden');
    closeBtn.removeEventListener('click', close);
    onClose();
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

// ── HOW-TO-PLAY MODAL ─────────────────────────────────────
function showHowToModal(onClose) {
  const overlay = document.getElementById('howto-overlay');
  const closeBtn = document.getElementById('howto-close');
  if (!overlay || !closeBtn) { onClose(); return; }

  applyTranslations();
  overlay.classList.remove('hidden');

  const close = () => {
    overlay.classList.add('hidden');
    closeBtn.removeEventListener('click', close);
    overlay.removeEventListener('click', onOverlayClick);
    onClose();
  };
  const onOverlayClick = (e) => { if (e.target === overlay) close(); };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', onOverlayClick);
}

// ── LOAD LEVEL ────────────────────────────────────────────
function loadLevel(levelId) {
  const level = levels.find(l => l.id === levelId);
  if (!level) return;

  currentLevel    = level;
  slotAssignments = {};

  // Update UI labels
  const levelWord = currentLang === 'es' ? 'Nivel' : currentLang === 'pt' ? 'Nível' : 'Level';
  document.getElementById('current-level-label').textContent =
    `${levelWord} ${level.id} — ${lvl(level, 'title')}`;

  document.getElementById('btn-next-level')?.classList.add('hidden');

  setMessage(t('readyMessage'));

  // Reset output colors
  document.querySelectorAll('.node-output-circle').forEach(el => {
    el.classList.remove('correct', 'wrong');
  });

  // Show game screen
  showScreen('screen-game');

  // Render palette
  renderGatePalette(level.available_gates);

  // Render circuit
  renderCircuit();

  // Show intro modal if gate is new
  if (level.intro_gate) {
    showGateIntroModal(level.intro_gate, () => {});
  }
}

// ── LEVEL SELECT SCREEN ───────────────────────────────────
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

    const desc = document.createElement('div');
    desc.className = 'level-description';
    desc.textContent = lvl(level, 'description');

    // Gate tags
    const gateTags = document.createElement('div');
    gateTags.className = 'level-gates';
    level.available_gates.forEach(g => {
      const tag = document.createElement('span');
      tag.className = 'level-gate-tag';
      tag.textContent = g;
      gateTags.appendChild(tag);
    });

    if (done) {
      const badge = document.createElement('span');
      badge.className = 'level-badge';
      badge.textContent = t('completed');
      info.appendChild(badge);
    }

    info.appendChild(title);
    info.appendChild(sector);
    info.appendChild(desc);
    info.appendChild(gateTags);

    const playBtn = document.createElement('button');
    playBtn.className = locked ? '' : 'primary';
    playBtn.textContent = locked ? t('locked') : (done ? t('playAgain') : t('play'));
    playBtn.disabled = locked;
    playBtn.setAttribute('aria-label', `Play level ${level.id}: ${level.title}`);
    if (locked) playBtn.setAttribute('aria-disabled', 'true');

    if (!locked) {
      playBtn.addEventListener('click', () => loadLevel(level.id));
    } else {
      playBtn.addEventListener('click', () => {
        setMessage(t('lockedMsg'), 'error');
      });
    }

    card.appendChild(info);
    card.appendChild(playBtn);
    container.appendChild(card);
  });
}

// ── SCREEN MANAGEMENT ─────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

// ── LANGUAGE ──────────────────────────────────────────────
function changeLanguage(lang) {
  if (!T[lang]) return;
  currentLang = lang;
  if (window.CapyLang) window.CapyLang.set(lang);

  // Update ARIA pressed state on lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // Re-apply all data-key text
  applyTranslations();

  // Re-render current screen content
  const levelScreen = document.getElementById('screen-levels');
  if (levelScreen?.classList.contains('active')) renderLevelList();

  if (currentLevel) {
    const levelWord = currentLang === 'es' ? 'Nivel' : currentLang === 'pt' ? 'Nível' : 'Level';
    const labelEl = document.getElementById('current-level-label');
    if (labelEl) labelEl.textContent = `${levelWord} ${currentLevel.id} — ${lvl(currentLevel, 'title')}`;
    setMessage(t('readyMessage'));
    renderGatePalette(currentLevel.available_gates);
    hideGateInfo();
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    const val = t(key);
    if (val !== key) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.innerHTML = val;
      }
    }
  });
}

// ── FULLSCREEN ────────────────────────────────────────────
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// ── INIT ──────────────────────────────────────────────────
async function init() {
  // Load levels
  try {
    const res = await fetch('levels.json');
    levels    = await res.json();
  } catch (err) {
    console.error('Failed to load levels.json:', err);
    return;
  }

  // Translate initial state (also marks active lang button)
  changeLanguage(currentLang);

  // ── Button wiring ──
  document.getElementById('btn-go-levels')?.addEventListener('click', () => {
    showHowToModal(() => {
      renderLevelList();
      showScreen('screen-levels');
    });
  });

  document.getElementById('howto-close')?.addEventListener('click', () => {
    document.getElementById('howto-overlay')?.classList.add('hidden');
  });

  document.getElementById('btn-back-start')?.addEventListener('click', () => {
    showScreen('screen-start');
  });

  document.getElementById('btn-back-levels')?.addEventListener('click', () => {
    currentLevel = null;
    renderLevelList();
    showScreen('screen-levels');
  });

  document.getElementById('btn-check')?.addEventListener('click', checkSolution);

  document.getElementById('btn-reset')?.addEventListener('click', resetCircuit);

  document.getElementById('btn-next-level')?.addEventListener('click', () => {
    if (!currentLevel) return;
    const nextId = currentLevel.id + 1;
    const next   = levels.find(l => l.id === nextId);
    if (next) loadLevel(next.id);
  });

  // Redraw wires on resize (positions use getBoundingClientRect)
  window.addEventListener('resize', () => {
    if (currentLevel) renderCircuit();
  });
}

document.addEventListener('DOMContentLoaded', init);
