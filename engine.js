/* Crime Grid engine: builds a themed crime scene, places the people, writes clues,
   proves the solution is unique and grades how much logic the puzzle needs. */
(function (root) {
  'use strict';

  const VERSION = 2;

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- objects ---------- */
  // occ = phrase used when someone is ON the object. No occ = nobody can stand there.
  const OBJECTS = {
    chair: { e: '🪑', name: 'chair', occ: 'sitting on a chair' },
    bed: { e: '🛏️', name: 'bed', occ: 'lying on a bed', two: true },
    rug: { css: 'rug', name: 'rug', occ: 'standing on a rug' },
    table: { css: 'table', name: 'table' },
    tv: { e: '📺', name: 'TV' },
    plant: { e: '🪴', name: 'plant' },
    bathtub: { e: '🛁', name: 'bathtub' },
    piano: { e: '🎹', name: 'piano' },
    seat: { e: '💺', name: 'seat', occ: 'sitting in a seat' },
    crate: { e: '📦', name: 'crate', occ: 'sitting on a crate' },
    barrel: { e: '🛢️', name: 'barrel' },
    lifebuoy: { e: '🛟', name: 'life ring' },
    anchor: { e: '⚓', name: 'anchor' },
    wheel: { e: '☸️', name: "ship's wheel" },
    tree: { e: '🌲', name: 'tree' },
    rock: { e: '🪨', name: 'boulder' },
    log: { e: '🪵', name: 'log', occ: 'sitting on a log' },
    tent: { e: '⛺', name: 'tent', occ: 'inside a tent' },
    campfire: { e: '🔥', name: 'campfire' },
    mushroom: { e: '🍄', name: 'giant mushroom' },
    canoe: { e: '🛶', name: 'canoe', occ: 'sitting in a canoe' },
    computer: { e: '🖥️', name: 'computer' },
    robot: { e: '🤖', name: 'robot' },
    telescope: { e: '🔭', name: 'telescope' },
    statue: { e: '🗿', name: 'statue' },
    dino: { e: '🦖', name: 'dinosaur skeleton' },
    vase: { e: '🏺', name: 'ancient vase' },
    suitcase: { e: '🧳', name: 'suitcase', occ: 'sitting on a suitcase' },
    drum: { e: '🥁', name: 'drum' },
    elephant: { e: '🐘', name: 'elephant' },
    popcorn: { e: '🍿', name: 'popcorn cart' },
    hay: { e: '🌾', name: 'hay bale', occ: 'sitting on a hay bale' },
    balloon: { e: '🎈', name: 'balloon stand' },
    fireplace: { e: '🔥', name: 'fireplace' },
    skis: { e: '🎿', name: 'ski rack' },
    snowman: { e: '⛄', name: 'snowman' },
    hottub: { e: '🛁', name: 'hot tub', occ: 'sitting in the hot tub' },
    armor: { e: '🛡️', name: 'suit of armor' },
    throne: { e: '👑', name: 'throne', occ: 'sitting on the throne' },
    candle: { e: '🕯️', name: 'candelabra' },
    swords: { e: '⚔️', name: 'weapon rack' },
    coal: { e: '⚫', name: 'coal pile' },
    cactus: { e: '🌵', name: 'cactus' },
  };
  const isBlocked = (o) => !!o && !OBJECTS[o].occ;
  const art = (w) => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;

  /* ---------- themes ---------- */
  const INDOOR = { wall: 'beside a wall', center: 'not beside a wall' };
  const OUTDOOR = { wall: 'at the edge of an area', center: 'not at the edge of any area' };

  const THEMES = [
    {
      id: 'mansion', name: 'The Mansion', icon: '🏚️', area: 'room', floor: 'floor', edge: 'window', edgeColor: '#7fc4f0', ...INDOOR,
      colors: ['#f6d6cf', '#fbefc4', '#d7e9c9', '#cfe0f3', '#e6d5ef', '#f8dcb4', '#cdeae6', '#efd0dc'],
      zones: [
        ['Living Room', ['tv', 'chair'], ['chair', 'rug', 'plant', 'rug']],
        ['Kitchen', ['table', 'chair'], ['chair', 'plant']],
        ['Bedroom', ['bed'], ['chair', 'rug', 'plant']],
        ['Bathroom', ['bathtub'], ['rug', 'plant']],
        ['Study', ['table', 'chair'], ['plant', 'rug', 'tv']],
        ['Library', ['chair', 'rug'], ['table', 'chair', 'plant']],
        ['Dining Room', ['table', 'chair'], ['chair', 'plant', 'rug']],
        ['Music Room', ['piano'], ['chair', 'rug', 'plant']],
        ['Guest Room', ['bed'], ['chair', 'tv']],
      ],
      stories: [
        ["Death by Dessert", "The sprinkles were fake news. So was everyone's alibi."],
        ["The Butler Didn't Do It", "For once, the butler has a rock-solid alibi. Rude."],
        ["A Will and a Grave", "Grandma left everything to her cat. Someone took it personally."],
        ["Tea, Biscuits & Betrayal", "Pinkies up. Bodies down."],
        ["Housewarming Gone Cold", "They brought a plant. Someone brought a grudge."],
        ["Spa Day Disaster", "Face masks, cucumber slices and one very permanent nap."],
        ["Sleepover Scream", "Truth or dare got way too much truth."],
        ["The Wi-Fi Password", "Nobody would share it. Somebody snapped."],
        ["Murder Most Fancy", "The silverware was polished. The alibis were not."],
        ["Chandelier Drama", "Something dropped at midnight, and it wasn't the chandelier."],
        ["Butler's Day Off", "With the butler gone, things got messy fast."],
        ["Family Fortune Feud", "Five relatives, one fortune, zero chill."],
        ["Dinner for Schemers", "Seven courses. One of them was revenge."],
        ["Wallpaper Witness", "If these walls could talk, they'd want a lawyer."],
        ["Brunch Gone Bad", "The fruit juice was bottomless. So were the lies."],
        ["The Missing Monocle", "It started with a missing monocle. It ended with a missing guest."],
      ],
    },
    {
      id: 'ship', name: 'The Ship', icon: '🚢', area: 'area', floor: 'deck', edge: 'porthole', edgeColor: '#5fb3d9', ...INDOOR,
      colors: ['#cfe3f2', '#e9dcc4', '#d8eadf', '#f3e1c7', '#dcd6ee', '#c9e4e8', '#f0d3cc', '#e3ecc9'],
      zones: [
        ['Main Deck', ['lifebuoy', 'crate'], ['seat', 'barrel', 'anchor']],
        ['Bridge', ['wheel', 'seat'], ['computer', 'seat']],
        ['Cabin', ['bed'], ['chair', 'rug']],
        ['Galley', ['table', 'barrel'], ['chair', 'crate']],
        ['Cargo Hold', ['crate', 'barrel'], ['crate', 'suitcase']],
        ['Engine Room', ['barrel', 'coal'], ['crate']],
        ['Lounge', ['seat', 'table'], ['rug', 'plant', 'seat']],
        ['Captain\'s Quarters', ['bed', 'table'], ['chair', 'rug']],
      ],
      stories: [
        ["Titanic-ish", "Good news: the iceberg is innocent this time."],
        ["Seasick & Suspicious", "Half the passengers were green. One was guilty."],
        ["Knot Guilty", "Every sailor swears they're knot guilty. Ha. Ha."],
        ["Captain Obvious", "The captain saw nothing. Typical."],
        ["All You Can Eat (Alive)", "Unlimited shrimp. Limited survivors."],
        ["Overboard Drama", "Someone yelled 'man overboard!'. Wrong in every way."],
        ["Love Cruise, Cold Case", "A romantic cruise. Heavy on the cruise, light on the romance."],
        ["Ship Happens", "Nobody planned for this on the brochure."],
        ["Abandon Ship-tionships", "Old friends, one cruise, too many secrets."],
        ["Sea You Never", "The goodbye party got a little too final."],
        ["Deck the Halls", "Someone decked someone, and not in the festive way."],
        ["Port of Call", "Nobody answered when the ship called. Suspicious."],
        ["Rough Seas, Rougher Guests", "The waves were wild. The passengers were wilder."],
        ["Lifeboat Drill", "Everyone found a seat. Almost everyone."],
        ["Anchors Away", "The anchor dropped. So did the mood."],
        ["Captain's Dinner", "Fancy suits, fancier lies."],
      ],
    },
    {
      id: 'forest', name: 'The Forest', icon: '🌲', area: 'area', floor: 'ground', edge: 'trail', edgeColor: '#b08a5a', ...OUTDOOR,
      colors: ['#d4e8c2', '#c3dcb0', '#e4ecc6', '#cfe3d4', '#dfe0b8', '#c8e0c8', '#e8e3c4', '#d0dcc0'],
      zones: [
        ['Clearing', ['log'], ['rock', 'mushroom', 'log']],
        ['Campsite', ['tent', 'campfire'], ['log', 'tent']],
        ['Riverbank', ['canoe'], ['rock', 'tree']],
        ['Pine Grove', ['tree', 'tree'], ['log', 'mushroom']],
        ['Cave', ['rock'], ['rock', 'campfire']],
        ['Mushroom Patch', ['mushroom'], ['mushroom', 'log']],
        ['Lakeside', ['canoe', 'rock'], ['tree', 'log']],
        ['Old Oak', ['tree'], ['log', 'tent']],
      ],
      stories: [
        ["Marshmallow Murder", "S'mores were made. So were mistakes."],
        ["Bear-ly Innocent", "Everyone blamed the bear. The bear has hired a lawyer."],
        ["A Very In-Tents Night", "Things got very in-tents around the campfire."],
        ["Lost & Hound", "The dog found the body. Good boy, bad night."],
        ["Hike Hard, Die Harder", "The trail map said 'easy'. The trail map lied."],
        ["Ghost Story Gone Wrong", "The scariest part of the story turned out to be true."],
        ["Mosquito Bites & Murder", "The bugs weren't the only ones out for blood."],
        ["Leaf Me Alone", "Somebody really wanted some alone time. Forever."],
        ["Wood You Believe It", "The trees saw everything. Unfortunately, trees can't testify."],
        ["Pine and Punishment", "Fresh air, fresh crime."],
        ["Trail of Lies", "Every footprint pointed somewhere different."],
        ["Owl Be Watching", "The owl asked 'who?' all night. Fair question."],
        ["Campfire Confessions", "Nobody confessed. Classic campers."],
        ["Moss Wanted", "Nature is beautiful. Nature is also an excellent hiding spot."],
        ["Branch Manager", "Someone climbed the corporate ladder. And a tree."],
        ["Into the Woods", "Six went in for the weekend. You know the rest."],
      ],
    },
    {
      id: 'space', name: 'The Space Station', icon: '🚀', area: 'module', floor: 'floor', edge: 'viewport', edgeColor: '#9fb4ff', ...INDOOR,
      colors: ['#dfe3f5', '#d3ecf0', '#e9dff3', '#e2eedd', '#f2e4d2', '#d6dcee', '#ecd9e2', '#d8e8e8'],
      zones: [
        ['Command Deck', ['seat', 'computer'], ['seat', 'computer']],
        ['Science Lab', ['computer', 'table'], ['seat', 'robot']],
        ['Sleeping Pods', ['bed'], ['bed', 'rug']],
        ['Hydroponics', ['plant'], ['plant', 'rug']],
        ['Mess Hall', ['table', 'seat'], ['seat']],
        ['Observatory', ['telescope', 'seat'], ['rug']],
        ['Robotics Bay', ['robot', 'crate'], ['crate']],
        ['Cargo Module', ['crate'], ['crate', 'suitcase']],
      ],
      stories: [
        ["Houston, We Have a Body", "Out in space, nobody hears a thing. Luckily, someone saw it."],
        ["Spaced Out", "Someone forgot to check their oxygen. Someone else 'helped'."],
        ["Zero Gravity, Zero Alibis", "Everyone was floating around. Nobody was where they said."],
        ["Moon Pie Mystery", "The last moon pie was eaten. Then it got personal."],
        ["Little Green Alibi", "The crew blamed little green visitors. The visitors are offended."],
        ["Not Rocket Science", "It's not rocket science. Okay, it's a little bit rocket science."],
        ["Ctrl + Alt + Dead", "The station computer saw everything. It's not talking."],
        ["Lost in Spaghetti", "Pasta night in orbit went horribly, noodly wrong."],
        ["Space Oddity", "Ground control lost contact. With one crew member."],
        ["The Martian Alibi", "'I was on Mars' is not an alibi up here."],
        ["Asteroid Accident?", "It was not an asteroid."],
        ["Black Hole Mystery", "Clues vanish fast out here. Work quickly."],
        ["Gravity Check", "Someone forgot the most important rule of space: be nice."],
        ["Astro-Not", "One astronaut will not be returning to Earth."],
        ["Rocket Fuel Rivals", "Two engineers, one promotion, zero oxygen to spare."],
        ["Moon Walk of Shame", "Someone tried to sneak away. On the moon. Bold."],
      ],
    },
    {
      id: 'museum', name: 'The Museum', icon: '🏛️', area: 'hall', floor: 'floor', edge: 'window', edgeColor: '#7fc4f0', ...INDOOR,
      colors: ['#efe6d6', '#e3dcef', '#d9e8e0', '#f3dccf', '#e0e6ef', '#efe0bf', '#dde8cd', '#ead7e0'],
      zones: [
        ['Lobby', ['plant', 'chair'], ['rug', 'chair']],
        ['Dinosaur Hall', ['dino'], ['chair', 'rug']],
        ['Ancient Wing', ['vase', 'statue'], ['rug', 'chair']],
        ['Gallery', ['statue', 'chair'], ['rug', 'chair']],
        ['Café', ['table', 'chair'], ['chair', 'plant']],
        ['Vault', ['crate', 'vase'], ['crate']],
        ['Gift Shop', ['table', 'crate'], ['plant']],
        ['Space Exhibit', ['telescope'], ['robot', 'rug']],
      ],
      stories: [
        ["Night at the Mausoleum", "The exhibits came alive. One guest didn't."],
        ["Dino-Mite", "The T. rex has tiny arms. Definitely not him."],
        ["Art Attack", "Critics said the show was killer. They weren't wrong."],
        ["Mummy Issues", "Everyone has them. One person had them really bad."],
        ["Please Do Not Touch", "Someone touched. Someone paid for it."],
        ["Gift Shop of Horrors", "Exit through the gift shop. If you can."],
        ["Older Than Dirt", "Someone's alibi is older than the vases."],
        ["Sculpt Fiction", "Every statue here has a perfect poker face."],
        ["Exhibit A", "The newest exhibit wasn't on the floor plan."],
        ["Fossil Fuel", "Old bones, new trouble."],
        ["The Louvre Affair", "Not that museum. Same amount of drama."],
        ["Frame Job", "Someone's being framed. Literally."],
        ["Relic Wreck", "A priceless relic, a pricey mistake."],
        ["Statue of Limitations", "The statues aren't talking. Everyone else is lying."],
        ["Museum After Dark", "The tour ended at five. The mystery started at six."],
        ["You Break It, You Bought It", "Someone broke something much worse than a vase."],
      ],
    },
    {
      id: 'train', name: 'The Night Train', icon: '🚂', area: 'car', floor: 'floor', edge: 'window', edgeColor: '#7fc4f0', ...INDOOR,
      colors: ['#e8d5c4', '#d5e2d0', '#e1d6ea', '#f1e3c2', '#cfdfe8', '#ead0cf', '#dee6c8', '#e5ddd0'],
      zones: [
        ['Locomotive', ['coal', 'seat'], ['coal']],
        ['Dining Car', ['table', 'seat'], ['table', 'seat']],
        ['Sleeper Car', ['bed'], ['bed', 'rug']],
        ['Luggage Car', ['suitcase', 'crate'], ['suitcase', 'crate']],
        ['Lounge Car', ['seat', 'rug'], ['plant', 'piano']],
        ['Observation Car', ['seat'], ['plant', 'telescope']],
        ['First Class', ['seat', 'table'], ['rug', 'plant']],
      ],
      stories: [
        ["Murder on the Espresso", "Coffee was served. So was revenge."],
        ["Choo-Choo-Choose Wisely", "One passenger made a very bad choice."],
        ["Off the Rails", "The party got out of hand somewhere around tunnel three."],
        ["Ticket to Die", "One-way tickets. Very, very one-way."],
        ["Snack Cart Showdown", "Someone took the last pretzels. Big mistake."],
        ["Next Stop: Nobody", "The conductor called the station. One passenger didn't answer."],
        ["Lost My Train of Thought", "Follow it carefully. It goes somewhere dark."],
        ["Tunnel Vision", "The lights went out in the tunnel for exactly ten seconds."],
        ["Derail of Events", "Things went off track around dinner time."],
        ["All Aboard the Alibi", "Every passenger has a story. Only some are true."],
        ["First Class Problems", "Fancy seats. Fancier motives."],
        ["Overnight Express", "Everyone slept. One person really, really slept."],
        ["Steam & Scheme", "The engine hissed. So did the passengers."],
        ["Tracks of My Tears", "Somebody's crying, and somebody's lying."],
        ["Caboose Clues", "The answer is at the end of the line."],
        ["Conductor Confusion", "Tickets, please. And alibis."],
      ],
    },
    {
      id: 'circus', name: 'The Circus', icon: '🎪', area: 'area', floor: 'ground', edge: 'entrance', edgeColor: '#e5554f', ...OUTDOOR,
      colors: ['#f6d4d4', '#f7ecc4', '#d6e6f4', '#e6d7f0', '#d8eed6', '#f6dcc0', '#f2d0e4', '#d4ecea'],
      zones: [
        ['Center Ring', ['drum'], ['hay', 'balloon']],
        ['Backstage', ['chair', 'suitcase'], ['crate', 'rug']],
        ['Animal Tent', ['elephant', 'hay'], ['hay']],
        ['Clown Trailer', ['bed', 'balloon'], ['chair']],
        ['Snack Stand', ['popcorn', 'chair'], ['table']],
        ['Ticket Booth', ['seat', 'table'], ['balloon']],
        ['Strongman Tent', ['crate'], ['drum', 'rug']],
      ],
      stories: [
        ["Juggling Alibis", "Everyone is juggling a story. Someone's about to drop one."],
        ["Big Top Flop", "The show must go on. The victim, sadly, must not."],
        ["Popcorn & Panic", "Extra butter. Extra suspects."],
        ["Tightrope Lies", "One false step and you're caught."],
        ["The Elephant in the Room", "Everyone ignored it. Classic."],
        ["Send in the Clowns", "They did. That was the problem."],
        ["Clown Town Breakdown", "Nobody was laughing when the music stopped."],
        ["Ring Ring, Who's Dead?", "The ringmaster announced a surprise. It was not on the program."],
        ["Big Top Mystery", "The tent was huge. The suspect list was bigger."],
        ["Trapeze Tease", "Someone swung for the fences. And missed."],
        ["Clowned and Out", "The clown car had one seat too many."],
        ["Ringmaster Plan", "Everyone wanted to run the show."],
        ["Cotton Candy Crime", "Sweet treats, sour motives."],
        ["Lion Around", "Nobody is telling the truth tonight."],
        ["The Greatest Show", "On Earth? Maybe. Most suspicious? Definitely."],
        ["Balloon Animal Witness", "The poodle balloon saw it all."],
      ],
    },
    {
      id: 'castle', name: 'The Castle', icon: '🏰', area: 'chamber', floor: 'floor', edge: 'window', edgeColor: '#9fc6e0', ...INDOOR,
      colors: ['#e2dccf', '#d7d2e4', '#e9d6c6', '#d4e0d4', '#ead8d8', '#dfe2c9', '#d2dde6', '#e8e0c8'],
      zones: [
        ['Throne Room', ['throne', 'rug'], ['candle', 'armor']],
        ['Great Hall', ['table', 'chair'], ['candle', 'chair']],
        ['Armory', ['armor', 'swords'], ['crate']],
        ['Dungeon', ['barrel', 'hay'], ['hay']],
        ['Chapel', ['candle', 'chair'], ['chair', 'rug']],
        ['Tower', ['bed', 'telescope'], ['chair']],
        ['Castle Kitchen', ['table', 'barrel'], ['chair']],
      ],
      stories: [
        ["A Long Winter", "Snow piles up. So does the list of suspects."],
        ["Knight Shift", "The guards changed at midnight. So did the plot."],
        ["Moat Mysterious", "The moat was full. The suspect list was fuller."],
        ["Throne Under the Bus", "Everyone wanted the crown. One of them got the boot."],
        ["Royally Messed Up", "A banquet, a jester and one very unroyal ending."],
        ["Dice & Drama", "Roll for an alibi. Everyone rolled a one."],
        ["The Ghost Has an Alibi", "The servants blamed the ghost. The ghost was at book club."],
        ["Heir Today, Gone Tomorrow", "Only one heir could inherit. Now there's one fewer."],
        ["A Knight to Remember", "The ball was lovely, right up until the scream."],
        ["Crown Jewels", "The jewels stayed. A guest did not."],
        ["Tower of Power", "Climbing to the top has a price."],
        ["Dragon Not Included", "For once, the dragon is innocent."],
        ["Royal Pain", "Being royalty is hard. Being dead is harder."],
        ["Jester Joking", "The jester had the last laugh."],
        ["Moat Ado About Nothing", "A lot of fuss over one tiny murder."],
        ["Chess Match", "Someone took the queen. Literally."],
      ],
    },
    {
      id: 'ski', name: 'The Ski Lodge', icon: '🏔️', area: 'room', floor: 'floor', edge: 'window', edgeColor: '#a8d8f0', ...INDOOR,
      colors: ['#e3edf5', '#f2e2d2', '#dceade', '#ead9e8', '#e8e8d0', '#d6e2ee', '#f0dcd6', '#dfe9e9'],
      zones: [
        ['Lobby', ['chair', 'plant'], ['rug']],
        ['Fireside Lounge', ['fireplace', 'chair'], ['rug', 'chair']],
        ['Ski Shop', ['skis', 'crate'], ['skis']],
        ['Hot Tub Deck', ['hottub', 'snowman'], ['chair']],
        ['Bunk Room', ['bed'], ['bed', 'suitcase']],
        ['Lodge Kitchen', ['table', 'chair'], ['plant']],
        ['Snowy Patio', ['snowman'], ['chair', 'skis']],
      ],
      stories: [
        ["Snow Way Out", "The roads were closed. The killer was trapped inside with everyone else."],
        ["Hot Cocoa Crime", "Marshmallows: optional. Murder: apparently not."],
        ["Slippery Slope", "It all started with a borrowed ski pole."],
        ["Chill Out", "Everyone was told to relax. Someone relaxed permanently."],
        ["Ice to Meet You", "A cold welcome. A colder body."],
        ["Avalanche of Lies", "The snow wasn't the only thing piling up."],
        ["The Snowman Saw Everything", "Snowmen don't talk. That's the whole problem."],
        ["Hot Tub Crime Machine", "Bubbles, steam and one very cold case."],
        ["Downhill From Here", "The vacation was going great, until it wasn't."],
        ["Black Diamond", "The hardest slope on the mountain is this case."],
        ["Cold Feet", "Someone's alibi melted fast."],
        ["Fondue Feud", "Cheese was dipped. Grudges were held."],
        ["Ski Lift Lies", "Stuck in a lift with a liar. Classic."],
        ["Apr\u00e8s-Ski Apocalypse", "The party ended early. For one guest, permanently."],
        ["Frozen Assets", "The will was in the safe. The heir was in trouble."],
        ["Powder Day", "Fresh snow covers a lot of tracks."],
      ],
    },
  ];

  /* ---------- people ---------- */
  const NAMES = {
    A: [['Adam', 'm'], ['Alice', 'f'], ['Arthur', 'm'], ['Amara', 'f'], ['Antonio', 'm'], ['Ava', 'f']],
    B: [['Ben', 'm'], ['Bella', 'f'], ['Boris', 'm'], ['Bianca', 'f'], ['Bruno', 'm'], ['Beatrice', 'f']],
    C: [['Chloe', 'f'], ['Carlos', 'm'], ['Clara', 'f'], ['Caleb', 'm'], ['Chelsea', 'f'], ['Cyrus', 'm']],
    D: [['Daisy', 'f'], ['Daniel', 'm'], ['Diego', 'm'], ['Dahlia', 'f'], ['Dmitri', 'm'], ['Delia', 'f']],
    E: [['Emma', 'f'], ['Ethan', 'm'], ['Elena', 'f'], ['Edgar', 'm'], ['Esme', 'f'], ['Ezra', 'm']],
    F: [['Felix', 'm'], ['Fiona', 'f'], ['Frida', 'f'], ['Finn', 'm'], ['Flora', 'f'], ['Franco', 'm']],
    G: [['Grace', 'f'], ['George', 'm'], ['Gloria', 'f'], ['Gus', 'm'], ['Greta', 'f'], ['Gideon', 'm']],
    H: [['Hugo', 'm'], ['Hazel', 'f'], ['Harriet', 'f'], ['Henry', 'm'], ['Hana', 'f'], ['Hector', 'm']],
    I: [['Iris', 'f'], ['Ivan', 'm'], ['Isla', 'f'], ['Igor', 'm'], ['Ingrid', 'f'], ['Isaac', 'm']],
    V: [['Valeria', 'f'], ['Victor', 'm'], ['Vivian', 'f'], ['Vincent', 'm'], ['Violet', 'f'], ['Vaughn', 'm']],
  };
  const FACES = {
    m: ['🧔', '👨‍🦲', '👨‍🦰', '👴', '👨‍🦱', '👱‍♂️', '🧑‍🦳', '👨', '🧔‍♂️', '👲'],
    f: ['👩‍🦰', '👵', '👩‍🦱', '👱‍♀️', '👩‍🦳', '👩', '🧕', '👧', '👩‍🦲', '👸'],
  };
  const TOKEN_COLORS = ['#e74c3c', '#2980b9', '#27ae60', '#8e44ad', '#e67e22', '#16a085', '#d35400', '#2c3e50', '#c0392b'];

  /* ---------- difficulty ---------- */
  const DIFFICULTY = {
    easy: { N: 4, zones: [3, 4], edges: [3, 4], style: 'specific', maxClues: 2, minimize: false, extras: false },
    medium: { N: 5, zones: [4, 4], edges: [3, 5], style: 'normal', maxClues: 2, minimize: true, extras: false },
    hard: { N: 6, zones: [4, 5], edges: [4, 6], style: 'broad', maxClues: 3, minimize: true, extras: false },
    expert: { N: 8, zones: [5, 6], edges: [5, 7], style: 'broad', maxClues: 4, minimize: true, extras: true, needTrial: true, minTrials: 3, attempts: 6, budget: 20000 },
    extreme: { N: 10, zones: [6, 8], edges: [6, 9], style: 'broad', maxClues: 4, minimize: true, extras: true, needTrial: true, minTrials: 10, attempts: 12, budget: 6000 },
  };

  function makeHelpers(R) {
    return {
      ri: (n) => Math.floor(R() * n),
      pick: (arr) => arr[Math.floor(R() * arr.length)],
      shuffle: (arr) => {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
      },
    };
  }

  function neighbors(N, i) {
    const r = Math.floor(i / N), c = i % N, out = [];
    if (r > 0) out.push(i - N);
    if (r < N - 1) out.push(i + N);
    if (c > 0) out.push(i - 1);
    if (c < N - 1) out.push(i + 1);
    return out;
  }

  function makeZones(N, k, R, H) {
    const minSize = N >= 8 ? 5 : 3;
    for (let tries = 0; tries < 500; tries++) {
      const id = new Array(N * N).fill(-1);
      const seeds = H.shuffle([...Array(N * N).keys()]).slice(0, k);
      const size = new Array(k).fill(1);
      seeds.forEach((s, r) => { id[s] = r; });
      let left = N * N - k, stuck = false;
      while (left > 0) {
        const order = H.shuffle([...Array(k).keys()]).sort((a, b) => size[a] - size[b]);
        let grown = false;
        for (const r of order) {
          let best = -1, bestScore = -1;
          for (let i = 0; i < N * N; i++) {
            if (id[i] !== -1) continue;
            const same = neighbors(N, i).filter((j) => id[j] === r).length;
            if (!same) continue;
            const score = same + R() * 1.5;
            if (score > bestScore) { bestScore = score; best = i; }
          }
          if (best >= 0) { id[best] = r; size[r]++; left--; grown = true; break; }
        }
        if (!grown) { stuck = true; break; }
      }
      if (stuck) continue;
      if (Math.min(...size) < minSize) continue;
      if (Math.max(...size) > Math.ceil((N * N) / k) + N) continue;
      return id;
    }
    return null;
  }

  function computeWalls(N, zoneOf) {
    return zoneOf.map((z, i) => {
      const r = Math.floor(i / N), c = i % N;
      return {
        n: r === 0 || zoneOf[i - N] !== z,
        s: r === N - 1 || zoneOf[i + N] !== z,
        w: c === 0 || zoneOf[i - 1] !== z,
        e: c === N - 1 || zoneOf[i + 1] !== z,
      };
    });
  }

  function placeObjects(N, zoneOf, zoneDefs, R, H) {
    const obj = new Array(N * N).fill(null);
    zoneDefs.forEach((def, z) => {
      const cells = H.shuffle(zoneOf.map((x, i) => (x === z ? i : -1)).filter((i) => i >= 0));
      const sz = cells.length;
      const target = Math.max(def[1].length, Math.round(sz * (0.3 + R() * 0.15)));
      const maxBlocked = Math.max(1, Math.floor(sz * 0.3));
      let used = 0, blocked = 0;
      const list = def[1].slice();
      while (list.length < target) list.push(H.pick(def[2]));
      for (const t of list) {
        if (used >= sz - 1) break;
        if (isBlocked(t) && blocked >= maxBlocked) continue;
        const free = cells.filter((i) => obj[i] === null);
        if (!free.length) break;
        if (OBJECTS[t].two) {
          let done = false;
          for (const i of free) {
            const mates = neighbors(N, i).filter((j) => zoneOf[j] === z && obj[j] === null);
            if (mates.length && used + 2 <= sz - 1) { obj[i] = obj[H.pick(mates)] = t; used += 2; done = true; break; }
          }
          if (!done) { obj[free[0]] = t; used++; }
        } else {
          obj[free[0]] = t; used++;
          if (isBlocked(t)) blocked++;
        }
      }
    });
    return obj;
  }

  /* ---------- facts & clues ---------- */
  function cellFacts(P, i) {
    const { N, zoneOf, obj, walls, edges } = P;
    const w = walls[i];
    const f = {
      zone: zoneOf[i], obj: obj[i],
      corner: (w.n || w.s) && (w.e || w.w),
      center: !w.n && !w.s && !w.e && !w.w,
      edge: ['n', 's', 'e', 'w'].some((s) => edges.has(i + s)),
      beside: {},
    };
    for (const j of neighbors(N, i)) {
      if (zoneOf[j] === zoneOf[i] && obj[j] && obj[j] !== obj[i]) f.beside[obj[j]] = true;
    }
    return f;
  }

  function evalUnary(P, c, i) {
    const f = P.facts[i];
    switch (c.t) {
      case 'zone': return f.zone === c.a;
      case 'notZone': return f.zone !== c.a;
      case 'on': return f.obj === c.a;
      case 'floor': return f.obj === null;
      case 'beside': return !!f.beside[c.a];
      case 'notBeside': return !f.beside[c.a];
      case 'edge': return f.edge;
      case 'corner': return f.corner;
      case 'center': return f.center;
      case 'wall': return !f.center;
      default: return true;
    }
  }

  function relHolds(P, r, i, j) {
    const N = P.N;
    const ri = Math.floor(i / N), ci = i % N, rj = Math.floor(j / N), cj = j % N;
    switch (r) {
      case 'same': return P.zoneOf[i] === P.zoneOf[j];
      case 'above': return ri < rj;
      case 'below': return ri > rj;
      case 'left': return ci < cj;
      case 'right': return ci > cj;
      case 'diag': return Math.abs(ri - rj) === 1 && Math.abs(ci - cj) === 1;
      default: return true;
    }
  }

  const NATURAL = { zone: 1, on: 1, floor: 1, beside: 1, edge: 1, corner: 1, center: 1 };

  function trueClues(P, sol, p, victim, extras) {
    const i = sol[p], f = P.facts[i], N = P.N, out = [];
    out.push({ t: 'zone', a: f.zone });
    if (f.obj && !isBlocked(f.obj)) out.push({ t: 'on', a: f.obj });
    if (!f.obj) out.push({ t: 'floor' });
    for (const k of Object.keys(f.beside)) out.push({ t: 'beside', a: k });
    if (f.edge) out.push({ t: 'edge' });
    if (f.corner) out.push({ t: 'corner' });
    if (f.center) out.push({ t: 'center' });
    for (let z = 0; z < P.zones.length; z++) if (z !== f.zone) out.push({ t: 'notZone', a: z });
    for (let q = 0; q < sol.length; q++) {
      if (q === p || q === victim) continue;
      if (P.zoneOf[sol[q]] === f.zone) out.push({ t: 'rel', r: 'same', a: q });
      if (!extras) continue;
      const j = sol[q];
      out.push({ t: 'rel', r: Math.floor(i / N) < Math.floor(j / N) ? 'above' : 'below', a: q });
      out.push({ t: 'rel', r: i % N < j % N ? 'left' : 'right', a: q });
      if (relHolds(P, 'diag', i, j)) out.push({ t: 'rel', r: 'diag', a: q });
    }
    if (extras) {
      if (!f.center) out.push({ t: 'wall' });
      const present = new Set(P.obj.filter(Boolean));
      for (const o of present) if (!f.beside[o] && o !== f.obj) out.push({ t: 'notBeside', a: o });
    }
    return out;
  }

  const clueKey = (c) => c.t + ':' + (c.r || '') + ':' + (c.a === undefined ? '' : c.a);

  /* ---------- exact solver (counts solutions) ---------- */
  function solve(P, clues, limit, budget) {
    const N = P.N, victim = N - 1, NN = N * N;
    let nodes = 0, aborted = false;
    const rowOf = new Int8Array(NN), colOf = new Int8Array(NN);
    for (let i = 0; i < NN; i++) { rowOf[i] = Math.floor(i / N); colOf[i] = i % N; }
    const zoneOf = P.zoneOf;
    const free = [];
    for (let i = 0; i < NN; i++) if (!isBlocked(P.obj[i])) free.push(i);
    const cands = [];
    const relsOf = [...Array(victim)].map(() => []); // [other, r, iAmFirst]
    for (let p = 0; p < victim; p++) {
      cands[p] = free.filter((i) => clues[p].every((c) => c.t === 'rel' || evalUnary(P, c, i)));
      for (const c of clues[p]) if (c.t === 'rel') { relsOf[p].push([c.a, c.r, true]); relsOf[c.a].push([p, c.r, false]); }
    }
    const holds = (r, i, j) => {
      switch (r) {
        case 'same': return zoneOf[i] === zoneOf[j];
        case 'above': return rowOf[i] < rowOf[j];
        case 'below': return rowOf[i] > rowOf[j];
        case 'left': return colOf[i] < colOf[j];
        case 'right': return colOf[i] > colOf[j];
        case 'diag': return Math.abs(rowOf[i] - rowOf[j]) === 1 && Math.abs(colOf[i] - colOf[j]) === 1;
      }
      return true;
    };
    const pos = new Int16Array(N).fill(-1);
    const rowUsed = new Uint8Array(N), colUsed = new Uint8Array(N);
    const sols = [];
    const lists = [...Array(victim)].map(() => new Int16Array(NN));
    const lens = new Int16Array(victim);

    function rec(placed) {
      if (sols.length >= limit || aborted) return;
      if (budget && ++nodes > budget) { aborted = true; return; }
      if (placed === victim) {
        const vi = rowUsed.indexOf(0) * N + colUsed.indexOf(0);
        if (isBlocked(P.obj[vi])) return;
        const out = Array.from(pos); out[victim] = vi; sols.push(out);
        return;
      }
      let best = -1, bestLen = 1e9, rowCover = 0, colCover = 0;
      for (let p = 0; p < victim; p++) {
        if (pos[p] >= 0) continue;
        const L = lists[p]; let n = 0;
        const rl = relsOf[p];
        for (const i of cands[p]) {
          if (rowUsed[rowOf[i]] || colUsed[colOf[i]]) continue;
          let good = true;
          for (let k = 0; k < rl.length; k++) {
            const q = pos[rl[k][0]];
            if (q >= 0 && !(rl[k][2] ? holds(rl[k][1], i, q) : holds(rl[k][1], q, i))) { good = false; break; }
          }
          if (!good) continue;
          L[n++] = i; rowCover |= 1 << rowOf[i]; colCover |= 1 << colOf[i];
        }
        if (!n) return;
        lens[p] = n;
        if (n < bestLen) { bestLen = n; best = p; }
      }
      // every free row/column except the victim's must still be reachable by some suspect
      let missR = 0, missC = 0;
      for (let k = 0; k < N; k++) {
        if (!rowUsed[k] && !(rowCover & (1 << k))) missR++;
        if (!colUsed[k] && !(colCover & (1 << k))) missC++;
      }
      if (missR > 1 || missC > 1) return;
      const choices = Array.from(lists[best].subarray(0, bestLen));
      for (const i of choices) {
        pos[best] = i; rowUsed[rowOf[i]] = colUsed[colOf[i]] = 1;
        rec(placed + 1);
        pos[best] = -1; rowUsed[rowOf[i]] = colUsed[colOf[i]] = 0;
        if (sols.length >= limit || aborted) return;
      }
    }
    rec(0);
    sols.aborted = aborted;
    return sols;
  }

  /* ---------- logic grader: how a person would solve it ----------
     level 1 = pure elimination (singles, hidden singles in rows/cols, relations)
     level 2 = needs "what if" reasoning (assume a spot, find a contradiction) */
  function grade(P, clues, wantCand) {
    const N = P.N, M = N, victim = N - 1, NN = N * N;
    const rels = [];
    let cand = [];
    for (let p = 0; p < M; p++) {
      const s = new Uint8Array(NN);
      for (let i = 0; i < NN; i++) {
        if (isBlocked(P.obj[i])) continue;
        if (p === victim || clues[p].every((c) => c.t === 'rel' || evalUnary(P, c, i))) s[i] = 1;
      }
      cand.push(s);
      if (p !== victim) for (const c of clues[p]) if (c.t === 'rel') rels.push([p, c.r, c.a]);
    }
    const count = (s) => { let n = 0; for (let i = 0; i < NN; i++) n += s[i]; return n; };

    function propagate(cd) {
      let changed = true;
      while (changed) {
        changed = false;
        for (let p = 0; p < M; p++) {
          const n = count(cd[p]);
          if (!n) return false;
          if (n === 1) {
            const i = cd[p].indexOf(1), r = Math.floor(i / N), c = i % N;
            for (let q = 0; q < M; q++) {
              if (q === p) continue;
              for (let k = 0; k < N; k++) {
                if (cd[q][r * N + k]) { cd[q][r * N + k] = 0; changed = true; }
                if (cd[q][k * N + c]) { cd[q][k * N + c] = 0; changed = true; }
              }
            }
          }
        }
        for (let line = 0; line < N; line++) {
          for (const isRow of [true, false]) {
            let who = -1, n = 0;
            for (let p = 0; p < M; p++) {
              for (let k = 0; k < N; k++) {
                const i = isRow ? line * N + k : k * N + line;
                if (cd[p][i]) { if (who !== p) { n++; who = p; } break; }
              }
            }
            if (n === 0) return false;
            if (n === 1) {
              for (let i = 0; i < NN; i++) {
                const inLine = isRow ? Math.floor(i / N) === line : i % N === line;
                if (!inLine && cd[who][i]) { cd[who][i] = 0; changed = true; }
              }
            }
          }
        }
        for (const [a, r, b] of rels) {
          for (let i = 0; i < NN; i++) {
            if (!cd[a][i]) continue;
            let sup = false;
            for (let j = 0; j < NN && !sup; j++) {
              if (cd[b][j] && Math.floor(i / N) !== Math.floor(j / N) && i % N !== j % N && relHolds(P, r, i, j)) sup = true;
            }
            if (!sup) { cd[a][i] = 0; changed = true; }
          }
          for (let j = 0; j < NN; j++) {
            if (!cd[b][j]) continue;
            let sup = false;
            for (let i = 0; i < NN && !sup; i++) {
              if (cd[a][i] && Math.floor(i / N) !== Math.floor(j / N) && i % N !== j % N && relHolds(P, r, i, j)) sup = true;
            }
            if (!sup) { cd[b][j] = 0; changed = true; }
          }
        }
      }
      return true;
    }
    const solved = (cd) => cd.every((s) => count(s) === 1);

    if (!propagate(cand)) return { level: 9 };
    if (wantCand) return { cand };
    if (solved(cand)) return { level: 1, trials: 0 };
    let trials = 0;
    for (let round = 0; round < 60; round++) {
      let progress = false;
      for (let p = 0; p < M && !progress; p++) {
        for (let i = 0; i < NN && !progress; i++) {
          if (!cand[p][i] || count(cand[p]) === 1) continue;
          const copy = cand.map((s) => s.slice());
          copy[p].fill(0); copy[p][i] = 1;
          if (!propagate(copy)) {
            cand[p][i] = 0; trials++; progress = true;
            if (!propagate(cand)) return { level: 9 };
          }
        }
      }
      if (solved(cand)) return { level: 2, trials };
      if (!progress) break;
    }
    return { level: 3, trials };
  }

  /* ---------- clue text ---------- */
  function clueText(P, c, person) {
    const S = person.g === 'm' ? 'He' : 'She';
    const T = P.theme;
    const Q = () => P.people[c.a].name;
    switch (c.t) {
      case 'zone': return `${S} was in the **${P.zones[c.a].name}**.`;
      case 'notZone': return `${S} was **not** in the **${P.zones[c.a].name}**.`;
      case 'on': return `${S} was **${OBJECTS[c.a].occ}**.`;
      case 'floor': return `${S} was standing on the **bare ${T.floor}**.`;
      case 'beside': return `${S} was **beside ${art(OBJECTS[c.a].name)}**.`;
      case 'notBeside': return `${S} was **not beside** any **${OBJECTS[c.a].name}**.`;
      case 'edge': return `${S} was **by ${art(T.edge)}**.`;
      case 'corner': return `${S} was **in a corner**.`;
      case 'center': return `${S} was **${T.center}**.`;
      case 'wall': return `${S} was **${T.wall}**.`;
      case 'rel':
        switch (c.r) {
          case 'same': return `${S} was in the **same ${T.area}** as ${Q()}.`;
          case 'above': return `${S} was in a **higher row** than ${Q()}.`;
          case 'below': return `${S} was in a **lower row** than ${Q()}.`;
          case 'left': return `${S} was in a column **to the left** of ${Q()}.`;
          case 'right': return `${S} was in a column **to the right** of ${Q()}.`;
          case 'diag': return `${S} was **diagonally next to** ${Q()}.`;
        }
    }
    return '';
  }

  /* ---------- generation ---------- */
  function tryGenerate(R, H, diffKey, themeIdx) {
    const D = DIFFICULTY[diffKey], N = D.N, victim = N - 1;
    const theme = THEMES[themeIdx];
    const k = D.zones[0] + H.ri(D.zones[1] - D.zones[0] + 1);
    const zoneOf = makeZones(N, Math.min(k, theme.zones.length), R, H);
    if (!zoneOf) return null;
    const zoneDefs = H.shuffle(theme.zones).slice(0, k);
    const colors = H.shuffle(theme.colors);
    const zones = zoneDefs.map((d, z) => ({ name: d[0], color: colors[z % colors.length] }));
    const obj = placeObjects(N, zoneOf, zoneDefs, R, H);
    const walls = computeWalls(N, zoneOf);

    const edges = new Set(), edgeList = [];
    for (let c = 0; c < N; c++) { edgeList.push(c + 'n'); edgeList.push((N - 1) * N + c + 's'); }
    for (let r = 0; r < N; r++) { edgeList.push(r * N + 'w'); edgeList.push(r * N + N - 1 + 'e'); }
    const ne = D.edges[0] + H.ri(D.edges[1] - D.edges[0] + 1);
    H.shuffle(edgeList).slice(0, ne).forEach((e) => edges.add(e));

    const P = { N, zoneOf, zones, obj, walls, edges, theme };
    P.facts = zoneOf.map((_, i) => cellFacts(P, i));

    // the hidden truth: one person per row and column, nobody on blocked objects,
    // and exactly one suspect alone with the victim
    let sol = null, murderer = -1;
    for (let t = 0; t < 3000 && !sol; t++) {
      const perm = H.shuffle([...Array(N).keys()]);
      const cells = perm.map((c, r) => r * N + c);
      if (cells.some((i) => isBlocked(obj[i]))) continue;
      const order = H.shuffle(cells);
      const vz = zoneOf[order[victim]];
      const with_ = [];
      for (let p = 0; p < victim; p++) if (zoneOf[order[p]] === vz) with_.push(p);
      if (with_.length !== 1) continue;
      sol = order; murderer = with_[0];
    }
    if (!sol) return null;

    const letters = 'ABCDEFGHI'.slice(0, victim).split('').concat('V');
    const faces = { m: H.shuffle(FACES.m), f: H.shuffle(FACES.f) };
    const people = letters.map((L, p) => {
      const [name, g] = H.pick(NAMES[L]);
      return { letter: L, name, g, emoji: faces[g].pop(), color: p === victim ? '#7f1d1d' : TOKEN_COLORS[p % TOKEN_COLORS.length] };
    });
    P.people = people;

    const all = [];
    for (let p = 0; p < victim; p++) all[p] = trueClues(P, sol, p, victim, D.extras);
    const freeCells = [];
    for (let i = 0; i < N * N; i++) if (!isBlocked(obj[i])) freeCells.push(i);
    const size = (c) => {
      if (c.t === 'rel') return c.r === 'diag' ? 3 : c.r === 'same' ? freeCells.length / zones.length : freeCells.length / 2;
      return freeCells.filter((i) => evalUnary(P, c, i)).length;
    };
    const broadPick = (pool) => {
      // prefer clues that leave many possibilities open
      const scored = pool.map((c) => [c, size(c) + R() * freeCells.length * 0.35]).sort((a, b) => b[1] - a[1]);
      return scored[Math.floor(R() * Math.min(3, scored.length))][0];
    };

    const clues = [];
    for (let p = 0; p < victim; p++) {
      let pool = all[p].filter((c) => NATURAL[c.t]);
      if (D.style === 'specific') {
        pool.sort((a, b) => size(a) - size(b));
        clues[p] = [H.pick(pool.slice(0, Math.max(1, Math.ceil(pool.length / 2))))];
      } else if (D.style === 'normal') {
        clues[p] = [H.pick(pool)];
      } else {
        if (D.extras && R() < 0.35) pool = all[p].filter((c) => c.t !== 'notZone' && c.t !== 'notBeside');
        clues[p] = [broadPick(pool)];
      }
    }

    const CAP = 120000; // a search this long means a messy layout: throw the attempt away
    for (let guard = 0; guard < 80; guard++) {
      const sols = solve(P, clues, 2, CAP);
      if (sols.aborted || !sols.length) return null;
      if (sols.length === 1) break;
      const other = sols[0].every((x, i) => x === sol[i]) ? sols[1] : sols[0];
      const diff = H.shuffle([...Array(victim).keys()].filter((p) => other[p] !== sol[p]))
        .sort((a, b) => clues[a].length - clues[b].length);
      let added = false;
      for (const p of diff) {
        if (clues[p].length >= D.maxClues) continue;
        const have = new Set(clues[p].map(clueKey));
        const excl = all[p].filter((c) => {
          if (have.has(clueKey(c))) return false;
          if (c.t === 'rel') return !relHolds(P, c.r, other[p], other[c.a]);
          return !evalUnary(P, c, other[p]);
        });
        if (!excl.length) continue;
        if (D.style === 'broad') clues[p].push(broadPick(excl));
        else {
          const nice = excl.filter((c) => NATURAL[c.t] || (c.t === 'rel' && c.r === 'same'));
          clues[p].push(H.pick(nice.length && R() < 0.8 ? nice : excl));
        }
        added = true;
        break;
      }
      if (!added) return null;
    }
    { const chk = solve(P, clues, 2, CAP); if (chk.aborted || chk.length !== 1) return null; }

    if (D.minimize) {
      const order = H.shuffle([...Array(victim).keys()]);
      for (const p of order) {
        for (let j = clues[p].length - 1; j >= 0 && clues[p].length > 1; j--) {
          const removed = clues[p].splice(j, 1)[0];
          const r = solve(P, clues, 2, D.budget);
          if (r.aborted || r.length !== 1) clues[p].splice(j, 0, removed);
        }
      }
    }

    { const chk = solve(P, clues, 2, CAP); if (chk.aborted || chk.length !== 1) return null; }
    const g = grade(P, clues.concat([[]]));
    people.forEach((person, p) => {
      person.isVictim = p === victim;
      person.rawClues = p === victim ? [] : clues[p];
      person.clues = person.rawClues.map((c) => clueText(P, c, person));
    });
    const story = H.pick(theme.stories);
    return {
      version: VERSION, N, zones, zoneOf, obj, walls,
      edges: [...edges], facts: P.facts, people, solution: sol, murderer, victim,
      theme: { id: theme.id, name: theme.name, icon: theme.icon, area: theme.area, edge: theme.edge, edgeColor: theme.edgeColor, floor: theme.floor, wall: theme.wall, center: theme.center },
      title: story[0], intro: story[1], grade: g,
    };
  }

  function generate(seed, diffKey) {
    const D = DIFFICULTY[diffKey];
    const R = mulberry32(seed * 2654435761 + 12345);
    const H = makeHelpers(R);
    // consecutive cases walk through the scenes so the setting keeps changing
    const themeIdx = (seed * 4 + Math.floor(seed / 100000) * 2) % THEMES.length;
    let best = null;
    const want = D.attempts || 1;
    for (let attempt = 0, got = 0; attempt < 400 && got < want; attempt++) {
      const p = tryGenerate(R, H, diffKey, themeIdx);
      if (!p || p.grade.level > 2) continue;
      got++;
      const score = (p.grade.level === 2 ? 1000 : 0) + p.grade.trials * 10;
      if (!best || score > best.score) best = { p, score };
      if (D.needTrial && p.grade.level === 2 && p.grade.trials >= (D.minTrials || 3)) break;
    }
    if (!best) throw new Error('Could not build a case');
    return best.p;
  }


  /* ---------- extra clues for the hint button ----------
     Facts about the whole scene ("only one suspect sat on a chair"), true in the solution,
     ranked by how many possibilities they rule out at the player's current point. */
  function sceneFacts(P, known) {
    const N = P.N, NN = N * N, victim = N - 1;
    const T = P.theme;
    const clues = P.people.map((p) => p.rawClues || []);
    const applyKnown = (cand) => {
      for (const [p, cell] of Object.entries(known.fixed || {})) { cand[p].fill(0); cand[p][cell] = 1; }
      for (const cell of known.crossed || []) for (let p = 0; p < victim; p++) if (!(known.fixed && known.fixed[p] === cell)) cand[p][cell] = 0;
      return cand;
    };
    // where an attentive player would be after plain elimination...
    const deduced = grade(P, clues, true).cand;
    // ...and where a beginner is: only each suspect's own clues
    const raw = P.people.map((person, p) => {
      const s = new Uint8Array(NN);
      for (let i = 0; i < NN; i++) {
        if (!isBlocked(P.obj[i]) && (p === victim || clues[p].every((c) => c.t === 'rel' || evalUnary(P, c, i)))) s[i] = 1;
      }
      return s;
    });
    const sol = P.solution.slice(0, victim);
    const facts = [];
    const qty = (k, what) => (k === 0 ? `**No suspect** was ${what}.` : k === victim && k > 1 ? `**Every suspect** was ${what}.` : k === 1 ? `**Only one suspect** was ${what}.` : `**Exactly ${k} suspects** were ${what}.`);
    // d = language-neutral description of the fact, so the app can phrase it in any language
    const addCount = (id, test, what, d) => {
      const k = sol.filter(test).length;
      facts.push({ id, kind: 'count', test, k, text: qty(k, what), d: { ...d, k, total: victim } });
    };
    P.zones.forEach((z, zi) => addCount('zone' + zi, (i) => P.zoneOf[i] === zi, `in the **${z.name}**`, { w: 'zone', z: zi }));
    const present = [...new Set(P.obj.filter((o) => o && !isBlocked(o)))];
    for (const o of present) addCount('on-' + o, (i) => P.obj[i] === o, `**${OBJECTS[o].occ}**`, { w: 'on', o });
    addCount('floor', (i) => !P.obj[i], `standing on the **bare ${T.floor}**`, { w: 'floor' });
    addCount('corner', (i) => P.facts[i].corner, `**in a corner**`, { w: 'corner' });
    addCount('edge', (i) => P.facts[i].edge, `**by ${art(T.edge)}**`, { w: 'edge' });
    addCount('center', (i) => P.facts[i].center, `**${T.center}**`, { w: 'center' });
    const occupied = new Set(sol.map((i) => P.zoneOf[i]));
    if (occupied.size === P.zones.length) facts.push({ id: 'allzones', kind: 'all', text: `**Every ${T.area}** had at least one suspect in it.`, d: { w: 'allzones' } });
    else if (P.zones.length - occupied.size === 1) {
      const z = [...P.zones.keys()].find((x) => !occupied.has(x));
      facts.push({ id: 'onlyempty', kind: 'count', test: (i) => P.zoneOf[i] === z, k: 0, text: `The **${P.zones[z].name}** was the **only ${T.area}** with no suspects.`, dup: 'zone' + z, d: { w: 'onlyempty', z } });
    }

    // how many (suspect, square) options does a fact rule out, ignoring everything else?
    const rowOf = (i) => Math.floor(i / N), colOf = (i) => i % N;
    const scoreAll = (cand) => facts.map((f) => {
      let gone = 0;
      for (let p = 0; p < victim; p++) {
        for (let c = 0; c < NN; c++) {
          if (!cand[p][c]) continue;
          let ok;
          if (f.kind === 'count') {
            let min = f.test(c) ? 1 : 0, max = min;
            for (let q = 0; q < victim && max <= f.k + 1; q++) {
              if (q === p) continue;
              let can = false, must = true, any = false;
              for (let j = 0; j < NN; j++) {
                if (!cand[q][j] || rowOf(j) === rowOf(c) || colOf(j) === colOf(c)) continue;
                any = true;
                if (f.test(j)) can = true; else must = false;
              }
              if (!any) continue;
              if (can) max++;
              if (must) min++;
            }
            ok = min <= f.k && f.k <= max;
          } else {
            ok = P.zones.every((_, z) => {
              if (P.zoneOf[c] === z) return true;
              for (let q = 0; q < victim; q++) {
                if (q === p) continue;
                for (let j = 0; j < NN; j++) {
                  if (cand[q][j] && P.zoneOf[j] === z && rowOf(j) !== rowOf(c) && colOf(j) !== colOf(c)) return true;
                }
              }
              return false;
            });
          }
          if (!ok) gone++;
        }
      }
      return gone;
    });
    let scores = deduced ? scoreAll(applyKnown(deduced)) : [];
    if (!scores.length || Math.max(...scores) === 0) scores = scoreAll(applyKnown(raw));
    return facts.map(({ id, text, dup, d }, k) => ({ id, text, dup, d, score: scores[k] }));
  }

  // the scene a seed will use (same formula as generate)
  function themeFor(seed) { return THEMES[(seed * 4 + Math.floor(seed / 100000) * 2) % THEMES.length]; }

  // turns a hand-made layout (like the tutorial case) into a full puzzle object
  function finishCustom(P) {
    P.walls = computeWalls(P.N, P.zoneOf);
    const view = { ...P, edges: new Set(P.edges) };
    P.facts = P.zoneOf.map((_, i) => cellFacts(view, i));
    return P;
  }

  const API = { generate, solve, grade, sceneFacts, finishCustom, themeFor, evalUnary, isBlocked, OBJECTS, THEMES, DIFFICULTY, VERSION };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.MysteryEngine = API;
})(typeof window !== 'undefined' ? window : globalThis);
