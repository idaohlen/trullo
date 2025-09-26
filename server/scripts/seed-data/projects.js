export default [
  {
    title: "Trullo",
    description: "Building the next generation project management platform with modern web technologies and intuitive user experience.",
    owner: { name: "Admin User", email: "admin@trullo.com", password: "Password1!", role: "ADMIN" },
    members: [
      { name: "Regular User", email: "user@trullo.com", password: "Password1!" },
      { name: "Astrid Lindgren", email: "astrid@trullo.com", password: "ReactExpert#37" },
      { name: "Erik Johansson", email: "erik@trullo.com", password: "NodeMaster$38" },
      { name: "Ingrid Bergström", email: "ingrid@trullo.com", password: "UXDesigner!39" }
    ],
    tasks: [
      { title: "Implement drag & drop functionality", description: "Add React Beautiful DND for card and list reordering", status: "IN_PROGRESS" },
      { title: "Design user authentication flow", description: "Create login/register UI with proper validation and error handling", status: "DONE" },
      { title: "Setup GraphQL API schema", description: "Define types for Users, Projects, Tasks and their relationships", status: "DONE" },
      { title: "Build responsive dashboard", description: "Create mobile-first dashboard layout using Tailwind CSS", status: "TO_DO" },
      { title: "Implement real-time collaboration", description: "Add WebSocket support for live updates across multiple users", status: "TO_DO" },
      { title: "Create task assignment system", description: "Allow users to assign tasks to team members with notifications", status: "IN_PROGRESS" },
      { title: "Add file upload functionality", description: "Enable users to attach files to tasks with cloud storage integration", status: "TO_DO" },
      { title: "Setup automated testing", description: "Configure Jest and Cypress for unit and e2e testing", status: "BLOCKED" },
      { title: "Implement search and filtering", description: "Add global search across projects and advanced filtering options", status: "TO_DO" },
      { title: "Create admin panel", description: "Build admin interface for user management and system analytics", status: "IN_PROGRESS" }
    ]
  },
  {
    title: "Black Sabbath",
    description: "The pioneers of heavy metal. Masters of dark riffs and doom-laden lyrics that birthed an entire genre.",
    owner: { name: "Ozzy Osbourne", email: "ozzy@sabbath.com", password: "PrinceOfDarkness1!" },
    members: [
      { name: "Tony Iommi", email: "tony@sabbath.com", password: "IronMan#2" },
      { name: "Geezer Butler", email: "geezer@sabbath.com", password: "BassWizard$3" },
      { name: "Bill Ward", email: "bill@sabbath.com", password: "DrumDemon!4" },
    ],
    tasks: [
      { title: "Write a new riff", description: "Tony to create a riff as heavy as 'Iron Man'", status: "TO_DO" },
      { title: "Lyric brainstorm", description: "Geezer to write lyrics inspired by 'War Pigs'", status: "TO_DO" },
      { title: "Record Paranoid album", description: "Studio sessions for the legendary album", status: "IN_PROGRESS" },
      { title: "Tune down guitars", description: "Experiment with lower tunings for heavier sound", status: "DONE" },
      { title: "Design album artwork", description: "Create dark and mystical album cover", status: "TO_DO" },
      { title: "Book tour venues", description: "Schedule concerts across Europe and US", status: "TO_DO" },
      { title: "Practice 'Children of the Grave'", description: "Perfect the timing for this heavy anthem", status: "IN_PROGRESS" }
    ]
  },
  {
    title: "Led Zeppelin",
    description: "Legends of hard rock and blues, known for epic live performances and mystical lyrics.",
    owner: { name: "Robert Plant", email: "robert@zeppelin.com", password: "GoldenGod!5" },
    members: [
      { name: "Jimmy Page", email: "jimmy@zeppelin.com", password: "GuitarDragon#6" },
      { name: "John Paul Jones", email: "jpj@zeppelin.com", password: "MultiTalent$7" },
      { name: "John Bonham", email: "bonzo@zeppelin.com", password: "DrumThunder!8" },
    ],
    tasks: [
      { title: "Rehearse 'Stairway to Heaven'", description: "Full band rehearsal for the epic 8-minute masterpiece", status: "IN_PROGRESS" },
      { title: "Plan next tour", description: "Organize world tour with setlist including 'Kashmir' and 'Whole Lotta Love'", status: "TO_DO" },
      { title: "Record 'Black Dog'", description: "Lay down tracks for this heavy blues rocker", status: "TO_DO" },
      { title: "Master 'Moby Dick' drum solo", description: "Bonzo to perfect his legendary 15-minute drum showcase", status: "IN_PROGRESS" },
      { title: "Write mystical lyrics", description: "Plant to channel Tolkien influences for new songs", status: "TO_DO" },
      { title: "Experiment with violin bow", description: "Page to explore bow techniques on guitar", status: "DONE" },
      { title: "Book Madison Square Garden", description: "Secure venue for epic NYC performance", status: "TO_DO" },
      { title: "Design 'Houses of the Holy' cover", description: "Create surreal album artwork at Giant's Causeway", status: "BLOCKED" }
    ]
  },
  {
    title: "Iron Maiden",
    description: "British heavy metal icons, famous for galloping bass lines and epic storytelling with Eddie as mascot.",
    owner: { name: "Bruce Dickinson", email: "bruce@maiden.com", password: "AirRaidSir3n!" },
    members: [
      { name: "Steve Harris", email: "steve@maiden.com", password: "GallopKing#9" },
      { name: "Dave Murray", email: "dave@maiden.com", password: "StratHero$10" },
      { name: "Nicko McBrain", email: "nicko@maiden.com", password: "DrumBeast!11" },
      { name: "Adrian Smith", email: "adrian@maiden.com", password: "SixString$12" },
      { name: "Janick Gers", email: "janick@maiden.com", password: "ThreeGuitar!13" }
    ],
    tasks: [
      { title: "Write new Eddie story", description: "Bruce and Steve to brainstorm concept for next album's mascot adventure", status: "TO_DO" },
      { title: "Practice 'The Trooper'", description: "Rehearse the galloping classic with full stage theatrics", status: "IN_PROGRESS" },
      { title: "Record 'Aces High'", description: "Capture the WWII aerial combat epic in studio", status: "TO_DO" },
      { title: "Design stage props", description: "Create Eddie animatronics and pyrotechnics for tour", status: "TO_DO" },
      { title: "Master 'Rime of the Ancient Mariner'", description: "Perfect the 13-minute Coleridge adaptation", status: "IN_PROGRESS" },
      { title: "Book Donnington festival", description: "Headline the legendary metal festival", status: "DONE" },
      { title: "Write historical epic", description: "Research new historical theme for concept album", status: "TO_DO" }
    ]
  },
  {
    title: "Metallica",
    description: "Thrash metal titans who brought heavy music to the mainstream while never compromising their edge.",
    owner: { name: "James Hetfield", email: "james@metallica.com", password: "MasterOfPuppets1!" },
    members: [
      { name: "Lars Ulrich", email: "lars@metallica.com", password: "DrumSnare#14" },
      { name: "Kirk Hammett", email: "kirk@metallica.com", password: "WahPedal$15" },
      { name: "Robert Trujillo", email: "rob@metallica.com", password: "BassSlap!16" }
    ],
    tasks: [
      { title: "Write thrash masterpiece", description: "Compose something heavier than 'Master of Puppets'", status: "TO_DO" },
      { title: "Record 'One' music video", description: "Create anti-war video with 'Johnny Got His Gun' footage", status: "IN_PROGRESS" },
      { title: "Master downpicking technique", description: "James to perfect right-hand stamina for live shows", status: "DONE" },
      { title: "Design stage setup", description: "Plan 360-degree stage for stadium tour", status: "TO_DO" },
      { title: "Rehearse 'Creeping Death'", description: "Perfect the crowd participation 'Die! Die! Die!' section", status: "IN_PROGRESS" },
      { title: "Write ballad", description: "Create something as emotional as 'Fade to Black'", status: "TO_DO" },
      { title: "Book S&M orchestra", description: "Arrange collaboration with San Francisco Symphony", status: "BLOCKED" },
      { title: "Master Kirk's solos", description: "Perfect the wah-heavy lead guitar parts", status: "TO_DO" }
    ]
  },
  {
    title: "Deep Purple",
    description: "Hard rock pioneers with classical influences, featuring some of the greatest musicians in rock history.",
    owner: { name: "Ian Gillan", email: "ian@purple.com", password: "HighwayStarVocals!" },
    members: [
      { name: "Ritchie Blackmore", email: "ritchie@purple.com", password: "StratClassical#17" },
      { name: "Jon Lord", email: "jon@purple.com", password: "HammondOrgan$18" },
      { name: "Roger Glover", email: "roger@purple.com", password: "BassFoundation!19" },
      { name: "Ian Paice", email: "paice@purple.com", password: "DrumMachine#20" }
    ],
    tasks: [
      { title: "Record 'Smoke on the Water'", description: "Capture the legendary riff that every guitarist knows", status: "DONE" },
      { title: "Perfect 'Highway Star' solo", description: "Ritchie to nail the blistering guitar showcase", status: "IN_PROGRESS" },
      { title: "Arrange orchestra parts", description: "Jon to write classical arrangements for rock songs", status: "TO_DO" },
      { title: "Build custom Hammond rig", description: "Create massive organ setup for live shows", status: "TO_DO" },
      { title: "Practice 'Child in Time'", description: "Ian G. to master the 10-minute vocal marathon", status: "IN_PROGRESS" },
      { title: "Book Montreux Casino", description: "Schedule recording session at Swiss venue", status: "BLOCKED" },
      { title: "Write speed metal anthem", description: "Create something faster than 'Fireball'", status: "TO_DO" }
    ]
  },
  {
    title: "AC/DC",
    description: "Australian rock legends delivering pure, high-voltage rock and roll with thunderous rhythm section.",
    owner: { name: "Brian Johnson", email: "brian@acdc.com", password: "ThunderStruck1!" },
    members: [
      { name: "Angus Young", email: "angus@acdc.com", password: "SchoolboyOutfit#21" },
      { name: "Malcolm Young", email: "malcolm@acdc.com", password: "RhythmKing$22" },
      { name: "Cliff Williams", email: "cliff@acdc.com", password: "SolidBass!23" },
      { name: "Phil Rudd", email: "phil@acdc.com", password: "SteadyBeat#24" }
    ],
    tasks: [
      { title: "Master 'Thunderstruck' intro", description: "Angus to perfect the lightning-fast finger picking", status: "DONE" },
      { title: "Record 'Back in Black'", description: "Lay down the ultimate comeback anthem", status: "IN_PROGRESS" },
      { title: "Design stage cannons", description: "Build massive props for 'For Those About to Rock'", status: "TO_DO" },
      { title: "Practice schoolboy routine", description: "Angus to rehearse his iconic stage antics", status: "TO_DO" },
      { title: "Write simple but heavy riff", description: "Create something as catchy as 'Highway to Hell'", status: "TO_DO" },
      { title: "Master rhythm guitar", description: "Malcolm to perfect the backbone of AC/DC sound", status: "DONE" },
      { title: "Book stadium tour", description: "Plan massive outdoor shows with pyrotechnics", status: "IN_PROGRESS" },
      { title: "Record cowbell parts", description: "Add the secret ingredient to rock anthems", status: "BLOCKED" }
    ]
  },
  {
    title: "Judas Priest",
    description: "Metal gods who defined the leather and studs aesthetic while pioneering the twin-guitar attack.",
    owner: { name: "Rob Halford", email: "rob@priest.com", password: "MetalGod666!" },
    members: [
      { name: "Glenn Tipton", email: "glenn@priest.com", password: "TwinGuitarAttack#25" },
      { name: "K.K. Downing", email: "kk@priest.com", password: "FlyingV$26" },
      { name: "Ian Hill", email: "ianhill@priest.com", password: "BassFounder!27" },
      { name: "Scott Travis", email: "scott@priest.com", password: "DoubleBass#28" }
    ],
    tasks: [
      { title: "Perfect 'Painkiller' speed", description: "Master the fastest song in metal history", status: "IN_PROGRESS" },
      { title: "Design leather stage outfit", description: "Rob to create iconic metal god costume", status: "DONE" },
      { title: "Write twin guitar harmonies", description: "Glenn and K.K. to compose dual lead parts", status: "TO_DO" },
      { title: "Record 'Breaking the Law'", description: "Capture the metal anthem in studio", status: "TO_DO" },
      { title: "Practice motorcycle entrance", description: "Rob to rehearse riding Harley on stage", status: "TO_DO" },
      { title: "Master operatic vocals", description: "Develop the highest screams in metal", status: "IN_PROGRESS" },
      { title: "Book heavy metal festival", description: "Headline the first all-metal festival", status: "BLOCKED" }
    ]
  },
  {
    title: "Motörhead",
    description: "The loudest band in the world, playing rock and roll so fast and heavy it created speed metal.",
    owner: { name: "Lemmy Kilmister", email: "lemmy@motorhead.com", password: "AceOfSpades1!" },
    members: [
      { name: "Fast Eddie Clarke", email: "eddie@motorhead.com", password: "SpeedGuitar#29" },
      { name: "Phil Taylor", email: "philthy@motorhead.com", password: "AnimalDrums$30" }
    ],
    tasks: [
      { title: "Record 'Ace of Spades'", description: "Capture the ultimate rock and roll anthem", status: "DONE" },
      { title: "Turn amps to 11", description: "Find a way to make it even louder than before", status: "TO_DO" },
      { title: "Perfect motorcharging", description: "Master the signature fast-picking technique", status: "IN_PROGRESS" },
      { title: "Write drinking song", description: "Create anthem for whiskey and cigarettes", status: "TO_DO" },
      { title: "Design snaggletooth logo", description: "Create the iconic Motörhead mascot", status: "DONE" },
      { title: "Play faster than punk", description: "Out-speed the Sex Pistols and Ramones", status: "IN_PROGRESS" },
      { title: "Book biker rally", description: "Play for the most appropriate audience", status: "TO_DO" },
      { title: "Survive the volume", description: "Protect hearing during rehearsals", status: "BLOCKED" }
    ]
  },
  {
    title: "Rainbow",
    description: "Ritchie Blackmore's fantasy-themed metal project featuring virtuoso musicianship and mystical themes.",
    owner: { name: "Ritchie Blackmore", email: "ritchie@rainbow.com", password: "StratocasterMaster!" },
    members: [
      { name: "Ronnie James Dio", email: "dio@rainbow.com", password: "HolyDiver#31" },
      { name: "Cozy Powell", email: "cozy@rainbow.com", password: "ThunderDrums$32" },
      { name: "Jimmy Bain", email: "jimmy@rainbow.com", password: "BassWizard!33" }
    ],
    tasks: [
      { title: "Write fantasy epic", description: "Compose songs about dragons and wizards", status: "TO_DO" },
      { title: "Record 'Man on the Silver Mountain'", description: "Capture Dio's powerful vocals on the fantasy anthem", status: "IN_PROGRESS" },
      { title: "Master neoclassical scales", description: "Ritchie to perfect baroque-influenced solos", status: "DONE" },
      { title: "Design medieval stage show", description: "Create castle props and mystical atmosphere", status: "TO_DO" },
      { title: "Perfect 'Stargazer'", description: "Master the 8-minute progressive metal epic", status: "IN_PROGRESS" },
      { title: "Study classical composers", description: "Research Bach and Vivaldi for guitar arrangements", status: "TO_DO" },
      { title: "Write rising ballad", description: "Create something as emotional as 'Temple of the King'", status: "TO_DO" },
      { title: "Book castle venue", description: "Find authentic medieval location for concert", status: "BLOCKED" }
    ]
  },
  {
    title: "Dio",
    description: "Heavy metal with fantasy themes and the most powerful voice in metal, spreading the devil horns worldwide.",
    owner: { name: "Ronnie James Dio", email: "ronnie@dio.com", password: "HeavenAndHell1!" },
    members: [
      { name: "Vivian Campbell", email: "vivian@dio.com", password: "DefLeppardGuitar#34" },
      { name: "Jimmy Bain", email: "jimmybain@dio.com", password: "BassLegend$35" },
      { name: "Vinny Appice", email: "vinny@dio.com", password: "DrumThunder!36" }
    ],
    tasks: [
      { title: "Record 'Holy Diver'", description: "Capture the ultimate metal anthem with fantasy themes", status: "DONE" },
      { title: "Perfect devil horns gesture", description: "Teach fans the proper way to throw the horns", status: "DONE" },
      { title: "Write dragon mythology", description: "Create lyrics about mystical creatures and medieval tales", status: "TO_DO" },
      { title: "Design elaborate stage show", description: "Build dragon props and medieval castle backdrop", status: "IN_PROGRESS" },
      { title: "Master operatic delivery", description: "Perfect the most powerful voice in heavy metal", status: "IN_PROGRESS" },
      { title: "Record 'Rainbow in the Dark'", description: "Lay down the classic metal anthem", status: "TO_DO" },
      { title: "Plan concept album", description: "Develop storyline for fantasy-themed record", status: "TO_DO" },
      { title: "Spread metal worldwide", description: "Bring heavy metal and horns gesture to every continent", status: "TO_DO" }
    ]
  },
];
