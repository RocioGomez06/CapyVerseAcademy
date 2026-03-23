let currentLanguage = "en";

// ==== CONSTANTS ====

const GRID_SIZE = 5;
const DIRECTIONS = ["up", "right", "down", "left"]; // 0,1,2,3

// ==== LEVEL DEFINITIONS ====

const levels = [
  {
    id: 1,
    name: "Level 1 – First Steps",
    description: "Learn how to move and turn the capybara on a simple grid.",
    start: { x: 0, y: 4, dirIndex: 0 },
    apples: [{ x: 2, y: 2 }],
    goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight"],
    obstacles: [],
    switches: [],
    gates: []
  },
  {
    id: 2,
    name: "Level 2 – Longer Path",
    description: "A longer path to practice planning your steps.",
    start: { x: 0, y: 4, dirIndex: 0 },
    apples: [{ x: 1, y: 1 }],
    goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight"],
    obstacles: [],
    switches: [],
    gates: []
  },
  {
    id: 3,
    name: "Level 3 – Avoid the Rocks",
    description: "Watch out for the rocks! Plan your path carefully.",
    start: { x: 0, y: 2, dirIndex: 0 },
    apples: [{ x: 2, y: 2 }],
    goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
    switches: [],
    gates: []
  },
  {
    id: 4,
    name: "Level 4 – Rock Corners",
    description: "The apple is surrounded by rocks. Find a safe path around them.",
    start: { x: 0, y: 4, dirIndex: 0 },
    apples: [{ x: 2, y: 2 }],
    goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 2, y: 1 }, { x: 1, y: 2 }, { x: 3, y: 2 }],
    switches: [],
    gates: []
  },
  {
    id: 5,
    name: "Level 5 – Rock Garden",
    description: "The garden is full of rocks. Use turns and repeats to reach the apple.",
    start: { x: 0, y: 4, dirIndex: 0 },
    apples: [{ x: 3, y: 1 }],
    goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 1, y: 2 }],
    switches: [],
    gates: []
  },
  {
    id: 6,
    name: "Level 6 – Long Corridor",
    description: "This is a long corridor! Use repeat to write shorter programs.",
    start: { x: 0, y: 4, dirIndex: 0 },
    apples: [{ x: 4, y: 2 }],
    goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 1 }],
    switches: [],
    gates: []
  },
  {
    id: 7,
    name: "Level 7 – First Switch",
    description: "One apple is locked behind a gate. Step on the switch to open it.",
    start: { x: 0, y: 4, dirIndex: 0 },
    apples: [{ x: 0, y: 1 }, { x: 4, y: 4 }, { x: 4, y: 1 }],
    goal: { x: 2, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 4, y: 0 }, { x: 4, y: 2 }, { x: 3, y: 2 }],
    switches: [{ x: 2, y: 3, gateIndex: 0 }],
    gates: [{ x: 3, y: 1 }]
  },
  {
    id: 8,
    name: "Level 8 – Double Switch Puzzle",
    description: "Some apples are trapped. Use both switches to free them.",
    start: { x: 0, y: 4, dirIndex: 0 },
    apples: [{ x: 0, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 3 }],
    goal: { x: 4, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 4 }, { x: 3, y: 4 }],
    switches: [{ x: 1, y: 3, gateIndex: 0 }, { x: 2, y: 1, gateIndex: 1 }],
    gates: [{ x: 3, y: 1 }, { x: 3, y: 3 }]
  },
  {
    id: 9,
    name: "Level 9 – Locked Corridor",
    description: "A locked gate blocks the way. Use the switch to open it and collect all apples.",
    start: { x: 0, y: 4, dirIndex: 0 },
    apples: [{ x: 1, y: 1 }, { x: 4, y: 2 }],
    goal: { x: 3, y: 0 },
    availableCommands: ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"],
    obstacles: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 },
      { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 4, y: 3 },
      { x: 2, y: 4 }, { x: 4, y: 4 }
    ],
    switches: [{ x: 3, y: 4, gateIndex: 0 }],
    gates: [{ x: 1, y: 2 }]
  },
  {
    id: 10,
    name: "Level 10 – Capybara Labyrinth",
    description: "Final challenge! A full maze with rocks, switches and apples.",
    start: { x: 0, y: 4, dirIndex: 0 },
    apples: [{ x: 2, y: 4 }, { x: 2, y: 1 }, { x: 4, y: 2 }],
    goal: { x: 4, y: 0 },
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

// ==== PROGRESS (sessionStorage) ====

let currentLevelIndex = 0;
let completedLevels = [];

function loadProgress() {
  const saved = sessionStorage.getItem("capyCompletedLevels");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      completedLevels = levels.map((_, i) => !!parsed[i]);
    } catch {
      completedLevels = levels.map(() => false);
    }
  } else {
    completedLevels = levels.map(() => false);
  }
}

