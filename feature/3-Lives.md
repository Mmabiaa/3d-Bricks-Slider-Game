## New Feature: 3-Lives System

Feature Description: Introduce a 3-lives system that allows players to make up to three mistakes before the game ends. This gives players more opportunities to continue playing and improve their scores.

### Requirements

* Each player starts with 3 lives.

* When a player swipes a bomb, they lose one life instead of the game ending immediately.

* Display the remaining lives clearly on the game HUD (e.g., ❤️❤️❤️).

* Each bomb swipe reduces the life count by one.

* When all 3 lives are lost, trigger Game Over.

* Ensure the life count resets to 3 when a new game starts.

* Keep existing bomb explosion sounds and visual effects.

* Ensure the feature works smoothly with the level display and dynamic backgrounds.

### Acceptance Criteria

* Players begin each game with 3 lives.

* Each bomb hit removes exactly one life.

* Game Over occurs only when all lives are lost.

* The HUD updates immediately after each lost life.

* Lives reset correctly when starting a new game.

Note: This changes the current bomb mechanic from instant Game Over to a life-based system.
