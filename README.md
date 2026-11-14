# 🕵️ Mystery Grid

Sudoku meets murder mystery. Place every suspect on the crime scene using their clues, then work out who was alone with the victim.

## Rules
- Every person was in a different row and a different column.
- Some objects can be stood on (chairs, beds, rugs, logs, crates…), others can't (tables, plants, statues…).
- The victim (always a name starting with **V**) is in the last remaining square.
- Whoever was alone with the victim in the same area is the murderer.

## Levels
| Level | Grid | Suspects |
|---|---|---|
| Rookie | 4×4 | 3 |
| Detective | 5×5 | 4 |
| Inspector | 6×6 | 5 |
| Expert | 8×8 | 7 |
| Extreme | 10×10 | 9 |

Suspects are named in alphabetical order (A, B, C…). Expert and Extreme puzzles are graded by a logic solver: they can't be finished by simple elimination and need "what if this person were here?" reasoning.

## Scenes
Mansion, ship, forest, space station, museum, night train, circus, castle and ski lodge, each with its own areas and objects.

## Files
- `engine.js`: builds cases, proves each has exactly one solution and grades its difficulty.
- `worker.js`: runs the engine in the background so the screen never freezes.
- `app.js` / `index.html`: the game.
- `manifest.webmanifest`, `sw.js`, `icons/`: install as a phone app, works offline.

Progress and the player's name are saved on the device.