function saveProgress() {
  sessionStorage.setItem("capyCompletedLevels", JSON.stringify(completedLevels));
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

// ==== DOM ELEMENTS ====

const screenStart  = document.getElementById("screen-start");
const screenLevels = document.getElementById("screen-levels");
const screenGame   = document.getElementById("screen-game");

const btnGoLevels   = document.getElementById("btn-go-levels");
const btnBackStart  = document.getElementById("btn-back-start");
const btnBackLevels = document.getElementById("btn-back-levels");

const levelsListElement   = document.getElementById("levels-list");
const currentLevelLabel   = document.getElementById("current-level-label");
const gridElement         = document.getElementById("grid");
const messageElement      = document.getElementById("message");
const programListElement  = document.getElementById("program-list");

const btnMove    = document.getElementById("btn-move");
const btnLeft    = document.getElementById("btn-left");
const btnRight   = document.getElementById("btn-right");
const btnRepeat2 = document.getElementById("btn-repeat2");
const btnRepeat3 = document.getElementById("btn-repeat3");
const btnRun     = document.getElementById("btn-run");
const btnClear   = document.getElementById("btn-clear");
const btnNextLevel = document.getElementById("btn-next-level");

// ==== INIT ====

loadProgress();
createGrid();
resetGameState();
updateProgramList();
populateLevelList();
showMessage(translations["en"].readyMessage);
showScreen("start");

// ==== SCREEN MANAGEMENT ====

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
  levelsListElement.innerHTML = "";
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
    levelsListElement.appendChild(card);
  });
}

function loadLevel(index) {
  const isUnlocked = index === 0 || completedLevels[index - 1];
  if (!isUnlocked) {
    showMessage(translations[currentLanguage].lockedMessage || "Complete the previous level first.");
    return;
  }

  currentLevelIndex = index;
  clearProgram(true);
  resetGameState();
  currentLevelLabel.textContent = levels[currentLevelIndex].name;
  showMessage(translations[currentLanguage].readyMessage);
  hideNextLevelButton();
  updateCommandVisibility();
}

// ==== COMMAND VISIBILITY ====

function getAvailableCommandsForCurrentLevel() {
  const level = levels[currentLevelIndex];
  return level.availableCommands || ["move", "turnLeft", "turnRight", "repeatForward2", "repeatForward3"];
}

function isCommandAvailable(type) {
  return getAvailableCommandsForCurrentLevel().includes(type);
}

function updateCommandVisibility() {
  const available = getAvailableCommandsForCurrentLevel();
  btnMove.classList.toggle("hidden",    !available.includes("move"));
  btnLeft.classList.toggle("hidden",    !available.includes("turnLeft"));
  btnRight.classList.toggle("hidden",   !available.includes("turnRight"));
  btnRepeat2.classList.toggle("hidden", !available.includes("repeatForward2"));
  btnRepeat3.classList.toggle("hidden", !available.includes("repeatForward3"));
}

// ==== GRID ====

function createGrid() {
  gridElement.innerHTML = "";
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      gridElement.appendChild(cell);
    }
  }
}

function renderGrid() {
  const cells = gridElement.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.className = "cell";
  });

  obstacles.forEach(o => {
    const cell = getCell(o.x, o.y);
    if (cell) cell.classList.add("obstacle");
  });

  gates.forEach(g => {
    if (!g.opened) {
      const cell = getCell(g.x, g.y);
      if (cell) cell.classList.add("gate");
    }
  });

  switchesArr.forEach(s => {
    const cell = getCell(s.x, s.y);
    if (cell) cell.classList.add("switch");
  });

  apples.forEach(a => {
    if (!a.collected) {
      const cell = getCell(a.x, a.y);
      if (cell) cell.classList.add("apple");
    }
  });

  const goalCell = getCell(goal.x, goal.y);
  if (goalCell) goalCell.classList.add("goal");

  const capyCell = getCell(capy.x, capy.y);
  if (capyCell) {
    capyCell.classList.add("capy");
    capyCell.classList.add(`dir-${DIRECTIONS[capy.dirIndex]}`);
  }
}

function getCell(x, y) {
  return gridElement.querySelector(`.cell[data-row="${y}"][data-col="${x}"]`);
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
  hideNextLevelButton();
  if (!silent) showMessage(translations[currentLanguage].programCleared);
}

function updateProgramList() {
  const t = translations[currentLanguage];
  programListElement.innerHTML = "";
  program.forEach((cmd, idx) => {
    const li = document.createElement("li");
    if      (cmd.type === "move")           li.textContent = t.moveForward;
    else if (cmd.type === "turnLeft")       li.textContent = t.turnLeft;
    else if (cmd.type === "turnRight")      li.textContent = t.turnRight;
    else if (cmd.type === "repeatForward2") li.textContent = t.repeat2;
    else if (cmd.type === "repeatForward3") li.textContent = t.repeat3;

    li.style.cursor = "pointer";
    li.title = t.clickDelete;
    li.addEventListener("click", () => {
      if (isRunning) return;
      program.splice(idx, 1);
      updateProgramList();
    });

    programListElement.appendChild(li);
  });
}

