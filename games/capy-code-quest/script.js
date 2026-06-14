// =============================================
// CAPY CODE QUEST — IMPROVED SCRIPT
// Fixes: Capy sprite, House, Execution highlighting,
//        Fullscreen, Switch visual state
// =============================================

let currentLanguage = (window.CapyLang && window.CapyLang.get()) || "en";

// ==== TRANSLATIONS ====

const translations = {
  en: {
    title:           "Capy Code Quest",
    gameTitle:       "Capy Code Quest",
    readyMessage:    "Ready! Build your program and press RUN.",
    runButton:       "▶ RUN",
    clearButton:     "✕ CLEAR",
    nextLevel:       "Next Level ⟶",
    backToLevels:    "⟵ Levels",
    startButton:     "Start Game",
    programEmpty:    "Program is empty. Add commands first!",
    running:         "Running...",
    hitObstacle:     "Oh no! Hit a rock or gate. Try again!",
    win:             "🎉 You collected all apples and reached home!",
    programFinished: "Program finished. Did you reach the goal?",
    programCleared:  "Program cleared. Build a new one!",
    moveForward:     "moveForward",
    turnLeft:        "turnLeft",
    turnRight:       "turnRight",
    repeat2:         "repeatFwd 2x",
    repeat3:         "repeatFwd 3x",
    clickDelete:     "Click to delete",
    programHint:     "💡 Click a line to delete it.",
    completed:       "✓ Done",
    play:            "PLAY",
    playAgain:       "PLAY AGAIN",
    locked:          "LOCKED 🔒",
    lockedMessage:   "Complete the previous level first.",
    backToStart:     "⟵ Start",
    backToLevelsBtn: "⟵ Levels",
    gameGrid:        "GAME GRID",
    programTitle:    "PROGRAM",
    goalLabel:       "Goal:",
    goalText:        " Collect all apples and reach the house.",
    howToPlayLabel:  "How to play:",
    howToPlayText:   " Add commands below, then press RUN to execute your program.",
    selectLevelTitle:"SELECT LEVEL",
    commandsTitle:   "Commands",
    startSubtitle:   "Help the capybara find all the apples<br />using simple coding commands!",
    finalWinTitle:   "🚀 ALL QUESTS COMPLETE!",
    finalWinMsg:     "Capy navigated every grid, grabbed every apple, and reached every home. You've mastered the basics of programming logic.",
    finalWinLevels:  "⟵ Back to Levels",
    finalWinClose:   "Close",
  },
  es: {
    title:           "Capy Code Quest",
    gameTitle:       "Capy Code Quest",
    readyMessage:    "¡Listo! Crea tu programa y pulsa EJECUTAR.",
    runButton:       "▶ EJECUTAR",
    clearButton:     "✕ BORRAR",
    nextLevel:       "Siguiente nivel ⟶",
    backToLevels:    "⟵ Niveles",
    startButton:     "Comenzar juego",
    programEmpty:    "¡El programa está vacío! Agrega comandos primero.",
    running:         "Ejecutando...",
    hitObstacle:     "¡Oh no! Chocaste con una roca o puerta. ¡Intenta de nuevo!",
    win:             "🎉 ¡Recolectaste todas las manzanas y llegaste a casa!",
    programFinished: "Programa terminado. ¿Llegaste al objetivo?",
    programCleared:  "Programa borrado. ¡Crea uno nuevo!",
    moveForward:     "avanzar",
    turnLeft:        "girarIzquierda",
    turnRight:       "girarDerecha",
    repeat2:         "repetirAvanzar 2x",
    repeat3:         "repetirAvanzar 3x",
    clickDelete:     "Clic para borrar",
    programHint:     "💡 Haz clic en una línea para borrarla.",
    completed:       "✓ Hecho",
    play:            "JUGAR",
    playAgain:       "JUGAR OTRA VEZ",
    locked:          "BLOQUEADO 🔒",
    lockedMessage:   "Completa el nivel anterior primero.",
    backToStart:     "⟵ Inicio",
    backToLevelsBtn: "⟵ Niveles",
    gameGrid:        "CUADRÍCULA",
    programTitle:    "PROGRAMA",
    goalLabel:       "Objetivo:",
    goalText:        " Recoge todas las manzanas y llega a casa.",
    howToPlayLabel:  "Cómo jugar:",
    howToPlayText:   " Agrega comandos y pulsa EJECUTAR para correr tu programa.",
    selectLevelTitle:"SELECCIONAR NIVEL",
    commandsTitle:   "Comandos",
    startSubtitle:   "¡Ayuda al capibara a encontrar todas las manzanas<br />usando simples comandos de programación!",
    finalWinTitle:   "🚀 ¡TODAS LAS MISIONES COMPLETADAS!",
    finalWinMsg:     "Capy recorrió cada cuadrícula, recogió cada manzana y llegó a cada casa. ¡Dominaste los fundamentos de la lógica de programación!",
    finalWinLevels:  "⟵ Volver a Niveles",
    finalWinClose:   "Cerrar",
  },
  pt: {
    title:           "Capy Code Quest",
    gameTitle:       "Capy Code Quest",
    readyMessage:    "Pronto! Crie seu programa e pressione EXECUTAR.",
    runButton:       "▶ EXECUTAR",
    clearButton:     "✕ LIMPAR",
    nextLevel:       "Próximo nível ⟶",
    backToLevels:    "⟵ Níveis",
    startButton:     "Começar Jogo",
    programEmpty:    "O programa está vazio! Adicione comandos primeiro.",
    running:         "Executando...",
    hitObstacle:     "Ah não! Você bateu em uma pedra ou portão. Tente de novo!",
    win:             "🎉 Você coletou todas as maçãs e chegou em casa!",
    programFinished: "Programa finalizado. Você alcançou o objetivo?",
    programCleared:  "Programa limpo. Crie um novo!",
    moveForward:     "moverFrente",
    turnLeft:        "virarEsquerda",
    turnRight:       "virarDireita",
    repeat2:         "repetirFrente 2x",
    repeat3:         "repetirFrente 3x",
    clickDelete:     "Clique para remover",
    programHint:     "💡 Clique numa linha para removê-la.",
    completed:       "✓ Concluído",
    play:            "JOGAR",
    playAgain:       "JOGAR NOVAMENTE",
    locked:          "BLOQUEADO 🔒",
    lockedMessage:   "Complete o nível anterior primeiro.",
    backToStart:     "⟵ Início",
    backToLevelsBtn: "⟵ Níveis",
    gameGrid:        "GRADE",
    programTitle:    "PROGRAMA",
    goalLabel:       "Objetivo:",
    goalText:        " Colete todas as maçãs e chegue à casa.",
    howToPlayLabel:  "Como jogar:",
    howToPlayText:   " Adicione comandos e pressione EXECUTAR para rodar o programa.",
    selectLevelTitle:"SELECIONAR NÍVEL",
    commandsTitle:   "Comandos",
    startSubtitle:   "Ajude a capivara a encontrar todas as maçãs<br />usando simples comandos de programação!",
    finalWinTitle:   "🚀 TODAS AS MISSÕES CONCLUÍDAS!",
    finalWinMsg:     "Capy percorreu cada grade, pegou cada maçã e chegou em cada casa. Você dominou os fundamentos da lógica de programação!",
    finalWinLevels:  "⟵ Voltar aos Níveis",
    finalWinClose:   "Fechar",
  }
};

