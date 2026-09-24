## Feature Request: Cube-Based Level Progression System

### Overview

Replace the current **score-based level progression** with a **cube-based progression system**.

Currently, the game advances to the next level after every **100 points**, which is approximately equivalent to 10 cubes smashed. The new system will determine level progression directly from the number of cubes the player successfully smashes.

The existing **dynamic background system should remain unchanged**. Whenever the player advances to a new level, the existing background-change behavior should execute exactly as it currently does.

### New Level Progression

The game will use a repeating 5-level progression cycle:

| Level    | Cubes Required |
| -------- | -------------: |
| Level 1  |             10 |
| Level 2  |             15 |
| Level 3  |             20 |
| Level 4  |             25 |
| Level 5  |             30 |
| Level 6  |             10 |
| Level 7  |             15 |
| Level 8  |             20 |
| Level 9  |             25 |
| Level 10 |             30 |
| Level 11 |             10 |
| ...      |         Repeat |

The progression pattern is:

**10 → 15 → 20 → 25 → 30 → repeat**

### Functional Requirements

1. **Replace score-based level progression**

   * Remove the current logic where every 100 points triggers a level increase.
   * Level progression should be based on successfully smashed cubes.

2. **Implement the repeating cube requirement**

   * Levels 1–5 use 10, 15, 20, 25, and 30 cubes respectively.
   * Level 6 restarts the cycle at 10 cubes.
   * Continue repeating this pattern indefinitely.

3. **Track cubes smashed**

   * Every successfully smashed cube should count toward the current level's requirement.
   * Bombs should not count as successfully smashed cubes.
   * Missed/off-screen cubes should not count toward progression.

4. **Display cubes remaining**

   * Add a clear **Cubes Left** indicator to the HUD.
   * Example:
     **LEVEL 3**
     **CUBES LEFT: 12**
   * The counter should update immediately whenever a cube is successfully smashed.

5. **Level completion**

   * When the required number of cubes for the current level has been smashed:

     * Advance to the next level.
     * Calculate the new cube requirement based on the 5-level cycle.
     * Reset the **Cubes Left** counter for the new level.
     * Trigger the existing level-up notification.
     * Trigger the existing dynamic background change.

6. **Preserve the existing dynamic background system**

   * Do not redesign or rewrite the dynamic background functionality.
   * The background should continue changing whenever a new level is reached.
   * Existing transitions, animations, sounds, and background selection behavior should remain intact.

7. **Preserve the existing score system**

   * Score calculation should continue working as it currently does.
   * Score should no longer determine when the player advances to a new level.
   * Score and level progression should operate independently.

8. **Preserve existing gameplay systems**

   * Do not break the existing:

     * 3-lives system
     * Bomb mechanic
     * Audio system
     * Level-up notifications
     * Dynamic backgrounds
     * Game-over behavior
     * HUD functionality

9. **Reset behavior**

   * Starting a completely new game should reset:

     * Level → **1**
     * Cubes required → **10**
     * Cubes left → **10**
     * Lives → **3**
     * Score → existing starting value

### Example Gameplay Flow

```text
Game Starts
↓
Level 1
10 Cubes Left
↓
Player smashes 10 cubes
↓
Level 2 Unlocked
15 Cubes Left
↓
Player smashes 15 cubes
↓
Level 3 Unlocked
20 Cubes Left
↓
Player smashes 20 cubes
↓
Level 4 Unlocked
25 Cubes Left
↓
Player smashes 25 cubes
↓
Level 5 Unlocked
30 Cubes Left
↓
Player smashes 30 cubes
↓
Level 6 Unlocked
10 Cubes Left
↓
Repeat
```

### HUD Example

The player should always be able to see their current progress:

**LEVEL 3**
**CUBES LEFT: 12**
**LIVES: ❤️ ❤️ ❤️**
**SCORE: 145**

### Acceptance Criteria

* [ ] Level progression is no longer triggered by score.
* [ ] Level progression is triggered by cubes successfully smashed.
* [ ] Levels 1–5 require 10, 15, 20, 25, and 30 cubes respectively.
* [ ] Level 6 restarts the requirement at 10 cubes.
* [ ] The 10/15/20/25/30 pattern continues indefinitely.
* [ ] Cubes Left is visible and updates accurately in real time.
* [ ] Successfully smashed cubes reduce Cubes Left by one.
* [ ] Bombs and missed cubes do not reduce Cubes Left.
* [ ] The existing dynamic background change still occurs on every level upgrade.
* [ ] Existing score calculation remains unchanged.
* [ ] Existing lives, bombs, audio, and game-over functionality remain unaffected.
* [ ] Starting a new game correctly resets the progression to Level 1 with 10 Cubes Left.
* [ ] The implementation does not introduce regressions to existing production functionality.