// ==== EXECUTION ====

function runProgram() {
  if (isRunning) return;
  if (program.length === 0) {
    showMessage(translations[currentLanguage].programEmpty);
    return;
  }

  resetGameState();
  hideNextLevelButton();

  execSteps = buildExecutionSteps(program);
  execIndex = 0;
  isRunning = true;
  showMessage(translations[currentLanguage].running);

  execIntervalId = setInterval(executeNextStep, 600);
}

function buildExecutionSteps(program) {
  const steps = [];
  for (const cmd of program) {
    if      (cmd.type === "move")           steps.push("move");
    else if (cmd.type === "turnLeft")       steps.push("turnLeft");
    else if (cmd.type === "turnRight")      steps.push("turnRight");
    else if (cmd.type === "repeatForward2") steps.push("move", "move");
    else if (cmd.type === "repeatForward3") steps.push("move", "move", "move");
  }
  return steps;
}

function executeNextStep() {
  if (execIndex >= execSteps.length) {
    finishExecution();
    return;
  }

  const action = execSteps[execIndex++];
  if      (action === "move")      moveForward();
  else if (action === "turnLeft")  turnLeft();
  else if (action === "turnRight") turnRight();

  renderGrid();

  if (checkWin()) {
    handleLevelCompleted();
  } else if (checkOutOfBounds() || checkHitObstacleOrGate()) {
    showMessage(translations[currentLanguage].hitObstacle);
    finishExecution();
  }
}

function finishExecution() {
  clearInterval(execIntervalId);
  execIntervalId = null;
  isRunning = false;

  if (!checkWin() && !checkOutOfBounds() && !checkHitObstacleOrGate()) {
    showMessage(translations[currentLanguage].programFinished);
  }
}

function handleLevelCompleted() {
  clearInterval(execIntervalId);
  execIntervalId = null;
  isRunning = false;

  showMessage(translations[currentLanguage].win);
  completedLevels[currentLevelIndex] = true;
  saveProgress();
  populateLevelList();
  showNextLevelButtonIfAvailable();
}

// ==== MOVEMENT & RULES ====

function moveForward() {
  const dir = DIRECTIONS[capy.dirIndex];
  let dx = 0, dy = 0;
  if      (dir === "up")    dy = -1;
  else if (dir === "down")  dy =  1;
  else if (dir === "left")  dx = -1;
  else if (dir === "right") dx =  1;

  capy.x += dx;
  capy.y += dy;

  apples.forEach(a => {
    if (!a.collected && a.x === capy.x && a.y === capy.y) a.collected = true;
  });

  switchesArr.forEach(s => {
    if (s.x === capy.x && s.y === capy.y) {
      if (typeof s.gateIndex === "number" && gates[s.gateIndex]) {
        gates[s.gateIndex].opened = true;
      } else {
        gates.forEach(g => (g.opened = true));
      }
    }
  });
}

function turnLeft()  { capy.dirIndex = (capy.dirIndex + 3) % 4; }
function turnRight() { capy.dirIndex = (capy.dirIndex + 1) % 4; }

function checkOutOfBounds() {
  return capy.x < 0 || capy.x >= GRID_SIZE || capy.y < 0 || capy.y >= GRID_SIZE;
}

function checkHitObstacleOrGate() {
  const hitObstacle  = obstacles.some(o => o.x === capy.x && o.y === capy.y);
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
  obstacles  = level.obstacles || [];
  switchesArr = level.switches || [];
  gates = (level.gates || []).map(g => ({ x: g.x, y: g.y, opened: false }));
  renderGrid();
}

// ==== UI HELPERS ====

function showMessage(text) {
  if (messageElement) messageElement.textContent = text;
}

function showNextLevelButtonIfAvailable() {
  if (!btnNextLevel) return;
  const t = translations[currentLanguage];
  btnNextLevel.textContent = currentLevelIndex < levels.length - 1
    ? t.nextLevel
    : t.backToLevels || "Back to Levels ⟶";
  btnNextLevel.classList.remove("hidden");
}

function hideNextLevelButton() {
  if (btnNextLevel) btnNextLevel.classList.add("hidden");
}

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

btnNextLevel.addEventListener("click", () => {
  hideNextLevelButton();
  if (currentLevelIndex < levels.length - 1) {
    loadLevel(currentLevelIndex + 1);
  } else {
    showScreen("levels");
  }
});

// ==== TRANSLATIONS ====

