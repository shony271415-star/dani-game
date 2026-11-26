/* Crime Grid: עברית language pack (generated from the translation tables; edit with care). */
(function (root) {
  'use strict';
  const I = root.I18N;
  if (!I) return;
  // ---------- grammar: Hebrew ----------
  const V = { be: ['היה', 'הייתה', 'היו'], sit: ['ישב', 'ישבה', 'ישבו'], lie: ['שכב', 'שכבה', 'שכבו'], stand: ['עמד', 'עמדה', 'עמדו'], in: ['היה', 'הייתה', 'היו'] };
  const verb = (kind, g, pl) => V[kind || 'be'][pl ? 2 : g === 'f' ? 1 : 0];
  const AREA = { room: 'באותו חדר עם', area: 'באותו אזור עם', module: 'באותו מודול עם', hall: 'באותו אולם עם', car: 'באותו קרון עם', chamber: 'באותו אולם עם' };
  const EDGE = { window: 'ליד חלון', porthole: 'ליד אשנב', viewport: 'ליד חלון תצפית', trail: 'ליד שביל', entrance: 'ליד כניסה' };
  const ONBARE = { floor: 'על הרצפה הריקה', deck: 'על הסיפון הריק', ground: 'על האדמה' };
  const BARE = { floor: 'רצפה ריקה', deck: 'סיפון ריק', ground: 'אדמה' };
  const wallPhrase = (x) => (x.outdoor ? 'בקצה אזור' : 'ליד קיר');
  const notWallPhrase = (x) => (x.outdoor ? 'בקצה אף אזור' : 'ליד קיר');
  // names are Latin text inside a right-to-left sentence: isolate them so the punctuation stays put
  const iso = (s) => '⁨' + s + '⁩';
  const clue = (c, x) => {
    const g = x.g, be = verb('be', g), N = (q) => iso(x.name(q));
    switch (c.t) {
      case 'zone': return `${be} **${x.zone(c.a).in}**.`;
      case 'notZone': return `**לא** ${be} **${x.zone(c.a).in}**.`;
      case 'on': { const o = x.obj(c.a); return `${verb(o[1], g)} **${o[2]}**.`; }
      case 'floor': return `${verb('stand', g)} **${ONBARE[x.floor]}**.`;
      case 'beside': return `${be} **ליד ${x.obj(c.a)[0]}**.`;
      case 'notBeside': return `**לא** ${be} **ליד אף ${x.obj(c.a)[0]}**.`;
      case 'edge': return `${be} **${EDGE[x.edge]}**.`;
      case 'corner': return `${be} **בפינה**.`;
      case 'center': return `**לא** ${be} **${notWallPhrase(x)}**.`;
      case 'wall': return `${be} **${wallPhrase(x)}**.`;
      case 'rel':
        if (c.r === 'same') return `${be} **${AREA[x.area]}** ${N(c.a)}.`;
        if (c.r === 'above') return `${be} **בשורה גבוהה יותר** מ־${N(c.a)} (קרוב יותר לראש הלוח).`;
        if (c.r === 'below') return `${be} **בשורה נמוכה יותר** מ־${N(c.a)} (קרוב יותר לתחתית הלוח).`;
        if (c.r === 'left') return `${be} **בעמודה משמאל** לעמודה של ${N(c.a)}.`;
        if (c.r === 'right') return `${be} **בעמודה מימין** לעמודה של ${N(c.a)}.`;
        return `${be} **באלכסון, בצמוד** ל־${N(c.a)}.`;
    }
    return '';
  };
  const fact = (d, x) => {
    if (d.w === 'allzones') return '**בכל אזור** היה לפחות חשוד אחד.';
    if (d.w === 'onlyempty') return `רק **אזור אחד** נשאר בלי חשודים: **${x.zone(d.z).n}**.`;
    const k = d.k, all = k === d.total && k > 1, pl = all || k > 1;
    const Q = k === 0 ? 'אף חשוד לא' : k === 1 ? 'חשוד אחד בלבד' : all ? 'כל החשודים' : `בדיוק ${k} חשודים`;
    let kind = 'be', loc = '';
    if (d.w === 'zone') loc = x.zone(d.z).in;
    else if (d.w === 'on') { const o = x.obj(d.o); kind = o[1]; loc = o[2]; }
    else if (d.w === 'floor') { kind = 'stand'; loc = ONBARE[x.floor]; }
    else if (d.w === 'corner') loc = 'בפינה';
    else if (d.w === 'edge') loc = EDGE[x.edge];
    else if (d.w === 'center') loc = x.outdoor ? 'הרחק מקצוות האזורים' : 'הרחק מהקירות';
    return `**${Q}** ${verb(kind, 'm', pl)} **${loc}**.`;
  };
  const legend = (x, can, cant) => `<li>כל אדם היה ב<b>שורה אחרת</b> וב<b>עמודה אחרת</b>.</li>
      <li><b>אפשר</b> לעמוד על: ${BARE[x.floor]}${can.length ? ', ' + can.join(', ') : ''}.</li>
      ${cant.length ? `<li><b>אי אפשר</b> לעמוד על: ${cant.join(', ')}.</li>` : ''}
      <li><b>ליד</b> משהו = במשבצת שמעליו, מתחתיו, משמאלו או מימינו, באותו חדר.</li>
      <li><b>בפינה</b> = משבצת שבה נפגשים שני קירות של החדר.</li>
      <li><b>${x.outdoor ? 'לא בקצה אף אזור' : 'לא ליד קיר'}</b> = אף אחד מארבעת צדי המשבצת אינו קיר.</li>
      <li><b>${EDGE[x.edge]}</b> = הפס הצבעוני בקיר החיצוני נמצא בצד של המשבצת.</li>
      <li><b>שורה גבוהה יותר</b> = קרובה יותר לראש הלוח, לא בהכרח צמודה. <b>משמאל</b> = קרוב יותר לצד שמאל.</li>
      <li><b>באלכסון</b> = נוגעים רק בפינה.</li>
      <li>הקורבן היה במשבצת הפנויה האחרונה. מי שהיה <b>לבד איתו</b> באותו חדר הוא הרוצח.</li>`;

  I.packs.he = {
    name: "עברית",
    ui: {
 "Rule 1: every suspect has a row and a column all to themselves.": "כלל 1: לכל חשוד יש שורה אחת ועמודה אחת רק לו.",
 "Rule 2: you can stand on chairs, beds and rugs, but not on tables, plants or TVs.": "כלל 2: אפשר לעמוד על כיסאות, מיטות ושטיחים, אבל לא על שולחנות, עציצים וטלוויזיות.",
 "Rule 3: the victim is in the last free square, and whoever is alone with them in that room did it.": "כלל 3: הקורבן במשבצת האחרונה הפנויה, ומי שנשאר לבד איתו באותו חדר הוא הרוצח.",
 "{0} sat on a chair: tap her card, then the glowing chair.": "{0} ישבה על כיסא: לחצו על הכרטיס שלה ואז על הכיסא המאיר.",
 "{0} lay on a bed. Only one bed square is left, so place him there.": "{0} שכב על מיטה. נשאר רק ריבוע מיטה אחד פנוי, אז שימו אותו שם.",
 "{0} was in the Kitchen, by a window: only one square fits.": "{0} הייתה במטבח, ליד חלון: רק ריבוע אחד מתאים.",
 "{0}, the victim, goes in the last free square.": "{0}, הקורבן, נכנס למשבצת האחרונה הפנויה.",
 "{0} was found {1}. Who was alone with him? Tap the killer!": "{0} נמצא {1}. מי היה לבד איתו? לחצו על הרוצח!",
 "Step {0} of {1}": "צעד {0} מתוך {1}",
 "Skip": "דלג",
 "Nice!": "יפה!",
 "Great!": "מצוין!",
 "Exactly right!": "בדיוק נכון!",
 "Sharp eye, detective!": "עין חדה, בלש!",
 "Tap Next to continue 🙂": "לחצו על הבא כדי להמשיך 🙂",
 "Pick the killer below 👇": "בחרו את הרוצח למטה 👇",
 "Not that card. Tap the glowing card, then the glowing square.": "לא הכרטיס הזה. לחצו על הכרטיס המאיר ואז על הריבוע המאיר.",
 "Not that square. Tap the glowing one 🙂": "לא הריבוע הזה. לחצו על הריבוע המאיר 🙂",
 "Not them. Who else was in the same room? Try the glowing one 🙂": "לא הם. מי עוד היה באותו חדר? נסו את המאיר 🙂",
 "POLICE LINE · DO NOT CROSS": "קו משטרה · אין לעבור",
 "CLOSED": "נסגר",
 "Best {0}": "שיא: {0}",
 "Bonuses ({0})": "בונוסים ({0})",
 "🟩 alone · 🟨 with a hint · 🟥 revealed": "🟩 לבד · 🟨 עם רמז · 🟥 נחשף",
 "The killer": "הרוצח/ת",
 "Tap to skip": "הקשו לדילוג",
 "Share result": "שיתוף התוצאה",
 "FILED": "הוצב",
 "{0}/{1} placed": "{0}/{1} הוצבו",
 "+{0} coins": "+{0} מטבעות",
 "{0} unlocked": "{0} נפתח!",
 "Available in the app": "זמין באפליקציה",
 "Purchases with real money work in the Google Play version of Crime Grid.": "רכישות בכסף אמיתי עובדות בגרסת Crime Grid של Google Play.",
 "OK": "אישור",
 "Thank you!": "תודה!",
 "Link copied!": "הקישור הועתק!",
 "Paste it to your friend in any chat.": "הדביקו אותו בכל צ'אט ושלחו לחבר.",
 "Send this to a friend": "שלחו לחבר",
 "Done": "סיום",
 "SHOP": "חנות",
 "+50 coins": "+50 מטבעות",
 "Who's on the case?": "מי חוקר היום?",
 "Your name and progress are saved on this device.": "השם וההתקדמות שלכם נשמרים במכשיר הזה.",
 "Your name": "השם שלכם",
 "Let's go": "יאללה",
 "Tap here to set your name": "הקישו כאן כדי לבחור שם",
 "Hello, {0}!": "שלום, {0}!",
 "Rank: {0}": "דרגה: {0}",
 "no cases solved yet": "עוד לא נפתר אף תיק",
 "Tap to change name": "הקישו כדי לשנות שם",
 "Trophies": "גביעים",
 "Shop": "חנות",
 "Settings": "הגדרות",
 "In progress": "בתהליך",
 "{0} solved": "{0} נפתרו",
 "New!": "חדש!",
 "Continue": "להמשיך",
 "Play": "לשחק",
 "Level {0}": "שלב {0}",
 "BOSS": "בוס",
 "Boss levels every 5 · how far can you go?": "שלב בוס כל 5 שלבים · עד לאן תגיעו?",
 "Map": "מפה",
 "Save progress": "שמירת התקדמות",
 "<b>This browser is not saving your progress</b> (private mode or storage blocked). Open the game in your normal browser, or use {0}.": "<b>הדפדפן הזה לא שומר את ההתקדמות שלכם</b> (מצב גלישה פרטית או אחסון חסום). פתחו את המשחק בדפדפן הרגיל, או השתמשו ב{0}.",
 "Add to Home Screen": "הוספה למסך הבית",
 "save a backup code": "שמרו קוד גיבוי",
 "Playing in Safari? iPhone can erase a website's saved progress after a week away. {0} to keep it safe, or {1}.": "משחקים ב-Safari? האייפון עלול למחוק התקדמות שמורה של אתר אחרי שבוע בלי כניסה. {0} כדי לשמור עליה, או {1}.",
 "Save a backup code": "שמרו קוד גיבוי",
 "Your progress is saved in this browser only. {0} to keep it safe.": "ההתקדמות שלכם נשמרת בדפדפן הזה בלבד. {0} כדי לשמור עליה.",
 "Detective Shop": "חנות הבלשים",
 "{0} coins": "{0} מטבעות",
 "New look: {0} · {1}": "מראה חדש: {0} · {1}",
 "You own every pack!": "יש לכם את כל החבילות!",
 "{0}/{1} owned": "{0}/{1} ברשותכם",
 "Open": "פתיחה",
 "Language": "שפה",
 "Sound & vibration": "צליל ורטט",
 "Off": "כבוי",
 "On": "פועל",
 "Your progress": "ההתקדמות שלכם",
 "Change name": "שינוי שם",
 "Tutorial": "מדריך",
 "How to play": "איך משחקים",
 "Close": "סגירה",
 "This backup is on level {0}, but you are on level {1}. Replace your progress anyway?": "הגיבוי הזה בשלב {0}, ואתם בשלב {1}. להחליף את ההתקדמות בכל זאת?",
 "Save your progress": "שמרו את ההתקדמות",
 "Your progress lives on this phone. If you switch phones, reinstall, or open the game in a different browser, use this code to bring it back.": "ההתקדמות שלכם נמצאת בטלפון הזה. אם תחליפו טלפון, תתקינו מחדש או תפתחו את המשחק בדפדפן אחר, השתמשו בקוד הזה כדי להחזיר אותה.",
 "Copy code": "העתקת הקוד",
 "Send to myself": "שליחה לעצמי",
 "Restore from a code": "שחזור מקוד",
 "Paste a code that starts with MG1.": "הדביקו קוד שמתחיל ב-MG1.",
 "Restore": "שחזור",
 "Copied ✓": "הועתק ✓",
 "Select & copy ↑": "סמנו והעתיקו ↑",
 "My Crime Grid progress backup (paste it in Settings → Save progress → Restore):": "גיבוי ההתקדמות שלי ב-Crime Grid (הדביקו אותו בהגדרות ← שמירת התקדמות ← שחזור):",
 "Progress restored!": "ההתקדמות שוחזרה!",
 "Level {0}, {1} coins.": "שלב {0}, {1} מטבעות.",
 "That code does not look right. Copy the whole thing, starting with MG1.": "הקוד לא נראה תקין. העתיקו את כולו, החל מ-MG1.",
 "You": "אתם",
 "{0} zone": "אזור {0}",
 "Share ({0})": "שיתוף ({0})",
 "Solve level {0} first.": "קודם פתרו את שלב {0}.",
 "{0} updated!": "{0} עודכן!",
 "{0} added!": "{0} נוסף!",
 "Level {0} on the journey map.": "שלב {0} במפת המסע.",
 "{0}d ago": "לפני {0} ימים",
 "today": "היום",
 "Level {0} · {1} cases · {2}-day streak · updated {3}": "שלב {0} · {1} תיקים · רצף של {2} ימים · עודכן {3}",
 "Remove": "הסרה",
 "No friends yet. Send your link to a friend, and ask for theirs!": "עדיין אין חברים. שלחו את הקישור שלכם לחבר, ובקשו את שלו!",
 "Share with friends": "שיתוף עם חברים",
 "You're on level <b>{0}</b>. Send your link so friends see you on their map. Send it again whenever you want them to see your new progress.": "אתם בשלב <b>{0}</b>. שלחו את הקישור שלכם כדי שחברים יראו אתכם במפה שלהם. שלחו אותו שוב בכל פעם שרוצים שיראו את ההתקדמות החדשה.",
 "Send my link": "שליחת הקישור שלי",
 "Add a friend": "הוספת חבר",
 "Join me on Crime Grid! I'm on level {0}. Open this link to add me as a friend (on iPhone with the app installed: copy it and paste it in Map → Share → Add a friend):": "הצטרפו אליי ל-Crime Grid! אני בשלב {0}. פתחו את הקישור הזה כדי להוסיף אותי כחבר (באייפון עם האפליקציה מותקנת: העתיקו אותו והדביקו ב-מפה ← שיתוף ← הוספת חבר):",
 "Paste the link (or code) your friend sent you.": "הדביקו את הקישור (או הקוד) ששלח לכם החבר.",
 "Add": "הוספה",
 "Back": "חזרה",
 "{0} is your friend!": "{0} הוא חבר שלכם!",
 "{0} is now on your map. To show up on <b>{0}'s</b> map too, send your link back.": "{0} נמצא עכשיו במפה שלכם. כדי להופיע גם במפה של <b>{0}</b>, שלחו לו את הקישור שלכם בחזרה.",
 "<b>Using the installed app on iPhone?</b> This link opened in Safari, which keeps its own copy of the game. Open the app, go to <b>Map → Share → Add a friend</b> and paste the same link there.": "<b>משתמשים באפליקציה המותקנת באייפון?</b> הקישור הזה נפתח ב-Safari, ולו יש עותק נפרד של המשחק. פתחו את האפליקציה, היכנסו ל<b>מפה ← שיתוף ← הוספת חבר</b> והדביקו שם את אותו קישור.",
 "Copy this friend's link": "העתקת הקישור של החבר הזה",
 "Send my link to {0}": "שליחת הקישור שלי אל {0}",
 "Later": "אחר כך",
 "Hey {0}, add me back on Crime Grid! I'm on level {1}:": "היי {0}, תוסיפו גם אותי ב-Crime Grid! אני בשלב {1}:",
 "Copied! Now paste it in the app": "הועתק! עכשיו הדביקו באפליקציה",
 "Copy failed: long-press the link in WhatsApp and copy it": "ההעתקה נכשלה: לחצו לחיצה ארוכה על הקישור בוואטסאפ והעתיקו אותו",
 "Opening {0}'s challenge…": "פותחים את האתגר של {0}…",
 "Day {0}": "יום {0}",
 "Daily gift!": "מתנה יומית!",
 "Come back every day for a bigger gift.": "חזרו בכל יום כדי לקבל מתנה גדולה יותר.",
 "Collect +{0} coins": "לקבל +{0} מטבעות",
 "{0} cases": "תיקי {0}",
 "<b>{0}</b> of {1} days solved.": "<b>{0}</b> מתוך {1} ימים נפתרו.",
 "You won the {0} trophy!": "זכיתם בגביע {0}!",
 "Solve every daily case this month to win the {0} trophy.": "פתרו את כל התיקים היומיים החודש כדי לזכות בגביע {0}.",
 "Equipped ✓": "נבחר ✓",
 "Equip": "לבחור",
 "Buy for {0}": "לקנות ב-{0}",
 "need {0} more": "חסרים {0}",
 "You have {0} <b>{1}</b> coins. New looks for every suspect and victim.": "יש לכם {0} <b>{1}</b> מטבעות. מראות חדשים לכל החשודים ולקורבן.",
 "Get coins": "להשיג מטבעות",
 "Skin packs": "חבילות מראה",
 "{0} unlocked!": "{0} נפתח!",
 "Equipped on every suspect.": "פעיל על כל החשודים.",
 "Trophy room": "חדר הגביעים",
 "Monthly trophies:": "גביעים חודשיים:",
 "Each trophy is worth 50 coins.": "כל גביע שווה 50 מטבעות.",
 "Daily Case": "תיק יומי",
 "{0}-day streak": "רצף של {0} ימים",
 "{0}-day streak, solve today to keep it!": "רצף של {0} ימים. פתרו היום כדי לשמור עליו!",
 "A new case every day. Same one for everyone!": "תיק חדש בכל יום. אותו תיק לכולם!",
 "Calendar": "לוח שנה",
 "New here?": "חדשים כאן?",
 "Take the 2-minute tutorial: we'll solve a tiny case together, step by step.": "עשו את המדריך של 2 דקות: נפתור יחד תיק קטן, צעד אחרי צעד.",
 "Start tutorial": "להתחיל מדריך",
 "I know how to play": "אני יודע לשחק",
 "Opening today's case file…": "פותחים את תיק היום…",
 "Building a boss level…": "בונים שלב בוס…",
 "Building the crime scene…": "בונים את זירת הפשע…",
 "Building a really nasty crime scene…": "בונים זירת פשע ממש מסובכת…",
 "Your First Case": "התיק הראשון שלכם",
 "A quiet evening, a loud scream. Let's learn the ropes together.": "ערב שקט, צעקה חזקה. בואו נלמד את החוקים יחד.",
 "{0}'s challenge: {1}": "האתגר של {0}: {1}",
 "Daily Case: {0}": "תיק יומי: {0}",
 "Level {0}: {1}": "שלב {0}: {1}",
 "Case #{0}: {1}": "תיק מס' {0}: {1}",
 "⚔ {0} solved this in {1}. Can you beat that?": "⚔ {0} פתר/ה את זה תוך {1}. תצליחו לנצח?",
 "Next": "הבא",
 "Challenge": "אתגר",
 "Daily": "יומי",
 "Boss": "בוס",
 "Mark mode: tap a square to cross it out ✕": "מצב סימון: הקישו על משבצת כדי לסמן אותה ב-✕",
 "Draft: tap every square where {0} might be.": "טיוטה: הקישו על כל משבצת שבה {0} אולי נמצא/ת.",
 "Draft mode: pick a suspect, then tap all the squares where they might be.": "מצב טיוטה: בחרו חשוד והקישו על כל המשבצות שבהן הוא אולי נמצא.",
 "Pick a suspect below, then tap a square.": "בחרו חשוד למטה, ואז הקישו על משבצת.",
 "Pick a suspect first, then tap the squares where they might be 👇": "קודם בחרו חשוד, ואז הקישו על המשבצות שבהן הוא אולי נמצא 👇",
 "Nobody can stand there!": "אף אחד לא יכול לעמוד שם!",
 "Tap Next in the box above first.": "קודם הקישו על \"הבא\" בתיבה שלמעלה.",
 "Pick a suspect card below.": "בחרו כרטיס של חשוד למטה.",
 "First tap {0}'s card below 👇": "קודם הקישו על הכרטיס של {0} למטה 👇",
 "Let's place {0} first.": "בואו נמקם קודם את {0}.",
 "Not quite. Read the clue again 🙂": "לא בדיוק. קראו שוב את הרמז 🙂",
 "You picked up {0}. Tap a new square.": "הרמתם את {0}. הקישו על משבצת חדשה.",
 "First pick a suspect from the list below 👇": "קודם בחרו חשוד מהרשימה שלמטה 👇",
 "Draft: tap every square where {0} might be. Tap again to erase.": "טיוטה: הקישו על כל משבצת שבה {0} אולי נמצא/ת. הקישו שוב כדי למחוק.",
 "Where was {0}? Tap a square.": "איפה היה/הייתה {0}? הקישו על משבצת.",
 "Two people share a row or column. That can't be right!": "שני אנשים באותה שורה או באותה עמודה. זה לא יכול להיות!",
 "🤔 Something doesn't add up… someone breaks one of their clues.": "🤔 משהו לא מסתדר… מישהו סותר אחד מהרמזים שלו.",
 "✅ Everyone is in place! Now… who did it?": "✅ כולם במקום! עכשיו… מי עשה את זה?",
 "Extra clues from headquarters": "רמזים נוספים מהמפקדה",
 "<b>The victim.</b> Found in the last remaining square.": "<b>הקורבן.</b> נמצא במשבצת האחרונה שנשארה.",
 "rip": "נח בשלום",
 "Detective's dictionary": "מילון הבלש",
 "Clear the board?": "לנקות את הלוח?",
 "All placements, drafts and ✕ marks will be erased. Extra clues stay.": "כל המיקומים, הטיוטות והסימוני ✕ יימחקו. הרמזים הנוספים יישארו.",
 "Yes, clear": "כן, לנקות",
 "Cancel": "ביטול",
 "Follow the hints in the box above 🙂": "עקבו אחרי ההוראות בתיבה שלמעלה 🙂",
 "Need a hand, detective?": "צריכים עזרה, בלשים?",
 "You have {0} <b>{1}</b> coins.": "יש לכם {0} <b>{1}</b> מטבעות.",
 "Give me an extra clue": "תנו לי רמז נוסף",
 "A fact about the whole scene. Nobody's spot is revealed.": "עובדה על כל הזירה. לא מגלה איפה מישהו נמצא.",
 "Check my placements": "בדיקת המיקומים שלי",
 "Tells you if someone on the board is in the wrong spot.": "אומר אם מישהו על הלוח נמצא במקום הלא נכון.",
 "Reveal one suspect": "לגלות חשוד אחד",
 "The last resort.": "המוצא האחרון.",
 "Never mind": "לא, תודה",
 "Not enough coins ({0} needed). Solve cases and collect your daily gift to earn more!": "אין מספיק מטבעות (צריך {0}). פתרו תיקים וקחו את המתנה היומית כדי להרוויח עוד!",
 "Headquarters has no more extra clues for this case. Try another kind of help.": "למפקדה אין עוד רמזים נוספים לתיק הזה. נסו סוג אחר של עזרה.",
 "🧾 New clue added above the suspects.": "🧾 רמז חדש נוסף מעל החשודים.",
 "Place somebody on the board first, then I can check.": "קודם הציבו מישהו על הלוח, ואז אוכל לבדוק.",
 "🔴 {0} is in the wrong spot.": "🔴 {0} במקום הלא נכון.",
 "👁️ {0} was in the wrong place. Fixed it.": "👁️ {0} היה/הייתה במקום הלא נכון. תיקנתי.",
 "👁️ Placed {0} in the right spot.": "👁️ הצבתי את {0} במקום הנכון.",
 "Welcome, detective!": "ברוכים הבאים, בלשים!",
 "There was (yep, you guessed it) a murder last night. The good news? We have a lineup of suspects and a clue about each of them.": "אתמול בלילה היה (כן, ניחשתם) רצח. החדשות הטובות? יש לנו רשימת חשודים ורמז על כל אחד מהם.",
 "<b>Your goal:</b> find the murderer: the one person who was <b>alone with the victim</b> in the same room.": "<b>המטרה:</b> למצוא את הרוצח: היחיד שהיה <b>לבד עם הקורבן</b> באותו חדר.",
 "Every person was in a <b>different row</b> and a <b>different column</b>, like sudoku.": "כל אדם היה ב<b>שורה אחרת</b> וב<b>עמודה אחרת</b>, כמו בסודוקו.",
 "Some objects can be stood on (chairs, beds, rugs…), others can't (tables, plants…). Check the dictionary under the suspects.": "על חלק מהחפצים אפשר לעמוד (כיסאות, מיטות, שטיחים…) ועל חלק לא (שולחנות, עציצים…). בדקו במילון מתחת לחשודים.",
 "The victim (<b>V</b>) is in the <b>last remaining square</b>.": "הקורבן (<b>V</b>) נמצא ב<b>משבצת האחרונה שנשארה</b>.",
 "<b>How to play:</b> tap a suspect card, then a square. Tap a placed suspect to pick them up again. Use <b>✏️ Draft</b> to pencil in every square where a suspect <i>might</i> be, and <b>✕ Mark</b> to cross out squares nobody can use.": "<b>איך משחקים:</b> הקישו על כרטיס של חשוד ואז על משבצת. הקישו על חשוד שכבר הונח כדי להרים אותו שוב. השתמשו ב<b>✏️ טיוטה</b> כדי לרשום את כל המשבצות שבהן חשוד <i>אולי</i> נמצא, וב<b>✕ סימון</b> כדי למחוק משבצות שאף אחד לא יכול להיות בהן.",
 "<b>Stuck?</b> 💡 gives you an extra clue about the whole scene, checks your board, or (last resort) reveals a suspect.": "<b>נתקעתם?</b> 💡 נותן רמז נוסף על כל הזירה, בודק את הלוח שלכם או (כמוצא אחרון) מגלה חשוד.",
 "Each scene is different: a mansion, a ship, a forest, a space station and more.": "כל זירה שונה: אחוזה, ספינה, יער, תחנת חלל ועוד.",
 "Let's investigate!": "בואו נחקור!",
 "Guided tutorial": "מדריך מודרך",
 "{0} wasn't alone with {1} {2}! Look again.": "{0} לא היה/הייתה לבד עם {1} {2}! הסתכלו שוב.",
 "Level {0} →": "שלב {0} ←",
 "Play level 1 →": "לשחק בשלב 1 ←",
 "Next case →": "התיק הבא ←",
 "Case closed: <b>{0}</b> did it.": "התיק נסגר: <b>{0}</b> עשה/עשתה את זה.",
 "Menu": "תפריט",
 "Who did it?": "מי עשה את זה?",
 "{0} was found {1} (highlighted). Who was alone with him?": "{0} נמצא {1} (מודגש). מי היה איתו לבד?",
 "{0} was found {1} (highlighted). Who was alone with her?": "{0} נמצאה {1} (מודגש). מי הייתה איתה לבד?",
 "You did it, detective!": "הצלחתם, בלשים!",
 "<b>{0}</b> was alone with {1} {2}. Case closed!": "<b>{0}</b> היה/הייתה לבד עם {1} {2}. התיק נסגר!",
 "Real cases have more suspects and trickier clues. Your tools:": "בתיקים אמיתיים יש יותר חשודים ורמזים מסובכים יותר. הכלים שלכם:",
 "<b>Draft</b>: pencil in every square where a suspect <i>might</i> be.": "<b>טיוטה</b>: רשמו כל משבצת שבה חשוד <i>אולי</i> נמצא.",
 "<b>Mark</b>: cross out squares nobody can use.": "<b>סימון</b>: מחקו משבצות שאף אחד לא יכול להיות בהן.",
 "<b>Help</b>: an extra clue when you're stuck.": "<b>עזרה</b>: רמז נוסף כשנתקעים.",
 "Play level 1": "לשחק בשלב 1",
 "{0}-day streak! Come back tomorrow for a new case.": "רצף של {0} ימים! חזרו מחר לתיק חדש.",
 "You beat {0} by {1}! +30 coins": "ניצחתם את {0} ב-{1}! +30 מטבעות",
 "A perfect tie with {0}!": "תיקו מושלם עם {0}!",
 "{0} was faster by {1}.": "{0} היה/הייתה מהיר/ה יותר ב-{1}.",
 "You {0} · {1} {2}": "אתם {0} · {1} {2}",
 "Level {0} complete!": "שלב {0} הושלם!",
 "He's on the way to jail.": "הוא בדרך לכלא.",
 "She's on the way to jail.": "היא בדרך לכלא.",
 "Case closed!": "התיק נסגר!",
 "<b>{0}</b> was alone with {1} {2}.": "<b>{0}</b> היה/הייתה לבד עם {1} {2}.",
 "New personal best!": "שיא אישי חדש!",
 "Challenge back": "אתגר חזרה",
 "Challenge a friend": "לאתגר חבר",
 "Can you solve it?": "מצליחים לפתור?",
 "I solved \"{0}\" in {1} on Crime Grid. Can you beat my time?": "פתרתי את \"{0}\" תוך {1} ב-Crime Grid. תצליחו לנצח את הזמן שלי?",
 "Install on iPhone": "התקנה באייפון",
 "Open this page in <b>Safari</b>.": "פתחו את הדף הזה ב-<b>Safari</b>.",
 "Tap the <b>Share</b> button (square with an arrow).": "הקישו על כפתור <b>השיתוף</b> (ריבוע עם חץ).",
 "Choose <b>\"Add to Home Screen\"</b>.": "בחרו <b>\"הוסף למסך הבית\"</b>.",
 "From now on, open the game from the icon.": "מעכשיו פותחים את המשחק מהאייקון.",
 "Install before you start playing: on iPhone the app keeps its progress separately from Safari.": "התקינו לפני שמתחילים לשחק: באייפון האפליקציה שומרת התקדמות בנפרד מ-Safari.",
 "Got it": "הבנתי",
 "Rookie": "טירון",
 "4×4 grid · 3 suspects": "לוח 4×4 · 3 חשודים",
 "Detective": "בלש",
 "5×5 grid · 4 suspects": "לוח 5×5 · 4 חשודים",
 "Inspector": "מפקח",
 "6×6 grid · 5 suspects": "לוח 6×6 · 5 חשודים",
 "Expert": "מומחה",
 "8×8 grid · 7 suspects": "לוח 8×8 · 7 חשודים",
 "Extreme": "אקסטרים",
 "10×10 grid · 9 suspects · bring coffee": "לוח 10×10 · 9 חשודים · תכינו קפה",
 "Junior Detective": "בלש צעיר",
 "Chief Inspector": "מפקח ראשי",
 "Legend of the Force": "אגדת המשטרה",
 "Classic Detectives": "בלשים קלאסיים",
 "Basic": "בסיסי",
 "The original cast.": "ההרכב המקורי.",
 "Pet Detectives": "בלשי חיות",
 "Common": "רגיל",
 "Cats, dogs, foxes, owls and more. Paws off the evidence!": "חתולים, כלבים, שועלים, ינשופים ועוד. כפות רחוקות מהראיות!",
 "Noir Gangsters": "גנגסטרים נואר",
 "Rare": "נדיר",
 "Fedoras, trench coats and very dark sunglasses.": "כובעי פדורה, מעילי טרנץ' ומשקפי שמש כהים מאוד.",
 "Monster Mash": "מצעד המפלצות",
 "Vampires, mummies, ghosts, a cyclops and one very polite werewolf.": "ערפדים, מומיות, רוחות רפאים, קיקלופ וגבר-זאב אחד מנומס מאוד.",
 "Royal Court": "החצר המלכותית",
 "Epic": "אפי",
 "Crowns, jewels and ermine, in a shimmering gold frame.": "כתרים, תכשיטים וסמור לבן, במסגרת זהב נוצצת.",
 "Space Crew": "צוות החלל",
 "Astronauts and aliens, framed by the stars.": "אסטרונאוטים וחייזרים, במסגרת של כוכבים.",
 "Neon Legends": "אגדות ניאון",
 "Legendary": "אגדי",
 "Glowing neon characters in a pulsing frame.": "דמויות ניאון זוהרות במסגרת פועמת.",
 "Masquerade Ball": "נשף מסכות",
 "Premium": "פרימיום",
 "Venetian masks, feathers and velvet. Comes with a gilded frame.": "מסכות ונציאניות, נוצות וקטיפה. עם מסגרת מוזהבת.",
 "Cyber Agents": "סוכני סייבר",
 "Glowing visors and live scan lines. The flashiest look in the game.": "מגני פנים זוהרים וקווי סריקה חיים. המראה הכי מרשים במשחק.",
 "Popular": "פופולרי",
 "Best value": "הכי משתלם",
 "👋 Welcome, detective! I'll walk you through your very first case. Tap <b>Next</b>.": "👋 ברוכים הבאים, בלשים! אלווה אתכם בתיק הראשון שלכם. הקישו על <b>הבא</b>.",
 "This is the <b>crime scene</b>. Thick lines are walls: they split the house into rooms. You <b>can</b> stand on chairs, beds and rugs, but <b>not</b> on tables, plants or TVs.": "זו <b>זירת הפשע</b>. הקווים העבים הם קירות: הם מחלקים את הבית לחדרים. <b>אפשר</b> לעמוד על כיסאות, מיטות ושטיחים, אבל <b>לא</b> על שולחנות, עציצים וטלוויזיות.",
 "The golden rule: every person was in a <b>different row</b> and a <b>different column</b>, just like sudoku.": "כלל הזהב: כל אדם היה ב<b>שורה אחרת</b> וב<b>עמודה אחרת</b>, בדיוק כמו בסודוקו.",
 "<b>Ava</b> was sitting on a chair. There is only <b>one chair</b> in the house! Tap Ava's card below, then tap the chair.": "<b>Ava</b> ישבה על כיסא. יש רק <b>כיסא אחד</b> בבית! הקישו על הכרטיס של Ava למטה, ואז על הכיסא.",
 "Nice! Ava now owns her row and her column, so nobody else can use them. When you pick another suspect, those squares turn gray.": "יפה! עכשיו השורה והעמודה של Ava תפוסות, ואף אחד אחר לא יכול להשתמש בהן. כשבוחרים חשוד אחר, המשבצות האלה נהיות אפורות.",
 "<b>Ben</b> was lying on a bed. The bed covers two squares, but one of them is in Ava's column. So there is only one choice left. Place Ben!": "<b>Ben</b> שכב על מיטה. המיטה תופסת שתי משבצות, אבל אחת מהן בעמודה של Ava. נשארה רק אפשרות אחת. מקמו את Ben!",
 "<b>Chloe</b> was in the Kitchen, <b>by a window</b> (the little bar on the outer wall). Only one Kitchen square touches a window. Place Chloe!": "<b>Chloe</b> הייתה במטבח, <b>ליד חלון</b> (הפס הקטן על הקיר החיצוני). רק משבצת אחת במטבח נוגעת בחלון. מקמו את Chloe!",
 "The victim is always in the <b>last free square</b>: only one row and one column are left. Place <b>Victor</b> there.": "הקורבן תמיד במשבצת <b>הפנויה האחרונה</b>: נשארו רק שורה אחת ועמודה אחת. מקמו שם את <b>Victor</b>.",
 "Everyone is in place! Victor was found in the <b>Bedroom</b>. Who else was in the Bedroom? That person is the murderer!": "כולם במקום! את Victor מצאו ב<b>חדר השינה</b>. מי עוד היה בחדר השינה? זה הרוצח!",
 "Extreme bosses": "בוסים אקסטרים",
 "First Case": "התיק הראשון",
 "Solve your first case": "פתרו את התיק הראשון שלכם",
 "Seasoned Sleuth": "בלש ותיק",
 "Solve 10 cases": "פתרו 10 תיקים",
 "Case Cracker": "פורץ תיקים",
 "Solve 50 cases": "פתרו 50 תיקים",
 "Week of Crime": "שבוע של פשע",
 "Keep a 7-day daily streak": "שמרו על רצף יומי של 7 ימים",
 "Monthly Mastermind": "ראש החודש",
 "Keep a 30-day daily streak": "שמרו על רצף יומי של 30 ימים",
 "No Peeking": "בלי להציץ",
 "Solve an Inspector case or harder without any help": "פתרו תיק ברמת מפקח או קשה יותר בלי שום עזרה",
 "Expert Witness": "עד מומחה",
 "Solve an Expert case": "פתרו תיק ברמת מומחה",
 "Extreme Measures": "אמצעים קיצוניים",
 "Solve an Extreme case": "פתרו תיק ברמת אקסטרים",
 "Speed Sleuth": "בלש מהיר",
 "Solve a Rookie case in under a minute": "פתרו תיק ברמת טירון תוך פחות מדקה",
 "Globetrotter": "מטייל עולמי",
 "Solve a case in all 9 scenes": "פתרו תיק בכל 9 הזירות",
 "Halfway Hero": "גיבור חצי הדרך",
 "Reach level 25 on the journey": "הגיעו לשלב 25 במסע",
 "Treasure Hunter": "צייד אוצרות",
 "Hold 500 coins at once": "החזיקו 500 מטבעות בו זמנית",
 "Sudoku meets murder mystery": "סודוקו פוגש תעלומת רצח",
 "Solve the grid · Catch the culprit": "פתרו את הרשת · תפסו את האשם",
 "CASE FILE": "תיק חקירה",
 "OPEN": "פתוח",
 "SOLVED": "פוענח",
 "Cases": "תיקים",
 "Friends": "חברים",
 "More": "עוד",
 "Free play": "משחק חופשי",
 "Install app": "התקנת האפליקציה",
 "Place": "הצבה",
 "Draft": "טיוטה",
 "Mark": "סימון",
 "Help": "עזרה",
 "Undo": "ביטול פעולה",
 "Clear": "ניקוי",
 "The Journey": "המסע",
 "Every level is a brand-new case": "כל שלב הוא תיק חדש לגמרי",
 "Kitchen Crew": "צוות המטבח",
 "Chef hats, curly mustaches and a pinch of suspicion.": "כובעי שף, שפמים מסולסלים וקורט של חשד.",
 "Circus Clowns": "ליצני קרקס",
 "Red noses, wild hair. Nobody trusts a clown.": "אף אדום, שיער פרוע. אף אחד לא סומך על ליצן.",
 "Wild West": "המערב הפרוע",
 "Cowboy hats, bandanas and a shiny sheriff star.": "כובעי בוקרים, בנדנות וכוכב שריף נוצץ.",
 "Robo Squad": "חוליית הרובוטים",
 "Beep boop. Box heads with glowing LED eyes.": "ביפ בופ. ראשי קופסה עם עיני לד זוהרות.",
 "Pirate Crew": "צוות הפיראטים",
 "Eye patches, tricorns and gold earrings. Arr!": "רטיות, כובעי פיראטים ועגילי זהב. ארררר!",
 "Shadow Ninjas": "נינג'ות הצללים",
 "Silent hoods, colourful headbands, one throwing star.": "ברדסים שקטים, סרטי ראש צבעוניים וכוכב נינג'ה אחד.",
 "Wizard Academy": "אקדמיית הקוסמים",
 "Starry hats, long beards and glowing wands.": "כובעים מכוכבים, זקנים ארוכים ושרביטים זוהרים.",
 "Dino Hoodies": "קפוצ'וני דינוזאור",
 "Everyone in a dinosaur onesie. Rawr.": "כולם בתחפושת דינוזאור. גרררר.",
 "Super Squad": "חוליית העל",
 "Masks, capes and big shiny emblems.": "מסכות, גלימות וסמלים גדולים ונוצצים.",
 "Deep Sea Gang": "כנופיית המעמקים",
 "Ten sea creatures: octopus, shark, turtle, crab, seahorse, jellyfish, pufferfish, starfish, whale and swordfish.": "עשרה יצורי ים: תמנון, כריש, צב ים, סרטן, סוס ים, מדוזה, אבו נפחא, כוכב ים, לווייתן ודג חרב.",
 "Solve {0} cases": "פתרו {0} תיקים",
 "Solve a Hard or harder case": "פתרו תיק ברמה קשה ומעלה",
 "Solve a case without any help": "פתרו תיק בלי שום עזרה",
 "Earn {0} stars": "אספו {0} כוכבים",
 "Solve the Daily Case": "פתרו את התיק היומי",
 "Daily Missions": "משימות יומיות",
 "All missions done! +{0} coins": "כל המשימות הושלמו! +{0} מטבעות",
 "Mission complete: {0} · +{1} coins": "משימה הושלמה: {0} · +{1} מטבעות",
 "Win streak ×{0}: +{1} coins": "רצף ניצחונות ×{0}: +{1} מטבעות",
 "Star chest": "תיבת כוכבים",
 "{0}/{1} stars to the next chest": "{0}/{1} כוכבים עד התיבה הבאה",
 "Star chest opened! +{0} coins": "תיבת הכוכבים נפתחה! +{0} מטבעות",
 "Star chest opened! New pack: {0}": "תיבת הכוכבים נפתחה! חבילה חדשה: {0}",
 "Win streak: {0}": "רצף ניצחונות: {0}",
 "Partners in Crime": "שותפים לפשע",
 "Exclusive": "בלעדי",
 "Only for detectives who duel a new friend.": "רק לבלשים שעושים דו-קרב עם חבר חדש.",
 "Duel a new friend to unlock": "דו-קרב עם חבר חדש פותח אותה",
 "Live duel": "דו-קרב חי",
 "Live duel: {0}": "דו-קרב חי: {0}",
 "First to solve it wins. {0} is dueling you right now!": "מי שפותר ראשון מנצח. {0} בדו-קרב נגדכם עכשיו!",
 "New duel": "דו-קרב חדש",
 "Live duel with a friend": "דו-קרב חי עם חבר",
 "New detective? You both get {0} coins and the exclusive Partners in Crime pack.": "בלש חדש? שניכם מקבלים {0} מטבעות ואת החבילה הבלעדית \"שותפים לפשע\".",
 "Live duels need an internet connection.": "דו-קרב חי צריך חיבור לאינטרנט.",
 "Could not reach the duel server. Try again in a moment.": "אין חיבור לשרת. נסו שוב עוד רגע.",
 "Same case, same moment. Whoever solves it first wins.": "אותו תיק, באותו רגע. מי שפותר ראשון מנצח.",
 "I have a code": "יש לי קוד",
 "Join a duel": "הצטרפות לדו-קרב",
 "Type the 6-letter code your friend sent you.": "הקלידו את הקוד בן 6 התווים שהחבר שלח לכם.",
 "Join": "הצטרפות",
 "Opening a duel room…": "פותחים חדר דו-קרב…",
 "Live duels are not available in this version yet.": "דו-קרב חי עוד לא זמין בגרסה הזו.",
 "Joining the duel…": "מצטרפים לדו-קרב…",
 "This duel has ended, or the code is wrong.": "הדו-קרב הזה נגמר, או שהקוד שגוי.",
 "This duel already has two detectives.": "בדו-קרב הזה כבר יש שני בלשים.",
 "This duel has already started.": "הדו-קרב הזה כבר התחיל.",
 "Friend": "חבר",
 "Connecting…": "מתחברים…",
 "Waiting for your friend to join…": "מחכים שהחבר יצטרף…",
 "Get ready!": "היכונו!",
 "{0} joined! Starting…": "{0} הצטרף! מתחילים…",
 "Send this code or the invite link to a friend:": "שלחו לחבר את הקוד או את קישור ההזמנה:",
 "Send invite": "שליחת הזמנה",
 "Duel me on Crime Grid! Same case, first to solve it wins. Code: {0}": "בואו לדו-קרב נגדי ב-Crime Grid! אותו תיק, מי שפותר ראשון מנצח. קוד: {0}",
 "Your friend cancelled the duel.": "החבר ביטל את הדו-קרב.",
 "{0} solved it first!": "{0} פתר ראשון!",
 "Finish the case anyway.": "אפשר לסיים את התיק בכל זאת.",
 "{0} left the duel.": "{0} יצא מהדו-קרב.",
 "Dueling {0}": "דו-קרב נגד {0}",
 "Solved!": "נפתר!",
 "Checking who was first…": "בודקים מי היה ראשון…",
 "You won the duel against {0}! +{1} coins": "ניצחתם בדו-קרב נגד {0}! ‎+{1} מטבעות",
 "{0} solved it first.": "{0} פתר ראשון.",
 "+{0} coins for dueling {1}!": "‎+{0} מטבעות על הדו-קרב עם {1}!",
 "Partners in Crime pack unlocked. Equip it in the shop.": "החבילה \"שותפים לפשע\" נפתחה. אפשר להלביש אותה בחנות.",
 "Thanks for bringing a new detective!": "תודה שהבאתם בלש חדש!",
 "Online now": "מחובר עכשיו",
 "Duel {0}": "דו-קרב נגד {0}",
 "No friends yet. Tell a friend your detective ID, or add theirs.": "עדיין אין חברים. ספרו לחבר את מספר הבלש שלכם, או הוסיפו את שלו.",
 "Your detective ID": "מספר הבלש שלכם",
 "Copy": "העתקה",
 "Friend's ID": "המספר של החבר",
 "Friends you add here can invite you to duels right inside the game.": "חברים שמוסיפים כאן יכולים להזמין אתכם לדו-קרב ישר בתוך המשחק.",
 "Other ways to add friends": "דרכים נוספות להוסיף חברים",
 "Delete my online ID": "מחיקת מספר הבלש שלי",
 "Copied!": "הועתק!",
 "Pick a level. {0} gets the invite inside the game.": "בחרו רמה. {0} יקבל את ההזמנה בתוך המשחק.",
 "{0} can't duel right now.": "{0} לא פנוי לדו-קרב עכשיו.",
 "{0} may be offline. Send the code another way, or try later.": "ייתכן ש-{0} לא מחובר. שלחו את הקוד בדרך אחרת, או נסו אחר כך.",
 "Invite sent to {0}. Waiting…": "ההזמנה נשלחה ל-{0}. מחכים…",
 "{0} added you as a friend!": "{0} הוסיף אתכם כחברים!",
 "You can now invite each other to duels.": "עכשיו אפשר להזמין זה את זה לדו-קרב.",
 "Duel invite!": "הזמנה לדו-קרב!",
 "{0} invites you to a live duel ({1}). First to solve the case wins!": "{0} מזמין אתכם לדו-קרב חי ({1}). מי שפותר ראשון מנצח!",
 "Not now": "לא עכשיו",
 "An ID has 6 letters and numbers.": "מספר בלש הוא 6 אותיות ומספרים.",
 "That's your own ID.": "זה המספר שלכם.",
 "No detective with this ID.": "אין בלש עם המספר הזה.",
 "{0} added! They will see you in their friends list too.": "{0} נוסף! גם הוא יראה אתכם ברשימת החברים שלו.",
 "This removes your detective ID and online profile from the server. Your progress on this device stays. Friends will no longer be able to invite you in the game.": "זה מוחק מהשרת את מספר הבלש ואת הפרופיל המקוון שלכם. ההתקדמות במכשיר נשארת. חברים לא יוכלו יותר להזמין אתכם בתוך המשחק.",
 "Delete": "מחיקה",
 "Online ID deleted.": "מספר הבלש נמחק.",
 "Get a detective ID": "קבלת מספר בלש",
 "Duel": "דו-קרב",
 "Stake per player": "הימור לכל שחקן",
 "Free": "חינם",
 "The winner takes {0} coins. Leaving early loses your stake.": "המנצח לוקח {0} מטבעות. מי שיוצא באמצע מפסיד את ההימור.",
 "Stake: {0} coins each. The winner takes {1}.": "הימור: {0} מטבעות מכל אחד. המנצח לוקח {1}.",
 "{0} challenges you for {1} coins each. The winner takes {2}. Join?": "{0} רוצה לשחק איתכם על {1} מטבעות מכל אחד. המנצח לוקח {2}. מצטרפים?",
 "You need {0} coins to join this duel.": "צריך {0} מטבעות כדי להצטרף לדו-קרב הזה.",
 "Not enough coins for this stake.": "אין מספיק מטבעות להימור הזה.",
 "{0} solved it first. You lost {1} coins.": "{0} פתר ראשון. הפסדתם {1} מטבעות.",
 "You left a duel with a stake. The stake was lost.": "יצאתם מדו-קרב עם הימור. ההימור אבד.",
 "You lost {0} coins.": "הפסדתם {0} מטבעות.",
 "To invite {0} inside the game, add them once with their detective ID (Friends screen).": "כדי להזמין את {0} בתוך המשחק, הוסיפו אותו פעם אחת עם מספר הבלש שלו (במסך חברים).",
 "{0} can't get invites yet. Send the code another way.": "{0} עדיין לא יכול לקבל הזמנות. שלחו לו את הקוד בדרך אחרת.",
 "{0} invites you to a live duel ({1}) for {2} coins each. The winner takes {3}!": "{0} מזמין אתכם לדו-קרב חי ({1}) על {2} מטבעות מכל אחד. המנצח לוקח {3}!",
 "No ads": "בלי פרסומות",
 "Remove ads": "הסרת פרסומות",
 "Enjoy Crime Grid without ads. One payment, no subscription. It comes back if you reinstall the game.": "נהנים מ-Crime Grid בלי פרסומות. תשלום אחד, בלי מנוי. הוא חוזר גם אם מתקינים את המשחק מחדש.",
 "Ads removed. Thank you!": "הפרסומות הוסרו. תודה!",
 "Daily Mission": "משימה יומית",
 "Streak freeze used!": "הקפאת הרצף הופעלה!",
 "Your {0}-day streak is safe. Solve today to keep it going.": "הרצף שלכם של {0} ימים בטוח. פתרו היום כדי להמשיך אותו.",
 "Daily reminder": "תזכורת יומית",
 "Pick a time. Your calendar will remind you every day to solve the Daily Case.": "בחרו שעה. היומן שלכם יזכיר לכם כל יום לפתור את התיק היומי.",
 "Crime Grid: today's case is waiting": "Crime Grid: התיק של היום מחכה",
 "Solve the Daily Case and keep your streak!": "פתרו את התיק היומי ושמרו על הרצף!",
 "Reminder file ready": "קובץ התזכורת מוכן",
 "Open it to add the daily reminder to your calendar.": "פתחו אותו כדי להוסיף את התזכורת היומית ליומן.",
 "Freeze": "הקפאה",
 "Remind me": "תזכורת",
 "Streak freeze earned! It saves your streak if you miss one day.": "הרווחתם הקפאת רצף! היא שומרת על הרצף אם מפספסים יום אחד.",
 "New trick: \"What if?\"": "טריק חדש: \"מה אם?\"",
 "Stuck? Pretend a suspect stands on one square and follow the clues.": "תקועים? דמיינו שחשוד עומד במשבצת אחת ועקבו אחרי הרמזים.",
 "Pencil the guess in with <b>Draft</b>, so it is only an idea.": "סמנו את הניחוש ב<b>טיוטה</b>, כך שזה רק רעיון.",
 "If two people end up in the same row or column, or a clue breaks, the guess was impossible.": "אם שני אנשים מגיעים לאותה שורה או עמודה, או שרמז נשבר, הניחוש היה בלתי אפשרי.",
 "Cross that square out with <b>Mark</b> and try another one.": "מחקו את המשבצת ב<b>סימון</b> ונסו אחרת.",
 "Bigger cases need this a lot. Take your time.": "תיקים גדולים צריכים את זה הרבה. קחו את הזמן.",
 "Jazz Age": "תקופת הג'אז",
 "Art deco gold, bow ties, pearls and a sunburst frame.": "זהב ארט דקו, עניבות פרפר, פנינים ומסגרת קרני שמש.",
 "Steampunk Guild": "גילדת הסטימפאנק",
 "Brass goggles, gears and top hats in a riveted frame.": "משקפי פליז, גלגלי שיניים וכובעי צילינדר במסגרת מסומרת.",
 "Haunted Gala": "נשף הרפאים",
 "Powdered wigs, lace collars and candlelight. Ghosts welcome.": "פיאות מאופרות, צווארוני תחרה ואור נרות. רוחות רפאים מוזמנות.",
 "Watch a short video: free clue": "צפו בסרטון קצר: רמז חינם",
 "{0} left today": "נשארו {0} להיום",
 "Watch a short video: double coins (+{0})": "צפו בסרטון קצר: מטבעות כפולים (+{0})",
 "Coins doubled!": "המטבעות הוכפלו!",
 "No video available right now. Try again later.": "אין סרטון זמין כרגע. נסו שוב מאוחר יותר.",
 "Replace your progress?": "להחליף את ההתקדמות?",
 "Keep my progress": "להשאיר את ההתקדמות שלי",
 "Replace": "להחליף",
 "Report or block": "דיווח או חסימה",
 "Report this player, or block them so they can never invite you again.": "דווחו על השחקן, או חסמו אותו כדי שלא יוכל להזמין אתכם שוב.",
 "Report: {0}": "דיווח: {0}",
 "Offensive name": "שם פוגעני",
 "Cheating": "רמאות",
 "Harassment": "הטרדה",
 "Something else": "משהו אחר",
 "Block {0}": "חסימת {0}",
 "Blocked. {0} can no longer invite you.": "נחסם. {0} לא יוכל יותר להזמין אתכם.",
 "Report sent. Thank you!": "הדיווח נשלח. תודה!",
 "You blocked this player.": "חסמתם את השחקן הזה.",
 "Unblock all ({0})": "ביטול כל החסימות ({0})"
},
    pl: {
 "{0} cases solved": {
  "one": "תיק אחד נפתר",
  "other": "{0} תיקים נפתרו"
 },
 "{0} levels to {1}": {
  "one": "שלב אחד עד {1}",
  "two": "שני שלבים עד {1}",
  "other": "{0} שלבים עד {1}"
 },
 "Map & {0} friends": {
  "one": "מפה וחבר אחד",
  "other": "מפה ו-{0} חברים"
 },
 "Solved with {0} stars.": {
  "one": "נפתר עם כוכב אחד.",
  "two": "נפתר עם 2 כוכבים.",
  "other": "נפתר עם {0} כוכבים."
 },
 "✅ So far so good: all {0} people you placed are in the right spot.": {
  "one": "✅ עד עכשיו הכול טוב: האדם שהצבתם במקום הנכון.",
  "other": "✅ עד עכשיו הכול טוב: כל {0} האנשים שהצבתם במקום הנכון."
 },
 "🔴 {0} people are in the wrong spot.": {
  "one": "🔴 אדם אחד במקום הלא נכון.",
  "two": "🔴 שני אנשים במקום הלא נכון.",
  "other": "🔴 {0} אנשים במקום הלא נכון."
 },
 "{0} clues/checks": {
  "one": "רמז/בדיקה אחד",
  "other": "{0} רמזים/בדיקות"
 },
 "{0} reveals": {
  "one": "גילוי אחד",
  "other": "{0} גילויים"
 }
},
    zones: {
 "Living Room": [
  "סלון",
  "בסלון"
 ],
 "Kitchen": [
  "מטבח",
  "במטבח"
 ],
 "Bedroom": [
  "חדר שינה",
  "בחדר השינה"
 ],
 "Bathroom": [
  "חדר אמבטיה",
  "בחדר האמבטיה"
 ],
 "Study": [
  "חדר עבודה",
  "בחדר העבודה"
 ],
 "Library": [
  "ספרייה",
  "בספרייה"
 ],
 "Dining Room": [
  "חדר אוכל",
  "בחדר האוכל"
 ],
 "Music Room": [
  "חדר מוזיקה",
  "בחדר המוזיקה"
 ],
 "Guest Room": [
  "חדר אורחים",
  "בחדר האורחים"
 ],
 "Main Deck": [
  "סיפון ראשי",
  "על הסיפון הראשי"
 ],
 "Bridge": [
  "גשר הפיקוד",
  "בגשר הפיקוד"
 ],
 "Cabin": [
  "תא",
  "בתא"
 ],
 "Galley": [
  "מטבח הספינה",
  "במטבח הספינה"
 ],
 "Cargo Hold": [
  "מחסן מטען",
  "במחסן המטען"
 ],
 "Engine Room": [
  "חדר מכונות",
  "בחדר המכונות"
 ],
 "Lounge": [
  "טרקלין",
  "בטרקלין"
 ],
 "Captain's Quarters": [
  "חדר הקברניט",
  "בחדר הקברניט"
 ],
 "Clearing": [
  "קרחת יער",
  "בקרחת היער"
 ],
 "Campsite": [
  "אתר קמפינג",
  "באתר הקמפינג"
 ],
 "Riverbank": [
  "גדת הנהר",
  "על גדת הנהר"
 ],
 "Pine Grove": [
  "חורשת אורנים",
  "בחורשת האורנים"
 ],
 "Cave": [
  "מערה",
  "במערה"
 ],
 "Mushroom Patch": [
  "שדה פטריות",
  "בשדה הפטריות"
 ],
 "Lakeside": [
  "שפת האגם",
  "על שפת האגם"
 ],
 "Old Oak": [
  "האלון העתיק",
  "באזור האלון העתיק"
 ],
 "Command Deck": [
  "סיפון פיקוד",
  "בסיפון הפיקוד"
 ],
 "Science Lab": [
  "מעבדה",
  "במעבדה"
 ],
 "Sleeping Pods": [
  "תאי שינה",
  "בתאי השינה"
 ],
 "Hydroponics": [
  "גינה הידרופונית",
  "בגינה ההידרופונית"
 ],
 "Mess Hall": [
  "קפטריה",
  "בקפטריה"
 ],
 "Observatory": [
  "מצפה כוכבים",
  "במצפה הכוכבים"
 ],
 "Robotics Bay": [
  "מעבדת רובוטיקה",
  "במעבדת הרובוטיקה"
 ],
 "Cargo Module": [
  "מודול מטען",
  "במודול המטען"
 ],
 "Lobby": [
  "לובי",
  "בלובי"
 ],
 "Dinosaur Hall": [
  "אולם הדינוזאורים",
  "באולם הדינוזאורים"
 ],
 "Ancient Wing": [
  "האגף העתיק",
  "באגף העתיק"
 ],
 "Gallery": [
  "גלריה",
  "בגלריה"
 ],
 "Café": [
  "בית קפה",
  "בבית הקפה"
 ],
 "Vault": [
  "כספת",
  "בכספת"
 ],
 "Gift Shop": [
  "חנות מזכרות",
  "בחנות המזכרות"
 ],
 "Space Exhibit": [
  "תערוכת החלל",
  "בתערוכת החלל"
 ],
 "Locomotive": [
  "קטר",
  "בקטר"
 ],
 "Dining Car": [
  "קרון אוכל",
  "בקרון האוכל"
 ],
 "Sleeper Car": [
  "קרון שינה",
  "בקרון השינה"
 ],
 "Luggage Car": [
  "קרון מטען",
  "בקרון המטען"
 ],
 "Lounge Car": [
  "קרון טרקלין",
  "בקרון הטרקלין"
 ],
 "Observation Car": [
  "קרון תצפית",
  "בקרון התצפית"
 ],
 "First Class": [
  "מחלקה ראשונה",
  "במחלקה הראשונה"
 ],
 "Center Ring": [
  "זירה מרכזית",
  "בזירה המרכזית"
 ],
 "Backstage": [
  "מאחורי הקלעים",
  "מאחורי הקלעים"
 ],
 "Animal Tent": [
  "אוהל החיות",
  "באוהל החיות"
 ],
 "Clown Trailer": [
  "קרוואן הליצנים",
  "בקרוואן הליצנים"
 ],
 "Snack Stand": [
  "דוכן חטיפים",
  "באזור דוכן החטיפים"
 ],
 "Ticket Booth": [
  "קופה",
  "באזור הקופה"
 ],
 "Strongman Tent": [
  "אוהל הכוחנים",
  "באוהל הכוחנים"
 ],
 "Throne Room": [
  "חדר הכס",
  "בחדר הכס"
 ],
 "Great Hall": [
  "האולם הגדול",
  "באולם הגדול"
 ],
 "Armory": [
  "נשקייה",
  "בנשקייה"
 ],
 "Dungeon": [
  "צינוק",
  "בצינוק"
 ],
 "Chapel": [
  "קפלה",
  "בקפלה"
 ],
 "Tower": [
  "מגדל",
  "במגדל"
 ],
 "Castle Kitchen": [
  "מטבח הטירה",
  "במטבח הטירה"
 ],
 "Fireside Lounge": [
  "טרקלין האח",
  "בטרקלין האח"
 ],
 "Ski Shop": [
  "חנות סקי",
  "בחנות הסקי"
 ],
 "Hot Tub Deck": [
  "מרפסת הג׳קוזי",
  "במרפסת הג׳קוזי"
 ],
 "Bunk Room": [
  "חדר דרגשים",
  "בחדר הדרגשים"
 ],
 "Lodge Kitchen": [
  "מטבח הבקתה",
  "במטבח הבקתה"
 ],
 "Snowy Patio": [
  "חצר מושלגת",
  "בחצר המושלגת"
 ]
},
    themes: {
 "The Mansion": "האחוזה",
 "The Ship": "הספינה",
 "The Forest": "היער",
 "The Space Station": "תחנת החלל",
 "The Museum": "המוזיאון",
 "The Night Train": "רכבת הלילה",
 "The Circus": "הקרקס",
 "The Castle": "הטירה",
 "The Ski Lodge": "בקתת הסקי"
},
    objs: {
 "chair": [
  "כיסא",
  "sit",
  "על כיסא"
 ],
 "bed": [
  "מיטה",
  "lie",
  "על מיטה"
 ],
 "rug": [
  "שטיח",
  "stand",
  "על שטיח"
 ],
 "table": [
  "שולחן",
  null,
  null
 ],
 "tv": [
  "טלוויזיה",
  null,
  null
 ],
 "plant": [
  "עציץ",
  null,
  null
 ],
 "bathtub": [
  "אמבטיה",
  null,
  null
 ],
 "piano": [
  "פסנתר",
  null,
  null
 ],
 "seat": [
  "מושב",
  "sit",
  "על מושב"
 ],
 "crate": [
  "ארגז",
  "sit",
  "על ארגז"
 ],
 "barrel": [
  "חבית",
  null,
  null
 ],
 "lifebuoy": [
  "גלגל הצלה",
  null,
  null
 ],
 "anchor": [
  "עוגן",
  null,
  null
 ],
 "wheel": [
  "הגה",
  null,
  null
 ],
 "tree": [
  "עץ",
  null,
  null
 ],
 "rock": [
  "סלע",
  null,
  null
 ],
 "log": [
  "גזע עץ",
  "sit",
  "על גזע עץ"
 ],
 "tent": [
  "אוהל",
  "in",
  "בתוך אוהל"
 ],
 "campfire": [
  "מדורה",
  null,
  null
 ],
 "mushroom": [
  "פטרייה ענקית",
  null,
  null
 ],
 "canoe": [
  "קאנו",
  "sit",
  "בתוך קאנו"
 ],
 "computer": [
  "מחשב",
  null,
  null
 ],
 "robot": [
  "רובוט",
  null,
  null
 ],
 "telescope": [
  "טלסקופ",
  null,
  null
 ],
 "statue": [
  "פסל",
  null,
  null
 ],
 "dino": [
  "שלד דינוזאור",
  null,
  null
 ],
 "vase": [
  "אגרטל עתיק",
  null,
  null
 ],
 "suitcase": [
  "מזוודה",
  "sit",
  "על מזוודה"
 ],
 "drum": [
  "תוף",
  null,
  null
 ],
 "elephant": [
  "פיל",
  null,
  null
 ],
 "popcorn": [
  "עגלת פופקורן",
  null,
  null
 ],
 "hay": [
  "חבילת קש",
  "sit",
  "על חבילת קש"
 ],
 "balloon": [
  "דוכן בלונים",
  null,
  null
 ],
 "fireplace": [
  "קמין",
  null,
  null
 ],
 "skis": [
  "מתקן מגלשיים",
  null,
  null
 ],
 "snowman": [
  "איש שלג",
  null,
  null
 ],
 "hottub": [
  "ג׳קוזי",
  "in",
  "בתוך ג׳קוזי"
 ],
 "armor": [
  "שריון אבירים",
  null,
  null
 ],
 "throne": [
  "כס מלכות",
  "sit",
  "על כס מלכות"
 ],
 "candle": [
  "פמוט",
  null,
  null
 ],
 "swords": [
  "מתלה נשק",
  null,
  null
 ],
 "coal": [
  "ערימת פחם",
  null,
  null
 ],
 "cactus": [
  "קקטוס",
  null,
  null
 ]
},
    objLabel: (e) => e[0],
    stories: [
 [
  "מוות בקינוח",
  "הסוכריות היו פייק. גם האליבי של כולם."
 ],
 [
  "המשרת לא עשה את זה",
  "פעם אחת למשרת יש אליבי בלתי שביר. איזו חוצפה."
 ],
 [
  "צוואה וקבר",
  "סבתא השאירה הכול לחתול שלה. מישהו לקח את זה ללב."
 ],
 [
  "תה, עוגיות ובגידה",
  "אצבע קטנה למעלה. גופות למטה."
 ],
 [
  "חנוכת בית שהתקררה",
  "הביאו עציץ. מישהו הביא טינה."
 ],
 [
  "אסון בספא",
  "מסיכות פנים, פרוסות מלפפון ושנת צהריים קבועה."
 ],
 [
  "צרחה במסיבת פיג'מות",
  "באמת או חובה הפכה ליותר מדי אמת."
 ],
 [
  "סיסמת ה-Wi-Fi",
  "אף אחד לא רצה לשתף. מישהו איבד את זה."
 ],
 [
  "רצח ברמה גבוהה",
  "הסכו\"ם הבריק. האליבי לא."
 ],
 [
  "דרמה בנברשת",
  "משהו נפל בחצות, ולא הייתה זו הנברשת."
 ],
 [
  "יום החופש של המשרת",
  "בלי המשרת הכול התפרק מהר."
 ],
 [
  "מריבת הירושה",
  "חמישה קרובים, הון אחד, אפס רגיעה."
 ],
 [
  "ארוחה למתכננים",
  "שבע מנות. אחת מהן הייתה נקמה."
 ],
 [
  "עד הטפט",
  "אם הקירות האלה היו מדברים, הם היו דורשים עורך דין."
 ],
 [
  "בראנץ' שהשתבש",
  "המיץ זרם בלי הפסקה. והשקרים גם."
 ],
 [
  "המונוקל האבוד",
  "הכול התחיל במונוקל שנעלם. הכול נגמר באורח שנעלם."
 ],
 [
  "כמעט טיטאניק",
  "חדשות טובות: הפעם הקרחון חף מפשע."
 ],
 [
  "בחילה וחשדות",
  "חצי מהנוסעים היו ירוקים. אחד היה אשם."
 ],
 [
  "קשר של אשמה",
  "כל המלחים נשבעים שהם לא אשמים בקשר. חה. חה."
 ],
 [
  "הקפטן המובן מאליו",
  "הקפטן לא ראה כלום. כרגיל."
 ],
 [
  "כל מה שאפשר לאכול (חי)",
  "שרימפס ללא הגבלה. ניצולים מוגבלים."
 ],
 [
  "דרמה מעבר לסיפון",
  "מישהו צעק \"אדם מעבר לסיפון!\". טעה בכל דבר."
 ],
 [
  "שייט אהבה, תיק קר",
  "שייט רומנטי. הרבה שייט, מעט רומנטיקה."
 ],
 [
  "דברים שקורים בים",
  "את זה לא כתבו בחוברת."
 ],
 [
  "יחסים על סף הטביעה",
  "חברים ותיקים, שייט אחד, יותר מדי סודות."
 ],
 [
  "להתראות בים",
  "מסיבת הפרידה הייתה קצת יותר מדי סופית."
 ],
 [
  "סיפון של קרבות",
  "מישהו הפיל מישהו, ולא בצורה חגיגית."
 ],
 [
  "נמל בלי תשובה",
  "אף אחד לא ענה כשהספינה קראה. חשוד."
 ],
 [
  "ים סוער, אורחים סוערים יותר",
  "הגלים היו פראיים. הנוסעים פראיים יותר."
 ],
 [
  "תרגיל סירות הצלה",
  "כולם מצאו מקום. כמעט כולם."
 ],
 [
  "עוגנים עולים",
  "העוגן ירד. גם מצב הרוח."
 ],
 [
  "ארוחת הקפטן",
  "חליפות מרשימות, שקרים מרשימים יותר."
 ],
 [
  "רצח מרשמלו",
  "הכינו סמורס. והכינו גם טעויות."
 ],
 [
  "חף מפשע כמו דוב",
  "כולם האשימו את הדוב. הדוב שכר עורך דין."
 ],
 [
  "לילה אוהלי מאוד",
  "ליד המדורה הכול נהיה מתוח."
 ],
 [
  "אבוד ונמצא",
  "הכלב מצא את הגופה. כלב טוב, לילה רע."
 ],
 [
  "טיול שהשתגע",
  "המפה אמרה \"קל\". המפה שיקרה."
 ],
 [
  "סיפור רפאים שהשתבש",
  "החלק המפחיד ביותר בסיפור התברר כאמיתי."
 ],
 [
  "עקיצות יתושים ורצח",
  "לא רק היתושים רצו דם."
 ],
 [
  "עזבו אותי בשקט, עלים",
  "מישהו באמת רצה קצת שקט. לתמיד."
 ],
 [
  "תאמינו או לא",
  "העצים ראו הכול. למרבה הצער, עצים לא מעידים."
 ],
 [
  "אורן ועונש",
  "אוויר צח, פשע טרי."
 ],
 [
  "שביל של שקרים",
  "כל עקבות הצביעו למקום אחר."
 ],
 [
  "ינשוף על המשמר",
  "הינשוף שאל \"מי?\" כל הלילה. שאלה הוגנת."
 ],
 [
  "וידויים ליד המדורה",
  "אף אחד לא התוודה. מחנאים קלאסיים."
 ],
 [
  "מבוקש: טחב",
  "הטבע יפה. הטבע גם מסתור מעולה."
 ],
 [
  "ניהול ענפים",
  "מישהו טיפס בסולם הקריירה. וגם על עץ."
 ],
 [
  "אל תוך היער",
  "שישה נכנסו לסוף שבוע. את השאר אתם יודעים."
 ],
 [
  "יוסטון, יש לנו גופה",
  "בחלל אף אחד לא שומע כלום. למזלנו, מישהו ראה."
 ],
 [
  "מנותק בחלל",
  "מישהו שכח לבדוק את החמצן שלו. מישהו אחר \"עזר\"."
 ],
 [
  "כבידה אפס, אליבי אפס",
  "כולם ריחפו מסביב. אף אחד לא היה איפה שאמר."
 ],
 [
  "תעלומת עוגת הירח",
  "עוגת הירח האחרונה נאכלה. ואז זה נהיה אישי."
 ],
 [
  "אליבי ירוק קטן",
  "הצוות האשים אורחים ירוקים קטנים. האורחים נעלבו."
 ],
 [
  "זה לא מדע טילים",
  "זה לא מדע טילים. טוב, קצת כן."
 ],
 [
  "Ctrl + Alt + מת",
  "מחשב התחנה ראה הכול. הוא לא מדבר."
 ],
 [
  "אבודים בספגטי",
  "ערב פסטה במסלול הלך נורא, ממש לא על הצלחת."
 ],
 [
  "מוזרות בחלל",
  "פיקוד הקרקע איבד קשר. עם איש צוות אחד."
 ],
 [
  "האליבי המאדימי",
  "\"הייתי במאדים\" זה לא אליבי כאן למעלה."
 ],
 [
  "תאונת אסטרואיד?",
  "זה לא היה אסטרואיד."
 ],
 [
  "תעלומת החור השחור",
  "רמזים נעלמים כאן מהר. תמהרו."
 ],
 [
  "בדיקת כבידה",
  "מישהו שכח את הכלל החשוב ביותר בחלל: להיות נחמד."
 ],
 [
  "אסטרו-לא",
  "אסטרונאוט אחד לא יחזור לכדור הארץ."
 ],
 [
  "יריבי דלק הטילים",
  "שני מהנדסים, קידום אחד, אפס חמצן מיותר."
 ],
 [
  "הליכת הבושה על הירח",
  "מישהו ניסה להתגנב. על הירח. אמיץ."
 ],
 [
  "לילה במאוזוליאום",
  "התערוכות התעוררו לחיים. אורח אחד לא."
 ],
 [
  "דינו-מיט",
  "לטירנוזאורוס יש ידיים זעירות. בטוח שזה לא הוא."
 ],
 [
  "התקף אמנות",
  "המבקרים אמרו שהתערוכה קטלנית. הם לא טעו."
 ],
 [
  "בעיות מומיה",
  "לכולם יש. לאחד היו חמורות במיוחד."
 ],
 [
  "נא לא לגעת",
  "מישהו נגע. מישהו שילם על זה."
 ],
 [
  "חנות המזכרות של האימה",
  "יציאה דרך חנות המזכרות. אם תצליחו."
 ],
 [
  "ישן יותר מהאבק",
  "האליבי של מישהו עתיק יותר מהאגרטלים."
 ],
 [
  "פיסול בדיוני",
  "לכל פסל כאן יש פרצוף פוקר מושלם."
 ],
 [
  "תצוגה א׳",
  "התצוגה החדשה ביותר לא הופיעה בתוכנית."
 ],
 [
  "דלק מאובנים",
  "עצמות ישנות, צרות חדשות."
 ],
 [
  "פרשת הלובר",
  "לא המוזיאון ההוא. אותה כמות דרמה."
 ],
 [
  "מסגרת הפללה",
  "מישהו מסובך. תרתי משמע."
 ],
 [
  "שריד שבור",
  "שריד שאין לו מחיר, טעות יקרה."
 ],
 [
  "פסל ההתיישנות",
  "הפסלים לא מדברים. כל השאר משקרים."
 ],
 [
  "המוזיאון אחרי החשיכה",
  "הסיור נגמר בחמש. התעלומה התחילה בשש."
 ],
 [
  "שברת, שילמת",
  "מישהו שבר משהו גרוע בהרבה מאגרטל."
 ],
 [
  "רצח באספרסו",
  "הוגש קפה. והוגשה נקמה."
 ],
 [
  "צ'וק צ'וק, תבחרו חכם",
  "נוסע אחד עשה בחירה גרועה מאוד."
 ],
 [
  "ירד מהפסים",
  "המסיבה יצאה משליטה איפשהו ליד המנהרה השלישית."
 ],
 [
  "כרטיס לעולם הבא",
  "כרטיסים לכיוון אחד. ממש, ממש לכיוון אחד."
 ],
 [
  "עימות בעגלת החטיפים",
  "מישהו לקח את הבייגלה האחרון. טעות גדולה."
 ],
 [
  "התחנה הבאה: אף אחד",
  "הקונדקטור קרא לתחנה. נוסע אחד לא ענה."
 ],
 [
  "איבדתי את חוט המחשבה",
  "עקבו אחריו בזהירות. הוא מוביל למקום אפל."
 ],
 [
  "ראיית מנהרה",
  "האורות כבו במנהרה לעשר שניות בדיוק."
 ],
 [
  "ירידה מהפסים",
  "הדברים יצאו מהמסלול בערך בזמן ארוחת הערב."
 ],
 [
  "כולם על האליבי",
  "לכל נוסע יש סיפור. רק חלק מהם נכונים."
 ],
 [
  "בעיות במחלקה ראשונה",
  "מושבים מפוארים. מניעים מפוארים יותר."
 ],
 [
  "אקספרס לילה",
  "כולם ישנו. אחד ישן ממש, ממש."
 ],
 [
  "קיטור ותחבולות",
  "הקטר שרק. גם הנוסעים."
 ],
 [
  "פסי הדמעות",
  "מישהו בוכה, ומישהו משקר."
 ],
 [
  "רמזים בקרון האחרון",
  "התשובה בסוף הקו."
 ],
 [
  "בלבול אצל הקונדקטור",
  "כרטיסים בבקשה. ואליבי."
 ],
 [
  "ג'אגלינג עם אליבי",
  "כולם מלהטטים עם סיפור. מישהו עומד להפיל אחד."
 ],
 [
  "כישלון בקרקס",
  "המופע חייב להימשך. הקורבן, למרבה הצער, לא."
 ],
 [
  "פופקורן ופאניקה",
  "עוד חמאה. עוד חשודים."
 ],
 [
  "שקרים על חבל דק",
  "צעד שגוי אחד ותפסו אתכם."
 ],
 [
  "הפיל שבחדר",
  "כולם התעלמו ממנו. קלאסי."
 ],
 [
  "שלחו את הליצנים",
  "הם נשלחו. זו הייתה הבעיה."
 ],
 [
  "התמוטטות עיר הליצנים",
  "אף אחד לא צחק כשהמוזיקה נפסקה."
 ],
 [
  "טלפון, מי מת?",
  "מנהל הקרקס הכריז על הפתעה. היא לא הייתה בתוכנית."
 ],
 [
  "תעלומה מתחת לאוהל הענק",
  "האוהל היה ענק. רשימת החשודים גדולה יותר."
 ],
 [
  "בדיחת טרפז",
  "מישהו קפץ בכל הכוח. והחטיא."
 ],
 [
  "ליצן מחוץ לזירה",
  "במכונית הליצנים היה מושב אחד יותר מדי."
 ],
 [
  "התוכנית של מנהל הקרקס",
  "כולם רצו לנהל את המופע."
 ],
 [
  "פשע צמר גפן סוכר",
  "ממתקים מתוקים, מניעים חמוצים."
 ],
 [
  "שאגות של שקר",
  "אף אחד לא אומר אמת הלילה."
 ],
 [
  "המופע הגדול ביותר",
  "עלי אדמות? אולי. החשוד ביותר? בהחלט."
 ],
 [
  "עד בדמות בלון",
  "פודל הבלונים ראה הכול."
 ],
 [
  "חורף ארוך",
  "השלג מצטבר. וגם רשימת החשודים."
 ],
 [
  "חילופי משמרות אבירים",
  "השומרים התחלפו בחצות. גם העלילה."
 ],
 [
  "תעלומת התעלה",
  "התעלה הייתה מלאה. רשימת החשודים מלאה יותר."
 ],
 [
  "כס מלכות מתחת לאוטובוס",
  "כולם רצו את הכתר. אחד קיבל בעיטה."
 ],
 [
  "מלכותי בבלגן",
  "סעודה, ליצן החצר וסוף לא מלכותי בכלל."
 ],
 [
  "קוביות ודרמה",
  "מטילים אליבי. לכולם יצא אחד."
 ],
 [
  "לרוח הרפאים יש אליבי",
  "המשרתים האשימו את הרוח. הרוח הייתה במועדון קריאה."
 ],
 [
  "יורש היום, נעלם מחר",
  "רק יורש אחד יכול לרשת. עכשיו יש אחד פחות."
 ],
 [
  "ערב אבירים בלתי נשכח",
  "נשף יפהפה, עד לצרחה."
 ],
 [
  "תכשיטי הכתר",
  "התכשיטים נשארו. אורח אחד לא."
 ],
 [
  "מגדל הכוח",
  "לטפס לפסגה עולה ביוקר."
 ],
 [
  "דרקון לא כלול",
  "הפעם הדרקון חף מפשע."
 ],
 [
  "כאב מלכותי",
  "להיות מלכותי קשה. להיות מת קשה יותר."
 ],
 [
  "בדיחת ליצן החצר",
  "ליצן החצר צחק אחרון."
 ],
 [
  "הרבה רעש על תעלה",
  "הרבה רעש על רצח זעיר אחד."
 ],
 [
  "משחק שחמט",
  "מישהו לקח את המלכה. תרתי משמע."
 ],
 [
  "אין מוצא בשלג",
  "הכבישים נחסמו. הרוצח נלכד בפנים עם כולם."
 ],
 [
  "פשע בשוקו חם",
  "מרשמלו: אופציונלי. רצח: כנראה שלא."
 ],
 [
  "מדרון חלקלק",
  "הכול התחיל במקל סקי שאול."
 ],
 [
  "תירגעו",
  "אמרו לכולם להירגע. מישהו נרגע לתמיד."
 ],
 [
  "נעים מאוד, קר לי",
  "קבלת פנים קרה. גופה קרה יותר."
 ],
 [
  "מפולת של שקרים",
  "לא רק השלג הצטבר."
 ],
 [
  "איש השלג ראה הכול",
  "אנשי שלג לא מדברים. זו כל הבעיה."
 ],
 [
  "ג'קוזי הפשע",
  "בועות, קיטור ותיק קפוא מאוד."
 ],
 [
  "מכאן והלאה במדרון",
  "החופשה הייתה נהדרת, עד שהפסיקה."
 ],
 [
  "מסלול יהלום שחור",
  "המדרון הקשה ביותר בהר הוא התיק הזה."
 ],
 [
  "רגליים קרות",
  "האליבי של מישהו נמס מהר."
 ],
 [
  "מלחמת פונדו",
  "טבלו גבינה. החזיקו טינה."
 ],
 [
  "שקרים בעגלת הסקי",
  "תקועים ברכבל עם שקרן. קלאסי."
 ],
 [
  "אפוקליפסה אפרה-סקי",
  "המסיבה הסתיימה מוקדם. עבור אורח אחד, לתמיד."
 ],
 [
  "נכסים קפואים",
  "הצוואה הייתה בכספת. היורש היה בצרות."
 ],
 [
  "יום אבקת שלג",
  "שלג טרי מכסה הרבה עקבות."
 ]
],
    clue, fact, legend,
  };
})(typeof window !== 'undefined' ? window : globalThis);
