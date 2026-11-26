# Crime Grid: Google Play launch checklist

Written 26 November 2026 for a new PERSONAL developer account. Plain English, in the order you do things.

**Who does it**
- **[DEV]** = the developer, in Play Console or on a phone. No one else can do it.
- **[AI]** = the assistant, in the repo (only after you ask; nothing in the repo was changed except this file).
- **[UNVERIFIED]** = I could not confirm this on Google's own page. Check it on screen before you rely on it.

**Honest note on sources.** In this session I could only reach web search summaries. Google's help pages (support.google.com), developer.chrome.com and several blogs could not be opened directly, so anything that comes from a search summary or a third-party blog is marked. Button names in Play Console change often; trust the screen over this file.

Main sources:
- Closed-test rule (Google): https://support.google.com/googleplay/android-developer/answer/14151465
- Closed-test explainers (third party): https://dev.to/vantico/google-plays-closed-test-12-testers-14-days-no-gaps-what-actually-counts-5c1i , https://ontest.app/blog/google-play-12-testers-14-days-requirement-explained , https://medium.com/@kefayatkhadem/google-play-closed-testing-in-2026-the-full-path-from-12-testers-to-production-access-1f48b7833671
- Trader status (Google): https://support.google.com/googleplay/android-developer/answer/17594752 ; third party: https://ivryn.com/guides/google-play-trader-status-declaration/ , https://12testerscommunity.com/blog/google-play-trader-status-declaration-2027 , https://wisevoter.com/world/2026/11/25/google-play-trader-developer-contact-disclosure-2027
- Store listing assets (Google): https://support.google.com/googleplay/android-developer/answer/9866151
- Target audience and content (Google): https://support.google.com/googleplay/android-developer/answer/9867159
- In-app product types (Google): https://support.google.com/googleplay/android-developer/answer/14590082 , create a product: https://support.google.com/googleplay/android-developer/answer/1153481
- License testing (Google): https://support.google.com/googleplay/android-developer/answer/6062777
- Payments profile and tax: https://support.google.com/googleplay/android-developer/answer/7163598 , https://support.google.com/paymentscenter/answer/10349995
- User-generated content policy (Google): https://support.google.com/googleplay/android-developer/answer/9876937 , https://support.google.com/googleplay/android-developer/answer/12923286
- Account/data deletion (Google): https://support.google.com/googleplay/android-developer/answer/13327111
- Gambling policy (Google): https://support.google.com/googleplay/android-developer/answer/9877032
- Incentivized installs/ratings: https://android-developers.googleblog.com/2017/06/google-plays-policy-on-incentivized.html
- Target API level (Google): https://support.google.com/googleplay/android-developer/answer/11926878 ; https://developer.android.com/google/play/requirements/target-sdk
- Android developer verification (June 2026): https://android-developers.googleblog.com/2026/06/android-developer-verification.html
- TWA + Play Billing: https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing
- Digital Goods bug on some Samsung phones: https://github.com/pwa-builder/pwabuilder/issues/6151
- Digital Asset Links / Play signing key: https://12-testers-for-14-days.github.io/guides/google-play-app-signing-sha256-fingerprint/ , https://primetestlab.com/blog/assetlinks-sha256-play-app-signing-twa

---

## 0. Problems found in the repo files (fix before pasting anything)

