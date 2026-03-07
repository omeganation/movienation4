/* =====================================================
   MOVIENATION — MOVIE DATABASE
   HOW TO ADD WATCH / DOWNLOAD LINKS:
   watchUrl:    put any external streaming URL here
   downloadUrl: put any external download URL here
   ===================================================== */

/* ── MOVIES ── */
const MOVIES = [
  [
  {
    "castImg": [],
    "studio": "Prime Video",
    "cast": [
      "Jason Statham",
      "Bodhi Rae Breathnach",
      "Michael Shaeffer"
    ],
    "tagline": "Michael Mason is a recluse on a remote Scottish island who rescues a girl from the sea, unleashing a perilous sequence of events that culminate in an attack on his home, compelling him to face his turbulent history.",
    "upcoming": false,
    "title": "Shelter",
    "featured": false,
    "director": "Ric Roman Waugh",
    "desc": "Michael Mason is a recluse on a remote Scottish island who rescues a girl from the sea, unleashing a perilous sequence of events that culminate in an attack on his home, compelling him to face his turbulent history.",
    "trailer": "PPMawzJxKF4",
    "releaseDate": "2026-03-01",
    "longDesc": "",
    "downloadUrl": "https://www.mediafire.com/file/mhh7ex8q8p1paga/SHELTER.mp4/file",
    "watchUrl": "https://masukestin.com/5wywfeluuj3j",
    "poster": "https://m.media-amazon.com/images/M/MV5BMzI2ODY3MzQtYzllNy00YWM1LWExZTgtOGIwNjk2MmE2MmY2XkEyXkFqcGc@._V1_.jpg",
    "duration": "1h 47m",
    "genres": [
      "Action",
      "Thriller",
      "Spy"
    ],
    "id": 1,
    "backdrop": "https://m.media-amazon.com/images/M/MV5BMzI2ODY3MzQtYzllNy00YWM1LWExZTgtOGIwNjk2MmE2MmY2XkEyXkFqcGc@._V1_.jpg",
    "badge": "new",
    "isNew": true,
    "year": 2026,
    "votes": 0,
    "rating": 6.7
  },
  {
    "poster": "https://upload.wikimedia.org/wikipedia/en/d/df/Pel%C3%A9_%28film_poster%29.jpg",
    "duration": "01:58:20",
    "longDesc": "a 2016 biographical drama film that chronicles the early life and meteoric rise of the legendary Brazilian footballer, Edson Arantes do Nascimento, known as Pelé",
    "downloadUrl": "",
    "watchUrl": "https://www.rebamovie.com/cinema?vd=228cedaa-1878-492a-9877-175bc289ab32",
    "featured": true,
    "director": "Jeff Zimbalist",
    "desc": "a biographical drama chronicling the meteoric rise of Edson Arantes do Nascimento from a poverty-stricken childhood in Brazil to becoming a 17-year-old soccer sensation",
    "trailer": "XBrfxHOXsDE",
    "releaseDate": "2016-05-06",
    "castImg": [],
    "studio": "Imagine Entertainment",
    "title": "Pele: Birth of a Legend",
    "cast": [
      "Kevin de Paula",
      "Seu Jorge",
      "Leonardo Lima Carvalho",
      "Mariana Nunes",
      "Milton Gonçalves"
    ],
    "upcoming": false,
    "tagline": "A boy with nothing changed everything",
    "rating": 8.1,
    "year": 2016,
    "votes": 23000,
    "isNew": false,
    "genres": [
      "Soccer",
      "Documentary",
      "Biography"
    ],
    "id": 2,
    "badge": "top",
    "backdrop": "https://img4.hulu.com/user/v3/artwork/7831c71a-e354-48a3-b7fa-f3d7530231b0?base_image_bucket_name=image_manager&base_image=77b09654-572e-4fd9-ad92-f73f2d5ca0a7&size=1200x630&format=webp&operations=%5B%7B%22gradient_vector%22%3A%22(0%2C0%2C0%2C0.5)%7C(0%2C0%2C0%2C0)%7C(0%2C600)%7C(0%2C240)%22%7D%2C%7B%22overlay%22%3A%7B%22position%22%3A%22SouthEast%7C(30%2C30)%22%2C%22operations%22%3A%5B%7B%22image%22%3A%22image_manager%7C2f8cf3ba-48c3-4c83-9f83-2fe421f8d71e%22%7D%2C%7B%22resize%22%3A%22204x204%7Cmax%22%7D%2C%7B%22extent%22%3A%22204x204%22%7D%5D%7D%7D%2C%5D"
  },
  {
    "longDesc": "the highest-ranking, often ceremonial representative of a sovereign state, embodying its unity, legitimacy, and continuity at home and abroad",
    "downloadUrl": "",
    "watchUrl": "https://www.rebamovie.com/cinema?vd=d2ec9f78-f6f5-4c44-ade1-6ded6516a25d",
    "poster": "https://upload.wikimedia.org/wikipedia/en/6/6b/Heads_of_State_poster.jpg",
    "duration": "01:49:13",
    "studio": "Prime Video",
    "castImg": [],
    "title": "Heads of State",
    "cast": [
      "Idris Elba",
      "John Cena",
      "Priyanka Chopra Jonas",
      "Paddy Considine",
      "Carla Gugino"
    ],
    "tagline": "The only thing white is the house",
    "upcoming": false,
    "featured": false,
    "director": " Ilya Naishuller",
    "releaseDate": "2025-07-02",
    "trailer": "8J646zM7UM8",
    "desc": "the highest-ranking, often ceremonial, public representative of a sovereign state",
    "year": 2025,
    "votes": 66000,
    "rating": 6.8,
    "id": 3,
    "genres": [
      "Action",
      "Comedy"
    ],
    "backdrop": "https://www.framerated.co.uk/wp-content/uploads/2025/07/headsstate01.jpg",
    "badge": "",
    "isNew": false
  },
  {
    "rating": 5.6,
    "year": 2024,
    "votes": 8600,
    "isNew": false,
    "id": 4,
    "genres": [
      "Horror",
      "Thriller"
    ],
    "backdrop": "https://static.wixstatic.com/media/25ad9d_aa0b02a1a7014efbac587ccd418b4350~mv2.jpg/v1/fill/w_568,h_284,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/25ad9d_aa0b02a1a7014efbac587ccd418b4350~mv2.jpg",
    "badge": "",
    "poster": "https://m.media-amazon.com/images/M/MV5BNzQwZDIzMWEtZDNkOS00ODI5LWI1YmYtNDU3MTM0NWQ0MDVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "duration": "1h 34m",
    "longDesc": "We Bury the Dead (2024/2026) is a sci-fi thriller following Ava (Daisy Ridley), a woman searching for her husband in Tasmania after a catastrophic military, YouTube video experimental weapon disaster. ",
    "downloadUrl": "",
    "watchUrl": "https://www.rebamovie.com/cinema?vd=9496c244-3674-44d7-a0a2-ff30926cf7f5",
    "featured": false,
    "director": "Zak Hilditch",
    "desc": "We Bury the Dead (2024/2026) is a sci-fi thriller following Ava (Daisy Ridley), a woman searching for her husband in Tasmania after a catastrophic military, YouTube video experimental weapon disaster.",
    "trailer": "iE-W-wEJJqw",
    "releaseDate": "2026-01-02",
    "castImg": [],
    "studio": "XYZ Films",
    "title": "We Bury the Dead",
    "cast": [
      "Daisy Ridley",
      "Brenton Thwaites",
      "Mark Coles Smith",
      "Matt Whelan",
      "Chloe Hurst"
    ],
    "upcoming": false,
    "tagline": "After a catastrophic military disaster, the dead don't just rise — they hunt"
  },
  {
    "title": "Hobbs & Shaw",
    "cast": [
      "Dwayne Johnson",
      "Jason Statham",
      "Idris Elba",
      "Vanessa Kirby",
      "Helen Mirren"
    ],
    "tagline": "Fast. Furious. And out of control.",
    "upcoming": false,
    "studio": "Universal Pictures",
    "castImg": [],
    "featured": true,
    "releaseDate": "2019-08-02",
    "trailer": "HZ7PAyCDwEg",
    "desc": "Lawman Luke Hobbs and former outlaw Deckard Shaw must team up to stop a genetically enhanced terrorist threatening the world with a deadly virus.",
    "director": "David Leitch",
    "longDesc": "Ever since lawman Luke Hobbs and skilled outlaw Deckard Shaw first faced off, they have constantly clashed. But when cyber-genetically enhanced anarchist Brixton gains control of a deadly biological threat capable of wiping out humanity, the two rivals are forced to form an unlikely alliance.\n\nAs they travel across the globe — from London to Samoa — Hobbs and Shaw must put aside their differences, work together, and rely on family to stop a global catastrophe.\n\nThe film delivers explosive action sequences, high-speed chases, intense combat scenes, and humor, expanding the Fast & Furious universe with bigger stunts and a more superhero-style villain.",
    "downloadUrl": "https://www.mediafire.com/file/caw3zrvx2j7vv0b/Hobbs_%2526_Shaw.mp4/file",
    "watchUrl": "https://masukestin.com/ethocs6a2ptz",
    "poster": "https://upload.wikimedia.org/wikipedia/en/0/00/Fast_%26_Furious_Presents_Hobbs_%26_Shaw_-_theatrical_poster.jpg",
    "duration": "2h 17m",
    "genres": [
      "Car Action",
      "Adventure",
      "Action"
    ],
    "id": 5,
    "badge": "top",
    "backdrop": "https://m.media-amazon.com/images/M/MV5BNzQxMzNlZjEtOTA2Ni00MTZmLThhZTAtMjI1YjhmYzdmYTE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "isNew": false,
    "year": 2019,
    "votes": 255000,
    "rating": 6.9
  },
  {
    "year": 2026,
    "votes": 82000,
    "rating": 7.9,
    "backdrop": "https://inreviewonline.com/wp-content/uploads/2026/02/the-bluff.png",
    "badge": "new",
    "genres": [
      "Drama",
      "Action"
    ],
    "id": 6,
    "isNew": true,
    "watchUrl": "https://vibuxer.com/pdxmbwjqoqv7",
    "downloadUrl": "https://www.mediafire.com/file/9t3b2rfospuk0fg/BLUFF_A+BY+ROCKY.mp4/file",
    "longDesc": "action-adventure film starring Priyanka Chopra Jonas as Ercell, a former female pirate in the 19th-century Caribbean whose quiet life is shattered when her past returns",
    "duration": "1h 43m",
    "poster": "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/The_Bluff_2026_poster.jpeg/250px-The_Bluff_2026_poster.jpeg",
    "cast": [
      "Priyanka Chopra Jonas",
      "Karl Urban",
      "Safia Oakley-Green",
      "Ismael Cruz Cordova",
      "Temuera Morrison"
    ],
    "tagline": "A Caribbean woman gets her secret past revealed when her island is invaded by vicious buccaneers.",
    "upcoming": false,
    "title": "The Bluff",
    "castImg": [],
    "studio": "Prime Video",
    "desc": "A Caribbean woman gets her secret past revealed when her island is invaded by vicious buccaneers.",
    "trailer": "soy2zOo69AE",
    "releaseDate": "2026-02-25",
    "director": "Frank E. Flowers",
    "featured": true
  },
  {
    "genres": [
      "Animation",
      "Comedy",
      "Family"
    ],
    "id": 7,
    "backdrop": "https://hansimcklaus.iwr.sh/post/the-sea-beast-breaking-it-down-for-children/img/TheSeaBeast.jpg",
    "badge": "",
    "isNew": false,
    "year": 2022,
    "votes": 6500,
    "rating": 6.1,
    "castImg": [],
    "studio": "Netflix",
    "cast": [
      "Karl Urban(Voice)",
      "Zaris-Angel Hator",
      "Jared Harris",
      "Marianne Jean-Baptiste",
      "Benjamin Plessala",
      "Somali Rose"
    ],
    "tagline": "When a young girl stows away on the ship of a legendary sea monster hunter, they launch an epic journey into uncharted waters - and make history to boot.",
    "upcoming": false,
    "title": "The Sea Beast",
    "featured": false,
    "director": " Chris Williams",
    "releaseDate": "2022-07-08",
    "trailer": "P-E-IGQCsPo",
    "desc": "When a young girl stows away on the ship of a legendary sea monster hunter, they launch an epic journey into uncharted waters - and make history to boot.",
    "longDesc": "a Netflix-animated, action-adventure film directed by Chris Williams, focusing on a legendary sea monster hunter, Jacob Holland, whose life changes when a young girl named Maisie Brumble stows away on his ship",
    "downloadUrl": "https://www.mediafire.com/file/b2pr76qmax1zc0u/The+Sea+Beast++Hd+Mp4.mp4/file",
    "watchUrl": "https://masukestin.com/tjml8rd5f33p",
    "poster": "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/The_Sea_Beast_film_poster.png/250px-The_Sea_Beast_film_poster.png",
    "duration": "1h 55m"
  },
  {
    "isNew": false,
    "backdrop": "https://static0.colliderimages.com/wordpress/wp-content/uploads/2025/12/the-odessey-matt-damon-1.jpg?w=1200&h=675&fit=crop",
    "badge": "soon",
    "genres": [
      "Adventure",
      "Action",
      "Epic"
    ],
    "id": 8,
    "rating": null,
    "year": 2026,
    "votes": 0,
    "desc": "After the Trojan War, Odysseus faces a dangerous voyage back to Ithaca, meeting creatures like the Cyclops Polyphemus, Sirens, and Circe along the way.",
    "trailer": "Mzw2ttJD2qQ",
    "releaseDate": "2026-07-17",
    "director": "Christopher Nolan",
    "featured": false,
    "title": "The Odyssey",
    "cast": [
      "Matt Damon",
      "Tom Holland",
      "Anne Hathaway"
    ],
    "tagline": "This movie adapts the famous Greek story Odyssey. It follows Odysseus on a long journey home after the Trojan War, facing monsters, gods, and dangerous adventures. It is one of the most anticipated movies of",
    "upcoming": true,
    "studio": "Universal Pictures",
    "castImg": [],
    "duration": "TBA",
    "poster": "https://m.media-amazon.com/images/M/MV5BN2MyYjk2MWMtODMyZS00MDUyLWE0OGQtOTQ3MGY0MDE0ZjVmXkEyXkFqcGc@._V1_.jpg",
    "watchUrl": "",
    "downloadUrl": "",
    "longDesc": "After the Trojan War, Odysseus faces a dangerous voyage back to Ithaca, meeting creatures like the Cyclops Polyphemus, Sirens, and Circe along the way."
  },
  {
    "watchUrl": "",
    "longDesc": "A young man on Earth discovers a fabulous secret legacy as the prince of an alien planet, and must recover a magic sword and return home to protect his kingdom.",
    "downloadUrl": "",
    "duration": "TBA",
    "poster": "https://m.media-amazon.com/images/M/MV5BN2MzMjMyNmQtYzkwMC00NTM2LThmN2ItMTczMGVmNGY5ODZlXkEyXkFqcGc@._V1_.jpg",
    "title": "Masters of the Universe",
    "cast": [
      "Morena Baccarin",
      "Idris Elba",
      "Alison Brie",
      "Nicholas Galitzine",
      "Kristen Wiig"
    ],
    "tagline": "Based on the famous He-Man franchise, this big-budget fantasy movie will show the battle between He-Man and the villain Skeletor.",
    "upcoming": true,
    "studio": "Amazon",
    "castImg": [],
    "releaseDate": "2026-06-05",
    "trailer": "ZmEx7wQI6RY",
    "desc": "A young man on Earth discovers a fabulous secret legacy as the prince of an alien planet, and must recover a magic sword and return home to protect his kingdom.",
    "director": "Travis Knight",
    "featured": false,
    "year": 2026,
    "votes": 0,
    "rating": null,
    "backdrop": "https://editorial.rottentomatoes.com/wp-content/uploads/2026/02/EWKA_Masters_of_the_Universe4.jpg?w=700",
    "badge": "soon",
    "id": 9,
    "genres": [
      "Sci-Fi",
      "Adventure"
    ],
    "isNew": false
  },
  {
    "year": 2026,
    "votes": 0,
    "rating": null,
    "genres": [
      "Sci-Fi",
      "Adventure",
      "Action"
    ],
    "id": 10,
    "backdrop": "https://images.thedirect.com/media/article_full/avengers-doomsday-deadpool.jpg",
    "badge": "soon",
    "isNew": false,
    "longDesc": "is an upcoming superhero movie from Marvel Studios and part of the Marvel Cinematic Universe.\n\nThe story is expected to bring together many powerful heroes from the Marvel universe to face a massive global threat. The main villain will likely be Doctor Doom, one of the most dangerous and intelligent enemies in Marvel history.\n\nIn the film, the Avengers must reunite when Doctor Doom begins a plan that could destroy worlds and reshape reality. Heroes from different teams and possibly different universes may join forces to stop the disaster before it is too late.\n\nThe movie is expected to feature large-scale battles, advanced technology, and multiverse elements, continuing the storyline that followed Avengers: Endgame.",
    "downloadUrl": "",
    "watchUrl": "",
    "poster": "https://upload.wikimedia.org/wikipedia/en/e/ee/Avengers_Doomsday_poster.jpg",
    "duration": "TBA",
    "studio": "Marvel Studios",
    "castImg": [],
    "upcoming": true,
    "tagline": "This movie will bring many Marvel heroes together to face a powerful villain called Doctor Doom.",
    "cast": [
      "Robert Downey Jr.",
      "Pedro Pascal",
      "Chris Hemsworth",
      "Vanessa Kirby",
      "Anthony Mackie"
    ],
    "title": "Avengers: Doomsday",
    "featured": false,
    "director": " Anthony Russo, Joe Russo",
    "desc": "This movie will bring many Marvel heroes together to face a powerful villain called Doctor Doom.",
    "trailer": "399Ez7WHK5s",
    "releaseDate": "2026-05-12"
  }
]
];

const GENRES = ["Action","Sci-Fi","Horror","Drama","Comedy","Thriller","Animation","Documentary","Adventure","Romance","History"];