// ==== CONSTANTS ====

const GRID_SIZE = 5;
const DIRECTIONS = ["up", "right", "down", "left"]; // 0=up,1=right,2=down,3=left

// ==== LEVEL DEFINITIONS ====

const levels = [
  {
    id: 1, name: "Level 1 – First Steps",
    description: "Learn how to move and turn the capybara on a simple grid.",
    start: { x: 0, y: 4, dirIndex: 0 }, apples: [{ x: 2, y: 2 }], goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight"], obstacles: [], switches: [], gates: []
  },
  {
    id: 2, name: "Level 2 – Longer Path",
    description: "A longer path to practice planning your steps.",
    start: { x: 0, y: 4, dirIndex: 0 }, apples: [{ x: 1, y: 1 }], goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight"], obstacles: [], switches: [], gates: []
  },
  {
    id: 3, name: "Level 3 – Avoid the Rocks",
    description: "Watch out for the rocks! Plan your path carefully.",
    start: { x: 0, y: 2, dirIndex: 0 }, apples: [{ x: 2, y: 2 }], goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }], switches: [], gates: []
  },
  {
    id: 4, name: "Level 4 – Rock Corners",
    description: "The apple is surrounded by rocks. Find a safe path around them.",
    start: { x: 0, y: 4, dirIndex: 0 }, apples: [{ x: 2, y: 2 }], goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 2, y: 1 }, { x: 1, y: 2 }, { x: 3, y: 2 }], switches: [], gates: []
  },
  {
    id: 5, name: "Level 5 – Rock Garden",
    description: "The garden is full of rocks. Use turns and repeats to reach the apple.",
    start: { x: 0, y: 4, dirIndex: 0 }, apples: [{ x: 3, y: 1 }], goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 1, y: 2 }],
    switches: [], gates: []
  },
  {
    id: 6, name: "Level 6 – Long Corridor",
    description: "A long corridor! Use repeat to write shorter programs.",
    start: { x: 0, y: 4, dirIndex: 0 }, apples: [{ x: 4, y: 2 }], goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 1 }],
    switches: [], gates: []
  },
  {
    id: 7, name: "Level 7 – First Switch",
    description: "An apple is locked behind a gate. Step on the switch to open it.",
    start: { x: 0, y: 4, dirIndex: 0 }, apples: [{ x: 0, y: 1 }, { x: 4, y: 4 }, { x: 4, y: 1 }], goal: { x: 2, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 4, y: 0 }, { x: 4, y: 2 }, { x: 3, y: 2 }],
    switches: [{ x: 2, y: 3, gateIndex: 0 }], gates: [{ x: 3, y: 1 }]
  },
  {
    id: 8, name: "Level 8 – Double Switch Puzzle",
    description: "Some apples are trapped. Use both switches to free them.",
    start: { x: 0, y: 4, dirIndex: 0 }, apples: [{ x: 0, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 3 }], goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 4 }, { x: 3, y: 4 }],
    switches: [{ x: 1, y: 3, gateIndex: 0 }, { x: 2, y: 1, gateIndex: 1 }], gates: [{ x: 3, y: 1 }, { x: 3, y: 3 }]
  },
  {
    id: 9, name: "Level 9 – Locked Corridor",
    description: "A locked gate blocks the way. Use the switch to open it.",
    start: { x: 0, y: 4, dirIndex: 0 }, apples: [{ x: 1, y: 1 }, { x: 4, y: 2 }], goal: { x: 3, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 },
      { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 4, y: 3 },
      { x: 2, y: 4 }, { x: 4, y: 4 }
    ],
    switches: [{ x: 3, y: 4, gateIndex: 0 }], gates: [{ x: 1, y: 2 }]
  },
  {
    id: 10, name: "Level 10 – Capybara Labyrinth",
    description: "Final challenge! A full maze with rocks, switches and apples.",
    start: { x: 0, y: 4, dirIndex: 0 }, apples: [{ x: 2, y: 4 }, { x: 2, y: 1 }, { x: 4, y: 2 }], goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [
      { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 1 },
      { x: 1, y: 3 }, { x: 3, y: 3 },
      { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 4 }
    ],
    switches: [{ x: 1, y: 4, gateIndex: 0 }, { x: 1, y: 2, gateIndex: 1 }],
    gates: [{ x: 2, y: 3 }, { x: 3, y: 2 }]
  }
];

