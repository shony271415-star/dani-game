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

## Two editions
- `/` (index.html): the original edition, emoji graphics.
- `/v2/`: the illustrated edition. All objects, scenes and characters are original SVG artwork drawn in `art.js`, with textured floors. Both editions share `engine.js` and `app.js` (and progress on the same device).

## Daily case and tutorial
- **Daily Case**: one case per day, the same for everyone (seeded by the date), harder towards the weekend, with a streak counter.
- **Tutorial**: a hand-made 4×4 case that walks a beginner through the logic step by step.

## Coming back every day
- **Journey**: one big Play button, numbered levels that slowly get harder, boss levels every 5.
- **Coins**: earned by solving (double for the daily case), spent on help.
- **Daily gift**: grows over a 7-day streak.
- **Daily calendar**: a trophy for solving every daily case of a month.
- **Trophies**: 12 achievements, 50 coins each.
- **Coin shop**: skin packs for every suspect and victim, from Pet Detectives (300 coins) to Neon Legends (4,000); two premium packs (Masquerade Ball, Cyber Agents) and coin bundles for real money through Google Play Billing (see `store/GOOGLE-PLAY.md`).
- **Feel**: sounds, vibration, confetti, coin count-up (sound can be turned off).

## Tools
- **Place**: pick a suspect, tap a square.
- **Draft**: pencil in every square where a suspect *might* be (small colored letters), erase as you rule them out.
- **Mark**: cross out squares nobody can use.
- **Help**: an extra clue about the whole scene ("only one suspect sat on a chair", "every room had someone in it"), chosen to be useful at your current point; or check your placements; or, as a last resort, reveal a suspect.

## Scenes
Mansion, ship, forest, space station, museum, night train, circus, castle and ski lodge, each with its own areas and objects.

## Files
- `engine.js`: builds cases, proves each has exactly one solution and grades its difficulty.
- `worker.js`: runs the engine in the background so the screen never freezes.
- `app.js` / `index.html`: the game.
- `manifest.webmanifest`, `sw.js`, `icons/`: install as a phone app, works offline.

Progress and the player's name are saved on the device.

## Printable casebook
24 cases (6 Inspector, 12 Expert, 6 Extreme) that never appear in the app, black & white and light on ink.
- `casebook-print.pdf`: **single-sided** A4 landscape. Fold every sheet in half with the print on the outside (right half to the front), keep them in order, stack and bind along the fold. Opens as an A5 booklet with each case on a two-page spread.
- `casebook-read.pdf`: one whole case per A4 sheet, for a screen or loose sheets.
- `casebook-booklet.pdf`: double-sided version (flip on short edge), fold the whole stack once and staple on the fold.

Rebuild with `node tools/make-booklet.js . "Name"`.
