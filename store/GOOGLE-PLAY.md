# Crime Grid: Google Play kit

Everything here is ready to copy into the Google Play Console.

## Files
| What | File | Google's requirement |
|---|---|---|
| App icon | `store/app-icon-512.png` | 512×512 PNG |
| Feature graphic | `store/feature-graphic.png` | 1024×500 |
| Phone screenshots | `store/screenshots/1-home.png`, `2-inspector.png`, `3-draft.png`, `4-expert.png`, `5-case-closed.png`, `6-shop.png`, `7-duel.png` | 2–8 images, 1080×1920 |
| Promo video (30 s, silent, vertical) | `promo/crime-grid-30s.mp4` | Play wants a YouTube link, so upload it to YouTube and paste that link; also fine for TikTok, Reels, Shorts |
| Privacy policy URL | https://lamplit-logic.github.io/privacy.html | required |
| The game itself | https://lamplit-logic.github.io/v2/ | the address to package |

## Store listing

**App name** (max 30): `Crime Grid: Murder Puzzles`

**Short description** (max 80):
`Sudoku meets murder mystery. Place the suspects, find the killer. Daily case!`  (77 characters; the limit is 80)
(Do not use competitor names, "Murdoku" or "#1" anywhere in the listing.)

**Full description:**
```
There was a murder. Can you work out who did it?

Crime Grid is a logic puzzle where sudoku meets a murder mystery. Every suspect gives you a clue: "She was sitting on a chair", "He was beside a plant", "She was in a higher row than Ben". Place everyone on the crime scene so each person has their own row and column, then name the killer: the one suspect who was alone with the victim.

FEATURES
• Unlimited cases, from a gentle 4×4 Rookie case to a brutal 10×10 Extreme case with 9 suspects
• A new Daily Case every day, the same for everyone, with a streak to keep alive
• Every case has exactly one solution, found by logic. Bigger cases teach you the "what if?" trick
• 9 hand-drawn scenes: a mansion, a ship, a forest, a space station, a museum, a night train, a circus, a castle and a ski lodge
• Draft mode to pencil in possibilities, just like on paper
• Collect coins and unlock skins for every suspect, from cute pets to noir gangsters, plus premium packs
• Add friends with a short detective ID and race them head to head in a live duel, with optional coin stakes
• Daily streak with streak freezes, and a calendar reminder if you want one
• Smart help when you're stuck: an extra clue about the whole scene, without spoiling the answer
• A friendly step-by-step tutorial for first-time detectives
• Works offline. No account, no ads, no tracking (friends and duels are optional and need internet)

Grab a cup of tea, sharpen your pencil, and start investigating.
```

**Category:** Games → Puzzle
**Tags:** Puzzle, Logic, Brain games, Detective, Daily puzzle

## Data safety form (online friends and duels are optional, so answer "yes")
Details and the reasoning are in `store/MULTIPLAYER-SETUP.md`. Short version:
- Does your app collect or share any of the required user data types? **Yes, collected** (only when the player opens Friends or starts a duel); **not shared** (Firebase acts as our processor).
- Data types: **Personal info → Name** (the nickname, optional, free text); **Device or other IDs → User IDs** (anonymous Firebase ID, game ID, detective ID); **App activity → Other actions** (level, solved count, duel progress and time).
- Purpose: **App functionality** only. No advertising, no analytics.
- Encrypted in transit: **Yes**.
- Deletion: **Yes**, inside the app (Friends → "Delete my online ID") and by email (gamezsm20@gmail.com).
- Purchases are handled by Google Play. Nothing about location, contacts or photos is collected.

## Content rating questionnaire (IARC)
- Category: Game / puzzle
- Violence: the theme is a murder mystery, but there's **no depiction of violence**. Victims appear as cartoon faces with "X" eyes, and there's no blood or weapons in use. Answer honestly that the theme is a fictional crime.
- No sexual content, strong language or drugs.
- **Users can interact: yes** (a friend or duel opponent sees your nickname; there is no chat). Answer the questionnaire carefully about "digital purchases: yes".
- **Coin stakes in duels:** coins are in-game only and cannot be cashed out, so this is not gambling. If the questionnaire asks about simulated gambling, answer that there is no real-money gambling; if in doubt, ask for a review rather than guess.
- Expected result: Teen / PEGI 12 range is plausible. That is fine for a 13+ audience.