// ==== PROGRESS ====

let currentLevelIndex = 0;
let completedLevels = [];

function loadProgress() {
  const saved = localStorage.getItem("capyCompletedLevels");
  let parsed = null;
  if (saved) {
    try { parsed = JSON.parse(saved); } catch { parsed = null; }
  }
  // Normalize: must be an array of booleans matching levels.length; coerce
  // truthy/falsy entries and pad/truncate to the current level count.
  if (!Array.isArray(parsed)) {
    completedLevels = levels.map(() => false);
    return;
  }
  completedLevels = levels.map((_, i) => Boolean(parsed[i]));
}

function saveProgress() {
  localStorage.setItem("capyCompletedLevels", JSON.stringify(completedLevels));
}

// ==== GAME STATE ====

let capy = { x: 0, y: 4, dirIndex: 0 };
let apples = [];
let goal = { x: 4, y: 0 };
let obstacles = [];
let switchesArr = [];
let gates = [];

let program = [];
let isRunning = false;
let execSteps = [];
let execIndex = 0;
let execIntervalId = null;

// Maps flat step index → program list index (for highlighting)
let stepToProgramIndex = [];

// ==== DOM ====

const screenStart  = document.getElementById("screen-start");
const screenLevels = document.getElementById("screen-levels");
const screenGame   = document.getElementById("screen-game");

