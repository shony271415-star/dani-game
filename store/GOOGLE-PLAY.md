# Mystery Grid: Google Play kit

Everything here is ready to copy into the Google Play Console.

## Files
| What | File | Google's requirement |
|---|---|---|
| App icon | `store/app-icon-512.png` | 512×512 PNG |
| Feature graphic | `store/feature-graphic.png` | 1024×500 |
| Phone screenshots | `store/screenshots/1-home.png` … `5-case-closed.png` | 2–8 images, 1080×1920 |
| Privacy policy URL | https://shony271415-star.github.io/dani-game/privacy.html | required |
| The game itself | https://shony271415-star.github.io/dani-game/v2/ | the address to package |

## Store listing

**App name** (max 30): `Mystery Grid: Murder Puzzles`

**Short description** (max 80):
`Sudoku meets murder mystery. Place the suspects, find the killer. New case daily!`

**Full description:**
```
There was a murder. Can you work out who did it?

Mystery Grid is a logic puzzle where sudoku meets a murder mystery. Every suspect gives you a clue: "She was sitting on a chair", "He was beside a plant", "She was in a higher row than Ben". Place everyone on the crime scene so each person has their own row and column, then name the killer: the one suspect who was alone with the victim.

FEATURES
• Unlimited cases, from a gentle 4×4 Rookie case to a brutal 10×10 Extreme case with 9 suspects
• A new Daily Case every day, the same for everyone, with a streak to keep alive
• Every case has exactly one solution, reachable by pure logic. No guessing
• 9 hand-drawn scenes: a mansion, a ship, a forest, a space station, a museum, a night train, a circus, a castle and a ski lodge
• Draft mode to pencil in possibilities, just like on paper
• Smart help when you're stuck: an extra clue about the whole scene, without spoiling the answer
• A friendly step-by-step tutorial for first-time detectives
• Works offline. No account, no ads, no tracking

Grab a cup of tea, sharpen your pencil, and start investigating.
```

**Category:** Games → Puzzle
**Tags:** Puzzle, Logic, Brain games, Detective, Single player

## Data safety form (all answers: nothing is collected)
- Does your app collect or share any of the required user data types? **No**
- Is all user data encrypted in transit? **Yes** (nothing personal is sent; the files load over HTTPS)
- Do you provide a way for users to request that their data is deleted? Not needed (no data collected). Progress is stored only on the device.

## Content rating questionnaire (IARC)
- Category: Game / puzzle
- Violence: the theme is a murder mystery, but there's **no depiction of violence**. Victims appear as cartoon faces with "X" eyes, and there's no blood or weapons in use.
- No sexual content, language, drugs, gambling, user interaction or sharing of location.
- Expected result: a low age rating (for example "Everyone 10+" / PEGI 7–12 range).

## Target audience
13 and older (choosing under 13 brings the "Families" policy requirements).

---

## Videos for TikTok / Instagram Reels
| File | Idea | Suggested caption |
|---|---|---|
| `promo/mystery-grid-can-you-solve.mp4` | Easy case, countdown, full solution | `Can you solve this murder before the timer? 🔍🔪 #puzzle #murdermystery #sudoku #logicpuzzle #braingames` |
| `promo/mystery-grid-who-did-it.mp4` | 10-second challenge, no answer | `Only real detectives get this one. Who did it? Comment A, B, C or D 👇 #whodunnit #puzzlegame #detective #braintest` |
| `promo/mystery-grid-extreme.mp4` | Extreme level teaser | `Level EXTREME: 9 suspects, 100 squares, 1 killer. Would you even try? 💀 #puzzle #logic #hardpuzzle #mystery` |

**Answer to the "Who did it?" video:** D, Diego. Post it in a pinned comment a day later, or in a follow-up video.

Tips:
- Add a trending sound inside TikTok/Instagram (the videos are silent on purpose, so you can choose).
- Pin a comment with the link, and put the link in your bio.
- Post the daily case regularly: "Today's case, can you solve it?" is a series people can follow.

---

## Packaging the web game as an Android app (PWABuilder)
1. Open https://www.pwabuilder.com and enter `https://shony271415-star.github.io/dani-game/v2/`.
2. Choose **Package for stores → Android → Generate**. Keep the suggested package ID or set one like `io.github.shony271415.mysterygrid`.
3. Download the zip. It contains the `.aab` file (upload this to Google Play), a **signing key** (keep it safe: you need it for every update) and an `assetlinks.json` file.
4. **Remove the browser bar (optional, recommended):** Android only trusts the app fully when `assetlinks.json` is published at `https://shony271415-star.github.io/.well-known/assetlinks.json`. That address belongs to a repository named exactly `shony271415-star.github.io`. Create it on GitHub, then the file can be added there. Without it the game still works, but it shows a small address bar at the top.
