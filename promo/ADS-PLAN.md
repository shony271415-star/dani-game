# Crime Grid: תוכנית פרסום

## מה המחקר מראה (2025–2026)

1. **פרסומת אינטראקטיבית (Playable) היא הפורמט החזק ביותר למשחקי פאזל.** לפי מדד Liftoff לשנת 2026 (כפי שמצוטט אצל ArtStash): 4.8 התקנות לכל 1,000 צפיות בפרסומת אינטראקטיבית, לעומת 2.9 בסרטון. אלה נתונים של חברות פרסום, אז כדאי להתייחס אליהם כמגמה ולא כמספר מדויק.
2. **סרטון קצר של 15 שניות עם פתיחה חזקה, ובסופו המשחק עצמו.** זה המבנה ההיברידי הנפוץ היום.
3. **פתיחת אתגר ("רק 1% מצליחים").** נפוצה מאוד במשחקי היגיון. היא עובדת כשהצופה רואה צעד אחד שהוא יכול לפתור בעצמו. לא מתאימה למשחקי אקשן.
4. **מתח ו"כמעט כישלון".** פס התקדמות, טעויות ו"WRONG!" על המסך יוצרים מתח. מגמה בולטת ב-2026.
5. **תוכן בסגנון יוצרים (UGC).** אדם אמיתי שמשחק ומגיב. לפי TikTok, זה הוריד את עלות ההתקנה ב-60% במקרה בוחן אחד (לא של משחק פאזל).
6. **משחקיות כבר מהשנייה הראשונה, בפורמט אנכי 9:16.**

## מה הוכן

| קובץ | סוג | מה הוא בודק |
|---|---|---|
| `crime-grid-playable.html` | פרסומת אינטראקטיבית (קובץ אחד, 304KB) | השחקן פותר תיק קטן באמת, טועה, מאשים, ואז "PLAY FREE" |
| `crime-grid-only-1-percent.mp4` | סרטון 16 שנ' | אתגר "רק 1%" + שחקן שמאשים את הלא נכון (WRONG!) + ספירה לאחור, בלי לגלות את הפתרון |
| `crime-grid-satisfying-solve.mp4` | סרטון 15 שנ' | "פתרון מספק": X-ים שנשטפים על שורות ועמודות, פס התקדמות, חותמת CASE CLOSED |
| `crime-grid-level-1-vs-100.mp4` | סרטון 14 שנ' | "שלב 1 מול שלב 100": קל וחמוד מול לוח 10×10 מאיים, "איפה הייתם מוותרים?" |
| `crime-grid-can-you-solve.mp4` | סרטון 25 שנ' | הסרטון הוותיק, עם השם החדש |
| `crime-grid-who-did-it.mp4` | סרטון 24 שנ' | הסרטון הוותיק, עם השם החדש ("כתבו בתגובות") |
| `crime-grid-extreme.mp4` | סרטון 22 שנ' | הסרטון הוותיק, עם השם החדש |

### לפני העלאת הפרסומת האינטראקטיבית
הכפתור שולח כרגע לכתובת האתר. כשהמשחק יעלה ל-Google Play, בונים מחדש עם הקישור לחנות:
```
node tools/promo/make-playable.js "https://play.google.com/store/apps/details?id=io.github.lamplitlogic.crimegrid"
```
הקובץ עובד ב-AppLovin, Unity, ironSource ו-Mintegral (דרך MRAID), ובקמפייני אפליקציות של Google Ads (דרך ExitApi). אין בו בקשות חיצוניות, כמו שהרשתות דורשות. אחרי 45 שניות מוצג כרטיס הסיום גם אם השחקן הפסיק לשחק.

## סרטון יוצרים לצלם בעצמך (30 שניות, טלפון אנכי)
- **0–2 שנ':** פנים למצלמה, מבט חשדני: "חברה שלי אמרה שאני לא אפתור את זה בפחות מדקה."
- **2–20 שנ':** צילום מסך של המשחק עם הקול שלך: "טוב… היא ישבה על כיסא… יש רק כיסא אחד… אז זה פה!"
- **20–25 שנ':** מאשימה, "WRONG!", צעקה קטנה וצחוק.
- **25–30 שנ':** "עוד ניסיון… מי לדעתכם עשה את זה? כתבו בתגובות."

## טקסטים לפוסטים
- **TikTok / Reels:** `Only 1% can find the killer 🔪 Comment A, B or C 👇 #puzzle #murdermystery #sudoku #brainteaser #logicpuzzle #detective`
- **Google Ads (כותרות):** `Find the killer in 60 seconds` · `Sudoku meets murder mystery` · `A new murder every day` · `Only 1% solve Level 100`

## תוכנית ניסוי (תקציב קטן)
1. **שבוע 1, בלי תקציב:** להעלות את שלושת הסרטונים החדשים כפוסטים רגילים ב-TikTok וב-Reels, אחד כל יומיים. לראות איזה מחזיק צופים הכי הרבה זמן ומקבל הכי הרבה תגובות.
2. **שבוע 2, כ-$5 ליום:** לקדם רק את המנצח, ואת הפרסומת האינטראקטיבית אם הרשת מאפשרת.
3. **מדד:** עלות להתקנה (CPI). מה שיקר פי 2 מהזול ביותר נעצר.
4. כל שבועיים לרענן פתיחה: אותו סרטון עם משפט פתיחה אחר. הפתיחה היא מה שנשחק הכי מהר.

## מקורות
- [Liftoff via ArtStash: How to Lower Your Mobile Game CPI](https://creative.artstash.io/how-to-lower-your-mobile-game-cpi-a-guide-to-creative-led-ua/)
- [Mobile Game Advertising: The Complete 2026 Guide (sett.ai)](https://www.sett.ai/content/mobile-game-advertising/)
- [AppAgent: The State of Playable Ads in 2025](https://appagent.com/blog/the-state-of-playable-ads-in-2025-mid-year-strategic-review/)
- [SocialPeta: Mobile Game Ad Creatives, April 2026](https://gameindustrylibrary.com/documents/may-29-2026top-mobile-game-ad-creatives-and-advertising-trends-in-april-2026in-april-2026-socialpeta)
- [SocialPeta: July 2026](https://socialpeta.com/en/blog/top-mobile-game-ad-creatives-and-advertising-trends-in-july-2026)
- [Segwise: Best Ad Creative Hooks for Puzzle Games](https://segwise.ai/blog/best-ad-creative-hooks-puzzle-games.md)
- [Mega Digital: TikTok Ads for Puzzle Games](https://megadigital.ai/en/blog/tiktok-ads-for-puzzle-games/)
- [TikTok: Pixodust success story](https://ads.tiktok.com/business/en-US/inspiration/pixodust)