const btnGoLevels   = document.getElementById("btn-go-levels");
const btnBackStart  = document.getElementById("btn-back-start");
const btnBackLevels = document.getElementById("btn-back-levels");

const levelsListEl  = document.getElementById("levels-list");
const levelLabel    = document.getElementById("current-level-label");
const gridEl        = document.getElementById("grid");
const messageEl     = document.getElementById("message");
const programListEl = document.getElementById("program-list");

const btnMove    = document.getElementById("btn-move");
const btnLeft    = document.getElementById("btn-left");
const btnRight   = document.getElementById("btn-right");
const btnRepeat2 = document.getElementById("btn-repeat2");
const btnRepeat3 = document.getElementById("btn-repeat3");
const btnRun     = document.getElementById("btn-run");
const btnClear   = document.getElementById("btn-clear");
const btnNext    = document.getElementById("btn-next-level");

// ==== INIT ====

// Hide page-footer when running inside the CapyVerse overlay iframe
if (window.self !== window.top) {
  const pf = document.querySelector('.page-footer');
  if (pf) pf.style.display = 'none';
}

loadProgress();
createGrid();
resetGameState();
updateProgramList();
changeLanguage(currentLanguage);
populateLevelList();
showMessage(translations.en.readyMessage);
showScreen("start");

// ==== SCREENS ====

function showScreen(name) {
  screenStart.classList.remove("active");
  screenLevels.classList.remove("active");
  screenGame.classList.remove("active");
  if (name === "start")  screenStart.classList.add("active");
  if (name === "levels") screenLevels.classList.add("active");
  if (name === "game")   screenGame.classList.add("active");
}

// ==== LEVEL LIST ====

function populateLevelList() {
  levelsListEl.innerHTML = "";
  const t = translations[currentLanguage];

  levels.forEach((level, index) => {
    const card = document.createElement("div");
    card.classList.add("level-card");

    const isCompleted = completedLevels[index];
    const isUnlocked  = index === 0 || completedLevels[index - 1];

    if (isCompleted) card.classList.add("completed");
    if (!isUnlocked) card.classList.add("locked");

    const info = document.createElement("div");
    info.classList.add("level-info");

    const title = document.createElement("div");
    title.classList.add("level-title");
    title.textContent = level.name;

    const desc = document.createElement("div");
    desc.classList.add("level-description");
    desc.textContent = level.description;

    info.appendChild(title);
    info.appendChild(desc);

    if (isCompleted) {
      const badge = document.createElement("div");
      badge.classList.add("level-badge");
      badge.textContent = t.completed;
      info.appendChild(badge);
    }

    const btnPlay = document.createElement("button");
    btnPlay.classList.add("primary");

    if (!isUnlocked) {
      btnPlay.textContent = t.locked;
      btnPlay.disabled = true;
    } else {
      btnPlay.textContent = isCompleted ? t.playAgain : t.play;
      btnPlay.addEventListener("click", () => {
        loadLevel(index);
        showScreen("game");
      });
    }

    card.appendChild(info);
    card.appendChild(btnPlay);
    levelsListEl.appendChild(card);
  });
}

function loadLevel(index) {
  const isUnlocked = index === 0 || completedLevels[index - 1];
  if (!isUnlocked) {
    showMessage(translations[currentLanguage].lockedMessage);
    return;
  }
  currentLevelIndex = index;
  clearProgram(true);
  resetGameState();
  levelLabel.textContent = levels[currentLevelIndex].name;
  showMessage(translations[currentLanguage].readyMessage);
  hideNextLevel();
  updateCommandVisibility();
}

// ==== COMMAND VISIBILITY ====

function getAvailableCommands() {
  return levels[currentLevelIndex].availableCommands || ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"];
}

function isCommandAvailable(type) {
  return getAvailableCommands().includes(type);
}