## Target audience
13 and older (choosing under 13 brings the "Families" policy requirements).

---

## Videos for TikTok / Instagram Reels
| File | Idea | Suggested caption |
|---|---|---|
| `promo/crime-grid-can-you-solve.mp4` | Easy case, countdown, full solution | `Can you solve this murder before the timer? 🔍🔪 #puzzle #murdermystery #sudoku #logicpuzzle #braingames` |
| `promo/crime-grid-who-did-it.mp4` | 10-second challenge, no answer | `Only real detectives get this one. Who did it? Comment A, B, C or D 👇 #whodunnit #puzzlegame #detective #braintest` |
| `promo/crime-grid-extreme.mp4` | Extreme level teaser | `Level EXTREME: 9 suspects, 100 squares, 1 killer. Would you even try? 💀 #puzzle #logic #hardpuzzle #mystery` |

**Answer to the "Who did it?" video:** D, Diego. Post it in a pinned comment a day later, or in a follow-up video.

Tips:
- Add a trending sound inside TikTok/Instagram (the videos are silent on purpose, so you can choose).
- Pin a comment with the link, and put the link in your bio.
- Post the daily case regularly: "Today's case, can you solve it?" is a series people can follow.

---

## Packaging the web game as an Android app (PWABuilder)
1. Open https://www.pwabuilder.com and enter `https://lamplit-logic.github.io/v2/`.
2. Choose **Package for stores → Android → Generate**. Keep the suggested package ID or set one like `io.github.lamplitlogic.crimegrid`.
3. Download the zip. It contains the `.aab` file (upload this to Google Play), a **signing key** (keep it safe: you need it for every update) and an `assetlinks.json` file.
4. **Remove the browser bar (optional, recommended):** Android only trusts the app fully when `assetlinks.json` is published at `https://lamplit-logic.github.io/.well-known/assetlinks.json`. That address belongs to a repository named exactly `lamplit-logic.github.io`. Create it on GitHub, then the file can be added there. Without it the game still works, but it shows a small address bar at the top.

---

## In-app purchases (real money)
The game already contains the purchase code (Google Play Billing through the Digital Goods API). It switches on by itself when the game runs as the Google Play app, and shows prices in the player's local currency. To make it live:

1. **Payments profile:** Play Console → Settings → Payments profile (a merchant account, 18+; Google pays out monthly).
2. **Create the products:** Play Console → your app → Monetize → Products → **In-app products** → Create. Use exactly these IDs:

| Product ID | What the player gets | Suggested price |
|---|---|---|
| `coins_500` | 500 coins | $0.99 |
| `coins_1200` | 1,200 coins | $1.99 |
| `coins_3000` | 3,000 coins | $3.99 |
| `coins_7500` | 7,500 coins | $7.99 |
| `skin_masquerade` | Masquerade Ball skin pack | $1.99 |
| `skin_cyber` | Cyber Agents skin pack | $2.99 |
| `skin_deco` | Jazz Age skin pack | $2.99 |
| `skin_steam` | Steampunk Guild skin pack | $2.99 |
| `skin_gothic` | Haunted Gala skin pack | $1.99 |
| `remove_ads` (create it only in the release that has ads) | Removes ads for good (one-time, non-consumable: do NOT make it a subscription) | $3.99 |

3. **Package with billing on:** when packaging on PWABuilder, turn on the Google Play Billing option in the Android settings, so the app can talk to Play Billing.
4. **Test before going live:** Play Console → Settings → License testing: add your Gmail. Purchases made with that account in the testing track are free test purchases.

Notes:
- Coins are consumable (they can be bought again). Skin packs are bought once and come back automatically on a new phone.
- Purchases are checked on the device only. For a small game this is normal; a server check can be added later if cheating ever matters.
- Purchases on iPhone need a native build with Apple's in-app purchase system, which is a separate project.