| # | Problem | Fix | Who |
|---|---|---|---|
| 1 | `GOOGLE-PLAY.md` short description is **81 characters**; the limit is 80. | Use: `Sudoku meets murder mystery. Place the suspects, find the killer. Daily case!` (77 characters). | [AI] edit later; [DEV] paste |
| 2 | `privacy.html` opens with "works entirely on your device, without collecting information" and "Almost nothing", but Friends and duels send data to Firebase. Google compares the policy with your Data safety form. | Reword the first two paragraphs to say: "Offline play collects nothing. If you open Friends or start a duel, the data listed below is sent to Google Firebase." | [AI] edit later |
| 3 | `privacy.html` has no section titled for deletion requests that a reviewer can find by name, and no statement of the developer name exactly as on the store listing. | Add a heading "Delete your data" with: in-app path (Friends, Delete my online ID), the email request, and the developer name exactly as shown on Play. Use this page's URL as the deletion web link in Data safety. | [AI] edit later |
| 4 | The privacy page says the publisher is "Lamplit Logic Games"; your personal account name may be your legal name. | Decide the developer name (see section 1, step 4), then make the privacy page, listing and account name match. | [DEV] decide, [AI] edit |
| 5 | `GOOGLE-PLAY.md` lists screenshots as "1-home.png ... 7-duel.png" but real names are `1-home, 2-inspector, 3-draft, 4-expert, 5-case-closed, 6-shop, 7-duel`. All are 1080x1920, fine. | Use the real names in section 3. | none |
| 6 | The promo video is an `.mp4`. Play wants a **YouTube link**, not a file. | Upload `promo/crime-grid-30s.mp4` to YouTube as Public or Unlisted, not age-restricted, then paste the link. Skip the video if in doubt; it is optional. | [DEV] |
| 7 | `remove_ads` is in the product table, but v1 has no ads (`ADS_ON = false`) and the button is hidden. A paid product that gives nothing visible is a refund and review risk. | **Do not create `remove_ads` for v1.** Create it when the ad release ships. Product IDs can never be reused or edited once created, so there is no rush. | [DEV] decide |
| 8 | Full description says "optional coin stakes" in duels. This word choice invites the gambling question. | Remove "with optional coin stakes" from the listing text (see section 3). Keep the feature decision in section "Decisions". | [DEV] decide |
| 9 | No in-app **report** or **block** for other players' nicknames (grep of `app.js` and `net.js` found none). Nicknames are free text and visible to friends and duel opponents. | See risk 3 below. Needs code before production. | [AI] build later |
| 10 | `HANDOFF.md` says the product is Hebrew-first for the owner, but the console and store listing must be in the languages you add. | Listing is written in English below; Hebrew, Russian, Spanish translations of the listing are not in the repo. | [AI] translate later |
| 11 | `MULTIPLAYER-SETUP.md` section 5 (API key restricted to websites) is flagged as untested for the TWA. A TWA sends requests from the web origin, so it should work, but test on a real phone. | Test in the closed test (section 6, day 0). | [DEV] |
| 12 | Package name in `GOOGLE-PLAY.md` is only a suggestion. It can never change after upload. | Use `io.github.lamplitlogic.crimegrid` (see section 2, step 3) unless you own a better domain. | [DEV] |

---

## 1. Before you start

1. **[DEV] Confirm your account is fully ready.** Identity verification, phone and email verified, Play Console home loads. Personal accounts created after 13 Nov 2023 must pass a closed test before production (details in section 6). Source: Google closed-test page above.
2. **[DEV] Decide the developer name and contact details** (they become public, see step 5). Decision needed.
3. **[DEV] Create a dedicated support email** (do not use a personal one). The repo currently uses `gamezsm20@gmail.com` in the privacy policy and Data safety text. If you keep it, accept that it is public. If you switch, **[AI]** updates `privacy.html` and `GOOGLE-PLAY.md`.
4. **[DEV] Developer name.** Pick one name: either your legal name or a brand ("Lamplit Logic Games"). [UNVERIFIED] whether a brand name is allowed to differ from the legal name on a personal account without extra proof; check the Account details page.
5. **[DEV] Trader (EU Digital Services Act) declaration.** Console: Settings, Developer account, Account details (or the banner that appears). What I found (secondary sources, partly conflicting):
   - You sell in-app purchases for money, so you are almost certainly a **trader** (commercial activity). Declaring "not a trader" while selling is a compliance risk. This is my reading, not Google's wording.
   - Declaration deadline reported as **1 February 2027**, with public display of trader contact details reported from **1 March 2027**. Sources disagree on whether the display is EU-only or worldwide. [UNVERIFIED]
   - For a personal account, Google's help page says you must give a **phone number** that will be shown on Google Play, and secondary sources say your **address** and **email** are shown as well. The public name is your developer name. Google says the trader declaration is separate from identity verification.
   - Practical rule: use details you are willing to make public. If you work from home, consider a PO box or a virtual business address if Google accepts it. [UNVERIFIED]
6. **[DEV] Payments profile and tax.** Console: Settings, Payments profile (a merchant account). Needed before you can sell. Outside the US you submit **Form W-8BEN** inside the payments profile; the legal name must match your ID; without tax info Google may withhold tax on US sales (the 30% figure came from a different Google program, so treat it as indicative). Also enter your bank account for payouts. Sources: Google payments pages above. Whether Israel gets a special treaty rate is [UNVERIFIED]; ask an accountant.
7. **[DEV] Make a Google Group or list of testers now** (section 6). You need at least 12 real people who use Android and have Gmail addresses. Start recruiting today; it is the slowest part.
8. **[DEV] Get a second Android phone or the one you will test on** and a Gmail address for license testing (section 5).
9. **[DEV] Fix the GitHub Pages root issue** (needed for the address bar to disappear):
   - Create a new public repo named exactly `lamplit-logic.github.io`.
   - Add `.well-known/assetlinks.json` (content comes from PWABuilder, then you add the Play signing fingerprint, section 2 step 9) and an empty file called `.nojekyll`, otherwise GitHub's site builder hides folders that start with a dot. [UNVERIFIED] for the `.nojekyll` detail (from memory), check by opening the file URL in a browser.
   - The file must open at `https://lamplit-logic.github.io/.well-known/assetlinks.json` with HTTP 200, as JSON, with no redirect. Source: assetlinks guides above.
   - [AI] can write these files into the new repo if you give access.