function updateCommandVisibility() {
  const available = getAvailableCommands();
  btnMove.classList.toggle("hidden",    !available.includes("move"));
  btnLeft.classList.toggle("hidden",    !available.includes("turnLeft"));
  btnRight.classList.toggle("hidden",   !available.includes("turnRight"));
  btnRepeat2.classList.toggle("hidden", !available.includes("repeatForward2"));
  btnRepeat3.classList.toggle("hidden", !available.includes("repeatForward3"));
}

// ==== GRID ====

function createGrid() {
  gridEl.innerHTML = "";
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      gridEl.appendChild(cell);
    }
  }
}

function renderGrid() {
  const cells = gridEl.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.className = "cell";
    cell.style.backgroundImage = "";
  });

  // Obstacles (rocks)
  obstacles.forEach(o => {
    const cell = getCell(o.x, o.y);
    if (cell) cell.classList.add("obstacle");
  });

  // Gates
  gates.forEach(g => {
    if (!g.opened) {
      const cell = getCell(g.x, g.y);
      if (cell) cell.classList.add("gate");
    }
  });

  // Switches
  switchesArr.forEach(s => {
    const cell = getCell(s.x, s.y);
    if (cell) {
      cell.classList.add("switch");
      if (s.activated) cell.classList.add("activated");
    }
  });

  // Apples
  apples.forEach(a => {
    if (!a.collected) {
      const cell = getCell(a.x, a.y);
      if (cell) cell.classList.add("apple");
    }
  });

  // Goal (house)
  const goalCell = getCell(goal.x, goal.y);
  if (goalCell) goalCell.classList.add("goal");

  // Capy — top-down sprite with direction rotation via CSS class
  const capyCell = getCell(capy.x, capy.y);
  if (capyCell) {
    capyCell.classList.add("capy");
    capyCell.classList.add(`dir-${DIRECTIONS[capy.dirIndex]}`);
  }
}

function getCell(x, y) {
  return gridEl.querySelector(`.cell[data-row="${y}"][data-col="${x}"]`);
}

// ==== PROGRAM ====

function addCommand(type) {
  if (isRunning) return;
  if (!isCommandAvailable(type)) return;
  program.push({ type });
  updateProgramList();
}

function clearProgram(silent = false) {
  if (isRunning) return;
  program = [];
  updateProgramList();
  resetGameState();
  hideNextLevel();
  messageEl.classList.remove("msg-win", "msg-error");
  if (!silent) showMessage(translations[currentLanguage].programCleared);
}