const translations = {
  en: {
    title:           "Capy Code Quest",
    readyMessage:    "Ready! Create your program and press RUN.",
    runButton:       "RUN",
    clearButton:     "CLEAR",
    nextLevel:       "Next Level ⟶",
    backToLevels:    "Back to Levels ⟶",
    startButton:     "Start Game",
    programEmpty:    "Your program is empty. Add some commands first.",
    running:         "Running...",
    hitObstacle:     "Oh no! You hit a rock, a gate or left the grid. Try again.",
    win:             "Great job! You collected all apples and reached home!",
    programFinished: "Program finished. Did you reach the goal?",
    programCleared:  "Program cleared. Create a new one!",
    moveForward:     "Move Forward",
    turnLeft:        "Turn Left",
    turnRight:       "Turn Right",
    repeat2:         "Repeat Forward 2x",
    repeat3:         "Repeat Forward 3x",
    clickDelete:     "Click to delete this command",
    completed:       "Completed ✓",
    play:            "Play",
    playAgain:       "Play Again",
    locked:          "Locked 🔒",
    lockedMessage:   "Complete the previous level first.",
    backToStart:     "⟵ Back to Start",
    backToLevelsBtn: "⟵ Back to Levels"
  },
  es: {
    title:           "Capy Code Quest",
    readyMessage:    "¡Listo! Crea tu programa y pulsa EJECUTAR.",
    runButton:       "EJECUTAR",
    clearButton:     "BORRAR",
    nextLevel:       "Siguiente nivel ⟶",
    backToLevels:    "Volver a niveles ⟶",
    startButton:     "Comenzar juego",
    programEmpty:    "Tu programa está vacío. Agrega comandos primero.",
    running:         "Ejecutando...",
    hitObstacle:     "¡Oh no! Chocaste con una roca, una puerta o saliste del mapa.",
    win:             "¡Excelente! ¡Recolectaste todas las manzanas y llegaste a casa!",
    programFinished: "Programa terminado. ¿Llegaste al objetivo?",
    programCleared:  "Programa borrado. ¡Crea uno nuevo!",
    moveForward:     "Avanzar",
    turnLeft:        "Girar izquierda",
    turnRight:       "Girar derecha",
    repeat2:         "Repetir avanzar 2x",
    repeat3:         "Repetir avanzar 3x",
    clickDelete:     "Haz clic para borrar este comando",
    completed:       "Completado ✓",
    play:            "Jugar",
    playAgain:       "Jugar otra vez",
    locked:          "Bloqueado 🔒",
    lockedMessage:   "Completa el nivel anterior primero.",
    backToStart:     "⟵ Inicio",
    backToLevelsBtn: "⟵ Niveles"
  },
  pt: {
    title:           "Capy Code Quest",
    readyMessage:    "Pronto! Crie seu programa e pressione EXECUTAR.",
    runButton:       "EXECUTAR",
    clearButton:     "LIMPAR",
    nextLevel:       "Próximo nível ⟶",
    backToLevels:    "Voltar aos níveis ⟶",
    startButton:     "Começar Jogo",
    programEmpty:    "Seu programa está vazio. Adicione comandos primeiro.",
    running:         "Executando...",
    hitObstacle:     "Ah não! Você bateu em uma pedra, portão ou saiu do mapa.",
    win:             "Ótimo! Você coletou todas as maçãs e chegou em casa!",
    programFinished: "Programa finalizado. Você alcançou o objetivo?",
    programCleared:  "Programa limpo. Crie um novo!",
    moveForward:     "Mover para frente",
    turnLeft:        "Virar à esquerda",
    turnRight:       "Virar à direita",
    repeat2:         "Repetir avançar 2x",
    repeat3:         "Repetir avançar 3x",
    clickDelete:     "Clique para remover este comando",
    completed:       "Concluído ✓",
    play:            "Jogar",
    playAgain:       "Jogar novamente",
    locked:          "Bloqueado 🔒",
    lockedMessage:   "Complete o nível anterior primeiro.",
    backToStart:     "⟵ Início",
    backToLevelsBtn: "⟵ Níveis"
  }
};

// ==== LANGUAGE SWITCHER ====

function changeLanguage(language) {
  currentLanguage = language;
  const t = translations[language];

  // Update data-key elements in HTML
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (t[key]) el.textContent = t[key];
  });

  // Update button labels that are set dynamically
  btnRun.textContent    = t.runButton;
  btnClear.textContent  = t.clearButton;
  btnMove.textContent   = t.moveForward;
  btnLeft.textContent   = t.turnLeft;
  btnRight.textContent  = t.turnRight;
  btnRepeat2.textContent = t.repeat2;
  btnRepeat3.textContent = t.repeat3;

  showMessage(t.readyMessage);
  updateProgramList();
  populateLevelList();
}
