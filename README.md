# 🎮 3D Bricks Slider Game

> **Version 2.0.0** — A fast-paced, reflex-driven 3D brick-swiping game built with vanilla HTML, CSS, and JavaScript.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Now!-brightgreen)](https://bricks-game-mmabiaa.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-orange)](CHANGELOG.md)

---

## 📚 Table of Contents

- [About the Game](#-about-the-game)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [File Structure](#-file-structure)
- [Getting Started](#-getting-started)
- [How to Play](#-how-to-play)
- [Changelog](#-changelog)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🕹️ About the Game

**3D Bricks Slider Game** is a fast-paced, reflex-driven browser game where players swipe bricks off the screen to score points while avoiding deadly bombs. As you progress, the game environment dynamically evolves with vivid new background colours as you clear levels, creating an ever-changing and immersive visual journey.

Built entirely with **vanilla HTML5, CSS3, and JavaScript** — no frameworks, no dependencies, just pure performance.

---

## 🌟 Features

### 🧱 Core Gameplay
- **3D Rendered Bricks:** Real-time 3D projection and rendering with perspective, shadows, and smooth physics.
- **Swipe Mechanics:** Swipe bricks using a mouse or touchscreen. Speed and direction affect scoring and physics reactions.
- **Ranked & Casual Modes:** Play competitively in Ranked Mode (missed bricks end the game) or relax in Casual Mode (missed bricks deduct points instead).
- **Slow-Motion Power-Up:** Smashing special wireframe bricks triggers a slow-motion effect with bonus spawns.

### 💣 Bomb Hazard
- Bombs randomly spawn among regular bricks. **Do not swipe them!** Swiping a bomb immediately ends the game with a dramatic explosion effect and sound.
- Bombs that fall off-screen are safely ignored — the game continues.

### 🔊 Sound Effects System
- Powered by the **Web Audio API** for zero-latency, hardware-accelerated audio — optimized for both desktop and mobile.
- **Game Start Sound:** Plays when the player starts or restarts a game.
- **Splash Sound:** Fires on every successful brick smash — supports simultaneous overlapping playback with no lag.
- **Game Over Sound:** Plays when the player loses (brick missed or bomb swiped).
- **Dynamic Background Sound:** Plays on every completed level when the background changes.
- **Sound Toggle Button (🔊/🔇):** Mounted in the HUD. Preference is saved to `localStorage` and persisted across sessions.

### 🌃 Endless Dynamic Backgrounds
- The game background evolves **every time you complete a level** (by successfully smashing a required sequence of 10, 15, 20, 25, or 30 cubes) through a curated palette of **10 environments**:

  | # | Colour Name         | Hex       |
  |---|---------------------|-----------|
  | 1 | Teal (Default)      | `#65c8a8` |
  | 2 | Blue Night          | `#1a365d` |
  | 3 | Cosmic Space Purple | `#170b3b` |
  | 4 | Sunset Red/Orange   | `#8a2c22` |
  | 5 | Digital Green       | `#0f381e` |
  | 6 | Deep Violet         | `#4a154b` |
  | 7 | Vibrant Orange      | `#e67e22` |
  | 8 | Midnight Blue       | `#2c3e50` |
  | 9 | Bright Purple       | `#8e44ad` |
  |10 | Deep Crimson        | `#c0392b` |

- After the 10th background, the palette **loops infinitely** — backgrounds never stop cycling.
- Each transition displays a smooth "New World Unlocked!" milestone notification.

### 📖 How It Works Guide
- An in-game instruction menu accessible from the Main Menu explains the game objective, controls, bomb warnings, and background progression system.

---

## 🚀 Live Demo

▶️ **[Play the Game Now!](https://bricks-game-mmabiaa.vercel.app)**

---

## 📁 File Structure

```
3d-Bricks-Slider-Game/
│
├── index.html                  # Main entry point — game HTML structure & HUD
│
├── src/
│   ├── css/
│   │   └── style.css           # All game styles, animations, menus & HUD
│   │
│   ├── js/
│   │   ├── globalConfig.js     # Global constants: colors, physics, camera, sizes
│   │   ├── state.js            # Global game state, enums, and localStorage high score
│   │   ├── PERF.js             # Performance measurement utilities
│   │   ├── utils.js            # Math, DOM, color, timing, 3D projection helpers
│   │   ├── 3dModels.js         # 3D brick and fragment model definitions
│   │   ├── Entity.js           # Entity class for 3D game objects
│   │   ├── getTarget.js        # Target spawning and object pool logic
│   │   ├── createBurst.js      # Burst/fragment explosion effect on brick smash
│   │   ├── sparks.js           # 2D spark particle system
│   │   ├── hud.js              # HUD rendering: score, cubes left, slow-mo bar, milestone notifications
│   │   ├── menus.js            # Menu rendering and button click handlers
│   │   ├── audioManager.js     # Web Audio API sound manager: preloading, playback, mute toggle
│   │   └── actions.js          # Core game loop, physics tick, milestone & background logic
│   │
│   └── assets/
│       ├── img/                # Game image assets
│       └── sounds/
│           ├── game-start.mp3          # Sound played when starting a game
│           ├── game-over.mp3           # Sound played on game over
│           ├── dynamic-background.mp3  # Sound played on background milestone change
│           └── splash.mp3              # Sound played when a brick is smashed
│
├── feature/                    # Feature specification documents
│   ├── BOMB.md
│   ├── DYNAMIC-BACKGROUND.md
│   ├── HOW IT WORKS.md
│   └── SOUND.md
│
├── Release/
│   └── v2.0.0-release-notes.md   # Official v2.0.0 release notes
│
├── CHANGELOG.md                # Full version history and change log
├── CONTRIBUTION.md             # Contribution guidelines
├── CODE_OF_CONDUCT.md          # Community code of conduct
├── LICENSE                     # MIT License
└── README.md                   # This file
```

---

## 🛠️ Getting Started

### Prerequisites

All you need is a modern web browser. No build tools, no package managers, no dependencies.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mmabiaa/3d-bricks-slider-game.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd 3d-bricks-slider-game
   ```

### Running the Game

Simply open `index.html` directly in your browser, or serve it with any local static server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000` in your browser. 🌐

> **Note:** Running via a local server (rather than opening the file directly) is recommended to ensure audio assets load correctly due to browser security policies.

---

## 🎯 How to Play

| Action | Result |
|---|---|
| Click / Tap **PLAY GAME** | Start a Ranked game |
| Click / Tap **CASUAL MODE** | Start a Casual game |
| **Swipe** a regular brick fast | Score points + splash effect |
| **Swipe** a bomb | 💥 Instant Game Over |
| Miss a brick (Ranked) | ❌ Game Over |
| Miss a brick (Casual) | -25 points |
| Smash a **wireframe** brick | ⚡ Slow-Motion activated |
| Complete a **level** | 🌍 Background changes + sound cue |
| Press **P** | Pause / Resume |
| Click 🔊 / 🔇 | Toggle sound effects |

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a full history of all changes, or read the [v2.0.0 Release Notes](Release/v2.0.0-release-notes.md) for the latest major update.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTION.md](CONTRIBUTION.md) for guidelines on how to submit improvements or bug fixes.

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Special thanks to [Rajtlak](https://github.com/rajtilak-2020) for early contributions and support!
- Inspired by classic fruit-slicing and brick-swiping arcade games.
- Audio engine optimized using the Web Audio API specification.

---

<div align="center">
  Made with ❤️ by <a href="https://mmabiaa.vercel.app">Mmabiaa</a>
</div>