10. **[DEV] Decide the open questions** in the "Decisions" box at the end.

---

## 2. Create the app and build the package

1. **[DEV] Console: All apps, Create app.**
   - App name: `Crime Grid: Murder Puzzles` (26 of 30 characters)
   - Default language: English (United States)
   - App or game: **Game**
   - Free or paid: **Free** (you cannot switch a free app to paid later; in-app purchases are fine on free)
   - Accept the declarations (Developer Program Policies, US export laws).
2. **[DEV] Package the game with PWABuilder** (https://www.pwabuilder.com): enter `https://lamplit-logic.github.io/v2/`, then Package for stores, Android.
3. **[DEV] Fill the Android options**:
   - Package ID: `io.github.lamplitlogic.crimegrid` (permanent)
   - App name: `Crime Grid`
   - Version: 1 / version name 1.0.0 (every new upload needs a higher version code)
   - Host: `lamplit-logic.github.io`; Start URL: `/v2/`
   - Display mode: standalone; orientation: portrait
   - **Google Play Billing: ON** (this also sets the right billing flags)
   - **Signing key:** let PWABuilder generate it, then **download and back up the keystore and its password in two places**. Losing it means you cannot update the app unless Play App Signing is enrolled (it is by default for new apps).
   - **Target API level:** Google says new apps and updates must target **Android 16 (API 36)** or higher (deadline 31 Aug 2026, already passed). Check in the generated project's `build.gradle` / PWABuilder summary that targetSdk is 36. If PWABuilder gives a lower number, upload will be rejected. [UNVERIFIED what PWABuilder's current default is.]
4. **[DEV] Download the zip** and keep: `.aab` (upload), signing key file and password, `assetlinks.json`.
5. **[DEV] Upload the .aab to a Closed testing track** (section 6), **not** to production. Opt in to Play App Signing when asked.
6. **[DEV] Get the Play signing fingerprint**: Console, Test and release, App integrity (Setup, App integrity), App signing tab, copy **SHA-256 certificate fingerprint** (the one under "App signing key certificate", NOT the upload key).
7. **[DEV or AI] Put both fingerprints** (upload key from PWABuilder and Play signing key) into the `assetlinks.json` in the user-site repo, commit, and open the URL to confirm it shows up. Wrong or missing fingerprint = a visible browser bar at the top of the app and sometimes broken Billing. Source: Digital Asset Links guides above.
8. **[DEV] Install the app from the test link and check**: no address bar, game loads, Friends screen works (Firebase API key restriction, MULTIPLAYER-SETUP section 5), Shop shows local prices.

---

## 3. Store listing

Console: Grow, Store presence, Main store listing (path may be "Store settings / Main store listing"). [UNVERIFIED exact menu names]