function updateProgramList(activeIndex = -1) {
  const t = translations[currentLanguage];
  programListEl.innerHTML = "";

  program.forEach((cmd, idx) => {
    const li = document.createElement("li");
    let label = "";
    if      (cmd.type === "move")           label = t.moveForward;
    else if (cmd.type === "turnLeft")       label = t.turnLeft;
    else if (cmd.type === "turnRight")      label = t.turnRight;
    else if (cmd.type === "repeatForward2") label = t.repeat2;
    else if (cmd.type === "repeatForward3") label = t.repeat3;

    li.textContent = label;
    li.title = t.clickDelete;
    li.style.cursor = "pointer";

    // Execution highlighting
    if (activeIndex === idx) {
      li.classList.add("executing");
    }

    li.addEventListener("click", () => {
      if (isRunning) return;
      program.splice(idx, 1);
      updateProgramList();
    });

    programListEl.appendChild(li);
  });

  // Auto-scroll to highlighted line
  if (activeIndex >= 0) {
    const activeLi = programListEl.children[activeIndex];
    if (activeLi) {
      activeLi.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
}

// ==== EXECUTION ====

function runProgram() {
  if (isRunning) return;
  if (program.length === 0) {
    showMessage(translations[currentLanguage].programEmpty);
    return;
  }

  if (window.capySfx) window.capySfx.play('run-code');

  resetGameState();
  hideNextLevel();
  messageEl.classList.remove("msg-win", "msg-error");

  // Build flat steps AND a mapping back to program line index
  const { steps, mapping } = buildExecutionSteps(program);
  execSteps = steps;
  stepToProgramIndex = mapping;
  execIndex = 0;
  isRunning = true;
  showMessage(translations[currentLanguage].running);

  execIntervalId = setInterval(executeNextStep, 600);
}

function buildExecutionSteps(program) {
  const steps = [];
  const mapping = []; // step index → program line index

  program.forEach((cmd, progIdx) => {
    if (cmd.type === "move") {
      steps.push("move"); mapping.push(progIdx);
    } else if (cmd.type === "turnLeft") {
      steps.push("turnLeft"); mapping.push(progIdx);
    } else if (cmd.type === "turnRight") {
      steps.push("turnRight"); mapping.push(progIdx);
    } else if (cmd.type === "repeatForward2") {
      steps.push("move", "move"); mapping.push(progIdx, progIdx);
    } else if (cmd.type === "repeatForward3") {
      steps.push("move", "move", "move"); mapping.push(progIdx, progIdx, progIdx);
    }
  });

  return { steps, mapping };
}

function executeNextStep() {
  if (execIndex >= execSteps.length) {
    finishExecution();
    return;
  }

  // Highlight current program line
  const currentProgLine = stepToProgramIndex[execIndex];
  updateProgramList(currentProgLine);

  const action = execSteps[execIndex++];
  if      (action === "move")      moveForward();
  else if (action === "turnLeft")  turnLeft();
  else if (action === "turnRight") turnRight();

  renderGrid();

  if (checkWin()) {
    handleLevelCompleted();
  } else if (checkOutOfBounds() || checkHitObstacleOrGate()) {
    messageEl.classList.add("msg-error");
    showMessage(translations[currentLanguage].hitObstacle);
    finishExecution();
  }
}

function finishExecution() {
  clearInterval(execIntervalId);
  execIntervalId = null;
  isRunning = false;
  updateProgramList(); // clear highlight

  if (!checkWin() && !checkOutOfBounds() && !checkHitObstacleOrGate()) {
    showMessage(translations[currentLanguage].programFinished);
  }
}

function handleLevelCompleted() {
  clearInterval(execIntervalId);
  execIntervalId = null;
  isRunning = false;
  updateProgramList(); // clear highlight

  if (window.capySfx) window.capySfx.play('won');

  messageEl.classList.add("msg-win");
  showMessage(translations[currentLanguage].win);

  // Win flash animation on grid
  gridEl.classList.add("win-flash");
  setTimeout(() => gridEl.classList.remove("win-flash"), 1400);

  completedLevels[currentLevelIndex] = true;
  saveProgress();
  populateLevelList();
  showNextLevelIfAvailable();

  // Final win — every level cleared
  if (completedLevels.every(Boolean) && completedLevels.length === levels.length) {
    setTimeout(showFinalWin, 900);
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
    showScreen('levels');
  }, { once: true });
}

// ==== MOVEMENT ====

function moveForward() {
  const dir = DIRECTIONS[capy.dirIndex];
  let dx = 0, dy = 0;
  if      (dir === "up")    dy = -1;
  else if (dir === "down")  dy =  1;
  else if (dir === "left")  dx = -1;
  else if (dir === "right") dx =  1;

  capy.x += dx;
  capy.y += dy;

  // Collect apples
  apples.forEach(a => {
    if (!a.collected && a.x === capy.x && a.y === capy.y) {
      a.collected = true;
      if (window.capySfx) window.capySfx.play('apple-grabbed');
    }
  });

  // Activate switches
  switchesArr.forEach(s => {
    if (s.x === capy.x && s.y === capy.y) {
      const wasActivated = s.activated;
      s.activated = true; // track activation for visual state
      if (typeof s.gateIndex === "number" && gates[s.gateIndex]) {
        gates[s.gateIndex].opened = true;
      } else {
        gates.forEach(g => (g.opened = true));
      }
      // Play the click sound only the first time a switch is stepped on
      // so re-crossing it doesn't re-trigger the cue.
      if (!wasActivated && window.capySfx) window.capySfx.play('switch-pressed');
    }
  });
}

function turnLeft()  { capy.dirIndex = (capy.dirIndex + 3) % 4; }
function turnRight() { capy.dirIndex = (capy.dirIndex + 1) % 4; }

function checkOutOfBounds() {
  return capy.x < 0 || capy.x >= GRID_SIZE || capy.y < 0 || capy.y >= GRID_SIZE;
}

function checkHitObstacleOrGate() {
  const hitObstacle   = obstacles.some(o => o.x === capy.x && o.y === capy.y);
  const hitClosedGate = gates.some(g => !g.opened && g.x === capy.x && g.y === capy.y);
  return hitObstacle || hitClosedGate;
}

function checkWin() {
  return apples.every(a => a.collected) && capy.x === goal.x && capy.y === goal.y;
}

function resetGameState() {
  const level = levels[currentLevelIndex];
  capy = { x: level.start.x, y: level.start.y, dirIndex: level.start.dirIndex };
  apples = level.apples.map(a => ({ x: a.x, y: a.y, collected: false }));
  goal = { x: level.goal.x, y: level.goal.y };
  obstacles   = level.obstacles || [];
  switchesArr = (level.switches || []).map(s => ({ ...s, activated: false }));
  gates       = (level.gates || []).map(g => ({ x: g.x, y: g.y, opened: false }));
  renderGrid();
}

// ==== UI ====

function showMessage(text) {
  if (messageEl) messageEl.textContent = text;
}

function showNextLevelIfAvailable() {
  if (!btnNext) return;
  const t = translations[currentLanguage];
  btnNext.textContent = currentLevelIndex < levels.length - 1 ? t.nextLevel : (t.backToLevels || "Back to Levels ⟶");
  btnNext.classList.remove("hidden");
}

function hideNextLevel() {
  if (btnNext) btnNext.classList.add("hidden");
}

// ==== FULLSCREEN ====

function toggleFullscreen() {
  // Fullscreen the whole page instead of the cabinet, so the cabinet
  // keeps its natural max-width and is centered with the page's
  // background filling the surrounding area.
  const root = document.documentElement;
  const btn = document.getElementById("btn-fullscreen");

  if (!document.fullscreenElement) {
    root.requestFullscreen().then(() => {
      btn.textContent = "⛶✕";
      btn.title = "Exit Fullscreen";
    }).catch(err => {
      console.warn("Fullscreen error:", err);
    });
  } else {
    document.exitFullscreen().then(() => {
      btn.textContent = "⛶";
      btn.title = "Fullscreen";
    });
  }
}

document.addEventListener("fullscreenchange", () => {
  const btn = document.getElementById("btn-fullscreen");
  if (!document.fullscreenElement) {
    btn.textContent = "⛶";
    btn.title = "Fullscreen";
  }
});

// ==== EVENT LISTENERS ====

btnGoLevels.addEventListener("click",   () => showScreen("levels"));
btnBackStart.addEventListener("click",  () => showScreen("start"));
btnBackLevels.addEventListener("click", () => showScreen("levels"));

btnMove.addEventListener("click",    () => addCommand("move"));
btnLeft.addEventListener("click",    () => addCommand("turnLeft"));
btnRight.addEventListener("click",   () => addCommand("turnRight"));
btnRepeat2.addEventListener("click", () => addCommand("repeatForward2"));
btnRepeat3.addEventListener("click", () => addCommand("repeatForward3"));

btnRun.addEventListener("click",   runProgram);
btnClear.addEventListener("click", () => clearProgram());

btnNext.addEventListener("click", () => {
  hideNextLevel();
  if (currentLevelIndex < levels.length - 1) {
    loadLevel(currentLevelIndex + 1);
  } else {
    showScreen("levels");
  }
});

// ==== LANGUAGE ====

function changeLanguage(lang) {
  currentLanguage = lang;
  if (window.CapyLang) window.CapyLang.set(lang);
  const t = translations[lang];

  // Update html[lang] for screen readers
  document.documentElement.setAttribute('lang', lang);

  // Highlight active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (t[key] !== undefined) {
      if (key === "startSubtitle") el.innerHTML = t[key];
      else el.textContent = t[key];
    }
  });

  btnRun.textContent     = t.runButton;
  btnClear.textContent   = t.clearButton;
  btnMove.textContent    = t.moveForward;
  btnLeft.textContent    = t.turnLeft;
  btnRight.textContent   = t.turnRight;
  btnRepeat2.textContent = t.repeat2;
  btnRepeat3.textContent = t.repeat3;

  showMessage(t.readyMessage);
  updateProgramList();
  populateLevelList();
}
