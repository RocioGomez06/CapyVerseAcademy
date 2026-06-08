# CapyVerse Academy

<img width="280" height="280" alt="pixil-frame-1(1)" src="https://github.com/user-attachments/assets/6e54139c-547a-4791-90da-2971131b7768" />

An interactive learning platform where programming meets play. Free, open-source educational games that teach Computer Science and IT fundamentals to young students and beginners through gamification and CLIL (Content and Language Integrated Learning).

<img width="1921" height="1065" alt="image" src="https://github.com/user-attachments/assets/b6ea6afa-1edf-4a83-80f7-a71236824d53" />


<img width="1487" height="824" alt="image" src="https://github.com/user-attachments/assets/bef472bc-04f9-439d-a249-4270e61363e3" />


Trilingual (English, Español, Português), color-blind-safe (Bang Wong palette), and built with vanilla HTML/CSS/JS — no frameworks, no build step, no tracking.


<img width="1302" height="719" alt="image" src="https://github.com/user-attachments/assets/15328e8a-62aa-474f-bd5a-3371c0bd548b" />

---

## Live games

| Game | Topic | Status |
| --- | --- | --- |
| **Capy Code Quest** | Algorithms, loops, sequential thinking | Available |
| **Capy Cyber Defense** | Cybersecurity literacy (phishing, malware, MITM, ransomware, zero-day, …) | Available |
| Capy Logic Labs | Logic gates, circuits | Coming soon |
| Capy Data Vault | Databases, queries | Coming soon |
| Capy Net World | Networking, protocols | Coming soon |

- **Capy Code Quest 1st level**
<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/90ab0b58-9bab-4cb4-8dcb-f6f7787c85fe" />

---

- **Capy Cyber Defense 1st level**
<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/b0604fe5-0d74-4c8b-b0bc-1b2e19f1fa78" />



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

## Authorship

**The entirety of CapyVerse Academy — except the music — was created by Rocío Gómez.**

This includes, without limitation:

- the original concept and educational vision of the platform
- the name, branding, and identity of "CapyVerse Academy"
- every game concept, mechanic, level design, and curriculum mapping (Capy Code Quest, Capy Cyber Defense, Capy Logic Labs, Capy Data Vault, Capy Net World)
- all pixel art (capybara mascot, custom cursors, logos, threat icons, sprites, UI chrome)
- all written copy, in-game text, translations, and pedagogical material
- all HTML, CSS, JavaScript, and configuration

The only external creative contribution is the soundtrack by Matías Ramírez (see Music subsection below).

## License

Different parts of this project are covered by different licenses. Please read both before reusing anything.

### Code, game design, and visual assets — © Rocío Gómez

All HTML, CSS, JavaScript, pixel art (capybara, cursors, logos, sprites), level design, written content, and the project's underlying concept and branding are © Rocío Gómez and are licensed under [**Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**](https://creativecommons.org/licenses/by-nc-sa/4.0/).

You're free to use, modify, and share this material for **non-commercial educational purposes**, provided you:

- **Attribute** the original work to Rocío Gómez and CapyVerse Academy with a link back to this repository.
- **Share alike** — any derivative work must be released under the same CC BY-NC-SA 4.0 license.
- **Non-commercial** — commercial use (including ad-supported sites, paid courses, or bundled products) requires prior written permission.

### Music

The soundtrack is **separately licensed and not covered by CC BY-NC-SA**.

All tracks in `assets/music/`, `games/capy-code-quest/music/`, and `games/capy-cyber-defense/music/` were composed and produced by **Matías Ramírez**, who retains full copyright. The works are not registered with any collective rights organisation (SADAIC, ASCAP, PRS, etc.) and have not been released under any public license.

Matías has granted CapyVerse Academy **explicit, personal permission** to include these tracks for use within this educational, non-commercial project only. This permission:

- **Does not transfer** to forks, mirrors, or derivative works. If you fork this repository, you may **not** redistribute, embed, stream, sample, or repackage the audio files. Please remove them from your fork or replace them with your own licensed material.
- **Does not authorise commercial use** of any kind, including monetised hosting.
- **Does not waive Matías's moral or economic rights** as the author.

If you'd like to use any of his music in your own project, please contact Rocío or Matías directly to request permission. Don't assume the project's CC license covers it — it doesn't.

---

## Credits

**Concept, project lead, branding, game design, level design, pixel art, code, written content** — Rocío Gómez ([@RocioGomez06](https://github.com/RocioGomez06)). © Rocío Gómez. All rights reserved beyond the CC BY-NC-SA 4.0 grant.

**Original soundtrack** — Matías Ramírez. Used by personal permission of the author. © Matías Ramírez. All rights reserved.

**Fonts** — *Press Start 2P* and *Pixelify Sans* via Google Fonts, both released under the SIL Open Font License.

**Colour palette** — based on Bang Wong's eight-colour palette ([Bang Wong, *Nature Methods*, 2011](https://www.nature.com/articles/nmeth.1618)), designed for accessibility under common forms of colour blindness.