| Field | Value to paste |
|---|---|
| App name (max 30) | `Crime Grid: Murder Puzzles` |
| Short description (max 80) | `Sudoku meets murder mystery. Place the suspects, find the killer. Daily case!` |
| Full description (max 4000) | The block below |
| App icon | `store/app-icon-512.png` (512x512 PNG, max 1 MB). Google lists 32-bit PNG with alpha; the file is RGB with no alpha, which normally still uploads. If the console complains, re-export. |
| Feature graphic | `store/feature-graphic.png` (1024x500, JPEG or 24-bit PNG, no alpha). **Required** to publish. |
| Phone screenshots | `store/screenshots/1-home.png`, `2-inspector.png`, `3-draft.png`, `4-expert.png`, `5-case-closed.png`, `6-shop.png`, `7-duel.png` (all 1080x1920). Google accepts up to 8, JPEG or PNG, sides between 320 and 3840 px. The minimum is 2 per Google's help, though one guide says 4; upload all 7. Do not show device frames or store badges. |
| 7-inch and 10-inch tablet screenshots | Optional for now. Skipping them is allowed but can reduce tablet visibility. [UNVERIFIED current rules] |
| Promo video | YouTube link (see problem 6). Optional. |
| Category | Game, Puzzle |
| Tags | Puzzle, Logic, Brain games, Detective (pick from the console's list; it may not accept your own text) |
| Contact email | your support email (public) |
| Contact website | `https://lamplit-logic.github.io/v2/` |
| Contact phone | optional; but required for trader display (section 1 step 5) |

**Full description (fixed: stake wording removed, offline claim kept accurate):**
```
There was a murder. Can you work out who did it?

Crime Grid is a logic puzzle where sudoku meets a murder mystery. Every suspect gives you a clue: "She was sitting on a chair", "He was beside a plant", "She was in a higher row than Ben". Place everyone on the crime scene so each person has their own row and column, then name the killer: the one suspect who was alone with the victim.

FEATURES
• Unlimited cases, from a gentle 4x4 Rookie case to a brutal 10x10 Extreme case with 9 suspects
• A new Daily Case every day, the same for everyone, with a streak to keep alive
• Every case has exactly one solution, found by logic. Bigger cases teach you the "what if?" trick
• 9 hand-drawn scenes: a mansion, a ship, a forest, a space station, a museum, a night train, a circus, a castle and a ski lodge
• Draft mode to pencil in possibilities, just like on paper
• Collect coins and unlock skins for every suspect, from cute pets to noir gangsters, plus premium packs
• Add friends with a short detective ID and race them head to head in a live duel
• Daily streak with streak freezes, and a calendar reminder if you want one
• Smart help when you're stuck: an extra clue about the whole scene, without spoiling the answer
• A friendly step-by-step tutorial for first-time detectives
• Works offline. No account, no ads, no tracking. Friends and duels are optional and need internet.

Optional in-app purchases: coin packs and skin packs. Game coins have no cash value.

Grab a cup of tea, sharpen your pencil, and start investigating.
```
Rules: no competitor names ("Murdoku"), no "#1", no "download and get coins", no asking for ratings (Google's incentivized-install policy; see risks).

**Translations [AI later, DEV pastes]:** add Hebrew (he), Russian (ru), Spanish (es) listings under "Manage translations". Each needs name (30), short description (80) and full description. Not in the repo yet. Screenshots in other languages are optional.

**Listing locale note:** the game UI is already localised in all four languages, so declaring them in the listing is accurate.

---

## 4. Content and policy forms

Console: Policy and programs, App content (a list of tasks). Order that works: Privacy policy, App access, Ads, Content rating, Target audience, Data safety, then the rest. Google says Target audience needs the ads declaration, app access and privacy policy done first.

1. **[DEV] Privacy policy URL:** `https://lamplit-logic.github.io/privacy.html`. Must open without login and be consistent with Data safety. Do the privacy.html edits (problems 2, 3, 4) before submitting for production.
2. **[DEV] App access:** "All functionality is available without special access" (no login). Add a note: "Friends and duels need internet; an anonymous sign-in happens automatically; no credentials required."
3. **[DEV] Ads:** **No, my app does not contain ads.** (v1 has `ADS_ON = false`.) When you ship ads or the rewarded-video bridge, change this and the Data safety form first.
4. **[DEV] Content rating (IARC questionnaire).** Email: your support email; category: **Game**. Answers:
   - Violence: the theme is a fictional murder mystery, with no depiction of violence (cartoon faces, no blood, no weapons used). Answer truthfully; "references to crime" may raise the rating. Expect Teen/PEGI 12 or lower.
   - Sexual content, profanity, drugs, fear: No.
   - **Users can interact / share info:** Yes (opponent sees a nickname; no chat).
   - **Digital purchases:** Yes.
   - **Gambling:** answer No real-money gambling, and answer "simulated gambling" carefully. See risk 1. If the form asks whether users can wager virtual currency/items on outcomes, the honest answer for duel stakes is yes, and the rating may rise. Decide this before you fill the form (Decisions box).
   - Save, then read the resulting ratings. [UNVERIFIED] exact question wording.
5. **[DEV] Target audience:** pick **13-15, 16-17, 18+** (nothing below 13). Answer "Does the app appeal to children?" **No**. Do not use cartoons-for-kids marketing. Google may check your declared audience against listing images and wording (Google target-audience page above). The pet and clown skins and cartoon art are a mild risk; keep marketing text adult/teen.
   - If you pick any age group under 13, Families Policy applies (ads SDK rules, no personal data, etc.) and your design is not set up for it.
6. **[DEV] Data safety.** Based on `GOOGLE-PLAY.md` and `MULTIPLAYER-SETUP.md`, with corrections:
   - Collects data: **Yes**. Shared with third parties: **No** (Firebase is a processor; the console guide decides, [UNVERIFIED]).
   - Data types collected:
     - **Personal info, Name:** the nickname (free text). Mark **optional**.
     - **App info and performance:** none.
     - **Device or other IDs:** anonymous Firebase user ID, detective ID, random game ID.
     - **App activity, Other actions:** level, solved cases, duel progress, finishing time, hints used.
     - Purchases: Play handles them; no purchase history is stored by you.
   - Purpose: **App functionality** only. No advertising, no analytics, no personalization.
   - Encrypted in transit: **Yes**.
   - Users can request deletion: **Yes**. In-app: Friends, Delete my online ID. Web link: the new "Delete your data" section of the privacy page (problem 3). Email as backup.
   - Retention note: profile is **stored** until deleted or about six months unused (not "ephemeral"); duel data is cleaned up after about a day on a best-effort basis.
   - Honesty check: the claim "no tracking" is OK only while there is no analytics. Firebase also sees IP addresses (the policy says so). Consider ticking IP-related items if the console asks about "approximate location / IP". [UNVERIFIED]
7. **[DEV] Account deletion declaration (if the Data safety flow asks):** Google requires an in-app deletion path **and** a web link for apps that let users create an account (Google deletion page above). Your anonymous "detective ID" is arguably an account. Answer yes, with both paths. This is the safe choice.
8. **[DEV] Government apps:** No. **News apps:** Not a news app. **Health apps / health features:** No health features. **Financial features:** No. **COVID-19:** not applicable. [UNVERIFIED current form labels]
9. **[DEV] Advertising ID declaration:** the app does not use it (no ads, no analytics). Answer No.
10. **[DEV] Store listing contact details** (done in section 3) and **trader declaration** (section 1 step 5).
11. **[DEV] App category and tags** (done in section 3).
12. **[DEV] Countries:** Production, Countries / regions. Start with all countries or a small list of countries where all four languages are likely. Note: in some countries a paid-item shop may need a tax setup by Google (automatic).

---

## 5. Products (in-app purchases)

Console: Monetize with Play, Products, **One-time products** (older name: In-app products). Needs the payments profile first.

**Order:** (a) upload an AAB with billing to a test track first, because Console requires the Billing permission in an uploaded build before it lets you create products [UNVERIFIED, true in older consoles]; (b) create the products; (c) set license testers; (d) test.

**Create each product.** Product ID and its type can **never be changed or reused** after creation (from a third-party guide; [UNVERIFIED] on Google's page).

| Product ID | Name (max 55, shown in Play) | Type | Price (your base; Console converts) |
|---|---|---|---|
| `coins_500` | 500 Coins | consumable | $0.99 |
| `coins_1200` | 1,200 Coins | consumable | $1.99 |
| `coins_3000` | 3,000 Coins | consumable | $3.99 |
| `coins_7500` | 7,500 Coins | consumable | $7.99 |
| `skin_masquerade` | Masquerade Ball skin pack | non-consumable | $1.99 |
| `skin_cyber` | Cyber Agents skin pack | non-consumable | $2.99 |
| `skin_deco` | Jazz Age skin pack | non-consumable | $2.99 |
| `skin_steam` | Steampunk Guild skin pack | non-consumable | $2.99 |
| `skin_gothic` | Haunted Gala skin pack | non-consumable | $1.99 |
| `remove_ads` | **Skip for v1** | non-consumable | $3.99 (later) |

Steps per product:
1. Create one-time product, enter the ID exactly (all lower case as above), name, description (example: "Adds 500 coins to your wallet. Coins have no cash value.").
2. Add the purchase option **Buy**, set the price, mark **consumable** for coins and **non-consumable** (one-time, buy once) for skins. In the new console the consumable setting sits on the purchase option or product; the wording changed in 2025 to "purchase option". [UNVERIFIED]
3. Set the product **Active**. Inactive products do not appear in the purchase flow.
4. Never make `remove_ads` a subscription.

**How the app handles it (checked in `app.js`):** it uses the Digital Goods API against `https://play.google.com/billing`, calls `acknowledge` for non-consumables and `consume` for coins, and re-checks with `listPurchases()` at launch to recover missed grants. Good. Unacknowledged purchases are refunded automatically (for license testers after about 3 minutes, per the testing guides above; in production after 3 days).

**License testers and testing [DEV]:**
1. Console: Settings, License testing, add the Gmail addresses (yours and trusted testers) of the Google accounts on the phone. This is an account-level list. Set "License response" to RESPOND_NORMALLY.
2. The tester must install **from the Play closed-test link** (a build side-loaded from PWABuilder will not have a working Billing connection) with the same Google account, on a phone with Play Store and Chrome.
3. Buy each product once. Check: coins arrive, coin pack can be bought a second time (consume works), skin stays after reinstall (listPurchases restore), prices show in local currency.
4. Test cards say "test card, always approves"; no money is charged. Closed testers who are **not** license testers are charged real money, so tell your 12 testers **not to buy anything**.
5. **Samsung / default browser bug:** a reported TWA issue where `PaymentRequest.show()` fails with "AbortError: Invalid state" on some Samsung phones when Samsung Internet is the default browser, fixed only by switching default browser to Chrome (https://github.com/pwa-builder/pwabuilder/issues/6151, closed July 2026 without a fix; the Bubblewrap issue is GoogleChromeLabs/bubblewrap#1046). Test on a Samsung if you can; ask the assistant to add a friendly fallback message if the purchase dialog fails.
6. 2026 changes to TWA billing: I found **no official 2026 change** to the Digital Goods API in TWA. The ChromeOS docs say only v2 of the API is available. Region-specific alternative billing programs exist and changed in 2026, but they do not stop you using Play Billing (secondary source, [UNVERIFIED]). Apps selling digital goods must use Play Billing. Do not add PayPal or other payment links for coins or skins.

---

## 6. Closed test (personal account requirement) with a 14-day calendar

**The rule (Google, confirmed by several explainers):** a personal developer account created after 13 November 2023 must run a closed test with **at least 12 testers opted in continuously for the previous 14 days** before it can apply for production. The minimum used to be 20 and was lowered to 12 in December 2024. A tester who opts out and back in breaks the 14 days. Invited-but-not-installed people do not count. Organization accounts with a D-U-N-S number are reported as exempt. Sources: Google closed-test page; https://dev.to/vantico/google-plays-closed-test-12-testers-14-days-no-gaps-what-actually-counts-5c1i ; https://ontest.app/blog/google-play-12-testers-14-days-requirement-explained ; https://primetestlab.com/blog/google-play-changed-20-to-12-testers .

**Safe plan: recruit 18 to 20 testers so that 12 stay opted in even if some leave.** Keep the track open and active the whole time.

**How opt-in works (Console and tester):**
1. **[DEV]** Console: Test and release, Testing, Closed testing, Create track (or use the default). Name it "Friends".
2. **[DEV]** Testers tab: create an email list (Gmail / Google Workspace addresses) or a Google Group. Add the addresses. Save.
3. **[DEV]** Countries tab: choose the countries your testers live in.
4. **[DEV]** Releases: Create new release, upload the `.aab`, release name `1.0.0`, release notes `First test build of Crime Grid.` Save, review, **Start rollout to Closed testing**. First review of a new app can take from hours to a few days; a new personal account may have review times at the long end. [UNVERIFIED]
5. **[DEV]** Testers tab: copy the **opt-in URL** (looks like `https://play.google.com/apps/testing/<package>`). Send it to every tester.
6. **Tester instructions (send this text):**
   > Hi! I am testing my puzzle game Crime Grid before launch. Please help for 14 days:
   > 1. Open this link on an Android phone, signed in with the Gmail address I invited: [OPT-IN LINK]
   > 2. Tap "Become a tester", then tap the link to download it from Google Play. Install it.
   > 3. Open it at least once now, and once every few days. Play a few cases. Try a Daily Case. If you like, add a friend and try a duel.
   > 4. **Please do not buy anything** and **do not leave the test or uninstall** until I tell you it is over (about 3 weeks). Leaving early breaks the count.
   > 5. If anything is broken, confusing or ugly, reply with a screenshot and your phone model. Thank you!
7. **[DEV]** Check Console after a day: Testers tab shows opted-in count. You need 12 **opted in** (installed) to start the clock.

**14-day calendar** (Day 0 = the day 12 or more testers are opted in and the build is live to them. Example dates assume Day 0 = Monday 30 Nov 2026 and are only an illustration; shift them to your real Day 0.)

| Day | Example date | Task | Who |
|---|---|---|---|
| Before D0 | now to 29 Nov | Do sections 1 to 5; upload the .aab to the closed track; send the opt-in link to 18 to 20 people; start the first review | DEV |
| 0 | Mon 30 Nov | Confirm 12+ are opted in and installed. Write down the count and date. Test billing on your phone with a license tester account | DEV |
| 1 | 1 Dec | Message testers: "open it today". Fix anything reported | DEV, AI for bugs |
| 2 to 3 | 2 to 3 Dec | Collect feedback; log what you changed (Google asks about it at the end) | DEV |
| 4 | 4 Dec | Reminder to testers; make sure no one has opted out. Replace dropouts at once | DEV |
| 5 to 6 | 5 to 6 Dec | Do the privacy.html and deletion-link edits, the report/block feature and the listing translations if not yet done | AI |
| 7 | 7 Dec | Mid-test check: count still 12+? Optionally upload a bug-fix build to the same track (do not remove testers) | DEV |
| 8 to 10 | 8 to 10 Dec | Test a duel with two real phones; test Digital Asset Links (no address bar); complete all Data safety and content forms; finish store listing in all four languages | DEV |
| 11 | 11 Dec | Reminder to testers; keep the list at 12+ | DEV |
| 12 to 13 | 12 to 13 Dec | Write the answers for the production application (below). Add a production release as a draft (do not roll out) | DEV |
| 14 | Mon 14 Dec | Day 14 reached (14 days counted back from the day you apply). Safer to wait until **Day 15** (Tue 15 Dec) to leave no gap in counting | DEV |
| 15 | Tue 15 Dec | **Apply for production access** (next section) | DEV |
| 16 to ~22 | 16 to 22 Dec | Google review. Reported as usually about 7 days or less, sometimes longer; official page gives no firm number [UNVERIFIED] | Google |
| ~22 | ~22 Dec | If approved, create the production release and roll out. Expect another app review of up to several days | DEV |

Plan for launch **around 22 to 30 December 2026** at the earliest. A holiday slowdown is likely.

**Do NOT:** let testers uninstall; use paid tester services or fake accounts (reviewers can tell and some guides say Google checks real usage); change the package name; delete the track; test only yourself on several accounts.

---

## 7. Production request

1. **[DEV]** Console: Dashboard, "Apply for production" (a card appears once 12 testers have been opted in for 14 days; before that the Production option is disabled).
2. **[DEV]** Answer the questions. Be specific; vague or copied answers are reported as the top cause of rejection (secondary source). Suggested truthful answers, to edit with real numbers:
   - **How did you recruit testers?** "Friends, family and members of puzzle forums I invited by email; N of them opted in." (Say what actually happened.)
   - **How easy was it to recruit 12?** Be honest.
   - **What feedback did you receive?** Two or three real examples (for example, hints too expensive, text too small on 10x10, Friends confusing).
   - **What did you change?** List concrete changes with dates.
   - **How do you know the app is ready for production?** "Stable for 14 days, no crashes, tested purchases with license testers, Digital Asset Links verified, listing and policy forms complete."
   - **Production changes you plan:** daily case, more themes, rewarded ads in a later version.
3. **[DEV]** Submit. Reported review times: up to about 7 days (secondary sources). You can keep updating the test build while you wait.
4. **If rejected:** the email gives a reason. Common causes in secondary sources: fewer than 12 continuous testers, testers who never opened the app, vague answers, broken app, policy form mismatch. Fix, keep the test running, and reapply (the waiting counter may not reset if testers stay opted in). [UNVERIFIED]
5. **[DEV]** After approval, go to Production, Create release. Upload the same signed `.aab` (or a higher versionCode), release notes, **roll out to 100% or start at 20% staged**. Then wait for app review.
6. **[DEV]** After launch: add the Play signing fingerprint to `assetlinks.json` if you have not (done in section 2), check the live app on a fresh phone, buy one real item with a non-tester account, and refund it (Console, Order management) if you want your money back.

---

## 8. Policy risks specific to Crime Grid (ranked)

1. **Simulated gambling (duel coin stakes). HIGH.** Google's policy bans simulated gambling content (social casino and virtual slot machines are the examples) in non-gambling apps, and bans wagering real money or **items bought with money** for prizes of real-world value. Stakes in Crime Grid are in-game coins, which can be **bought for real money** (`coins_500` and up) and have **no cash-out**. That is not a casino game, but IARC questions about virtual-currency wagering can lead to a higher rating, and a reviewer could object to "stake coins on a skill duel" when coins are purchasable. Hard fact: I found no Google text that bans skill-based virtual-coin duels, and I found no text that clearly permits it. [UNVERIFIED] Mitigations: (a) safest, ship v1 without stakes (the host can already pick 0 stake per HANDOFF.md; [AI] would hide the other options); (b) otherwise keep stakes, say "no cash value, cannot be withdrawn" in the listing and in the app, and answer the IARC form honestly. Source: https://support.google.com/googleplay/android-developer/answer/9877032 and search summaries.
2. **Target API 36 / PWABuilder build. HIGH (blocks upload).** New apps must target API 36. Check the generated project before upload (section 2 step 3).
3. **User-generated nicknames without report/block. HIGH.** Google's UGC policy requires clear terms, an **in-app report** function and an **in-app block** function for apps where users see other users' content, and consent to terms before creating content. A nickname seen by friends and duel opponents is likely in scope, though Google's text I found does not mention usernames specifically [UNVERIFIED]. The app has no report/block (problem 9). Mitigations: [AI] adds a "Report player" and "Block player" button on friend cards and the duel screen, a basic profanity filter on nicknames, and a one-line terms note; privacy page gets a "Conduct" paragraph. Because no chat exists, the risk is limited to nicknames.
4. **Data safety and privacy policy mismatch. MEDIUM-HIGH.** The policy's opening says almost nothing is collected, but Firebase stores profile, duel and anonymous ID data. Fix problem 2, and make the Data safety answers match.
5. **Data deletion. MEDIUM.** If the detective ID counts as an account, Google requires an in-app path and a web link. The app has the in-app path; add the web section (problem 3). The anonymous Firebase auth account is not deleted by the button (the privacy page admits this); consider deleting it in code via the Auth REST API when "Delete my online ID" is pressed, so the answer "deleted" is true.
6. **Invite bonus (500 coins + exclusive skin). MEDIUM-LOW.** Google's incentivized policy targets rewards for **installs, ratings and reviews**. Your bonus is for playing a duel together, not for installing, rating or reviewing, which is what the 2017 policy post separates, but that post is old [UNVERIFIED current text]. Keep listing and marketing wording as "play a duel with a friend", never "invite and get coins". Also the bonus is not server-enforced, so it is exploitable; keep it cosmetic.
7. **Children policy / audience. MEDIUM-LOW.** Declared 13+ with a murder theme. Cartoon art and pet skins might look child-directed to a reviewer. Keep marketing teen-oriented. Do not tick under-13 groups.
8. **Digital Asset Links / address bar. MEDIUM (quality, not a policy ban).** Without the root `assetlinks.json` the app shows a URL bar, which looks like a website wrapper and can hurt Play's minimum functionality review. Fix in section 1 step 9 and section 2 steps 6 and 7.
9. **Billing correctness. MEDIUM.** Purchases are validated only on the device (ECONOMY and GOOGLE-PLAY notes). Not a policy violation. A product that does not grant what it claims is, so test every product (section 5).
10. **Remove-ads product with no ads. LOW-MEDIUM.** Skip for v1 (problem 7).
11. **Developer verification (Android).** In June 2026 Google announced that Play developers must register Play apps in Play Console for Android developer verification, with enforcement beginning 30 Sept 2026 in four countries and a wider rollout later. Apps distributed through Play are mostly registered automatically. Confirm any banner in Console. Source: https://android-developers.googleblog.com/2026/06/android-developer-verification.html (search summary only; [UNVERIFIED] details).

---

## 9. Decisions the developer must make

1. Developer name and public contact details (name, support email, phone, address). They become public for traders.
2. Trader or not-a-trader. With paid in-app items, trader is the likely answer; ask Google or an accountant if unsure.
3. Duel coin stakes in v1: keep, hide, or limit to 0. Recommended: hide or set to 0 for v1, bring back after approval with a clear "no cash value" label.
4. Ship v1 without `remove_ads`: recommended yes.
5. Whether to let [AI] add report/block for nicknames and a nickname filter before production (recommended yes).
6. Whether to create the `lamplit-logic.github.io` repo (needed for the address bar), or buy a custom domain.
7. Who the 12+ testers are, and a backup list.
8. Which countries to launch in.

## 10. Things I could not verify

- Exact current Play Console menu names and the production-application question list (Google pages not reachable in this session).
- Exact Google review times (all numbers here are from third-party blogs).
- Whether a brand name can differ from your legal name on a personal account.
- Whether the trader details display is worldwide or EU-only, and the exact public fields for individuals.
- PWABuilder's current default target API level and Digital Goods behaviour in its latest output.
- The `.nojekyll` requirement for `.well-known` on GitHub Pages (from memory).
- The IARC wording for virtual-currency wagering, and whether stakes change your rating.
- Whether usernames fall under the UGC rules (the policy defines UGC as content visible to other users, which suggests yes).
- Whether the Console lets you create products before any AAB with Billing is uploaded.
