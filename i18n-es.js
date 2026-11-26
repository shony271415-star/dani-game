/* Crime Grid: Español language pack (generated from the translation tables; edit with care). */
(function (root) {
  'use strict';
  const I = root.I18N;
  if (!I) return;
  // ---------- grammar: Spanish ----------
  const V = { be: ['estaba', 'estaba', 'estaban'], sit: ['estaba sentado', 'estaba sentada', 'estaban sentados'], lie: ['estaba acostado', 'estaba acostada', 'estaban acostados'], stand: ['estaba de pie', 'estaba de pie', 'estaban de pie'], in: ['estaba', 'estaba', 'estaban'] };
  const verb = (kind, g, pl) => V[kind || 'be'][pl ? 2 : g === 'f' ? 1 : 0];
  const AREA = { room: 'en la misma habitación que', area: 'en la misma zona que', module: 'en el mismo módulo que', hall: 'en la misma sala que', car: 'en el mismo vagón que', chamber: 'en la misma cámara que' };
  const EDGE = { window: 'junto a una ventana', porthole: 'junto a un ojo de buey', viewport: 'junto a un ventanal', trail: 'junto a un sendero', entrance: 'junto a una entrada' };
  const ONBARE = { floor: 'sobre el suelo vacío', deck: 'sobre la cubierta vacía', ground: 'sobre la tierra' };
  const BARE = { floor: 'suelo vacío', deck: 'cubierta vacía', ground: 'tierra' };
  const ni = (a) => (/^una /.test(a) ? 'ninguna' : 'ningún');
  const noun = (a) => a.replace(/^(un|una) /, '');
  const wallPhrase = (x) => (x.outdoor ? 'en el borde de una zona' : 'junto a una pared');
  const notWallPhrase = (x) => (x.outdoor ? 'en el borde de ninguna zona' : 'junto a una pared');
  const clue = (c, x) => {
    const g = x.g, be = verb('be', g), N = (q) => x.name(q);
    switch (c.t) {
      case 'zone': return `${cap(be)} **${x.zone(c.a).in}**.`;
      case 'notZone': return `**No** ${be} **${x.zone(c.a).in}**.`;
      case 'on': { const o = x.obj(c.a); return `${cap(verb(o[1], g))} **${o[2]}**.`; }
      case 'floor': return `${cap(verb('stand', g))} **${ONBARE[x.floor]}**.`;
      case 'beside': return `${cap(be)} **junto a ${x.obj(c.a)[0]}**.`;
      case 'notBeside': { const a = x.obj(c.a)[0]; return `**No** ${be} junto a **${ni(a)} ${noun(a)}**.`; }
      case 'edge': return `${cap(be)} **${EDGE[x.edge]}**.`;
      case 'corner': return `${cap(be)} **en una esquina**.`;
      case 'center': return `**No** ${be} **${notWallPhrase(x)}**.`;
      case 'wall': return `${cap(be)} **${wallPhrase(x)}**.`;
      case 'rel':
        if (c.r === 'same') return `${cap(be)} **${AREA[x.area]}** ${N(c.a)}.`;
        if (c.r === 'above') return `${cap(be)} en una **fila más arriba** que ${N(c.a)}.`;
        if (c.r === 'below') return `${cap(be)} en una **fila más abajo** que ${N(c.a)}.`;
        if (c.r === 'left') return `${cap(be)} en una columna **a la izquierda** de la de ${N(c.a)}.`;
        if (c.r === 'right') return `${cap(be)} en una columna **a la derecha** de la de ${N(c.a)}.`;
        return `${cap(be)} **en diagonal** junto a ${N(c.a)}.`;
    }
    return '';
  };
  const fact = (d, x) => {
    if (d.w === 'allzones') return '**En cada zona** había al menos un sospechoso.';
    if (d.w === 'onlyempty') return `Solo había una zona sin sospechosos: **${x.zone(d.z).n}**.`;
    const k = d.k, all = k === d.total && k > 1, pl = all || k > 1;
    const Q = k === 0 ? 'Ningún sospechoso' : k === 1 ? 'Solo un sospechoso' : all ? 'Todos los sospechosos' : `Exactamente ${k} sospechosos`;
    let kind = 'be', loc = '';
    if (d.w === 'zone') loc = x.zone(d.z).in;
    else if (d.w === 'on') { const o = x.obj(d.o); kind = o[1]; loc = o[2]; }
    else if (d.w === 'floor') { kind = 'stand'; loc = ONBARE[x.floor]; }
    else if (d.w === 'corner') loc = 'en una esquina';
    else if (d.w === 'edge') loc = EDGE[x.edge];
    else if (d.w === 'center') loc = x.outdoor ? 'lejos de los bordes de las zonas' : 'lejos de las paredes';
    return `**${Q}** ${verb(kind, 'm', pl)} **${loc}**.`;
  };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const legend = (x, can, cant) => {
    const T = x.P.theme;
    return `<li>Cada persona estaba en una <b>fila distinta</b> y en una <b>columna distinta</b>.</li>
      <li><b>Se puede</b> estar sobre: ${BARE[x.floor]}${can.length ? ', ' + can.join(', ') : ''}.</li>
      ${cant.length ? `<li><b>No se puede</b> estar sobre: ${cant.join(', ')}.</li>` : ''}
      <li><b>Junto a</b> algo = en una casilla justo encima, debajo, a la izquierda o a la derecha, en el mismo espacio.</li>
      <li><b>En una esquina</b> = una casilla donde se juntan dos paredes del espacio.</li>
      <li><b>${cap(x.outdoor ? 'no en el borde de ninguna zona' : 'no junto a una pared')}</b> = ninguno de los 4 lados de la casilla es pared.</li>
      <li><b>${cap(EDGE[x.edge])}</b> = la barra de color de la pared exterior está en el lado de esa casilla.</li>
      <li><b>Fila más arriba</b> = más cerca de arriba. <b>A la izquierda</b> = más cerca del lado izquierdo.</li>
      <li><b>En diagonal</b> = se tocan solo por una esquina.</li>
      <li>La víctima estaba en la última casilla libre. Quien estuviera <b>a solas con ella</b> en el mismo espacio es el asesino.</li>`;
  };

  I.packs.es = {
    name: "Español",
    ui: {
 "Rule 1: every suspect has a row and a column all to themselves.": "Regla 1: cada sospechoso tiene su propia fila y su propia columna.",
 "Rule 2: you can stand on chairs, beds and rugs, but not on tables, plants or TVs.": "Regla 2: se puede estar sobre sillas, camas y alfombras, pero no sobre mesas, plantas ni televisores.",
 "Rule 3: the victim is in the last free square, and whoever is alone with them in that room did it.": "Regla 3: la víctima está en la última casilla libre, y quien esté a solas con ella en esa habitación es el culpable.",
 "{0} sat on a chair: tap her card, then the glowing chair.": "{0} se sentó en una silla: toca su tarjeta y luego la silla que brilla.",
 "{0} lay on a bed. Only one bed square is left, so place him there.": "{0} estaba tumbado en una cama. Solo queda una casilla de cama libre, colócalo ahí.",
 "{0} was in the Kitchen, by a window: only one square fits.": "{0} estaba en la cocina, junto a una ventana: solo encaja una casilla.",
 "{0}, the victim, goes in the last free square.": "{0}, la víctima, va en la última casilla libre.",
 "{0} was found {1}. Who was alone with him? Tap the killer!": "{0} apareció {1}. ¿Quién estaba a solas con él? ¡Toca al asesino!",
 "Step {0} of {1}": "Paso {0} de {1}",
 "Skip": "Saltar",
 "Nice!": "¡Bien!",
 "Great!": "¡Genial!",
 "Exactly right!": "¡Exacto!",
 "Sharp eye, detective!": "¡Buen ojo, detective!",
 "Tap Next to continue 🙂": "Toca Siguiente para continuar 🙂",
 "Pick the killer below 👇": "Elige al asesino abajo 👇",
 "Not that card. Tap the glowing card, then the glowing square.": "Esa no. Toca la tarjeta que brilla y luego la casilla que brilla.",
 "Not that square. Tap the glowing one 🙂": "Esa casilla no. Toca la que brilla 🙂",
 "Not them. Who else was in the same room? Try the glowing one 🙂": "Él no. ¿Quién más estaba en la misma habitación? Prueba al que brilla 🙂",
 "POLICE LINE · DO NOT CROSS": "LÍNEA POLICIAL · NO CRUZAR",
 "CLOSED": "CERRADO",
 "Best {0}": "Récord: {0}",
 "Bonuses ({0})": "Bonos ({0})",
 "🟩 alone · 🟨 with a hint · 🟥 revealed": "🟩 solo · 🟨 con pista · 🟥 revelado",
 "The killer": "El asesino",
 "Tap to skip": "Toca para saltar",
 "Share result": "Compartir resultado",
 "FILED": "ARCHIVADO",
 "{0}/{1} placed": "{0}/{1} colocados",
 "+{0} coins": "+{0} monedas",
 "{0} unlocked": "¡{0} desbloqueado!",
 "Available in the app": "Disponible en la app",
 "Purchases with real money work in the Google Play version of Crime Grid.": "Las compras con dinero real funcionan en la versión de Crime Grid para Google Play.",
 "OK": "Vale",
 "Thank you!": "¡Gracias!",
 "Link copied!": "¡Enlace copiado!",
 "Paste it to your friend in any chat.": "Pégalo en cualquier chat para enviárselo a tu amigo.",
 "Send this to a friend": "Envíaselo a un amigo",
 "Done": "Listo",
 "SHOP": "TIENDA",
 "+50 coins": "+50 monedas",
 "Who's on the case?": "¿Quién investiga?",
 "Your name and progress are saved on this device.": "Tu nombre y tu progreso se guardan en este dispositivo.",
 "Your name": "Tu nombre",
 "Let's go": "¡Vamos!",
 "Tap here to set your name": "Toca aquí para poner tu nombre",
 "Hello, {0}!": "¡Hola, {0}!",
 "Rank: {0}": "Rango: {0}",
 "no cases solved yet": "aún no has resuelto ningún caso",
 "Tap to change name": "Toca para cambiar el nombre",
 "Trophies": "Trofeos",
 "Shop": "Tienda",
 "Settings": "Ajustes",
 "In progress": "En curso",
 "{0} solved": "{0} resueltos",
 "New!": "¡Nuevo!",
 "Continue": "Continuar",
 "Play": "Jugar",
 "Level {0}": "Nivel {0}",
 "BOSS": "JEFE",
 "Boss levels every 5 · how far can you go?": "Un nivel jefe cada 5 · ¿hasta dónde llegarás?",
 "Map": "Mapa",
 "Save progress": "Guardar progreso",
 "<b>This browser is not saving your progress</b> (private mode or storage blocked). Open the game in your normal browser, or use {0}.": "<b>Este navegador no está guardando tu progreso</b> (modo privado o almacenamiento bloqueado). Abre el juego en tu navegador habitual o usa {0}.",
 "Add to Home Screen": "Añadir a la pantalla de inicio",
 "save a backup code": "guarda un código de respaldo",
 "Playing in Safari? iPhone can erase a website's saved progress after a week away. {0} to keep it safe, or {1}.": "¿Juegas en Safari? El iPhone puede borrar el progreso guardado de una web tras una semana sin entrar. {0} para mantenerlo a salvo, o {1}.",
 "Save a backup code": "Guarda un código de respaldo",
 "Your progress is saved in this browser only. {0} to keep it safe.": "Tu progreso se guarda solo en este navegador. {0} para mantenerlo a salvo.",
 "Detective Shop": "Tienda de detectives",
 "{0} coins": "{0} monedas",
 "New look: {0} · {1}": "Nuevo aspecto: {0} · {1}",
 "You own every pack!": "¡Tienes todos los packs!",
 "{0}/{1} owned": "{0}/{1} en tu poder",
 "Open": "Abrir",
 "Language": "Idioma",
 "Sound & vibration": "Sonido y vibración",
 "Off": "Desactivado",
 "On": "Activado",
 "Your progress": "Tu progreso",
 "Change name": "Cambiar nombre",
 "Tutorial": "Tutorial",
 "How to play": "Cómo se juega",
 "Close": "Cerrar",
 "This backup is on level {0}, but you are on level {1}. Replace your progress anyway?": "Este respaldo está en el nivel {0}, pero tú estás en el nivel {1}. ¿Reemplazar tu progreso de todos modos?",
 "Save your progress": "Guarda tu progreso",
 "Your progress lives on this phone. If you switch phones, reinstall, or open the game in a different browser, use this code to bring it back.": "Tu progreso vive en este teléfono. Si cambias de teléfono, reinstalas o abres el juego en otro navegador, usa este código para recuperarlo.",
 "Copy code": "Copiar código",
 "Send to myself": "Enviármelo",
 "Restore from a code": "Restaurar desde un código",
 "Paste a code that starts with MG1.": "Pega un código que empiece por MG1.",
 "Restore": "Restaurar",
 "Copied ✓": "Copiado ✓",
 "Select & copy ↑": "Selecciona y copia ↑",
 "My Crime Grid progress backup (paste it in Settings → Save progress → Restore):": "Mi copia de seguridad de Crime Grid (pégala en Ajustes → Guardar progreso → Restaurar):",
 "Progress restored!": "¡Progreso restaurado!",
 "Level {0}, {1} coins.": "Nivel {0}, {1} monedas.",
 "That code does not look right. Copy the whole thing, starting with MG1.": "Ese código no parece correcto. Copia todo, empezando por MG1.",
 "You": "Tú",
 "{0} zone": "Zona {0}",
 "Share ({0})": "Compartir ({0})",
 "Solve level {0} first.": "Resuelve primero el nivel {0}.",
 "{0} updated!": "¡{0} actualizado!",
 "{0} added!": "¡{0} añadido!",
 "Level {0} on the journey map.": "Nivel {0} en el mapa del viaje.",
 "{0}d ago": "hace {0} d",
 "today": "hoy",
 "Level {0} · {1} cases · {2}-day streak · updated {3}": "Nivel {0} · {1} casos · racha de {2} días · actualizado {3}",
 "Remove": "Quitar",
 "No friends yet. Send your link to a friend, and ask for theirs!": "Aún no tienes amigos. ¡Envía tu enlace a un amigo y pídele el suyo!",
 "Share with friends": "Compartir con amigos",
 "You're on level <b>{0}</b>. Send your link so friends see you on their map. Send it again whenever you want them to see your new progress.": "Estás en el nivel <b>{0}</b>. Envía tu enlace para que tus amigos te vean en su mapa. Vuelve a enviarlo cuando quieras que vean tu nuevo progreso.",
 "Send my link": "Enviar mi enlace",
 "Add a friend": "Añadir un amigo",
 "Join me on Crime Grid! I'm on level {0}. Open this link to add me as a friend (on iPhone with the app installed: copy it and paste it in Map → Share → Add a friend):": "¡Únete a mí en Crime Grid! Estoy en el nivel {0}. Abre este enlace para añadirme como amigo (en iPhone con la app instalada: cópialo y pégalo en Mapa → Compartir → Añadir un amigo):",
 "Paste the link (or code) your friend sent you.": "Pega el enlace (o el código) que te envió tu amigo.",
 "Add": "Añadir",
 "Back": "Atrás",
 "{0} is your friend!": "¡{0} es tu amigo!",
 "{0} is now on your map. To show up on <b>{0}'s</b> map too, send your link back.": "{0} ya está en tu mapa. Para aparecer también en el mapa de <b>{0}</b>, envíale tu enlace.",
 "<b>Using the installed app on iPhone?</b> This link opened in Safari, which keeps its own copy of the game. Open the app, go to <b>Map → Share → Add a friend</b> and paste the same link there.": "<b>¿Usas la app instalada en iPhone?</b> Este enlace se abrió en Safari, que guarda su propia copia del juego. Abre la app, ve a <b>Mapa → Compartir → Añadir un amigo</b> y pega allí el mismo enlace.",
 "Copy this friend's link": "Copiar el enlace de este amigo",
 "Send my link to {0}": "Enviar mi enlace a {0}",
 "Later": "Luego",
 "Hey {0}, add me back on Crime Grid! I'm on level {1}:": "¡Hola {0}, añádeme tú también en Crime Grid! Estoy en el nivel {1}:",
 "Copied! Now paste it in the app": "¡Copiado! Ahora pégalo en la app",
 "Copy failed: long-press the link in WhatsApp and copy it": "No se pudo copiar: mantén pulsado el enlace en WhatsApp y cópialo",
 "Opening {0}'s challenge…": "Abriendo el desafío de {0}…",
 "Day {0}": "Día {0}",
 "Daily gift!": "¡Regalo diario!",
 "Come back every day for a bigger gift.": "Vuelve cada día para recibir un regalo mayor.",
 "Collect +{0} coins": "Recoger +{0} monedas",
 "{0} cases": "Casos de {0}",
 "<b>{0}</b> of {1} days solved.": "<b>{0}</b> de {1} días resueltos.",
 "You won the {0} trophy!": "¡Ganaste el trofeo de {0}!",
 "Solve every daily case this month to win the {0} trophy.": "Resuelve todos los casos diarios de este mes para ganar el trofeo de {0}.",
 "Equipped ✓": "Equipado ✓",
 "Equip": "Equipar",
 "Buy for {0}": "Comprar por {0}",
 "need {0} more": "faltan {0}",
 "You have {0} <b>{1}</b> coins. New looks for every suspect and victim.": "Tienes {0} <b>{1}</b> monedas. Nuevos aspectos para todos los sospechosos y la víctima.",
 "Get coins": "Conseguir monedas",
 "Skin packs": "Packs de aspectos",
 "{0} unlocked!": "¡{0} desbloqueado!",
 "Equipped on every suspect.": "Equipado en todos los sospechosos.",
 "Trophy room": "Sala de trofeos",
 "Monthly trophies:": "Trofeos mensuales:",
 "Each trophy is worth 50 coins.": "Cada trofeo vale 50 monedas.",
 "Daily Case": "Caso diario",
 "{0}-day streak": "Racha de {0} días",
 "{0}-day streak, solve today to keep it!": "Racha de {0} días. ¡Resuelve hoy para mantenerla!",
 "A new case every day. Same one for everyone!": "¡Un caso nuevo cada día, el mismo para todos!",
 "Calendar": "Calendario",
 "New here?": "¿Eres nuevo?",
 "Take the 2-minute tutorial: we'll solve a tiny case together, step by step.": "Haz el tutorial de 2 minutos: resolveremos juntos un caso pequeño, paso a paso.",
 "Start tutorial": "Empezar el tutorial",
 "I know how to play": "Ya sé jugar",
 "Opening today's case file…": "Abriendo el expediente de hoy…",
 "Building a boss level…": "Preparando un nivel jefe…",
 "Building the crime scene…": "Preparando la escena del crimen…",
 "Building a really nasty crime scene…": "Preparando una escena del crimen muy retorcida…",
 "Your First Case": "Tu primer caso",
 "A quiet evening, a loud scream. Let's learn the ropes together.": "Una tarde tranquila, un grito terrible. Vamos a aprender juntos cómo se hace.",
 "{0}'s challenge: {1}": "Desafío de {0}: {1}",
 "Daily Case: {0}": "Caso diario: {0}",
 "Level {0}: {1}": "Nivel {0}: {1}",
 "Case #{0}: {1}": "Caso n.º {0}: {1}",
 "⚔ {0} solved this in {1}. Can you beat that?": "⚔ {0} resolvió esto en {1}. ¿Puedes mejorarlo?",
 "Next": "Siguiente",
 "Challenge": "Desafío",
 "Daily": "Diario",
 "Boss": "Jefe",
 "Mark mode: tap a square to cross it out ✕": "Modo marcar: toca una casilla para tacharla ✕",
 "Draft: tap every square where {0} might be.": "Borrador: toca todas las casillas donde {0} podría estar.",
 "Draft mode: pick a suspect, then tap all the squares where they might be.": "Modo borrador: elige un sospechoso y toca todas las casillas donde podría estar.",
 "Pick a suspect below, then tap a square.": "Elige un sospechoso abajo y toca una casilla.",
 "Pick a suspect first, then tap the squares where they might be 👇": "Elige primero un sospechoso y luego toca las casillas donde podría estar 👇",
 "Nobody can stand there!": "¡Nadie puede estar ahí!",
 "Tap Next in the box above first.": "Primero toca Siguiente en el recuadro de arriba.",
 "Pick a suspect card below.": "Elige la tarjeta de un sospechoso abajo.",
 "First tap {0}'s card below 👇": "Primero toca la tarjeta de {0} abajo 👇",
 "Let's place {0} first.": "Coloquemos primero a {0}.",
 "Not quite. Read the clue again 🙂": "No exactamente. Vuelve a leer la pista 🙂",
 "You picked up {0}. Tap a new square.": "Has recogido a {0}. Toca una casilla nueva.",
 "First pick a suspect from the list below 👇": "Primero elige un sospechoso de la lista de abajo 👇",
 "Draft: tap every square where {0} might be. Tap again to erase.": "Borrador: toca todas las casillas donde {0} podría estar. Toca de nuevo para borrar.",
 "Where was {0}? Tap a square.": "¿Dónde estaba {0}? Toca una casilla.",
 "Two people share a row or column. That can't be right!": "Dos personas comparten fila o columna. ¡Eso no puede ser!",
 "🤔 Something doesn't add up… someone breaks one of their clues.": "🤔 Algo no cuadra… alguien incumple una de sus pistas.",
 "✅ Everyone is in place! Now… who did it?": "✅ ¡Todos en su sitio! Ahora… ¿quién fue?",
 "Extra clues from headquarters": "Pistas extra del cuartel general",
 "<b>The victim.</b> Found in the last remaining square.": "<b>La víctima.</b> Encontrada en la última casilla libre.",
 "rip": "D.E.P.",
 "Detective's dictionary": "Diccionario del detective",
 "Clear the board?": "¿Vaciar el tablero?",
 "All placements, drafts and ✕ marks will be erased. Extra clues stay.": "Se borrarán todas las posiciones, borradores y marcas ✕. Las pistas extra se conservan.",
 "Yes, clear": "Sí, vaciar",
 "Cancel": "Cancelar",
 "Follow the hints in the box above 🙂": "Sigue las indicaciones del recuadro de arriba 🙂",
 "Need a hand, detective?": "¿Necesitas ayuda, detective?",
 "You have {0} <b>{1}</b> coins.": "Tienes {0} <b>{1}</b> monedas.",
 "Give me an extra clue": "Dame una pista extra",
 "A fact about the whole scene. Nobody's spot is revealed.": "Un dato sobre toda la escena. No revela dónde está nadie.",
 "Check my placements": "Comprobar mis posiciones",
 "Tells you if someone on the board is in the wrong spot.": "Te dice si alguien del tablero está en el lugar equivocado.",
 "Reveal one suspect": "Revelar a un sospechoso",
 "The last resort.": "El último recurso.",
 "Never mind": "Mejor no",
 "Not enough coins ({0} needed). Solve cases and collect your daily gift to earn more!": "No tienes monedas suficientes (hacen falta {0}). ¡Resuelve casos y recoge tu regalo diario para ganar más!",
 "Headquarters has no more extra clues for this case. Try another kind of help.": "El cuartel general no tiene más pistas extra para este caso. Prueba otro tipo de ayuda.",
 "🧾 New clue added above the suspects.": "🧾 Nueva pista añadida sobre los sospechosos.",
 "Place somebody on the board first, then I can check.": "Coloca primero a alguien en el tablero y entonces podré comprobar.",
 "🔴 {0} is in the wrong spot.": "🔴 {0} está en el lugar equivocado.",
 "👁️ {0} was in the wrong place. Fixed it.": "👁️ {0} estaba mal colocado. Ya lo corregí.",
 "👁️ Placed {0} in the right spot.": "👁️ He colocado a {0} en su sitio.",
 "Welcome, detective!": "¡Bienvenido, detective!",
 "There was (yep, you guessed it) a murder last night. The good news? We have a lineup of suspects and a clue about each of them.": "Anoche hubo (sí, lo adivinaste) un asesinato. ¿La buena noticia? Tenemos una lista de sospechosos y una pista sobre cada uno.",
 "<b>Your goal:</b> find the murderer: the one person who was <b>alone with the victim</b> in the same room.": "<b>Tu objetivo:</b> encontrar al asesino: la única persona que estuvo <b>a solas con la víctima</b> en el mismo espacio.",
 "Every person was in a <b>different row</b> and a <b>different column</b>, like sudoku.": "Cada persona estaba en una <b>fila distinta</b> y en una <b>columna distinta</b>, como en el sudoku.",
 "Some objects can be stood on (chairs, beds, rugs…), others can't (tables, plants…). Check the dictionary under the suspects.": "En algunos objetos se puede estar encima (sillas, camas, alfombras…) y en otros no (mesas, plantas…). Consulta el diccionario bajo los sospechosos.",
 "The victim (<b>V</b>) is in the <b>last remaining square</b>.": "La víctima (<b>V</b>) está en la <b>última casilla libre</b>.",
 "<b>How to play:</b> tap a suspect card, then a square. Tap a placed suspect to pick them up again. Use <b>✏️ Draft</b> to pencil in every square where a suspect <i>might</i> be, and <b>✕ Mark</b> to cross out squares nobody can use.": "<b>Cómo se juega:</b> toca la tarjeta de un sospechoso y luego una casilla. Toca a un sospechoso ya colocado para recogerlo. Usa <b>✏️ Borrador</b> para apuntar todas las casillas donde un sospechoso <i>podría</i> estar y <b>✕ Marcar</b> para tachar las casillas que nadie puede usar.",
 "<b>Stuck?</b> 💡 gives you an extra clue about the whole scene, checks your board, or (last resort) reveals a suspect.": "<b>¿Atascado?</b> 💡 te da una pista extra sobre toda la escena, comprueba tu tablero o (último recurso) revela a un sospechoso.",
 "Each scene is different: a mansion, a ship, a forest, a space station and more.": "Cada escena es distinta: una mansión, un barco, un bosque, una estación espacial y más.",
 "Let's investigate!": "¡A investigar!",
 "Guided tutorial": "Tutorial guiado",
 "{0} wasn't alone with {1} {2}! Look again.": "¡{0} no estaba a solas con {1} {2}! Mira otra vez.",
 "Level {0} →": "Nivel {0} →",
 "Play level 1 →": "Jugar el nivel 1 →",
 "Next case →": "Siguiente caso →",
 "Case closed: <b>{0}</b> did it.": "Caso cerrado: lo hizo <b>{0}</b>.",
 "Menu": "Menú",
 "Who did it?": "¿Quién fue?",
 "{0} was found {1} (highlighted). Who was alone with him?": "{0} apareció {1} (resaltado). ¿Quién estaba a solas con él?",
 "{0} was found {1} (highlighted). Who was alone with her?": "{0} apareció {1} (resaltado). ¿Quién estaba a solas con ella?",
 "You did it, detective!": "¡Lo lograste, detective!",
 "<b>{0}</b> was alone with {1} {2}. Case closed!": "<b>{0}</b> estaba a solas con {1} {2}. ¡Caso cerrado!",
 "Real cases have more suspects and trickier clues. Your tools:": "Los casos reales tienen más sospechosos y pistas más difíciles. Tus herramientas:",
 "<b>Draft</b>: pencil in every square where a suspect <i>might</i> be.": "<b>Borrador</b>: apunta todas las casillas donde un sospechoso <i>podría</i> estar.",
 "<b>Mark</b>: cross out squares nobody can use.": "<b>Marcar</b>: tacha las casillas que nadie puede usar.",
 "<b>Help</b>: an extra clue when you're stuck.": "<b>Ayuda</b>: una pista extra cuando estés atascado.",
 "Play level 1": "Jugar el nivel 1",
 "{0}-day streak! Come back tomorrow for a new case.": "¡Racha de {0} días! Vuelve mañana para un caso nuevo.",
 "You beat {0} by {1}! +30 coins": "¡Superaste a {0} por {1}! +30 monedas",
 "A perfect tie with {0}!": "¡Empate perfecto con {0}!",
 "{0} was faster by {1}.": "{0} fue más rápido por {1}.",
 "You {0} · {1} {2}": "Tú {0} · {1} {2}",
 "Level {0} complete!": "¡Nivel {0} completado!",
 "He's on the way to jail.": "Va camino de la cárcel.",
 "She's on the way to jail.": "Va camino de la cárcel.",
 "Case closed!": "¡Caso cerrado!",
 "<b>{0}</b> was alone with {1} {2}.": "<b>{0}</b> estaba a solas con {1} {2}.",
 "New personal best!": "¡Nuevo récord personal!",
 "Challenge back": "Devolver el desafío",
 "Challenge a friend": "Desafiar a un amigo",
 "Can you solve it?": "¿Puedes resolverlo?",
 "I solved \"{0}\" in {1} on Crime Grid. Can you beat my time?": "Resolví «{0}» en {1} en Crime Grid. ¿Puedes superar mi tiempo?",
 "Install on iPhone": "Instalar en iPhone",
 "Open this page in <b>Safari</b>.": "Abre esta página en <b>Safari</b>.",
 "Tap the <b>Share</b> button (square with an arrow).": "Toca el botón <b>Compartir</b> (el cuadrado con una flecha).",
 "Choose <b>\"Add to Home Screen\"</b>.": "Elige <b>«Añadir a pantalla de inicio»</b>.",
 "From now on, open the game from the icon.": "A partir de ahora, abre el juego desde el icono.",
 "Install before you start playing: on iPhone the app keeps its progress separately from Safari.": "Instálalo antes de empezar a jugar: en iPhone la app guarda su progreso por separado de Safari.",
 "Got it": "Entendido",
 "Rookie": "Novato",
 "4×4 grid · 3 suspects": "Cuadrícula 4×4 · 3 sospechosos",
 "Detective": "Detective",
 "5×5 grid · 4 suspects": "Cuadrícula 5×5 · 4 sospechosos",
 "Inspector": "Inspector",
 "6×6 grid · 5 suspects": "Cuadrícula 6×6 · 5 sospechosos",
 "Expert": "Experto",
 "8×8 grid · 7 suspects": "Cuadrícula 8×8 · 7 sospechosos",
 "Extreme": "Extremo",
 "10×10 grid · 9 suspects · bring coffee": "Cuadrícula 10×10 · 9 sospechosos · prepara café",
 "Junior Detective": "Detective junior",
 "Chief Inspector": "Inspector jefe",
 "Legend of the Force": "Leyenda del cuerpo",
 "Classic Detectives": "Detectives clásicos",
 "Basic": "Básico",
 "The original cast.": "El reparto original.",
 "Pet Detectives": "Detectives mascota",
 "Common": "Común",
 "Cats, dogs, foxes, owls and more. Paws off the evidence!": "Gatos, perros, zorros, búhos y más. ¡Las patas lejos de las pruebas!",
 "Noir Gangsters": "Gánsteres noir",
 "Rare": "Raro",
 "Fedoras, trench coats and very dark sunglasses.": "Sombreros fedora, gabardinas y gafas de sol muy oscuras.",
 "Monster Mash": "Fiesta de monstruos",
 "Vampires, mummies, ghosts, a cyclops and one very polite werewolf.": "Vampiros, momias, fantasmas, un cíclope y un hombre lobo muy educado.",
 "Royal Court": "Corte real",
 "Epic": "Épico",
 "Crowns, jewels and ermine, in a shimmering gold frame.": "Coronas, joyas y armiño, con un reluciente marco dorado.",
 "Space Crew": "Tripulación espacial",
 "Astronauts and aliens, framed by the stars.": "Astronautas y alienígenas enmarcados por las estrellas.",
 "Neon Legends": "Leyendas de neón",
 "Legendary": "Legendario",
 "Glowing neon characters in a pulsing frame.": "Personajes de neón brillante con un marco que late.",
 "Masquerade Ball": "Baile de máscaras",
 "Premium": "Premium",
 "Venetian masks, feathers and velvet. Comes with a gilded frame.": "Máscaras venecianas, plumas y terciopelo. Con un marco dorado.",
 "Cyber Agents": "Agentes cibernéticos",
 "Glowing visors and live scan lines. The flashiest look in the game.": "Visores brillantes y líneas de escaneo en vivo. El aspecto más llamativo del juego.",
 "Popular": "Popular",
 "Best value": "Mejor valor",
 "👋 Welcome, detective! I'll walk you through your very first case. Tap <b>Next</b>.": "👋 ¡Bienvenido, detective! Te guiaré en tu primer caso. Toca <b>Siguiente</b>.",
 "This is the <b>crime scene</b>. Thick lines are walls: they split the house into rooms. You <b>can</b> stand on chairs, beds and rugs, but <b>not</b> on tables, plants or TVs.": "Esta es la <b>escena del crimen</b>. Las líneas gruesas son paredes: dividen la casa en habitaciones. Se <b>puede</b> estar en sillas, camas y alfombras, pero <b>no</b> en mesas, plantas ni televisores.",
 "The golden rule: every person was in a <b>different row</b> and a <b>different column</b>, just like sudoku.": "La regla de oro: cada persona estaba en una <b>fila distinta</b> y en una <b>columna distinta</b>, igual que en el sudoku.",
 "<b>Ava</b> was sitting on a chair. There is only <b>one chair</b> in the house! Tap Ava's card below, then tap the chair.": "<b>Ava</b> estaba sentada en una silla. ¡Solo hay <b>una silla</b> en toda la casa! Toca la tarjeta de Ava abajo y luego la silla.",
 "Nice! Ava now owns her row and her column, so nobody else can use them. When you pick another suspect, those squares turn gray.": "¡Bien! Ava ya es dueña de su fila y de su columna, así que nadie más puede usarlas. Al elegir a otro sospechoso, esas casillas se vuelven grises.",
 "<b>Ben</b> was lying on a bed. The bed covers two squares, but one of them is in Ava's column. So there is only one choice left. Place Ben!": "<b>Ben</b> estaba acostado en una cama. La cama ocupa dos casillas, pero una está en la columna de Ava. Solo queda una opción. ¡Coloca a Ben!",
 "<b>Chloe</b> was in the Kitchen, <b>by a window</b> (the little bar on the outer wall). Only one Kitchen square touches a window. Place Chloe!": "<b>Chloe</b> estaba en la cocina, <b>junto a una ventana</b> (la barrita de la pared exterior). Solo una casilla de la cocina toca una ventana. ¡Coloca a Chloe!",
 "The victim is always in the <b>last free square</b>: only one row and one column are left. Place <b>Victor</b> there.": "La víctima siempre está en la <b>última casilla libre</b>: solo quedan una fila y una columna. Coloca ahí a <b>Victor</b>.",
 "Everyone is in place! Victor was found in the <b>Bedroom</b>. Who else was in the Bedroom? That person is the murderer!": "¡Todos en su sitio! Victor apareció en el <b>dormitorio</b>. ¿Quién más estaba en el dormitorio? ¡Esa persona es el asesino!",
 "Extreme bosses": "Jefes extremos",
 "First Case": "Primer caso",
 "Solve your first case": "Resuelve tu primer caso",
 "Seasoned Sleuth": "Sabueso veterano",
 "Solve 10 cases": "Resuelve 10 casos",
 "Case Cracker": "Rompe-casos",
 "Solve 50 cases": "Resuelve 50 casos",
 "Week of Crime": "Semana del crimen",
 "Keep a 7-day daily streak": "Mantén una racha diaria de 7 días",
 "Monthly Mastermind": "Mente maestra del mes",
 "Keep a 30-day daily streak": "Mantén una racha diaria de 30 días",
 "No Peeking": "Sin mirar",
 "Solve an Inspector case or harder without any help": "Resuelve un caso de Inspector o más difícil sin ninguna ayuda",
 "Expert Witness": "Testigo experto",
 "Solve an Expert case": "Resuelve un caso de Experto",
 "Extreme Measures": "Medidas extremas",
 "Solve an Extreme case": "Resuelve un caso Extremo",
 "Speed Sleuth": "Sabueso veloz",
 "Solve a Rookie case in under a minute": "Resuelve un caso de Novato en menos de un minuto",
 "Globetrotter": "Trotamundos",
 "Solve a case in all 9 scenes": "Resuelve un caso en las 9 escenas",
 "Halfway Hero": "Héroe a mitad de camino",
 "Reach level 25 on the journey": "Llega al nivel 25 del viaje",
 "Treasure Hunter": "Cazatesoros",
 "Hold 500 coins at once": "Reúne 500 monedas a la vez",
 "Sudoku meets murder mystery": "El sudoku se encuentra con el misterio de asesinato",
 "Solve the grid · Catch the culprit": "Resuelve la cuadrícula · Atrapa al culpable",
 "CASE FILE": "EXPEDIENTE",
 "OPEN": "ABIERTO",
 "SOLVED": "RESUELTO",
 "Cases": "Casos",
 "Friends": "Amigos",
 "More": "Más",
 "Free play": "Juego libre",
 "Install app": "Instalar la app",
 "Place": "Colocar",
 "Draft": "Borrador",
 "Mark": "Marcar",
 "Help": "Ayuda",
 "Undo": "Deshacer",
 "Clear": "Vaciar",
 "The Journey": "El viaje",
 "Every level is a brand-new case": "Cada nivel es un caso totalmente nuevo",
 "Kitchen Crew": "Brigada de cocina",
 "Chef hats, curly mustaches and a pinch of suspicion.": "Gorros de chef, bigotes rizados y una pizca de sospecha.",
 "Circus Clowns": "Payasos de circo",
 "Red noses, wild hair. Nobody trusts a clown.": "Narices rojas, pelo alocado. Nadie se fía de un payaso.",
 "Wild West": "Lejano Oeste",
 "Cowboy hats, bandanas and a shiny sheriff star.": "Sombreros vaqueros, pañuelos y una brillante estrella de sheriff.",
 "Robo Squad": "Escuadrón robot",
 "Beep boop. Box heads with glowing LED eyes.": "Bip bup. Cabezas cuadradas con ojos LED brillantes.",
 "Pirate Crew": "Tripulación pirata",
 "Eye patches, tricorns and gold earrings. Arr!": "Parches, tricornios y pendientes de oro. ¡Arr!",
 "Shadow Ninjas": "Ninjas de las sombras",
 "Silent hoods, colourful headbands, one throwing star.": "Capuchas silenciosas, cintas de colores y una estrella ninja.",
 "Wizard Academy": "Academia de magos",
 "Starry hats, long beards and glowing wands.": "Sombreros estrellados, barbas largas y varitas brillantes.",
 "Dino Hoodies": "Sudaderas de dino",
 "Everyone in a dinosaur onesie. Rawr.": "Todos con pijama de dinosaurio. Grrr.",
 "Super Squad": "Superescuadrón",
 "Masks, capes and big shiny emblems.": "Antifaces, capas y grandes emblemas brillantes.",
 "Deep Sea Gang": "Banda del fondo marino",
 "Ten sea creatures: octopus, shark, turtle, crab, seahorse, jellyfish, pufferfish, starfish, whale and swordfish.": "Diez criaturas marinas: pulpo, tiburón, tortuga, cangrejo, caballito de mar, medusa, pez globo, estrella de mar, ballena y pez espada.",
 "Solve {0} cases": "Resuelve {0} casos",
 "Solve a Hard or harder case": "Resuelve un caso difícil o más",
 "Solve a case without any help": "Resuelve un caso sin ayuda",
 "Earn {0} stars": "Consigue {0} estrellas",
 "Solve the Daily Case": "Resuelve el caso diario",
 "Daily Missions": "Misiones diarias",
 "All missions done! +{0} coins": "¡Todas las misiones completas! +{0} monedas",
 "Mission complete: {0} · +{1} coins": "Misión completa: {0} · +{1} monedas",
 "Win streak ×{0}: +{1} coins": "Racha de victorias ×{0}: +{1} monedas",
 "Star chest": "Cofre de estrellas",
 "{0}/{1} stars to the next chest": "{0}/{1} estrellas para el próximo cofre",
 "Star chest opened! +{0} coins": "¡Cofre abierto! +{0} monedas",
 "Star chest opened! New pack: {0}": "¡Cofre abierto! Nuevo pack: {0}",
 "Win streak: {0}": "Racha de victorias: {0}",
 "Partners in Crime": "Cómplices",
 "Exclusive": "Exclusivo",
 "Only for detectives who duel a new friend.": "Solo para detectives que se baten en duelo con un amigo nuevo.",
 "Duel a new friend to unlock": "Bátete en duelo con un amigo nuevo para desbloquear",
 "Live duel": "Duelo en vivo",
 "Live duel: {0}": "Duelo en vivo: {0}",
 "First to solve it wins. {0} is dueling you right now!": "Gana quien lo resuelva primero. ¡{0} se está batiendo en duelo contigo ahora mismo!",
 "New duel": "Nuevo duelo",
 "Live duel with a friend": "Duelo en vivo con un amigo",
 "New detective? You both get {0} coins and the exclusive Partners in Crime pack.": "¿Detective nuevo? Cada uno recibe {0} monedas y el paquete exclusivo Cómplices.",
 "Live duels need an internet connection.": "Los duelos en vivo necesitan conexión a internet.",
 "Could not reach the duel server. Try again in a moment.": "No se pudo conectar con el servidor. Inténtalo de nuevo en un momento.",
 "Same case, same moment. Whoever solves it first wins.": "Mismo caso, mismo momento. Gana quien lo resuelva primero.",
 "I have a code": "Tengo un código",
 "Join a duel": "Unirse a un duelo",
 "Type the 6-letter code your friend sent you.": "Escribe el código de 6 caracteres que te envió tu amigo.",
 "Join": "Unirse",
 "Opening a duel room…": "Abriendo una sala de duelo…",
 "Live duels are not available in this version yet.": "Los duelos en vivo aún no están disponibles en esta versión.",
 "Joining the duel…": "Uniéndote al duelo…",
 "This duel has ended, or the code is wrong.": "Este duelo terminó o el código es incorrecto.",
 "This duel already has two detectives.": "Este duelo ya tiene dos detectives.",
 "This duel has already started.": "Este duelo ya empezó.",
 "Friend": "Amigo",
 "Connecting…": "Conectando…",
 "Waiting for your friend to join…": "Esperando a que tu amigo se una…",
 "Get ready!": "¡Prepárate!",
 "{0} joined! Starting…": "¡{0} se unió! Empezando…",
 "Send this code or the invite link to a friend:": "Envía este código o el enlace de invitación a un amigo:",
 "Send invite": "Enviar invitación",
 "Duel me on Crime Grid! Same case, first to solve it wins. Code: {0}": "¡Bátete en duelo conmigo en Crime Grid! Mismo caso, gana quien lo resuelva primero. Código: {0}",
 "Your friend cancelled the duel.": "Tu amigo canceló el duelo.",
 "{0} solved it first!": "¡{0} lo resolvió primero!",
 "Finish the case anyway.": "Termina el caso de todos modos.",
 "{0} left the duel.": "{0} abandonó el duelo.",
 "Dueling {0}": "Duelo contra {0}",
 "Solved!": "¡Resuelto!",
 "Checking who was first…": "Comprobando quién fue primero…",
 "You won the duel against {0}! +{1} coins": "¡Ganaste el duelo contra {0}! +{1} monedas",
 "{0} solved it first.": "{0} lo resolvió primero.",
 "+{0} coins for dueling {1}!": "¡+{0} monedas por el duelo con {1}!",
 "Partners in Crime pack unlocked. Equip it in the shop.": "Paquete Cómplices desbloqueado. Equípalo en la tienda.",
 "Thanks for bringing a new detective!": "¡Gracias por traer a un detective nuevo!",
 "Online now": "En línea ahora",
 "Duel {0}": "Duelo contra {0}",
 "No friends yet. Tell a friend your detective ID, or add theirs.": "Aún no tienes amigos. Dile a un amigo tu ID de detective o añade el suyo.",
 "Your detective ID": "Tu ID de detective",
 "Copy": "Copiar",
 "Friend's ID": "ID del amigo",
 "Friends you add here can invite you to duels right inside the game.": "Los amigos que añadas aquí pueden retarte a duelos dentro del juego.",
 "Other ways to add friends": "Otras formas de añadir amigos",
 "Delete my online ID": "Eliminar mi ID en línea",
 "Copied!": "¡Copiado!",
 "Pick a level. {0} gets the invite inside the game.": "Elige un nivel. {0} recibirá la invitación dentro del juego.",
 "{0} can't duel right now.": "{0} no puede batirse en duelo ahora.",
 "{0} may be offline. Send the code another way, or try later.": "Puede que {0} no esté conectado. Envía el código de otra forma o inténtalo más tarde.",
 "Invite sent to {0}. Waiting…": "Invitación enviada a {0}. Esperando…",
 "{0} added you as a friend!": "¡{0} te añadió como amigo!",
 "You can now invite each other to duels.": "Ya puedes invitarle a un duelo.",
 "Duel invite!": "¡Invitación a un duelo!",
 "{0} invites you to a live duel ({1}). First to solve the case wins!": "{0} te reta a un duelo en vivo ({1}). ¡Gana quien resuelva el caso primero!",
 "Not now": "Ahora no",
 "An ID has 6 letters and numbers.": "Un ID tiene 6 letras y números.",
 "That's your own ID.": "Ese es tu propio ID.",
 "No detective with this ID.": "No hay ningún detective con este ID.",
 "{0} added! They will see you in their friends list too.": "¡{0} añadido! También te verá en su lista de amigos.",
 "This removes your detective ID and online profile from the server. Your progress on this device stays. Friends will no longer be able to invite you in the game.": "Esto borra del servidor tu ID de detective y tu perfil en línea. Tu progreso en este dispositivo se mantiene. Tus amigos ya no podrán invitarte dentro del juego.",
 "Delete": "Eliminar",
 "Online ID deleted.": "ID en línea eliminado.",
 "Get a detective ID": "Obtener un ID de detective",
 "Duel": "Duelo",
 "Stake per player": "Apuesta por jugador",
 "Free": "Gratis",
 "The winner takes {0} coins. Leaving early loses your stake.": "El ganador se lleva {0} monedas. Si abandonas antes, pierdes tu apuesta.",
 "Stake: {0} coins each. The winner takes {1}.": "Apuesta: {0} monedas cada uno. El ganador se lleva {1}.",
 "{0} challenges you for {1} coins each. The winner takes {2}. Join?": "{0} te reta apostando {1} monedas cada uno. El ganador se lleva {2}. ¿Te unes?",
 "You need {0} coins to join this duel.": "Necesitas {0} monedas para unirte a este duelo.",
 "Not enough coins for this stake.": "No tienes monedas suficientes para esta apuesta.",
 "{0} solved it first. You lost {1} coins.": "{0} lo resolvió primero. Perdiste {1} monedas.",
 "You left a duel with a stake. The stake was lost.": "Abandonaste un duelo con apuesta. Perdiste la apuesta.",
 "You lost {0} coins.": "Perdiste {0} monedas.",
 "To invite {0} inside the game, add them once with their detective ID (Friends screen).": "Para invitar a {0} dentro del juego, añádelo una vez con su ID de detective (pantalla Amigos).",
 "{0} can't get invites yet. Send the code another way.": "{0} aún no puede recibir invitaciones. Envía el código de otra forma.",
 "{0} invites you to a live duel ({1}) for {2} coins each. The winner takes {3}!": "{0} te reta a un duelo en vivo ({1}) apostando {2} monedas cada uno. ¡El ganador se lleva {3}!",
 "No ads": "Sin anuncios",
 "Remove ads": "Quitar anuncios",
 "Enjoy Crime Grid without ads. One payment, no subscription. It comes back if you reinstall the game.": "Disfruta de Crime Grid sin anuncios. Un solo pago, sin suscripción. Se recupera si reinstalas el juego.",
 "Ads removed. Thank you!": "Anuncios eliminados. ¡Gracias!",
 "Daily Mission": "Misión diaria",
 "Streak freeze used!": "¡Congelación de racha usada!",
 "Your {0}-day streak is safe. Solve today to keep it going.": "Tu racha de {0} días está a salvo. Resuelve el caso de hoy para continuarla.",
 "Daily reminder": "Recordatorio diario",
 "Pick a time. Your calendar will remind you every day to solve the Daily Case.": "Elige una hora. Tu calendario te recordará cada día resolver el Caso Diario.",
 "Crime Grid: today's case is waiting": "Crime Grid: el caso de hoy te espera",
 "Solve the Daily Case and keep your streak!": "¡Resuelve el Caso Diario y mantén tu racha!",
 "Reminder file ready": "Archivo de recordatorio listo",
 "Open it to add the daily reminder to your calendar.": "Ábrelo para añadir el recordatorio diario a tu calendario.",
 "Freeze": "Congelación",
 "Remind me": "Recordar",
 "Streak freeze earned! It saves your streak if you miss one day.": "¡Has ganado una congelación de racha! Salva tu racha si te saltas un día.",
 "New trick: \"What if?\"": "Truco nuevo: «¿Y si…?»",
 "Stuck? Pretend a suspect stands on one square and follow the clues.": "¿Atascado? Imagina que un sospechoso está en una casilla y sigue las pistas.",
 "Pencil the guess in with <b>Draft</b>, so it is only an idea.": "Anota la suposición con <b>Borrador</b>, para que sea solo una idea.",
 "If two people end up in the same row or column, or a clue breaks, the guess was impossible.": "Si dos personas acaban en la misma fila o columna, o una pista se rompe, la suposición era imposible.",
 "Cross that square out with <b>Mark</b> and try another one.": "Tacha esa casilla con <b>Marcar</b> y prueba otra.",
 "Bigger cases need this a lot. Take your time.": "Los casos grandes lo necesitan mucho. Tómate tu tiempo.",
 "Jazz Age": "Era del jazz",
 "Art deco gold, bow ties, pearls and a sunburst frame.": "Oro art déco, pajaritas, perlas y un marco de rayos de sol.",
 "Steampunk Guild": "Gremio steampunk",
 "Brass goggles, gears and top hats in a riveted frame.": "Gafas de latón, engranajes y sombreros de copa en un marco remachado.",
 "Haunted Gala": "Gala encantada",
 "Powdered wigs, lace collars and candlelight. Ghosts welcome.": "Pelucas empolvadas, cuellos de encaje y luz de velas. Los fantasmas son bienvenidos.",
 "Watch a short video: free clue": "Mira un vídeo corto: pista gratis",
 "{0} left today": "Quedan {0} hoy",
 "Watch a short video: double coins (+{0})": "Mira un vídeo corto: monedas dobles (+{0})",
 "Coins doubled!": "¡Monedas duplicadas!",
 "No video available right now. Try again later.": "No hay vídeo disponible ahora. Inténtalo más tarde.",
 "Replace your progress?": "¿Reemplazar tu progreso?",
 "Keep my progress": "Conservar mi progreso",
 "Replace": "Reemplazar",
 "Report or block": "Denunciar o bloquear",
 "Report this player, or block them so they can never invite you again.": "Denuncia a este jugador o bloquéalo para que no pueda invitarte más.",
 "Report: {0}": "Denuncia: {0}",
 "Offensive name": "Nombre ofensivo",
 "Cheating": "Trampas",
 "Harassment": "Acoso",
 "Something else": "Otra cosa",
 "Block {0}": "Bloquear a {0}",
 "Blocked. {0} can no longer invite you.": "Bloqueado. {0} ya no podrá invitarte.",
 "Report sent. Thank you!": "Denuncia enviada. ¡Gracias!",
 "You blocked this player.": "Has bloqueado a este jugador.",
 "Unblock all ({0})": "Desbloquear a todos ({0})"
},
    pl: {
 "{0} cases solved": {
  "one": "{0} caso resuelto",
  "other": "{0} casos resueltos"
 },
 "{0} levels to {1}": {
  "one": "{0} nivel para {1}",
  "other": "{0} niveles para {1}"
 },
 "Map & {0} friends": {
  "one": "Mapa y {0} amigo",
  "other": "Mapa y {0} amigos"
 },
 "Solved with {0} stars.": {
  "one": "Resuelto con {0} estrella.",
  "other": "Resuelto con {0} estrellas."
 },
 "✅ So far so good: all {0} people you placed are in the right spot.": {
  "one": "✅ Vas bien: la persona que has colocado está en su sitio.",
  "other": "✅ Vas bien: las {0} personas que has colocado están en su sitio."
 },
 "🔴 {0} people are in the wrong spot.": {
  "one": "🔴 {0} persona está en el lugar equivocado.",
  "other": "🔴 {0} personas están en el lugar equivocado."
 },
 "{0} clues/checks": {
  "one": "{0} pista/comprobación",
  "other": "{0} pistas/comprobaciones"
 },
 "{0} reveals": {
  "one": "{0} revelación",
  "other": "{0} revelaciones"
 }
},
    zones: {
 "Living Room": [
  "Sala de estar",
  "en la sala de estar"
 ],
 "Kitchen": [
  "Cocina",
  "en la cocina"
 ],
 "Bedroom": [
  "Dormitorio",
  "en el dormitorio"
 ],
 "Bathroom": [
  "Baño",
  "en el baño"
 ],
 "Study": [
  "Estudio",
  "en el estudio"
 ],
 "Library": [
  "Biblioteca",
  "en la biblioteca"
 ],
 "Dining Room": [
  "Comedor",
  "en el comedor"
 ],
 "Music Room": [
  "Sala de música",
  "en la sala de música"
 ],
 "Guest Room": [
  "Cuarto de invitados",
  "en el cuarto de invitados"
 ],
 "Main Deck": [
  "Cubierta principal",
  "en la cubierta principal"
 ],
 "Bridge": [
  "Puente de mando",
  "en el puente de mando"
 ],
 "Cabin": [
  "Camarote",
  "en el camarote"
 ],
 "Galley": [
  "Cocina del barco",
  "en la cocina del barco"
 ],
 "Cargo Hold": [
  "Bodega de carga",
  "en la bodega de carga"
 ],
 "Engine Room": [
  "Sala de máquinas",
  "en la sala de máquinas"
 ],
 "Lounge": [
  "Salón",
  "en el salón"
 ],
 "Captain's Quarters": [
  "Camarote del capitán",
  "en el camarote del capitán"
 ],
 "Clearing": [
  "Claro",
  "en el claro"
 ],
 "Campsite": [
  "Campamento",
  "en el campamento"
 ],
 "Riverbank": [
  "Orilla del río",
  "en la orilla del río"
 ],
 "Pine Grove": [
  "Pinar",
  "en el pinar"
 ],
 "Cave": [
  "Cueva",
  "en la cueva"
 ],
 "Mushroom Patch": [
  "Campo de setas",
  "en el campo de setas"
 ],
 "Lakeside": [
  "Orilla del lago",
  "en la orilla del lago"
 ],
 "Old Oak": [
  "Roble viejo",
  "en la zona del roble viejo"
 ],
 "Command Deck": [
  "Cubierta de mando",
  "en la cubierta de mando"
 ],
 "Science Lab": [
  "Laboratorio",
  "en el laboratorio"
 ],
 "Sleeping Pods": [
  "Cápsulas de dormir",
  "en las cápsulas de dormir"
 ],
 "Hydroponics": [
  "Hidroponía",
  "en el módulo de hidroponía"
 ],
 "Mess Hall": [
  "Comedor de la tripulación",
  "en el comedor de la tripulación"
 ],
 "Observatory": [
  "Observatorio",
  "en el observatorio"
 ],
 "Robotics Bay": [
  "Bahía de robótica",
  "en la bahía de robótica"
 ],
 "Cargo Module": [
  "Módulo de carga",
  "en el módulo de carga"
 ],
 "Lobby": [
  "Vestíbulo",
  "en el vestíbulo"
 ],
 "Dinosaur Hall": [
  "Sala de dinosaurios",
  "en la sala de dinosaurios"
 ],
 "Ancient Wing": [
  "Ala antigua",
  "en el ala antigua"
 ],
 "Gallery": [
  "Galería",
  "en la galería"
 ],
 "Café": [
  "Cafetería",
  "en la cafetería"
 ],
 "Vault": [
  "Cámara acorazada",
  "en la cámara acorazada"
 ],
 "Gift Shop": [
  "Tienda de regalos",
  "en la tienda de regalos"
 ],
 "Space Exhibit": [
  "Exposición espacial",
  "en la exposición espacial"
 ],
 "Locomotive": [
  "Locomotora",
  "en la locomotora"
 ],
 "Dining Car": [
  "Vagón comedor",
  "en el vagón comedor"
 ],
 "Sleeper Car": [
  "Vagón cama",
  "en el vagón cama"
 ],
 "Luggage Car": [
  "Vagón de equipaje",
  "en el vagón de equipaje"
 ],
 "Lounge Car": [
  "Vagón salón",
  "en el vagón salón"
 ],
 "Observation Car": [
  "Vagón mirador",
  "en el vagón mirador"
 ],
 "First Class": [
  "Primera clase",
  "en primera clase"
 ],
 "Center Ring": [
  "Pista central",
  "en la pista central"
 ],
 "Backstage": [
  "Backstage",
  "entre bastidores"
 ],
 "Animal Tent": [
  "Carpa de animales",
  "en la carpa de animales"
 ],
 "Clown Trailer": [
  "Remolque de payasos",
  "en el remolque de los payasos"
 ],
 "Snack Stand": [
  "Puesto de aperitivos",
  "en el puesto de aperitivos"
 ],
 "Ticket Booth": [
  "Taquilla",
  "en la taquilla"
 ],
 "Strongman Tent": [
  "Carpa del forzudo",
  "en la carpa del forzudo"
 ],
 "Throne Room": [
  "Sala del trono",
  "en la sala del trono"
 ],
 "Great Hall": [
  "Gran salón",
  "en el gran salón"
 ],
 "Armory": [
  "Armería",
  "en la armería"
 ],
 "Dungeon": [
  "Mazmorra",
  "en la mazmorra"
 ],
 "Chapel": [
  "Capilla",
  "en la capilla"
 ],
 "Tower": [
  "Torre",
  "en la torre"
 ],
 "Castle Kitchen": [
  "Cocina del castillo",
  "en la cocina del castillo"
 ],
 "Fireside Lounge": [
  "Salón de la chimenea",
  "en el salón de la chimenea"
 ],
 "Ski Shop": [
  "Tienda de esquí",
  "en la tienda de esquí"
 ],
 "Hot Tub Deck": [
  "Terraza del jacuzzi",
  "en la terraza del jacuzzi"
 ],
 "Bunk Room": [
  "Dormitorio de literas",
  "en el dormitorio de literas"
 ],
 "Lodge Kitchen": [
  "Cocina del refugio",
  "en la cocina del refugio"
 ],
 "Snowy Patio": [
  "Patio nevado",
  "en el patio nevado"
 ]
},
    themes: {
 "The Mansion": "La mansión",
 "The Ship": "El barco",
 "The Forest": "El bosque",
 "The Space Station": "La estación espacial",
 "The Museum": "El museo",
 "The Night Train": "El tren nocturno",
 "The Circus": "El circo",
 "The Castle": "El castillo",
 "The Ski Lodge": "El refugio de esquí"
},
    objs: {
 "chair": [
  "una silla",
  "sit",
  "en una silla"
 ],
 "bed": [
  "una cama",
  "lie",
  "en una cama"
 ],
 "rug": [
  "una alfombra",
  "stand",
  "sobre una alfombra"
 ],
 "table": [
  "una mesa",
  null,
  null
 ],
 "tv": [
  "un televisor",
  null,
  null
 ],
 "plant": [
  "una planta",
  null,
  null
 ],
 "bathtub": [
  "una bañera",
  null,
  null
 ],
 "piano": [
  "un piano",
  null,
  null
 ],
 "seat": [
  "un asiento",
  "sit",
  "en un asiento"
 ],
 "crate": [
  "una caja",
  "sit",
  "sobre una caja"
 ],
 "barrel": [
  "un barril",
  null,
  null
 ],
 "lifebuoy": [
  "un salvavidas",
  null,
  null
 ],
 "anchor": [
  "un ancla",
  null,
  null
 ],
 "wheel": [
  "un timón",
  null,
  null
 ],
 "tree": [
  "un árbol",
  null,
  null
 ],
 "rock": [
  "una roca",
  null,
  null
 ],
 "log": [
  "un tronco",
  "sit",
  "sobre un tronco"
 ],
 "tent": [
  "una tienda",
  "in",
  "dentro de una tienda"
 ],
 "campfire": [
  "una fogata",
  null,
  null
 ],
 "mushroom": [
  "un hongo gigante",
  null,
  null
 ],
 "canoe": [
  "una canoa",
  "sit",
  "en una canoa"
 ],
 "computer": [
  "una computadora",
  null,
  null
 ],
 "robot": [
  "un robot",
  null,
  null
 ],
 "telescope": [
  "un telescopio",
  null,
  null
 ],
 "statue": [
  "una estatua",
  null,
  null
 ],
 "dino": [
  "un esqueleto de dinosaurio",
  null,
  null
 ],
 "vase": [
  "un jarrón antiguo",
  null,
  null
 ],
 "suitcase": [
  "una maleta",
  "sit",
  "sobre una maleta"
 ],
 "drum": [
  "un tambor",
  null,
  null
 ],
 "elephant": [
  "un elefante",
  null,
  null
 ],
 "popcorn": [
  "un carrito de palomitas",
  null,
  null
 ],
 "hay": [
  "una paca de heno",
  "sit",
  "sobre una paca de heno"
 ],
 "balloon": [
  "un puesto de globos",
  null,
  null
 ],
 "fireplace": [
  "una chimenea",
  null,
  null
 ],
 "skis": [
  "un soporte de esquís",
  null,
  null
 ],
 "snowman": [
  "un muñeco de nieve",
  null,
  null
 ],
 "hottub": [
  "un jacuzzi",
  "in",
  "dentro de un jacuzzi"
 ],
 "armor": [
  "una armadura",
  null,
  null
 ],
 "throne": [
  "un trono",
  "sit",
  "en un trono"
 ],
 "candle": [
  "un candelabro",
  null,
  null
 ],
 "swords": [
  "un expositor de armas",
  null,
  null
 ],
 "coal": [
  "una pila de carbón",
  null,
  null
 ],
 "cactus": [
  "un cactus",
  null,
  null
 ]
},
    objLabel: (e) => e[0].replace(/^(un|una) /, ''),
    stories: [
 [
  "Muerte por postre",
  "Las lentejuelas eran falsas. Las coartadas, también."
 ],
 [
  "El mayordomo no fue",
  "Por una vez, el mayordomo tiene una coartada a prueba de bombas. Qué grosería."
 ],
 [
  "Un testamento y una tumba",
  "La abuela se lo dejó todo a su gato. Alguien se lo tomó a pecho."
 ],
 [
  "Té, galletas y traición",
  "Meñique en alto. Cuerpos en el suelo."
 ],
 [
  "Inauguración gélida",
  "Trajeron una planta. Alguien trajo rencor."
 ],
 [
  "Desastre en el spa",
  "Mascarillas, rodajas de pepino y una siesta muy permanente."
 ],
 [
  "Grito en la pijamada",
  "Verdad o reto tuvo demasiada verdad."
 ],
 [
  "La contraseña del wifi",
  "Nadie quiso compartirla. Alguien perdió los papeles."
 ],
 [
  "Crimen de lujo",
  "La cubertería estaba reluciente. Las coartadas, no."
 ],
 [
  "Drama en la lámpara",
  "Algo cayó a medianoche, y no fue la lámpara de araña."
 ],
 [
  "El día libre del mayordomo",
  "Sin mayordomo, todo se complicó enseguida."
 ],
 [
  "Pelea por la herencia",
  "Cinco parientes, una fortuna y cero calma."
 ],
 [
  "Cena para intrigantes",
  "Siete platos. Uno de ellos era venganza."
 ],
 [
  "El testigo del papel pintado",
  "Si estas paredes hablaran, pedirían abogado."
 ],
 [
  "Brunch fatal",
  "El zumo era infinito. Las mentiras, también."
 ],
 [
  "El monóculo perdido",
  "Empezó con un monóculo perdido. Acabó con un invitado perdido."
 ],
 [
  "Casi Titanic",
  "Buenas noticias: esta vez el iceberg es inocente."
 ],
 [
  "Mareados y sospechosos",
  "La mitad del pasaje estaba verde. Uno era culpable."
 ],
 [
  "Nudo de culpables",
  "Todos los marineros juran que no son culpables. Ja. Ja."
 ],
 [
  "Capitán Obvio",
  "El capitán no vio nada. Típico."
 ],
 [
  "Barra libre (de vida)",
  "Gambas ilimitadas. Supervivientes limitados."
 ],
 [
  "Drama a bordo",
  "Alguien gritó «¡hombre al agua!». Se equivocó en todo."
 ],
 [
  "Crucero del amor, caso frío",
  "Un crucero romántico. Mucho crucero, poco romance."
 ],
 [
  "Cosas de barcos",
  "Nadie lo había previsto en el folleto."
 ],
 [
  "Navegando entre secretos",
  "Viejos amigos, un crucero y demasiados secretos."
 ],
 [
  "Mar-cha atrás",
  "La fiesta de despedida fue un poco demasiado definitiva."
 ],
 [
  "Cubierta de problemas",
  "Alguien tumbó a alguien, y no precisamente de forma festiva."
 ],
 [
  "Puerto sin respuesta",
  "Nadie contestó cuando el barco llamó. Sospechoso."
 ],
 [
  "Mar gruesa, invitados peores",
  "Las olas eran salvajes. Los pasajeros, más."
 ],
 [
  "Simulacro de salvamento",
  "Todos encontraron sitio. Casi todos."
 ],
 [
  "Levad anclas",
  "El ancla cayó. El ánimo, también."
 ],
 [
  "La cena del capitán",
  "Trajes elegantes, mentiras más elegantes."
 ],
 [
  "Asesinato de malvavisco",
  "Se hicieron s'mores. Y también errores."
 ],
 [
  "Casi inocente como un oso",
  "Todos culparon al oso. El oso ha contratado abogado."
 ],
 [
  "Una noche de lo más tienda",
  "La cosa se puso tensa alrededor de la fogata."
 ],
 [
  "Perdidos y encontrados",
  "El perro encontró el cuerpo. Buen chico, mala noche."
 ],
 [
  "Senderismo extremo",
  "El mapa decía «fácil». El mapa mentía."
 ],
 [
  "Cuento de miedo que salió mal",
  "Lo más aterrador del cuento resultó ser verdad."
 ],
 [
  "Picaduras y crimen",
  "Los bichos no eran los únicos con sed de sangre."
 ],
 [
  "Déjame en paz, hojas",
  "Alguien quería de verdad estar solo. Para siempre."
 ],
 [
  "Tronco de sospecha",
  "Los árboles lo vieron todo. Por desgracia, no pueden declarar."
 ],
 [
  "Pino y castigo",
  "Aire fresco, crimen fresco."
 ],
 [
  "Rastro de mentiras",
  "Cada huella apuntaba a un sitio distinto."
 ],
 [
  "Un búho vigilante",
  "El búho preguntó «¿quién?» toda la noche. Buena pregunta."
 ],
 [
  "Confesiones junto al fuego",
  "Nadie confesó. Campistas de manual."
 ],
 [
  "Se busca musgo",
  "La naturaleza es preciosa. También es un excelente escondite."
 ],
 [
  "Jefe de ramas",
  "Alguien subió en la empresa. Y a un árbol."
 ],
 [
  "Hacia el bosque",
  "Seis entraron para el fin de semana. Ya sabes el resto."
 ],
 [
  "Houston, tenemos un cadáver",
  "En el espacio nadie oye nada. Por suerte, alguien lo vio."
 ],
 [
  "Perdido en el espacio",
  "Alguien olvidó revisar su oxígeno. Otro «ayudó»."
 ],
 [
  "Gravedad cero, coartadas cero",
  "Todos flotaban por ahí. Nadie estaba donde dijo."
 ],
 [
  "El misterio del pastelito lunar",
  "Se comieron el último pastelito lunar. Y se puso personal."
 ],
 [
  "Coartada verdecita",
  "La tripulación culpó a unos visitantes verdes. Los visitantes se ofendieron."
 ],
 [
  "No es ciencia de cohetes",
  "No es ciencia de cohetes. Vale, un poquito sí."
 ],
 [
  "Ctrl + Alt + Muerto",
  "El ordenador de la estación lo vio todo. No habla."
 ],
 [
  "Perdidos entre espaguetis",
  "La noche de pasta en órbita salió fatal, fideo a fideo."
 ],
 [
  "Rareza espacial",
  "El centro de control perdió el contacto. Con un tripulante."
 ],
 [
  "La coartada marciana",
  "«Estaba en Marte» no sirve de coartada aquí arriba."
 ],
 [
  "¿Accidente de asteroide?",
  "No fue un asteroide."
 ],
 [
  "Misterio de agujero negro",
  "Aquí las pistas desaparecen rápido. Date prisa."
 ],
 [
  "Control de gravedad",
  "Alguien olvidó la regla más importante del espacio: ser amable."
 ],
 [
  "Astro-no",
  "Un astronauta no volverá a la Tierra."
 ],
 [
  "Rivales de combustible",
  "Dos ingenieros, un ascenso, cero oxígeno de sobra."
 ],
 [
  "Paseo lunar de la vergüenza",
  "Alguien intentó escabullirse. En la Luna. Qué valor."
 ],
 [
  "Noche en el mausoleo",
  "Las piezas cobraron vida. Un invitado, no."
 ],
 [
  "Dino-mita",
  "El T. rex tiene los brazos diminutos. Seguro que no fue él."
 ],
 [
  "Ataque de arte",
  "La crítica dijo que la exposición era mortal. No se equivocaba."
 ],
 [
  "Problemas de momia",
  "Todos los tenemos. Uno los tenía muy graves."
 ],
 [
  "Por favor, no tocar",
  "Alguien tocó. Alguien lo pagó."
 ],
 [
  "Tienda de regalos del terror",
  "Salida por la tienda de regalos. Si puedes."
 ],
 [
  "Más viejo que el polvo",
  "La coartada de alguien es más antigua que los jarrones."
 ],
 [
  "Escultura ficción",
  "Todas estas estatuas tienen una cara de póker perfecta."
 ],
 [
  "Pieza A",
  "La exposición más nueva no estaba en el plano."
 ],
 [
  "Combustible fósil",
  "Huesos viejos, problemas nuevos."
 ],
 [
  "El caso del Louvre",
  "Otro museo. La misma dosis de drama."
 ],
 [
  "Marco incriminatorio",
  "A alguien lo están enmarcando. Literalmente."
 ],
 [
  "Reliquia rota",
  "Una reliquia sin precio, un error carísimo."
 ],
 [
  "Estatua de limitaciones",
  "Las estatuas no hablan. Todos los demás mienten."
 ],
 [
  "El museo después de cerrar",
  "La visita acabó a las cinco. El misterio empezó a las seis."
 ],
 [
  "Si lo rompes, lo pagas",
  "Alguien rompió algo mucho peor que un jarrón."
 ],
 [
  "Asesinato en el exprés",
  "Se sirvió café. Y también venganza."
 ],
 [
  "Elige bien, tren",
  "Un pasajero tomó una decisión malísima."
 ],
 [
  "Fuera de los raíles",
  "La fiesta se descontroló hacia el tercer túnel."
 ],
 [
  "Billete a la tumba",
  "Billetes de solo ida. Muy, muy de solo ida."
 ],
 [
  "Duelo en el carrito",
  "Alguien se llevó los últimos pretzels. Gran error."
 ],
 [
  "Próxima parada: nadie",
  "El revisor llamó a la estación. Un pasajero no contestó."
 ],
 [
  "Perdí el hilo del tren",
  "Síguelo con cuidado. Lleva a un sitio oscuro."
 ],
 [
  "Visión de túnel",
  "Las luces se apagaron en el túnel durante exactamente diez segundos."
 ],
 [
  "Descarrilamiento de hechos",
  "Las cosas se torcieron a la hora de la cena."
 ],
 [
  "Todos a bordo de la coartada",
  "Cada pasajero tiene una historia. Solo algunas son ciertas."
 ],
 [
  "Problemas de primera clase",
  "Asientos elegantes. Motivos más elegantes."
 ],
 [
  "Exprés nocturno",
  "Todos durmieron. Uno durmió de verdad, muy de verdad."
 ],
 [
  "Vapor y artimañas",
  "La locomotora silbó. Los pasajeros, también."
 ],
 [
  "Rastro de lágrimas",
  "Alguien llora, y alguien miente."
 ],
 [
  "Pistas en el furgón de cola",
  "La respuesta está al final de la línea."
 ],
 [
  "Confusión del revisor",
  "Billetes, por favor. Y coartadas."
 ],
 [
  "Malabares de coartadas",
  "Todos hacen malabares con una historia. Alguien está a punto de soltar una."
 ],
 [
  "Fracaso en la carpa",
  "El espectáculo debe continuar. La víctima, por desgracia, no."
 ],
 [
  "Palomitas y pánico",
  "Mantequilla extra. Sospechosos extra."
 ],
 [
  "Mentiras en la cuerda floja",
  "Un paso en falso y te pillan."
 ],
 [
  "El elefante en la habitación",
  "Todos lo ignoraron. Un clásico."
 ],
 [
  "Que entren los payasos",
  "Entraron. Ese fue el problema."
 ],
 [
  "Ciudad payaso en ruinas",
  "Nadie se reía cuando paró la música."
 ],
 [
  "¿Quién ha muerto en la pista?",
  "El maestro de ceremonias anunció una sorpresa. No estaba en el programa."
 ],
 [
  "Misterio bajo la carpa",
  "La carpa era enorme. La lista de sospechosos, más."
 ],
 [
  "Trapecio traicionero",
  "Alguien se lanzó con todo. Y falló."
 ],
 [
  "Payaso fuera de combate",
  "El coche de payasos tenía un asiento de más."
 ],
 [
  "Plan del maestro de pista",
  "Todos querían dirigir el espectáculo."
 ],
 [
  "Crimen de algodón de azúcar",
  "Dulces golosinas, motivos amargos."
 ],
 [
  "Rugidos de mentira",
  "Nadie dice la verdad esta noche."
 ],
 [
  "El mayor espectáculo",
  "¿Del mundo? Quizá. ¿El más sospechoso? Sin duda."
 ],
 [
  "Testigo con forma de globo",
  "El caniche de globo lo vio todo."
 ],
 [
  "Un largo invierno",
  "La nieve se acumula. La lista de sospechosos, también."
 ],
 [
  "Cambio de guardia",
  "Los guardias cambiaron a medianoche. La trama, también."
 ],
 [
  "Foso misterioso",
  "El foso estaba lleno. La lista de sospechosos, más."
 ],
 [
  "Trono bajo el autobús",
  "Todos querían la corona. Uno se llevó el desplante."
 ],
 [
  "Realmente desastroso",
  "Un banquete, un bufón y un final nada real."
 ],
 [
  "Dados y drama",
  "Tira por una coartada. A todos les salió un uno."
 ],
 [
  "El fantasma tiene coartada",
  "Los criados culparon al fantasma. El fantasma estaba en el club de lectura."
 ],
 [
  "Heredero hoy, ausente mañana",
  "Solo un heredero podía heredar. Ahora hay uno menos."
 ],
 [
  "Una noche de caballeros",
  "El baile era precioso, hasta el grito."
 ],
 [
  "Joyas de la corona",
  "Las joyas se quedaron. Un invitado, no."
 ],
 [
  "Torre de poder",
  "Subir a lo más alto tiene un precio."
 ],
 [
  "Dragón no incluido",
  "Por una vez, el dragón es inocente."
 ],
 [
  "Dolor real",
  "Ser de la realeza es difícil. Estar muerto, más."
 ],
 [
  "Broma de bufón",
  "El bufón rio el último."
 ],
 [
  "Mucho foso para nada",
  "Mucho alboroto por un diminuto asesinato."
 ],
 [
  "Partida de ajedrez",
  "Alguien se llevó a la reina. Literalmente."
 ],
 [
  "Sin salida en la nieve",
  "Las carreteras estaban cortadas. El asesino estaba atrapado dentro con los demás."
 ],
 [
  "Crimen de chocolate caliente",
  "Malvaviscos: opcionales. Asesinato: al parecer, no."
 ],
 [
  "Pendiente resbaladiza",
  "Todo empezó con un bastón de esquí prestado."
 ],
 [
  "Tranquilo, tranquilo",
  "Les dijeron que se relajaran. Alguien se relajó para siempre."
 ],
 [
  "Encantado de helarte",
  "Una bienvenida fría. Un cuerpo más frío."
 ],
 [
  "Avalancha de mentiras",
  "La nieve no era lo único que se acumulaba."
 ],
 [
  "El muñeco de nieve lo vio todo",
  "Los muñecos de nieve no hablan. Ese es todo el problema."
 ],
 [
  "Jacuzzi criminal",
  "Burbujas, vapor y un caso muy frío."
 ],
 [
  "Cuesta abajo",
  "Las vacaciones iban genial, hasta que dejaron de ir."
 ],
 [
  "Pista negra",
  "La pista más difícil de la montaña es este caso."
 ],
 [
  "Pies fríos",
  "La coartada de alguien se derritió enseguida."
 ],
 [
  "Guerra de fondue",
  "Se mojó queso. Se guardaron rencores."
 ],
 [
  "Mentiras en el telesilla",
  "Atrapado en un telesilla con un mentiroso. Clásico."
 ],
 [
  "Apocalipsis après-ski",
  "La fiesta acabó pronto. Para un invitado, para siempre."
 ],
 [
  "Activos congelados",
  "El testamento estaba en la caja fuerte. El heredero, en un lío."
 ],
 [
  "Día de nieve virgen",
  "La nieve fresca tapa muchas huellas."
 ]
],
    clue, fact, legend,
  };
})(typeof window !== 'undefined' ? window : globalThis);
