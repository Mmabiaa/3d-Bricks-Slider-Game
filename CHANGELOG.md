# Changelog

All notable changes to the 3D Bricks Slider Game project will be documented in this file.

## [Unreleased]

### Refactored
- **File Modularization**: Refactored the monolithic gameplay architecture into distinct, maintainable modules (`state.js`, `actions.js`, `hud.js`, `globalConfig.js`, etc.). This structural improvement ensures cleaner codebase management and easier integration of new features.

### Added
- **Gameplay Sound Effects System** (from `feature/SOUND.md`):
  - Created a centralized Audio Manager (`audioManager.js`) to handle logic for game sound effects.
  - Implemented core sound cues: a confirmation sound on game start, an explosion/game-over sound, and an environment transition sound at 100-point milestones.
  - Integrated `splash.mp3` audio feedback that fires immediately whenever a regular brick is successfully slashed/smashed.
  - Added an accessible sound toggle button integrated with `localStorage` to save player preferences for enabling or muting audio across sessions.

- **Bomb Mechanic Feature** (from `feature/BOMB.md`):
  - Introduced hazardous Bomb objects that randomly spawn alongside regular score bricks.
  - Added critical game-over mechanics when a player accidentally swipes a bomb.
  - Implemented distinct visual effects (dark color model with spark/explosion animations) and sound effects to differentiate bombs from regular target bricks.
  
- **How It Works Page** (from `feature/HOW IT WORKS.md`):
  - Created a dedicated instruction menu overlay, accessible directly from the Main Menu.
  - Documented the game's objective, premise, and interaction controls for new players.
  - Integrated a prominently visible "Bomb Warning" instructing players to avoid swiping bombs.
  - Included a section detailing the new Dynamic Backgrounds and progression incentives.
  - Added a "Start Playing" button and intuitive navigation back to the main menu without breaking game flow.

- **Dynamic Backgrounds Feature** (from `feature/DYNAMIC-BACKGROUND.md`):
  - Engineered a Dynamic Background System that automatically updates the game environment every 100 points.
  - Crafted distinct, high-contrast color themes (Teal, Blue Night, Cosmic Space Purple, Sunset Red, Digital Green, and Deep Violet) fitting the suggested game environments without hindering readability or clashing with gameplay objects.
  - Added an unobtrusive milestone notification popup (e.g., "100 Points! New World Unlocked!") accompanied by smooth color transitions.
  - Handled progress tracking within ranked mode sessions and ensured the background resets gracefully upon game restarts.

### Fixed
- **Bomb Mechanic**: Resolved an issue where ignoring a bomb and letting it fall offscreen incorrectly resulted in a Game Over sequence. Ignoring bombs now correctly allows gameplay to proceed unaffected.
