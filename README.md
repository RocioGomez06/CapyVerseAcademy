# CapyVerse Academy

An interactive learning platform where programming meets play. Free, open-source educational games that teach Computer Science and IT fundamentals to young students and beginners through gamification and CLIL (Content and Language Integrated Learning).

Trilingual (English, Español, Português), color-blind-safe (Bang Wong palette), and built with vanilla HTML/CSS/JS — no frameworks, no build step, no tracking.

---

## Live games

| Game | Topic | Status |
| --- | --- | --- |
| **Capy Code Quest** | Algorithms, loops, sequential thinking | Available |
| **Capy Cyber Defense** | Cybersecurity literacy (phishing, malware, MITM, ransomware, zero-day, …) | Available |
| Capy Logic Labs | Logic gates, circuits | Coming soon |
| Capy Data Vault | Databases, queries | Coming soon |
| Capy Net World | Networking, protocols | Coming soon |

---

## Running locally

No build, no dependencies. Any static file server works — the games use `fetch` for `levels.json`, so opening `index.html` via `file://` will fail on some browsers. Use one of these from the project root:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open <http://localhost:8000>.

---

## Project structure

```
/
├── index.html              ← academy landing page (the entry point)
├── assets/
│   ├── logos/              ← cross-game logos (Code Quest, Cyber Defense, ship)
│   └── cursor/             ← pixel-art capy hand cursor (open + closed)
├── pages/                  ← static content pages
│   ├── about.html
│   ├── accessibility.html
│   ├── curriculum.html
│   ├── languages.html
│   └── pedagogy.html
└── games/                  ← one folder per game, fully self-contained
    ├── capy-code-quest/
    │   ├── index.html
    │   ├── script.js
    │   ├── style.css
    │   ├── levels.json
    │   └── assets/         ← game-specific sprites
    └── capy-cyber-defense/
        ├── index.html
        ├── script.js
        └── style.css
```

Each game is fully standalone — its folder can be opened directly, or embedded in the academy via the `openGame()` overlay.

---

## Tech stack

- **HTML / CSS / vanilla JS** — no frameworks, no canvas, no game engine. Threats and game objects are absolutely-positioned DOM elements animated with CSS keyframes (`animation-play-state: paused/running` to freeze the world during popups).
- **`localStorage`** — player profiles, progress, syllabus, high scores. All schema-validated on load.
- **Press Start 2P + Pixelify Sans** from Google Fonts — both free for any use.
- **Bang Wong color-blind-safe palette** — the eight colors used across the UI are distinguishable by people with all common forms of color blindness.

---

## Design principles

- **Educational first.** CLIL methodology means every gameplay moment is also a vocabulary moment. Threat names, counter names, descriptions, and "why this is wrong" tooltips are translated into all three supported languages.
- **Retro arcade aesthetic.** Windows 95 + Vaporwave + pixel art. Pre-2000s feel, sub-2000s file sizes.
- **Accessibility is gameplay, not a checkbox.**
  - All interactive elements have ARIA labels and live regions.
  - Skip-links on every game.
  - Keyboard-navigable menus (game-loop targets like falling threats are mouse/touch only by design; the menus, popups, and forms aren't).
  - Color-blind-safe by default.
  - ESC closes any popup or pause overlay.
- **No tracking, no analytics, no third-party scripts.** Player data never leaves the browser.

---

## Contributing / extending

The repo is structured so adding a new game is just creating a new folder under `games/`:

1. `games/capy-<your-game>/` with `index.html`, `script.js`, `style.css`, and any `assets/`.
2. Add the game card to `index.html` (academy landing) and wire its `openGame(...)` button.
3. Add translations in the three language objects at the bottom of `index.html`.

Game-specific contributions: each game's `script.js` is a single self-contained file. State lives in a `state` object, screens are toggled via a `.active` class, and `localStorage` writes go through `savePlayers()` / `saveProgress()` so schema can stay validated.

---

## Browser support

- Modern Chromium, Firefox, Safari (last 2 major versions).
- Mobile: works in modern mobile browsers; touch is fully supported. Threat-click hitboxes are sized for fingertips.
- The fullscreen toggle uses the standard Fullscreen API and falls back gracefully.

---

## License

[**CC BY-NC-SA 4.0**](https://creativecommons.org/licenses/by-nc-sa/4.0/) — Creative Commons Attribution-NonCommercial-ShareAlike.

You're free to use, modify, and share the code and assets for non-commercial educational purposes, as long as you credit the project and share derivatives under the same license. Commercial use requires written permission.

---

## Credits

Created by Rocío Gómez ([@RocioGomez06](https://github.com/RocioGomez06)). Capybara art, pixel cursors, and game design original to the project.
