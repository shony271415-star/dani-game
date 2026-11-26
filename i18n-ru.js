/* Crime Grid: Русский language pack (generated from the translation tables; edit with care). */
(function (root) {
  'use strict';
  const I = root.I18N;
  if (!I) return;
  // ---------- grammar: Russian ----------
  const V = { be: ['был', 'была', 'были'], sit: ['сидел', 'сидела', 'сидели'], lie: ['лежал', 'лежала', 'лежали'], stand: ['стоял', 'стояла', 'стояли'], in: ['был', 'была', 'были'] };
  const verb = (kind, g, pl) => V[kind || 'be'][pl ? 2 : g === 'f' ? 1 : 0];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const AREA = { room: 'в той же комнате, что и', area: 'в той же зоне, что и', module: 'в том же модуле, что и', hall: 'в том же зале, что и', car: 'в том же вагоне, что и', chamber: 'в том же зале, что и' };
  const EDGE = { window: 'у окна', porthole: 'у иллюминатора', viewport: 'у смотрового окна', trail: 'у тропы', entrance: 'у входа' };
  const ONBARE = { floor: 'на голом полу', deck: 'на пустой палубе', ground: 'на голой земле' };
  const BARE = { floor: 'голый пол', deck: 'пустая палуба', ground: 'голая земля' };
  const wallPhrase = (x) => (x.outdoor ? 'на краю зоны' : 'у стены');
  const notWallPhrase = (x) => (x.outdoor ? 'на краю какой-либо зоны' : 'у стены');
  const clue = (c, x) => {
    const g = x.g, be = verb('be', g), N = (q) => x.name(q);
    switch (c.t) {
      case 'zone': return `${cap(be)} **${x.zone(c.a).in}**.`;
      case 'notZone': return `**Не** ${be} **${x.zone(c.a).in}**.`;
      case 'on': { const o = x.obj(c.a); return `${cap(verb(o[2], g))} **${o[3]}**.`; }
      case 'floor': return `${cap(verb('stand', g))} **${ONBARE[x.floor]}**.`;
      case 'beside': return `${cap(be)} **рядом с ${x.obj(c.a)[1]}**.`;
      case 'notBeside': { const o = x.obj(c.a); return `**Не** ${be} **рядом ни с ${String(o[4]).replace(/^ни/, '')} ${o[1]}**.`; }
      case 'edge': return `${cap(be)} **${EDGE[x.edge]}**.`;
      case 'corner': return `${cap(be)} **в углу**.`;
      case 'center': return `**Не** ${be} **${notWallPhrase(x)}**.`;
      case 'wall': return `${cap(be)} **${wallPhrase(x)}**.`;
      case 'rel':
        if (c.r === 'same') return `${cap(be)} **${AREA[x.area]}** ${N(c.a)}.`;
        if (c.r === 'above') return `${cap(be)} **в строке выше**, чем у ${N(c.a)}.`;
        if (c.r === 'below') return `${cap(be)} **в строке ниже**, чем у ${N(c.a)}.`;
        if (c.r === 'left') return `${cap(be)} **в столбце левее**, чем у ${N(c.a)}.`;
        if (c.r === 'right') return `${cap(be)} **в столбце правее**, чем у ${N(c.a)}.`;
        return `${cap(be)} **по диагонали рядом с** ${N(c.a)}.`;
    }
    return '';
  };
  const fact = (d, x) => {
    if (d.w === 'allzones') return '**В каждой зоне** был хотя бы один подозреваемый.';
    if (d.w === 'onlyempty') return `Только в одной зоне не было подозреваемых: **${x.zone(d.z).n}**.`;
    const k = d.k, all = k === d.total && k > 1, pl = all || k > 1;
    const Q = k === 0 ? 'Ни один подозреваемый не' : k === 1 ? 'Ровно один подозреваемый' : all ? 'Все подозреваемые' : `Ровно ${k} подозреваемых`;
    let kind = 'be', loc = '';
    if (d.w === 'zone') loc = x.zone(d.z).in;
    else if (d.w === 'on') { const o = x.obj(d.o); kind = o[2]; loc = o[3]; }
    else if (d.w === 'floor') { kind = 'stand'; loc = ONBARE[x.floor]; }
    else if (d.w === 'corner') loc = 'в углу';
    else if (d.w === 'edge') loc = EDGE[x.edge];
    else if (d.w === 'center') loc = x.outdoor ? 'вдали от краёв зон' : 'вдали от стен';
    return `**${Q}** ${verb(kind, 'm', pl)} **${loc}**.`;
  };
  const legend = (x, can, cant) => `<li>Каждый человек был в <b>своей строке</b> и в <b>своём столбце</b>.</li>
      <li><b>Можно</b> находиться на: ${BARE[x.floor]}${can.length ? ', ' + can.join(', ') : ''}.</li>
      ${cant.length ? `<li><b>Нельзя</b> находиться на: ${cant.join(', ')}.</li>` : ''}
      <li><b>Рядом</b> с чем-то = в клетке прямо сверху, снизу, слева или справа, в том же помещении.</li>
      <li><b>В углу</b> = клетка, где сходятся две стены помещения.</li>
      <li><b>${cap(x.outdoor ? 'не на краю какой-либо зоны' : 'не у стены')}</b> = ни одна из 4 сторон клетки не является стеной.</li>
      <li><b>${cap(EDGE[x.edge])}</b> = цветная полоска на внешней стене находится со стороны этой клетки.</li>
      <li><b>Строка выше</b> = ближе к верху. <b>Левее</b> = ближе к левому краю.</li>
      <li><b>По диагонали рядом</b> = клетки соприкасаются только углом.</li>
      <li>Жертва была на последней свободной клетке. Тот, кто был <b>наедине с ней</b> в том же помещении, и есть убийца.</li>`;

  I.packs.ru = {
    name: "Русский",
    ui: {
 "Rule 1: every suspect has a row and a column all to themselves.": "Правило 1: у каждого подозреваемого своя строка и свой столбец.",
 "Rule 2: you can stand on chairs, beds and rugs, but not on tables, plants or TVs.": "Правило 2: можно стоять на стульях, кроватях и коврах, но не на столах, растениях и телевизорах.",
 "Rule 3: the victim is in the last free square, and whoever is alone with them in that room did it.": "Правило 3: жертва в последней свободной клетке, а убийца тот, кто остался с ней наедине в комнате.",
 "{0} sat on a chair: tap her card, then the glowing chair.": "{0} сидела на стуле: нажмите её карточку, потом светящийся стул.",
 "{0} lay on a bed. Only one bed square is left, so place him there.": "{0} лежал на кровати. Свободна только одна клетка кровати, поставьте его туда.",
 "{0} was in the Kitchen, by a window: only one square fits.": "{0} была на кухне, у окна: подходит только одна клетка.",
 "{0}, the victim, goes in the last free square.": "{0}, жертва, встаёт в последнюю свободную клетку.",
 "{0} was found {1}. Who was alone with him? Tap the killer!": "{0} нашли {1}. Кто был с ним наедине? Нажмите на убийцу!",
 "Step {0} of {1}": "Шаг {0} из {1}",
 "Skip": "Пропустить",
 "Nice!": "Отлично!",
 "Great!": "Здорово!",
 "Exactly right!": "Абсолютно верно!",
 "Sharp eye, detective!": "Зоркий глаз, детектив!",
 "Tap Next to continue 🙂": "Нажмите «Дальше», чтобы продолжить 🙂",
 "Pick the killer below 👇": "Выберите убийцу ниже 👇",
 "Not that card. Tap the glowing card, then the glowing square.": "Не эта карточка. Нажмите светящуюся карточку, затем светящуюся клетку.",
 "Not that square. Tap the glowing one 🙂": "Не эта клетка. Нажмите светящуюся 🙂",
 "Not them. Who else was in the same room? Try the glowing one 🙂": "Не он. Кто ещё был в той же комнате? Попробуйте светящегося 🙂",
 "POLICE LINE · DO NOT CROSS": "ПОЛИЦЕЙСКОЕ ОГРАЖДЕНИЕ · НЕ ПЕРЕХОДИТЬ",
 "CLOSED": "ЗАКРЫТО",
 "Best {0}": "Рекорд: {0}",
 "Bonuses ({0})": "Бонусы ({0})",
 "🟩 alone · 🟨 with a hint · 🟥 revealed": "🟩 сам · 🟨 с подсказкой · 🟥 раскрыт",
 "The killer": "Убийца",
 "Tap to skip": "Нажмите, чтобы пропустить",
 "Share result": "Поделиться результатом",
 "FILED": "В ДЕЛЕ",
 "{0}/{1} placed": "Размещено: {0}/{1}",
 "+{0} coins": "+{0} монет",
 "{0} unlocked": "{0}: разблокировано!",
 "Available in the app": "Доступно в приложении",
 "Purchases with real money work in the Google Play version of Crime Grid.": "Покупки за реальные деньги работают в версии Crime Grid для Google Play.",
 "OK": "ОК",
 "Thank you!": "Спасибо!",
 "Link copied!": "Ссылка скопирована!",
 "Paste it to your friend in any chat.": "Отправьте её другу в любом чате.",
 "Send this to a friend": "Отправить другу",
 "Done": "Готово",
 "SHOP": "МАГАЗИН",
 "+50 coins": "+50 монет",
 "Who's on the case?": "Кто ведёт расследование?",
 "Your name and progress are saved on this device.": "Ваше имя и прогресс сохраняются на этом устройстве.",
 "Your name": "Ваше имя",
 "Let's go": "Поехали!",
 "Tap here to set your name": "Нажмите, чтобы указать имя",
 "Hello, {0}!": "Привет, {0}!",
 "Rank: {0}": "Звание: {0}",
 "no cases solved yet": "пока нет раскрытых дел",
 "Tap to change name": "Нажмите, чтобы сменить имя",
 "Trophies": "Трофеи",
 "Shop": "Магазин",
 "Settings": "Настройки",
 "In progress": "В процессе",
 "{0} solved": "раскрыто: {0}",
 "New!": "Новое!",
 "Continue": "Продолжить",
 "Play": "Играть",
 "Level {0}": "Уровень {0}",
 "BOSS": "БОСС",
 "Boss levels every 5 · how far can you go?": "Босс каждые 5 уровней · как далеко вы зайдёте?",
 "Map": "Карта",
 "Save progress": "Сохранить прогресс",
 "<b>This browser is not saving your progress</b> (private mode or storage blocked). Open the game in your normal browser, or use {0}.": "<b>Этот браузер не сохраняет ваш прогресс</b> (приватный режим или заблокировано хранилище). Откройте игру в обычном браузере или используйте: {0}.",
 "Add to Home Screen": "Добавить на главный экран",
 "save a backup code": "сохраните резервный код",
 "Playing in Safari? iPhone can erase a website's saved progress after a week away. {0} to keep it safe, or {1}.": "Играете в Safari? iPhone может стереть сохранённый прогресс сайта, если не заходить неделю. {0}, чтобы сохранить его, или {1}.",
 "Save a backup code": "Сохраните резервный код",
 "Your progress is saved in this browser only. {0} to keep it safe.": "Ваш прогресс хранится только в этом браузере. {0}, чтобы не потерять его.",
 "Detective Shop": "Магазин детектива",
 "{0} coins": "{0} монет",
 "New look: {0} · {1}": "Новый образ: {0} · {1}",
 "You own every pack!": "У вас есть все наборы!",
 "{0}/{1} owned": "{0} из {1}",
 "Open": "Открыть",
 "Language": "Язык",
 "Sound & vibration": "Звук и вибрация",
 "Off": "Выкл.",
 "On": "Вкл.",
 "Your progress": "Ваш прогресс",
 "Change name": "Сменить имя",
 "Tutorial": "Обучение",
 "How to play": "Как играть",
 "Close": "Закрыть",
 "This backup is on level {0}, but you are on level {1}. Replace your progress anyway?": "Эта копия на уровне {0}, а вы на уровне {1}. Всё равно заменить ваш прогресс?",
 "Save your progress": "Сохраните прогресс",
 "Your progress lives on this phone. If you switch phones, reinstall, or open the game in a different browser, use this code to bring it back.": "Ваш прогресс хранится на этом телефоне. Если вы смените телефон, переустановите игру или откроете её в другом браузере, используйте этот код, чтобы его вернуть.",
 "Copy code": "Скопировать код",
 "Send to myself": "Отправить себе",
 "Restore from a code": "Восстановить из кода",
 "Paste a code that starts with MG1.": "Вставьте код, который начинается с MG1.",
 "Restore": "Восстановить",
 "Copied ✓": "Скопировано ✓",
 "Select & copy ↑": "Выделите и скопируйте ↑",
 "My Crime Grid progress backup (paste it in Settings → Save progress → Restore):": "Резервная копия моего прогресса в Crime Grid (вставьте её в Настройки → Сохранить прогресс → Восстановить):",
 "Progress restored!": "Прогресс восстановлен!",
 "Level {0}, {1} coins.": "Уровень {0}, монет: {1}.",
 "That code does not look right. Copy the whole thing, starting with MG1.": "Код выглядит неправильно. Скопируйте его целиком, начиная с MG1.",
 "You": "Вы",
 "{0} zone": "Зона: {0}",
 "Share ({0})": "Поделиться ({0})",
 "Solve level {0} first.": "Сначала пройдите уровень {0}.",
 "{0} updated!": "{0}: данные обновлены!",
 "{0} added!": "{0} добавлен(а)!",
 "Level {0} on the journey map.": "Уровень {0} на карте путешествия.",
 "{0}d ago": "{0} дн. назад",
 "today": "сегодня",
 "Level {0} · {1} cases · {2}-day streak · updated {3}": "Уровень {0} · дел: {1} · серия: {2} дн. · обновлено: {3}",
 "Remove": "Удалить",
 "No friends yet. Send your link to a friend, and ask for theirs!": "Друзей пока нет. Отправьте свою ссылку другу и попросите его ссылку!",
 "Share with friends": "Поделиться с друзьями",
 "You're on level <b>{0}</b>. Send your link so friends see you on their map. Send it again whenever you want them to see your new progress.": "Вы на уровне <b>{0}</b>. Отправьте свою ссылку, чтобы друзья видели вас на своей карте. Отправляйте её снова, когда хотите показать новый прогресс.",
 "Send my link": "Отправить мою ссылку",
 "Add a friend": "Добавить друга",
 "Join me on Crime Grid! I'm on level {0}. Open this link to add me as a friend (on iPhone with the app installed: copy it and paste it in Map → Share → Add a friend):": "Присоединяйся ко мне в Crime Grid! Я на уровне {0}. Открой эту ссылку, чтобы добавить меня в друзья (на iPhone с установленным приложением: скопируй её и вставь в Карта → Поделиться → Добавить друга):",
 "Paste the link (or code) your friend sent you.": "Вставьте ссылку (или код), которую прислал друг.",
 "Add": "Добавить",
 "Back": "Назад",
 "{0} is your friend!": "{0} теперь ваш друг!",
 "{0} is now on your map. To show up on <b>{0}'s</b> map too, send your link back.": "{0} теперь на вашей карте. Чтобы вы тоже появились на карте <b>{0}</b>, отправьте свою ссылку в ответ.",
 "<b>Using the installed app on iPhone?</b> This link opened in Safari, which keeps its own copy of the game. Open the app, go to <b>Map → Share → Add a friend</b> and paste the same link there.": "<b>Используете установленное приложение на iPhone?</b> Эта ссылка открылась в Safari, у которого своя копия игры. Откройте приложение, зайдите в <b>Карта → Поделиться → Добавить друга</b> и вставьте туда ту же ссылку.",
 "Copy this friend's link": "Скопировать ссылку этого друга",
 "Send my link to {0}": "Отправить мою ссылку: {0}",
 "Later": "Позже",
 "Hey {0}, add me back on Crime Grid! I'm on level {1}:": "Привет, {0}, добавь и меня в Crime Grid! Я на уровне {1}:",
 "Copied! Now paste it in the app": "Скопировано! Теперь вставьте в приложении",
 "Copy failed: long-press the link in WhatsApp and copy it": "Не удалось скопировать: нажмите на ссылку в WhatsApp и удерживайте, затем скопируйте",
 "Opening {0}'s challenge…": "Открываем вызов от {0}…",
 "Day {0}": "День {0}",
 "Daily gift!": "Ежедневный подарок!",
 "Come back every day for a bigger gift.": "Заходите каждый день, и подарок будет всё больше.",
 "Collect +{0} coins": "Забрать +{0} монет",
 "{0} cases": "Дела за {0}",
 "<b>{0}</b> of {1} days solved.": "Решено дней: <b>{0}</b> из {1}.",
 "You won the {0} trophy!": "Вы выиграли трофей месяца ({0})!",
 "Solve every daily case this month to win the {0} trophy.": "Решите все ежедневные дела этого месяца ({0}), чтобы выиграть трофей.",
 "Equipped ✓": "Выбрано ✓",
 "Equip": "Выбрать",
 "Buy for {0}": "Купить за {0}",
 "need {0} more": "не хватает {0}",
 "You have {0} <b>{1}</b> coins. New looks for every suspect and victim.": "У вас {0} <b>{1}</b> монет. Новые образы для всех подозреваемых и жертвы.",
 "Get coins": "Получить монеты",
 "Skin packs": "Наборы образов",
 "{0} unlocked!": "{0}: разблокировано!",
 "Equipped on every suspect.": "Выбрано для всех подозреваемых.",
 "Trophy room": "Зал трофеев",
 "Monthly trophies:": "Трофеи месяцев:",
 "Each trophy is worth 50 coins.": "Каждый трофей стоит 50 монет.",
 "Daily Case": "Дело дня",
 "{0}-day streak": "Серия: {0} дн.",
 "{0}-day streak, solve today to keep it!": "Серия: {0} дн. Решите дело сегодня, чтобы не прервать её!",
 "A new case every day. Same one for everyone!": "Новое дело каждый день, одно на всех!",
 "Calendar": "Календарь",
 "New here?": "Вы здесь впервые?",
 "Take the 2-minute tutorial: we'll solve a tiny case together, step by step.": "Пройдите двухминутное обучение: мы вместе, шаг за шагом, раскроем маленькое дело.",
 "Start tutorial": "Начать обучение",
 "I know how to play": "Я умею играть",
 "Opening today's case file…": "Открываем дело дня…",
 "Building a boss level…": "Готовим уровень с боссом…",
 "Building the crime scene…": "Готовим место преступления…",
 "Building a really nasty crime scene…": "Готовим очень хитрое место преступления…",
 "Your First Case": "Ваше первое дело",
 "A quiet evening, a loud scream. Let's learn the ropes together.": "Тихий вечер и громкий крик. Давайте разберёмся вместе.",
 "{0}'s challenge: {1}": "Вызов от {0}: {1}",
 "Daily Case: {0}": "Дело дня: {0}",
 "Level {0}: {1}": "Уровень {0}: {1}",
 "Case #{0}: {1}": "Дело №{0}: {1}",
 "⚔ {0} solved this in {1}. Can you beat that?": "⚔ {0} раскрыл(а) это за {1}. Сможете быстрее?",
 "Next": "Далее",
 "Challenge": "Вызов",
 "Daily": "Дело дня",
 "Boss": "Босс",
 "Mark mode: tap a square to cross it out ✕": "Режим отметок: нажмите на клетку, чтобы вычеркнуть её ✕",
 "Draft: tap every square where {0} might be.": "Черновик: нажмите на каждую клетку, где может находиться {0}.",
 "Draft mode: pick a suspect, then tap all the squares where they might be.": "Режим черновика: выберите подозреваемого и нажмите на все клетки, где он может быть.",
 "Pick a suspect below, then tap a square.": "Выберите подозреваемого внизу, затем нажмите на клетку.",
 "Pick a suspect first, then tap the squares where they might be 👇": "Сначала выберите подозреваемого, затем нажмите на клетки, где он может быть 👇",
 "Nobody can stand there!": "Здесь никто не может находиться!",
 "Tap Next in the box above first.": "Сначала нажмите «Далее» в рамке выше.",
 "Pick a suspect card below.": "Выберите карточку подозреваемого внизу.",
 "First tap {0}'s card below 👇": "Сначала нажмите на карточку {0} внизу 👇",
 "Let's place {0} first.": "Сначала поставим {0}.",
 "Not quite. Read the clue again 🙂": "Не совсем. Прочитайте подсказку ещё раз 🙂",
 "You picked up {0}. Tap a new square.": "Вы взяли {0}. Нажмите на новую клетку.",
 "First pick a suspect from the list below 👇": "Сначала выберите подозреваемого из списка внизу 👇",
 "Draft: tap every square where {0} might be. Tap again to erase.": "Черновик: нажмите на каждую клетку, где может находиться {0}. Нажмите ещё раз, чтобы стереть.",
 "Where was {0}? Tap a square.": "Где был(а) {0}? Нажмите на клетку.",
 "Two people share a row or column. That can't be right!": "Два человека в одной строке или в одном столбце. Так не бывает!",
 "🤔 Something doesn't add up… someone breaks one of their clues.": "🤔 Что-то не сходится… кто-то нарушает одну из своих подсказок.",
 "✅ Everyone is in place! Now… who did it?": "✅ Все на местах! Теперь… кто это сделал?",
 "Extra clues from headquarters": "Дополнительные подсказки из штаба",
 "<b>The victim.</b> Found in the last remaining square.": "<b>Жертва.</b> Найдена на последней свободной клетке.",
 "rip": "R.I.P.",
 "Detective's dictionary": "Словарь детектива",
 "Clear the board?": "Очистить доску?",
 "All placements, drafts and ✕ marks will be erased. Extra clues stay.": "Все расстановки, черновики и отметки ✕ будут стёрты. Дополнительные подсказки останутся.",
 "Yes, clear": "Да, очистить",
 "Cancel": "Отмена",
 "Follow the hints in the box above 🙂": "Следуйте подсказкам в рамке выше 🙂",
 "Need a hand, detective?": "Нужна помощь, детектив?",
 "You have {0} <b>{1}</b> coins.": "У вас {0} <b>{1}</b> монет.",
 "Give me an extra clue": "Дать дополнительную подсказку",
 "A fact about the whole scene. Nobody's spot is revealed.": "Факт обо всей сцене. Чьё-либо место не раскрывается.",
 "Check my placements": "Проверить мои расстановки",
 "Tells you if someone on the board is in the wrong spot.": "Покажет, стоит ли кто-то на доске не на своём месте.",
 "Reveal one suspect": "Раскрыть одного подозреваемого",
 "The last resort.": "Крайняя мера.",
 "Never mind": "Не надо",
 "Not enough coins ({0} needed). Solve cases and collect your daily gift to earn more!": "Не хватает монет (нужно {0}). Раскрывайте дела и забирайте ежедневный подарок, чтобы заработать больше!",
 "Headquarters has no more extra clues for this case. Try another kind of help.": "У штаба больше нет дополнительных подсказок по этому делу. Попробуйте другой вид помощи.",
 "🧾 New clue added above the suspects.": "🧾 Новая подсказка добавлена над списком подозреваемых.",
 "Place somebody on the board first, then I can check.": "Сначала поставьте кого-нибудь на доску, и тогда я смогу проверить.",
 "🔴 {0} is in the wrong spot.": "🔴 {0} стоит не на своём месте.",
 "👁️ {0} was in the wrong place. Fixed it.": "👁️ {0} стоял(а) не на своём месте. Я это исправил.",
 "👁️ Placed {0} in the right spot.": "👁️ Я поставил {0} на правильное место.",
 "Welcome, detective!": "Добро пожаловать, детектив!",
 "There was (yep, you guessed it) a murder last night. The good news? We have a lineup of suspects and a clue about each of them.": "Прошлой ночью было (да, вы угадали) убийство. Хорошая новость? У нас есть список подозреваемых и по подсказке на каждого.",
 "<b>Your goal:</b> find the murderer: the one person who was <b>alone with the victim</b> in the same room.": "<b>Ваша цель:</b> найти убийцу, то есть единственного человека, который был <b>наедине с жертвой</b> в одном помещении.",
 "Every person was in a <b>different row</b> and a <b>different column</b>, like sudoku.": "Каждый человек был в <b>своей строке</b> и в <b>своём столбце</b>, как в судоку.",
 "Some objects can be stood on (chairs, beds, rugs…), others can't (tables, plants…). Check the dictionary under the suspects.": "На одних предметах можно находиться (стулья, кровати, ковры…), на других нет (столы, растения…). Смотрите словарь под списком подозреваемых.",
 "The victim (<b>V</b>) is in the <b>last remaining square</b>.": "Жертва (<b>V</b>) находится на <b>последней свободной клетке</b>.",
 "<b>How to play:</b> tap a suspect card, then a square. Tap a placed suspect to pick them up again. Use <b>✏️ Draft</b> to pencil in every square where a suspect <i>might</i> be, and <b>✕ Mark</b> to cross out squares nobody can use.": "<b>Как играть:</b> нажмите на карточку подозреваемого, затем на клетку. Нажмите на уже поставленного подозреваемого, чтобы снять его. Используйте <b>✏️ Черновик</b>, чтобы отметить все клетки, где подозреваемый <i>может</i> быть, и <b>✕ Отметка</b>, чтобы вычеркнуть клетки, которые никто не может занять.",
 "<b>Stuck?</b> 💡 gives you an extra clue about the whole scene, checks your board, or (last resort) reveals a suspect.": "<b>Застряли?</b> 💡 даст дополнительную подсказку обо всей сцене, проверит вашу доску или (крайняя мера) раскроет подозреваемого.",
 "Each scene is different: a mansion, a ship, a forest, a space station and more.": "Каждая сцена особенная: особняк, корабль, лес, космическая станция и другие.",
 "Let's investigate!": "Приступаем к расследованию!",
 "Guided tutorial": "Обучение с подсказками",
 "{0} wasn't alone with {1} {2}! Look again.": "{0} не был(а) наедине с {1} {2}! Посмотрите ещё раз.",
 "Level {0} →": "Уровень {0} →",
 "Play level 1 →": "Играть с 1-го уровня →",
 "Next case →": "Следующее дело →",
 "Case closed: <b>{0}</b> did it.": "Дело закрыто: это сделал(а) <b>{0}</b>.",
 "Menu": "Меню",
 "Who did it?": "Кто это сделал?",
 "{0} was found {1} (highlighted). Who was alone with him?": "{0} нашли {1} (подсвечено). Кто был с ним наедине?",
 "{0} was found {1} (highlighted). Who was alone with her?": "{0} нашли {1} (подсвечено). Кто был с ней наедине?",
 "You did it, detective!": "У вас получилось, детектив!",
 "<b>{0}</b> was alone with {1} {2}. Case closed!": "<b>{0}</b> был(а) наедине с {1} {2}. Дело закрыто!",
 "Real cases have more suspects and trickier clues. Your tools:": "В настоящих делах больше подозреваемых и хитрее подсказки. Ваши инструменты:",
 "<b>Draft</b>: pencil in every square where a suspect <i>might</i> be.": "<b>Черновик</b>: отметьте все клетки, где подозреваемый <i>может</i> быть.",
 "<b>Mark</b>: cross out squares nobody can use.": "<b>Отметка</b>: вычеркните клетки, которые никто не может занять.",
 "<b>Help</b>: an extra clue when you're stuck.": "<b>Помощь</b>: дополнительная подсказка, если вы застряли.",
 "Play level 1": "Играть с 1-го уровня",
 "{0}-day streak! Come back tomorrow for a new case.": "Серия: {0} дн.! Возвращайтесь завтра за новым делом.",
 "You beat {0} by {1}! +30 coins": "Вы обогнали игрока {0} на {1}! +30 монет",
 "A perfect tie with {0}!": "Идеальная ничья с игроком {0}!",
 "{0} was faster by {1}.": "{0} был(а) быстрее на {1}.",
 "You {0} · {1} {2}": "Вы: {0} · {1}: {2}",
 "Level {0} complete!": "Уровень {0} пройден!",
 "He's on the way to jail.": "Его ведут в тюрьму.",
 "She's on the way to jail.": "Её ведут в тюрьму.",
 "Case closed!": "Дело закрыто!",
 "<b>{0}</b> was alone with {1} {2}.": "<b>{0}</b> был(а) наедине с {1} {2}.",
 "New personal best!": "Новый личный рекорд!",
 "Challenge back": "Ответный вызов",
 "Challenge a friend": "Бросить вызов другу",
 "Can you solve it?": "Сможешь решить?",
 "I solved \"{0}\" in {1} on Crime Grid. Can you beat my time?": "Я раскрыл(а) дело «{0}» за {1} в Crime Grid. Сможешь быстрее?",
 "Install on iPhone": "Установка на iPhone",
 "Open this page in <b>Safari</b>.": "Откройте эту страницу в <b>Safari</b>.",
 "Tap the <b>Share</b> button (square with an arrow).": "Нажмите кнопку <b>«Поделиться»</b> (квадрат со стрелкой).",
 "Choose <b>\"Add to Home Screen\"</b>.": "Выберите <b>«На экран „Домой“»</b>.",
 "From now on, open the game from the icon.": "Теперь открывайте игру с иконки.",
 "Install before you start playing: on iPhone the app keeps its progress separately from Safari.": "Установите игру до начала игры: на iPhone приложение хранит прогресс отдельно от Safari.",
 "Got it": "Понятно",
 "Rookie": "Новичок",
 "4×4 grid · 3 suspects": "Поле 4×4 · 3 подозреваемых",
 "Detective": "Детектив",
 "5×5 grid · 4 suspects": "Поле 5×5 · 4 подозреваемых",
 "Inspector": "Инспектор",
 "6×6 grid · 5 suspects": "Поле 6×6 · 5 подозреваемых",
 "Expert": "Эксперт",
 "8×8 grid · 7 suspects": "Поле 8×8 · 7 подозреваемых",
 "Extreme": "Экстрим",
 "10×10 grid · 9 suspects · bring coffee": "Поле 10×10 · 9 подозреваемых · запаситесь кофе",
 "Junior Detective": "Младший детектив",
 "Chief Inspector": "Главный инспектор",
 "Legend of the Force": "Легенда полиции",
 "Classic Detectives": "Классические детективы",
 "Basic": "Обычный",
 "The original cast.": "Исходный состав.",
 "Pet Detectives": "Детективы-зверята",
 "Common": "Обычный",
 "Cats, dogs, foxes, owls and more. Paws off the evidence!": "Кошки, собаки, лисы, совы и другие. Лапы прочь от улик!",
 "Noir Gangsters": "Гангстеры нуар",
 "Rare": "Редкий",
 "Fedoras, trench coats and very dark sunglasses.": "Шляпы-федоры, плащи и очень тёмные очки.",
 "Monster Mash": "Монстр-парад",
 "Vampires, mummies, ghosts, a cyclops and one very polite werewolf.": "Вампиры, мумии, призраки, циклоп и один очень вежливый оборотень.",
 "Royal Court": "Королевский двор",
 "Epic": "Эпический",
 "Crowns, jewels and ermine, in a shimmering gold frame.": "Короны, драгоценности и горностай в сверкающей золотой рамке.",
 "Space Crew": "Космический экипаж",
 "Astronauts and aliens, framed by the stars.": "Астронавты и инопланетяне в рамке из звёзд.",
 "Neon Legends": "Неоновые легенды",
 "Legendary": "Легендарный",
 "Glowing neon characters in a pulsing frame.": "Светящиеся неоновые персонажи в пульсирующей рамке.",
 "Masquerade Ball": "Бал-маскарад",
 "Premium": "Премиум",
 "Venetian masks, feathers and velvet. Comes with a gilded frame.": "Венецианские маски, перья и бархат. В позолоченной рамке.",
 "Cyber Agents": "Кибер-агенты",
 "Glowing visors and live scan lines. The flashiest look in the game.": "Светящиеся визоры и живые линии сканирования. Самый эффектный образ в игре.",
 "Popular": "Популярное",
 "Best value": "Выгодно",
 "👋 Welcome, detective! I'll walk you through your very first case. Tap <b>Next</b>.": "👋 Добро пожаловать, детектив! Я проведу вас через ваше первое дело. Нажмите <b>«Далее»</b>.",
 "This is the <b>crime scene</b>. Thick lines are walls: they split the house into rooms. You <b>can</b> stand on chairs, beds and rugs, but <b>not</b> on tables, plants or TVs.": "Это <b>место преступления</b>. Толстые линии это стены: они делят дом на комнаты. Можно находиться на стульях, кроватях и коврах, но <b>нельзя</b> на столах, растениях и телевизорах.",
 "The golden rule: every person was in a <b>different row</b> and a <b>different column</b>, just like sudoku.": "Золотое правило: каждый человек был в <b>своей строке</b> и в <b>своём столбце</b>, как в судоку.",
 "<b>Ava</b> was sitting on a chair. There is only <b>one chair</b> in the house! Tap Ava's card below, then tap the chair.": "<b>Ava</b> сидела на стуле. Во всём доме только <b>один стул</b>! Нажмите на карточку Ava внизу, затем на стул.",
 "Nice! Ava now owns her row and her column, so nobody else can use them. When you pick another suspect, those squares turn gray.": "Отлично! Теперь строка и столбец Ava заняты, и никто другой не может их использовать. Когда вы выбираете другого подозреваемого, эти клетки становятся серыми.",
 "<b>Ben</b> was lying on a bed. The bed covers two squares, but one of them is in Ava's column. So there is only one choice left. Place Ben!": "<b>Ben</b> лежал на кровати. Кровать занимает две клетки, но одна из них в столбце Ava. Остаётся только один вариант. Поставьте Ben!",
 "<b>Chloe</b> was in the Kitchen, <b>by a window</b> (the little bar on the outer wall). Only one Kitchen square touches a window. Place Chloe!": "<b>Chloe</b> была на кухне, <b>у окна</b> (маленькая полоска на внешней стене). Окна касается только одна клетка кухни. Поставьте Chloe!",
 "The victim is always in the <b>last free square</b>: only one row and one column are left. Place <b>Victor</b> there.": "Жертва всегда на <b>последней свободной клетке</b>: осталась только одна строка и один столбец. Поставьте туда <b>Victor</b>.",
 "Everyone is in place! Victor was found in the <b>Bedroom</b>. Who else was in the Bedroom? That person is the murderer!": "Все на местах! Victor нашли в <b>спальне</b>. Кто ещё был в спальне? Этот человек и есть убийца!",
 "Extreme bosses": "Боссы-экстрим",
 "First Case": "Первое дело",
 "Solve your first case": "Раскройте своё первое дело",
 "Seasoned Sleuth": "Опытный сыщик",
 "Solve 10 cases": "Раскройте 10 дел",
 "Case Cracker": "Взломщик дел",
 "Solve 50 cases": "Раскройте 50 дел",
 "Week of Crime": "Неделя преступлений",
 "Keep a 7-day daily streak": "Держите серию ежедневных дел 7 дней",
 "Monthly Mastermind": "Мастермайнд месяца",
 "Keep a 30-day daily streak": "Держите серию ежедневных дел 30 дней",
 "No Peeking": "Без подглядывания",
 "Solve an Inspector case or harder without any help": "Раскройте дело уровня Инспектор или сложнее без какой-либо помощи",
 "Expert Witness": "Свидетель-эксперт",
 "Solve an Expert case": "Раскройте дело уровня Эксперт",
 "Extreme Measures": "Крайние меры",
 "Solve an Extreme case": "Раскройте дело уровня Экстрим",
 "Speed Sleuth": "Быстрый сыщик",
 "Solve a Rookie case in under a minute": "Раскройте дело уровня Новичок меньше чем за минуту",
 "Globetrotter": "Путешественник",
 "Solve a case in all 9 scenes": "Раскройте дело в каждой из 9 сцен",
 "Halfway Hero": "Герой на полпути",
 "Reach level 25 on the journey": "Дойдите до 25-го уровня в путешествии",
 "Treasure Hunter": "Охотник за сокровищами",
 "Hold 500 coins at once": "Накопите 500 монет одновременно",
 "Sudoku meets murder mystery": "Судоку встречает детектив про убийство",
 "Solve the grid · Catch the culprit": "Реши сетку · Поймай виновного",
 "CASE FILE": "ДЕЛО",
 "OPEN": "ОТКРЫТО",
 "SOLVED": "РАСКРЫТО",
 "Cases": "Дела",
 "Friends": "Друзья",
 "More": "Ещё",
 "Free play": "Свободная игра",
 "Install app": "Установить приложение",
 "Place": "Поставить",
 "Draft": "Черновик",
 "Mark": "Отметка",
 "Help": "Помощь",
 "Undo": "Отменить",
 "Clear": "Очистить",
 "The Journey": "Путешествие",
 "Every level is a brand-new case": "Каждый уровень это совершенно новое дело",
 "Kitchen Crew": "Кухонная бригада",
 "Chef hats, curly mustaches and a pinch of suspicion.": "Поварские колпаки, закрученные усы и щепотка подозрений.",
 "Circus Clowns": "Цирковые клоуны",
 "Red noses, wild hair. Nobody trusts a clown.": "Красные носы, дикие причёски. Клоунам никто не верит.",
 "Wild West": "Дикий Запад",
 "Cowboy hats, bandanas and a shiny sheriff star.": "Ковбойские шляпы, банданы и блестящая звезда шерифа.",
 "Robo Squad": "Робоотряд",
 "Beep boop. Box heads with glowing LED eyes.": "Бип-буп. Квадратные головы со светящимися глазами.",
 "Pirate Crew": "Пиратская команда",
 "Eye patches, tricorns and gold earrings. Arr!": "Повязки на глаз, треуголки и золотые серьги. Арр!",
 "Shadow Ninjas": "Ниндзя тени",
 "Silent hoods, colourful headbands, one throwing star.": "Тихие капюшоны, яркие повязки и один сюрикен.",
 "Wizard Academy": "Академия волшебников",
 "Starry hats, long beards and glowing wands.": "Звёздные шляпы, длинные бороды и светящиеся палочки.",
 "Dino Hoodies": "Дино-пижамы",
 "Everyone in a dinosaur onesie. Rawr.": "Все в костюмах динозавров. Р-р-р.",
 "Super Squad": "Суперотряд",
 "Masks, capes and big shiny emblems.": "Маски, плащи и большие блестящие эмблемы.",
 "Deep Sea Gang": "Банда глубин",
 "Ten sea creatures: octopus, shark, turtle, crab, seahorse, jellyfish, pufferfish, starfish, whale and swordfish.": "Десять морских обитателей: осьминог, акула, черепаха, краб, морской конёк, медуза, рыба-фугу, морская звезда, кит и меч-рыба.",
 "Solve {0} cases": "Раскройте дел: {0}",
 "Solve a Hard or harder case": "Раскройте сложное дело или выше",
 "Solve a case without any help": "Раскройте дело без подсказок",
 "Earn {0} stars": "Заработайте звёзд: {0}",
 "Solve the Daily Case": "Раскройте дело дня",
 "Daily Missions": "Задания дня",
 "All missions done! +{0} coins": "Все задания выполнены! +{0} монет",
 "Mission complete: {0} · +{1} coins": "Задание выполнено: {0} · +{1} монет",
 "Win streak ×{0}: +{1} coins": "Серия побед ×{0}: +{1} монет",
 "Star chest": "Сундук звёзд",
 "{0}/{1} stars to the next chest": "{0}/{1} звёзд до следующего сундука",
 "Star chest opened! +{0} coins": "Сундук открыт! +{0} монет",
 "Star chest opened! New pack: {0}": "Сундук открыт! Новый набор: {0}",
 "Win streak: {0}": "Серия побед: {0}",
 "Partners in Crime": "Соучастники",
 "Exclusive": "Эксклюзив",
 "Only for detectives who duel a new friend.": "Только для детективов, сразившихся в дуэли с новым другом.",
 "Duel a new friend to unlock": "Дуэль с новым другом откроет набор",
 "Live duel": "Живая дуэль",
 "Live duel: {0}": "Живая дуэль: {0}",
 "First to solve it wins. {0} is dueling you right now!": "Кто первым раскроет дело, тот и победил. {0} сражается с вами прямо сейчас!",
 "New duel": "Новая дуэль",
 "Live duel with a friend": "Живая дуэль с другом",
 "New detective? You both get {0} coins and the exclusive Partners in Crime pack.": "Новый детектив? Вы оба получите {0} монет и эксклюзивный набор «Соучастники».",
 "Live duels need an internet connection.": "Для живой дуэли нужен интернет.",
 "Could not reach the duel server. Try again in a moment.": "Не удалось связаться с сервером. Попробуйте чуть позже.",
 "Same case, same moment. Whoever solves it first wins.": "Одно дело, одно мгновение. Кто раскроет первым, тот и победил.",
 "I have a code": "У меня есть код",
 "Join a duel": "Присоединиться к дуэли",
 "Type the 6-letter code your friend sent you.": "Введите 6-значный код, который прислал друг.",
 "Join": "Войти",
 "Opening a duel room…": "Открываем комнату дуэли…",
 "Live duels are not available in this version yet.": "В этой версии живые дуэли пока недоступны.",
 "Joining the duel…": "Подключаемся к дуэли…",
 "This duel has ended, or the code is wrong.": "Эта дуэль закончилась или код неверный.",
 "This duel already has two detectives.": "В этой дуэли уже два детектива.",
 "This duel has already started.": "Эта дуэль уже началась.",
 "Friend": "Друг",
 "Connecting…": "Подключение…",
 "Waiting for your friend to join…": "Ждём, когда друг присоединится…",
 "Get ready!": "Приготовьтесь!",
 "{0} joined! Starting…": "{0} на месте! Начинаем…",
 "Send this code or the invite link to a friend:": "Отправьте другу этот код или ссылку-приглашение:",
 "Send invite": "Отправить приглашение",
 "Duel me on Crime Grid! Same case, first to solve it wins. Code: {0}": "Сразимся в дуэли в Crime Grid! Одно дело, кто раскроет первым, тот победил. Код: {0}",
 "Your friend cancelled the duel.": "Друг отменил дуэль.",
 "{0} solved it first!": "{0} раскрыл(а) дело первым!",
 "Finish the case anyway.": "Всё равно доведите дело до конца.",
 "{0} left the duel.": "{0} покинул(а) дуэль.",
 "Dueling {0}": "Дуэль с {0}",
 "Solved!": "Раскрыто!",
 "Checking who was first…": "Проверяем, кто был первым…",
 "You won the duel against {0}! +{1} coins": "Вы победили {0} в дуэли! +{1} монет",
 "{0} solved it first.": "{0} раскрыл(а) дело первым.",
 "+{0} coins for dueling {1}!": "+{0} монет за дуэль с {1}!",
 "Partners in Crime pack unlocked. Equip it in the shop.": "Набор «Соучастники» открыт. Наденьте его в магазине.",
 "Thanks for bringing a new detective!": "Спасибо, что привели нового детектива!",
 "Online now": "Сейчас в сети",
 "Duel {0}": "Дуэль с {0}",
 "No friends yet. Tell a friend your detective ID, or add theirs.": "Пока нет друзей. Скажите другу свой ID детектива или добавьте его ID.",
 "Your detective ID": "Ваш ID детектива",
 "Copy": "Копировать",
 "Friend's ID": "ID друга",
 "Friends you add here can invite you to duels right inside the game.": "Друзья, добавленные здесь, могут вызывать вас на дуэль прямо в игре.",
 "Other ways to add friends": "Другие способы добавить друзей",
 "Delete my online ID": "Удалить мой онлайн-ID",
 "Copied!": "Скопировано!",
 "Pick a level. {0} gets the invite inside the game.": "Выберите уровень. {0} получит приглашение прямо в игре.",
 "{0} can't duel right now.": "{0} сейчас не может сразиться.",
 "{0} may be offline. Send the code another way, or try later.": "Возможно, {0} не в сети. Отправьте код другим способом или попробуйте позже.",
 "Invite sent to {0}. Waiting…": "Приглашение отправлено: {0}. Ждём…",
 "{0} added you as a friend!": "{0} добавил(а) вас в друзья!",
 "You can now invite each other to duels.": "Теперь вы можете вызывать друг друга на дуэль.",
 "Duel invite!": "Вызов на дуэль!",
 "{0} invites you to a live duel ({1}). First to solve the case wins!": "{0} вызывает вас на живую дуэль ({1}). Кто первым раскроет дело, тот и победил!",
 "Not now": "Не сейчас",
 "An ID has 6 letters and numbers.": "ID состоит из 6 букв и цифр.",
 "That's your own ID.": "Это ваш собственный ID.",
 "No detective with this ID.": "Детектива с таким ID нет.",
 "{0} added! They will see you in their friends list too.": "{0} добавлен(а)! Вы тоже появитесь в списке друзей.",
 "This removes your detective ID and online profile from the server. Your progress on this device stays. Friends will no longer be able to invite you in the game.": "Ваш ID детектива и онлайн-профиль будут удалены с сервера. Прогресс на этом устройстве сохранится. Друзья больше не смогут звать вас в игре.",
 "Delete": "Удалить",
 "Online ID deleted.": "Онлайн-ID удалён.",
 "Get a detective ID": "Получить ID детектива",
 "Duel": "Дуэль",
 "Stake per player": "Ставка с каждого",
 "Free": "Бесплатно",
 "The winner takes {0} coins. Leaving early loses your stake.": "Победитель забирает {0} монет. Кто выйдет раньше, потеряет ставку.",
 "Stake: {0} coins each. The winner takes {1}.": "Ставка: по {0} монет. Победитель забирает {1}.",
 "{0} challenges you for {1} coins each. The winner takes {2}. Join?": "{0} предлагает сыграть на {1} монет с каждого. Победитель забирает {2}. Присоединиться?",
 "You need {0} coins to join this duel.": "Чтобы присоединиться к дуэли, нужно {0} монет.",
 "Not enough coins for this stake.": "Не хватает монет для этой ставки.",
 "{0} solved it first. You lost {1} coins.": "{0} раскрыл(а) дело первым. Вы потеряли {1} монет.",
 "You left a duel with a stake. The stake was lost.": "Вы вышли из дуэли со ставкой. Ставка потеряна.",
 "You lost {0} coins.": "Вы потеряли {0} монет.",
 "To invite {0} inside the game, add them once with their detective ID (Friends screen).": "Чтобы звать {0} прямо в игре, один раз добавьте друга по его ID детектива (экран «Друзья»).",
 "{0} can't get invites yet. Send the code another way.": "{0} пока не может получать приглашения. Отправьте код другим способом.",
 "{0} invites you to a live duel ({1}) for {2} coins each. The winner takes {3}!": "{0} зовёт вас на живую дуэль ({1}) на {2} монет с каждого. Победитель забирает {3}!",
 "No ads": "Без рекламы",
 "Remove ads": "Отключить рекламу",
 "Enjoy Crime Grid without ads. One payment, no subscription. It comes back if you reinstall the game.": "Играйте в Crime Grid без рекламы. Один платёж, без подписки. Покупка вернётся, если переустановить игру.",
 "Ads removed. Thank you!": "Реклама отключена. Спасибо!",
 "Daily Mission": "Ежедневное задание",
 "Streak freeze used!": "Заморозка серии сработала!",
 "Your {0}-day streak is safe. Solve today to keep it going.": "Ваша серия в {0} дн. сохранена. Решите дело сегодня, чтобы продолжить.",
 "Daily reminder": "Ежедневное напоминание",
 "Pick a time. Your calendar will remind you every day to solve the Daily Case.": "Выберите время. Календарь будет каждый день напоминать вам о ежедневном деле.",
 "Crime Grid: today's case is waiting": "Crime Grid: дело дня ждёт",
 "Solve the Daily Case and keep your streak!": "Решите ежедневное дело и сохраните серию!",
 "Reminder file ready": "Файл напоминания готов",
 "Open it to add the daily reminder to your calendar.": "Откройте его, чтобы добавить ежедневное напоминание в календарь.",
 "Freeze": "Заморозка",
 "Remind me": "Напомнить",
 "Streak freeze earned! It saves your streak if you miss one day.": "Вы получили заморозку серии! Она сохранит серию, если пропустить один день.",
 "New trick: \"What if?\"": "Новый приём: «А что, если?»",
 "Stuck? Pretend a suspect stands on one square and follow the clues.": "Застряли? Представьте, что подозреваемый стоит на одной клетке, и проследите за подсказками.",
 "Pencil the guess in with <b>Draft</b>, so it is only an idea.": "Отметьте догадку в режиме <b>Черновик</b>, чтобы это была лишь идея.",
 "If two people end up in the same row or column, or a clue breaks, the guess was impossible.": "Если двое оказываются в одной строке или столбце или подсказка нарушена, догадка невозможна.",
 "Cross that square out with <b>Mark</b> and try another one.": "Вычеркните эту клетку в режиме <b>Отметка</b> и попробуйте другую.",
 "Bigger cases need this a lot. Take your time.": "В больших делах это нужно часто. Не торопитесь.",
 "Jazz Age": "Эпоха джаза",
 "Art deco gold, bow ties, pearls and a sunburst frame.": "Золото ар-деко, галстуки-бабочки, жемчуг и рамка с лучами.",
 "Steampunk Guild": "Гильдия стимпанка",
 "Brass goggles, gears and top hats in a riveted frame.": "Латунные очки, шестерёнки и цилиндры в клёпаной рамке.",
 "Haunted Gala": "Бал призраков",
 "Powdered wigs, lace collars and candlelight. Ghosts welcome.": "Напудренные парики, кружевные воротники и свечи. Призракам рады.",
 "Watch a short video: free clue": "Короткое видео: бесплатная подсказка",
 "{0} left today": "Осталось сегодня: {0}",
 "Watch a short video: double coins (+{0})": "Короткое видео: двойные монеты (+{0})",
 "Coins doubled!": "Монеты удвоены!",
 "No video available right now. Try again later.": "Сейчас нет доступного видео. Попробуйте позже.",
 "Replace your progress?": "Заменить прогресс?",
 "Keep my progress": "Оставить мой прогресс",
 "Replace": "Заменить",
 "Report or block": "Пожаловаться или заблокировать",
 "Report this player, or block them so they can never invite you again.": "Пожалуйтесь на игрока или заблокируйте его, чтобы он больше не мог вас приглашать.",
 "Report: {0}": "Жалоба: {0}",
 "Offensive name": "Оскорбительное имя",
 "Cheating": "Обман",
 "Harassment": "Преследование",
 "Something else": "Другое",
 "Block {0}": "Заблокировать {0}",
 "Blocked. {0} can no longer invite you.": "Заблокирован. {0} больше не сможет вас приглашать.",
 "Report sent. Thank you!": "Жалоба отправлена. Спасибо!",
 "You blocked this player.": "Вы заблокировали этого игрока.",
 "Unblock all ({0})": "Разблокировать всех ({0})"
},
    pl: {
 "{0} cases solved": {
  "one": "{0} дело раскрыто",
  "few": "{0} дела раскрыто",
  "many": "{0} дел раскрыто",
  "other": "{0} дела раскрыто"
 },
 "{0} levels to {1}": {
  "one": "{0} уровень до {1}",
  "few": "{0} уровня до {1}",
  "many": "{0} уровней до {1}",
  "other": "{0} уровня до {1}"
 },
 "Map & {0} friends": {
  "one": "Карта и {0} друг",
  "few": "Карта и {0} друга",
  "many": "Карта и {0} друзей",
  "other": "Карта и {0} друга"
 },
 "Solved with {0} stars.": {
  "one": "Пройден с {0} звездой.",
  "few": "Пройден с {0} звёздами.",
  "many": "Пройден с {0} звёздами.",
  "other": "Пройден с {0} звёздами."
 },
 "✅ So far so good: all {0} people you placed are in the right spot.": {
  "one": "✅ Пока всё хорошо: поставленный вами человек на своём месте.",
  "few": "✅ Пока всё хорошо: все поставленные вами люди ({0}) на своих местах.",
  "many": "✅ Пока всё хорошо: все поставленные вами люди ({0}) на своих местах.",
  "other": "✅ Пока всё хорошо: все поставленные вами люди ({0}) на своих местах."
 },
 "🔴 {0} people are in the wrong spot.": {
  "one": "🔴 {0} человек стоит не на своём месте.",
  "few": "🔴 {0} человека стоят не на своих местах.",
  "many": "🔴 {0} человек стоят не на своих местах.",
  "other": "🔴 {0} человека стоят не на своих местах."
 },
 "{0} clues/checks": {
  "one": "{0} подсказка/проверка",
  "few": "{0} подсказки/проверки",
  "many": "{0} подсказок/проверок",
  "other": "{0} подсказки/проверки"
 },
 "{0} reveals": {
  "one": "{0} раскрытие",
  "few": "{0} раскрытия",
  "many": "{0} раскрытий",
  "other": "{0} раскрытия"
 }
},
    zones: {
 "Living Room": [
  "Гостиная",
  "в гостиной"
 ],
 "Kitchen": [
  "Кухня",
  "на кухне"
 ],
 "Bedroom": [
  "Спальня",
  "в спальне"
 ],
 "Bathroom": [
  "Ванная",
  "в ванной"
 ],
 "Study": [
  "Кабинет",
  "в кабинете"
 ],
 "Library": [
  "Библиотека",
  "в библиотеке"
 ],
 "Dining Room": [
  "Столовая",
  "в столовой"
 ],
 "Music Room": [
  "Музыкальная комната",
  "в музыкальной комнате"
 ],
 "Guest Room": [
  "Гостевая комната",
  "в гостевой комнате"
 ],
 "Main Deck": [
  "Главная палуба",
  "на главной палубе"
 ],
 "Bridge": [
  "Капитанский мостик",
  "на капитанском мостике"
 ],
 "Cabin": [
  "Каюта",
  "в каюте"
 ],
 "Galley": [
  "Камбуз",
  "на камбузе"
 ],
 "Cargo Hold": [
  "Грузовой трюм",
  "в грузовом трюме"
 ],
 "Engine Room": [
  "Машинное отделение",
  "в машинном отделении"
 ],
 "Lounge": [
  "Салон",
  "в салоне"
 ],
 "Captain's Quarters": [
  "Каюта капитана",
  "в каюте капитана"
 ],
 "Clearing": [
  "Поляна",
  "на поляне"
 ],
 "Campsite": [
  "Лагерь",
  "в лагере"
 ],
 "Riverbank": [
  "Берег реки",
  "на берегу реки"
 ],
 "Pine Grove": [
  "Сосновая роща",
  "в сосновой роще"
 ],
 "Cave": [
  "Пещера",
  "в пещере"
 ],
 "Mushroom Patch": [
  "Грибная поляна",
  "на грибной поляне"
 ],
 "Lakeside": [
  "Берег озера",
  "на берегу озера"
 ],
 "Old Oak": [
  "Старый дуб",
  "в зоне старого дуба"
 ],
 "Command Deck": [
  "Командная палуба",
  "на командной палубе"
 ],
 "Science Lab": [
  "Научная лаборатория",
  "в научной лаборатории"
 ],
 "Sleeping Pods": [
  "Спальные капсулы",
  "в спальных капсулах"
 ],
 "Hydroponics": [
  "Гидропоника",
  "в гидропонной оранжерее"
 ],
 "Mess Hall": [
  "Кают-компания",
  "в кают-компании"
 ],
 "Observatory": [
  "Обсерватория",
  "в обсерватории"
 ],
 "Robotics Bay": [
  "Робототехнический отсек",
  "в робототехническом отсеке"
 ],
 "Cargo Module": [
  "Грузовой модуль",
  "в грузовом модуле"
 ],
 "Lobby": [
  "Вестибюль",
  "в вестибюле"
 ],
 "Dinosaur Hall": [
  "Зал динозавров",
  "в зале динозавров"
 ],
 "Ancient Wing": [
  "Древнее крыло",
  "в древнем крыле"
 ],
 "Gallery": [
  "Галерея",
  "в галерее"
 ],
 "Café": [
  "Кафе",
  "в кафе"
 ],
 "Vault": [
  "Хранилище",
  "в хранилище"
 ],
 "Gift Shop": [
  "Сувенирный магазин",
  "в сувенирном магазине"
 ],
 "Space Exhibit": [
  "Космическая выставка",
  "на космической выставке"
 ],
 "Locomotive": [
  "Локомотив",
  "в локомотиве"
 ],
 "Dining Car": [
  "Вагон-ресторан",
  "в вагоне-ресторане"
 ],
 "Sleeper Car": [
  "Спальный вагон",
  "в спальном вагоне"
 ],
 "Luggage Car": [
  "Багажный вагон",
  "в багажном вагоне"
 ],
 "Lounge Car": [
  "Вагон-салон",
  "в вагоне-салоне"
 ],
 "Observation Car": [
  "Смотровой вагон",
  "в смотровом вагоне"
 ],
 "First Class": [
  "Первый класс",
  "в первом классе"
 ],
 "Center Ring": [
  "Центральная арена",
  "на центральной арене"
 ],
 "Backstage": [
  "Закулисье",
  "за кулисами"
 ],
 "Animal Tent": [
  "Шатёр зверей",
  "в шатре зверей"
 ],
 "Clown Trailer": [
  "Трейлер клоунов",
  "в трейлере клоунов"
 ],
 "Snack Stand": [
  "Лоток с закусками",
  "в зоне лотка с закусками"
 ],
 "Ticket Booth": [
  "Касса",
  "в зоне кассы"
 ],
 "Strongman Tent": [
  "Шатёр силача",
  "в шатре силача"
 ],
 "Throne Room": [
  "Тронный зал",
  "в тронном зале"
 ],
 "Great Hall": [
  "Большой зал",
  "в большом зале"
 ],
 "Armory": [
  "Оружейная",
  "в оружейной"
 ],
 "Dungeon": [
  "Подземелье",
  "в подземелье"
 ],
 "Chapel": [
  "Часовня",
  "в часовне"
 ],
 "Tower": [
  "Башня",
  "в башне"
 ],
 "Castle Kitchen": [
  "Замковая кухня",
  "на замковой кухне"
 ],
 "Fireside Lounge": [
  "Каминный зал",
  "в каминном зале"
 ],
 "Ski Shop": [
  "Лыжный магазин",
  "в лыжном магазине"
 ],
 "Hot Tub Deck": [
  "Терраса с джакузи",
  "на террасе с джакузи"
 ],
 "Bunk Room": [
  "Комната с койками",
  "в комнате с койками"
 ],
 "Lodge Kitchen": [
  "Кухня шале",
  "на кухне шале"
 ],
 "Snowy Patio": [
  "Заснеженный дворик",
  "на заснеженном дворике"
 ]
},
    themes: {
 "The Mansion": "Особняк",
 "The Ship": "Корабль",
 "The Forest": "Лес",
 "The Space Station": "Космическая станция",
 "The Museum": "Музей",
 "The Night Train": "Ночной поезд",
 "The Circus": "Цирк",
 "The Castle": "Замок",
 "The Ski Lodge": "Лыжное шале"
},
    objs: {
 "chair": [
  "стул",
  "стулом",
  "sit",
  "на стуле",
  "никаким"
 ],
 "bed": [
  "кровать",
  "кроватью",
  "lie",
  "на кровати",
  "никакой"
 ],
 "rug": [
  "ковёр",
  "ковром",
  "stand",
  "на ковре",
  "никаким"
 ],
 "table": [
  "стол",
  "столом",
  null,
  null,
  "никаким"
 ],
 "tv": [
  "телевизор",
  "телевизором",
  null,
  null,
  "никаким"
 ],
 "plant": [
  "растение",
  "растением",
  null,
  null,
  "никаким"
 ],
 "bathtub": [
  "ванна",
  "ванной",
  null,
  null,
  "никакой"
 ],
 "piano": [
  "пианино",
  "пианино",
  null,
  null,
  "никаким"
 ],
 "seat": [
  "кресло",
  "креслом",
  "sit",
  "в кресле",
  "никаким"
 ],
 "crate": [
  "ящик",
  "ящиком",
  "sit",
  "на ящике",
  "никаким"
 ],
 "barrel": [
  "бочка",
  "бочкой",
  null,
  null,
  "никакой"
 ],
 "lifebuoy": [
  "спасательный круг",
  "спасательным кругом",
  null,
  null,
  "никаким"
 ],
 "anchor": [
  "якорь",
  "якорем",
  null,
  null,
  "никаким"
 ],
 "wheel": [
  "штурвал",
  "штурвалом",
  null,
  null,
  "никаким"
 ],
 "tree": [
  "дерево",
  "деревом",
  null,
  null,
  "никаким"
 ],
 "rock": [
  "валун",
  "валуном",
  null,
  null,
  "никаким"
 ],
 "log": [
  "бревно",
  "бревном",
  "sit",
  "на бревне",
  "никаким"
 ],
 "tent": [
  "палатка",
  "палаткой",
  "in",
  "в палатке",
  "никакой"
 ],
 "campfire": [
  "костёр",
  "костром",
  null,
  null,
  "никаким"
 ],
 "mushroom": [
  "гигантский гриб",
  "гигантским грибом",
  null,
  null,
  "никаким"
 ],
 "canoe": [
  "каноэ",
  "каноэ",
  "sit",
  "в каноэ",
  "никаким"
 ],
 "computer": [
  "компьютер",
  "компьютером",
  null,
  null,
  "никаким"
 ],
 "robot": [
  "робот",
  "роботом",
  null,
  null,
  "никаким"
 ],
 "telescope": [
  "телескоп",
  "телескопом",
  null,
  null,
  "никаким"
 ],
 "statue": [
  "статуя",
  "статуей",
  null,
  null,
  "никакой"
 ],
 "dino": [
  "скелет динозавра",
  "скелетом динозавра",
  null,
  null,
  "никаким"
 ],
 "vase": [
  "древняя ваза",
  "древней вазой",
  null,
  null,
  "никакой"
 ],
 "suitcase": [
  "чемодан",
  "чемоданом",
  "sit",
  "на чемодане",
  "никаким"
 ],
 "drum": [
  "барабан",
  "барабаном",
  null,
  null,
  "никаким"
 ],
 "elephant": [
  "слон",
  "слоном",
  null,
  null,
  "никаким"
 ],
 "popcorn": [
  "тележка с попкорном",
  "тележкой с попкорном",
  null,
  null,
  "никакой"
 ],
 "hay": [
  "стог сена",
  "стогом сена",
  "sit",
  "на стоге сена",
  "никаким"
 ],
 "balloon": [
  "лоток с шарами",
  "лотком с шарами",
  null,
  null,
  "никаким"
 ],
 "fireplace": [
  "камин",
  "камином",
  null,
  null,
  "никаким"
 ],
 "skis": [
  "стойка с лыжами",
  "стойкой с лыжами",
  null,
  null,
  "никакой"
 ],
 "snowman": [
  "снеговик",
  "снеговиком",
  null,
  null,
  "никаким"
 ],
 "hottub": [
  "джакузи",
  "джакузи",
  "in",
  "в джакузи",
  "никаким"
 ],
 "armor": [
  "рыцарские доспехи",
  "рыцарскими доспехами",
  null,
  null,
  "никакими"
 ],
 "throne": [
  "трон",
  "троном",
  "sit",
  "на троне",
  "никаким"
 ],
 "candle": [
  "канделябр",
  "канделябром",
  null,
  null,
  "никаким"
 ],
 "swords": [
  "стойка с оружием",
  "стойкой с оружием",
  null,
  null,
  "никакой"
 ],
 "coal": [
  "куча угля",
  "кучей угля",
  null,
  null,
  "никакой"
 ],
 "cactus": [
  "кактус",
  "кактусом",
  null,
  null,
  "никаким"
 ]
},
    objLabel: (e) => e[0],
    stories: [
 [
  "Смерть от десерта",
  "Посыпка была ненастоящей. Как и алиби всех гостей."
 ],
 [
  "Дворецкий не виноват",
  "На этот раз у дворецкого железное алиби. Как грубо."
 ],
 [
  "Завещание и могила",
  "Бабушка оставила всё своему коту. Кто-то принял это близко к сердцу."
 ],
 [
  "Чай, печенье и предательство",
  "Мизинчики вверх. Тела вниз."
 ],
 [
  "Новоселье остыло",
  "Принесли цветок. Кто-то принёс злость."
 ],
 [
  "Беда в спа",
  "Маски для лица, кружки огурца и очень долгий сон."
 ],
 [
  "Крик на пижамной вечеринке",
  "В «правде или действии» оказалось слишком много правды."
 ],
 [
  "Пароль от Wi-Fi",
  "Никто не хотел делиться. Кто-то сорвался."
 ],
 [
  "Убийство по высшему разряду",
  "Серебро начистили. Алиби не начистили."
 ],
 [
  "Драма с люстрой",
  "В полночь что-то упало, и это была не люстра."
 ],
 [
  "Выходной дворецкого",
  "Без дворецкого всё быстро пошло наперекосяк."
 ],
 [
  "Битва за наследство",
  "Пять родственников, одно состояние, ноль спокойствия."
 ],
 [
  "Ужин для интриганов",
  "Семь блюд. Одно из них было местью."
 ],
 [
  "Свидетель-обои",
  "Если бы эти стены умели говорить, они потребовали бы адвоката."
 ],
 [
  "Неудачный бранч",
  "Сок лился рекой. Ложь тоже."
 ],
 [
  "Пропавший монокль",
  "Всё началось с пропавшего монокля. Закончилось пропавшим гостем."
 ],
 [
  "Почти «Титаник»",
  "Хорошие новости: на этот раз айсберг ни в чём не виноват."
 ],
 [
  "Морская болезнь и подозрения",
  "Половина пассажиров позеленела. Один был виновен."
 ],
 [
  "Ни узла, ни вины",
  "Все моряки клянутся, что они ни в чём не виноваты. Ха. Ха."
 ],
 [
  "Капитан Очевидность",
  "Капитан ничего не видел. Как обычно."
 ],
 [
  "Шведский стол (на выбывание)",
  "Креветок без ограничений. Выживших ограниченное число."
 ],
 [
  "Драма за бортом",
  "Кто-то крикнул «человек за бортом!». Ошибся во всём."
 ],
 [
  "Круиз любви, дело остыло",
  "Романтический круиз. Много круиза, мало романтики."
 ],
 [
  "Море бывает всякое",
  "Об этом в рекламной брошюре не писали."
 ],
 [
  "Отношения на дне",
  "Старые друзья, один круиз, слишком много секретов."
 ],
 [
  "Прощай, море",
  "Прощальная вечеринка получилась слишком прощальной."
 ],
 [
  "Палуба для драки",
  "Кто-то уложил кого-то, и совсем не по-праздничному."
 ],
 [
  "Порт без ответа",
  "Никто не отвечал, когда корабль вызывал порт. Подозрительно."
 ],
 [
  "Шторм и ещё хуже гости",
  "Волны были дикими. Пассажиры ещё дичее."
 ],
 [
  "Учебная тревога",
  "Все нашли себе место. Почти все."
 ],
 [
  "Якоря в воду",
  "Якорь упал. Настроение тоже."
 ],
 [
  "Ужин у капитана",
  "Красивые костюмы, ещё красивее ложь."
 ],
 [
  "Убийство с зефиром",
  "Сделали сморы. И ошибки тоже."
 ],
 [
  "Невиновен, как медведь",
  "Все винили медведя. Медведь нанял адвоката."
 ],
 [
  "Очень палаточная ночь",
  "У костра всё стало слишком палаточным."
 ],
 [
  "Потерялся и нашёлся",
  "Собака нашла тело. Хороший пёс, плохая ночь."
 ],
 [
  "Поход на максималках",
  "На карте стояло «легко». Карта лгала."
 ],
 [
  "Страшилка пошла не так",
  "Самое страшное в истории оказалось правдой."
 ],
 [
  "Комариные укусы и убийство",
  "Не только комары жаждали крови."
 ],
 [
  "Оставьте меня в лесу",
  "Кто-то очень хотел побыть один. Навсегда."
 ],
 [
  "Поверишь ли ты в это",
  "Деревья всё видели. К сожалению, деревья не дают показаний."
 ],
 [
  "Сосна и наказание",
  "Свежий воздух, свежее преступление."
 ],
 [
  "След лжи",
  "Каждый след вёл в разные стороны."
 ],
 [
  "Сова всё видит",
  "Сова всю ночь спрашивала «кто?». Справедливый вопрос."
 ],
 [
  "Признания у костра",
  "Никто не признался. Классические туристы."
 ],
 [
  "Разыскивается мох",
  "Природа прекрасна. Ещё она отличное укрытие."
 ],
 [
  "Ветвистая карьера",
  "Кто-то пошёл вверх по карьерной лестнице. И по дереву."
 ],
 [
  "В лес",
  "Шестеро поехали на выходные. Остальное вы знаете."
 ],
 [
  "Хьюстон, у нас труп",
  "В космосе никто ничего не слышит. К счастью, кто-то увидел."
 ],
 [
  "Выбит из космоса",
  "Кто-то забыл проверить кислород. Кто-то другой «помог»."
 ],
 [
  "Нулевая гравитация, нулевые алиби",
  "Все парили по станции. Никто не был там, где сказал."
 ],
 [
  "Загадка лунного пирожного",
  "Съели последнее лунное пирожное. И всё стало личным."
 ],
 [
  "Маленькое зелёное алиби",
  "Экипаж обвинил маленьких зелёных гостей. Гости обиделись."
 ],
 [
  "Не ракетная наука",
  "Это не ракетная наука. Ладно, чуть-чуть ракетная."
 ],
 [
  "Ctrl + Alt + Труп",
  "Компьютер станции всё видел. Он молчит."
 ],
 [
  "Потерянные в спагетти",
  "Вечер макарон на орбите пошёл ужасно, макаронно не так."
 ],
 [
  "Космическая странность",
  "Центр управления потерял связь. С одним членом экипажа."
 ],
 [
  "Марсианское алиби",
  "«Я был на Марсе» здесь алиби не считается."
 ],
 [
  "Несчастный случай с астероидом?",
  "Это был не астероид."
 ],
 [
  "Тайна чёрной дыры",
  "Улики здесь исчезают быстро. Поторопитесь."
 ],
 [
  "Проверка гравитации",
  "Кто-то забыл главное правило космоса: будь добрым."
 ],
 [
  "Астро-нет",
  "Один астронавт не вернётся на Землю."
 ],
 [
  "Соперники по ракетному топливу",
  "Два инженера, одно повышение, ни капли лишнего кислорода."
 ],
 [
  "Позорная лунная прогулка",
  "Кто-то пытался улизнуть. На Луне. Смело."
 ],
 [
  "Ночь в мавзолее",
  "Экспонаты ожили. Один гость нет."
 ],
 [
  "Дино-бомба",
  "У тираннозавра крошечные лапки. Точно не он."
 ],
 [
  "Атака искусства",
  "Критики сказали, что выставка убойная. Они не ошиблись."
 ],
 [
  "Проблемы с мумией",
  "Они есть у всех. У одного они были очень серьёзными."
 ],
 [
  "Руками не трогать",
  "Кто-то потрогал. Кто-то за это заплатил."
 ],
 [
  "Сувенирный магазин ужасов",
  "Выход через сувенирный магазин. Если получится."
 ],
 [
  "Старше пыли",
  "Чьё-то алиби старше этих ваз."
 ],
 [
  "Скульптурная фантастика",
  "У каждой статуи здесь идеальное покерное лицо."
 ],
 [
  "Экспонат А",
  "Новейшего экспоната не было на плане."
 ],
 [
  "Ископаемое топливо",
  "Старые кости, новые проблемы."
 ],
 [
  "Дело Лувра",
  "Не тот музей. Но драмы не меньше."
 ],
 [
  "Рамка для подставы",
  "Кого-то подставляют. Буквально."
 ],
 [
  "Реликвия вдребезги",
  "Бесценная реликвия, дорогая ошибка."
 ],
 [
  "Статуя ограничений",
  "Статуи молчат. Остальные лгут."
 ],
 [
  "Музей после закрытия",
  "Экскурсия закончилась в пять. Тайна началась в шесть."
 ],
 [
  "Сломал, купи",
  "Кто-то сломал нечто гораздо хуже вазы."
 ],
 [
  "Убийство в эспрессо",
  "Подали кофе. И месть."
 ],
 [
  "Чух-чух, выбирай мудро",
  "Один пассажир сделал очень плохой выбор."
 ],
 [
  "Сошли с рельсов",
  "Вечеринка вышла из-под контроля где-то у третьего туннеля."
 ],
 [
  "Билет в один конец",
  "Билеты в одну сторону. Очень, очень в одну."
 ],
 [
  "Дуэль у тележки со снеками",
  "Кто-то взял последние крендельки. Серьёзная ошибка."
 ],
 [
  "Следующая остановка: никто",
  "Проводник вызвал станцию. Один пассажир не ответил."
 ],
 [
  "Потерял нить поезда",
  "Следите внимательно. Она ведёт во тьму."
 ],
 [
  "Туннельное зрение",
  "В туннеле свет погас ровно на десять секунд."
 ],
 [
  "Крушение событий",
  "Всё пошло под откос примерно за ужином."
 ],
 [
  "Алиби, все по вагонам",
  "У каждого пассажира есть история. Правдивы лишь некоторые."
 ],
 [
  "Проблемы первого класса",
  "Дорогие места. Ещё дороже мотивы."
 ],
 [
  "Ночной экспресс",
  "Все спали. Один спал по-настоящему крепко."
 ],
 [
  "Пар и интриги",
  "Паровоз зашипел. Пассажиры тоже."
 ],
 [
  "Дорога слёз",
  "Кто-то плачет, а кто-то лжёт."
 ],
 [
  "Улики в хвостовом вагоне",
  "Ответ в конце состава."
 ],
 [
  "Путаница у проводника",
  "Билеты, пожалуйста. И алиби."
 ],
 [
  "Жонглирование алиби",
  "Все жонглируют историями. Кто-то вот-вот уронит свою."
 ],
 [
  "Провал под куполом",
  "Шоу должно продолжаться. Жертва, увы, нет."
 ],
 [
  "Попкорн и паника",
  "Больше масла. Больше подозреваемых."
 ],
 [
  "Ложь на канате",
  "Один неверный шаг, и вас поймали."
 ],
 [
  "Слон в комнате",
  "Все его проигнорировали. Классика."
 ],
 [
  "Клоуны, на выход",
  "Они вышли. В этом и была проблема."
 ],
 [
  "Клоунада с последствиями",
  "Когда смолкла музыка, никто не смеялся."
 ],
 [
  "Ринг-ринг, кто мёртв?",
  "Шпрехшталмейстер объявил сюрприз. В программе его не было."
 ],
 [
  "Тайна под куполом",
  "Шатёр был огромным. Список подозреваемых ещё больше."
 ],
 [
  "Трапеция-обманка",
  "Кто-то прыгнул изо всех сил. И промахнулся."
 ],
 [
  "Клоун вне игры",
  "В клоунской машине было на одно место больше."
 ],
 [
  "План шпрехшталмейстера",
  "Все хотели управлять шоу."
 ],
 [
  "Преступление из сахарной ваты",
  "Сладкие угощения, горькие мотивы."
 ],
 [
  "Львиная доля вранья",
  "Сегодня никто не говорит правду."
 ],
 [
  "Величайшее шоу",
  "На Земле? Возможно. Самое подозрительное? Определённо."
 ],
 [
  "Свидетель из воздушных шаров",
  "Пудель из шарика всё видел."
 ],
 [
  "Долгая зима",
  "Снег всё глубже. Список подозреваемых тоже."
 ],
 [
  "Смена рыцарей",
  "Стража сменилась в полночь. Сюжет тоже."
 ],
 [
  "Загадочный ров",
  "Ров был полон. Список подозреваемых ещё полнее."
 ],
 [
  "Трон под колёсами",
  "Все хотели корону. Одному досталось по шапке."
 ],
 [
  "По-королевски плохо",
  "Пир, шут и совсем не королевский финал."
 ],
 [
  "Кости и драма",
  "Бросаем алиби. У всех выпала единица."
 ],
 [
  "У призрака есть алиби",
  "Слуги винили призрака. Призрак был в книжном клубе."
 ],
 [
  "Наследник сегодня, пропал завтра",
  "Наследовать мог только один. Теперь одним меньше."
 ],
 [
  "Рыцарский вечер",
  "Бал был прекрасен, пока не раздался крик."
 ],
 [
  "Драгоценности короны",
  "Драгоценности остались. Гость нет."
 ],
 [
  "Башня власти",
  "Подъём на вершину имеет цену."
 ],
 [
  "Дракон не включён",
  "Хоть раз дракон невиновен."
 ],
 [
  "Королевская боль",
  "Быть королевской особой трудно. Быть мёртвой ещё труднее."
 ],
 [
  "Шутки шута",
  "Последним смеялся шут."
 ],
 [
  "Много рва из ничего",
  "Столько шума из-за одного маленького убийства."
 ],
 [
  "Партия в шахматы",
  "Кто-то взял королеву. Буквально."
 ],
 [
  "Снег и никакого выхода",
  "Дороги закрыты. Убийца заперт внутри вместе со всеми."
 ],
 [
  "Преступление с какао",
  "Зефир по желанию. Убийство, видимо, нет."
 ],
 [
  "Скользкий склон",
  "Всё началось с одолженной лыжной палки."
 ],
 [
  "Остынь",
  "Всем сказали расслабиться. Кто-то расслабился навсегда."
 ],
 [
  "Ледяное знакомство",
  "Холодный приём. Ещё холоднее тело."
 ],
 [
  "Лавина лжи",
  "Росли не только сугробы."
 ],
 [
  "Снеговик всё видел",
  "Снеговики не говорят. В этом вся проблема."
 ],
 [
  "Джакузи-убийца",
  "Пузыри, пар и очень холодное дело."
 ],
 [
  "Дальше под откос",
  "Отпуск шёл отлично, пока не перестал."
 ],
 [
  "Чёрная трасса",
  "Самый сложный склон этой горы — это дело."
 ],
 [
  "Холодные ноги",
  "Чьё-то алиби быстро растаяло."
 ],
 [
  "Фондю-вражда",
  "Сыр макали. Обиды копили."
 ],
 [
  "Ложь на подъёмнике",
  "Застрять на подъёмнике с лжецом. Классика."
 ],
 [
  "Апокалипсис après-ski",
  "Вечеринка закончилась рано. Для одного гостя навсегда."
 ],
 [
  "Замороженные активы",
  "Завещание было в сейфе. Наследник в беде."
 ],
 [
  "День свежего снега",
  "Свежий снег скрывает много следов."
 ]
],
    clue, fact, legend,
  };
})(typeof window !== 'undefined' ? window : globalThis);
