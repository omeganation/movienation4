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
    "poster": "https://m.media-amazon.com/images/M/MV5BMzI2ODY3MzQtYzllNy00YWM1LWExZTgtOGIwNjk2MmE2MmY2XkEyXkFqcGc@._V1_.jpg",
    "tagline": "Michael Mason is a recluse on a remote Scottish island who rescues a girl from the sea, unleashing a perilous sequence of events that culminate in an attack on his home, compelling him to face his turbulent history.",
    "title": "Shelter",
    "trailer": "PPMawzJxKF4",
    "downloadUrl": "https://www.mediafire.com/file/mhh7ex8q8p1paga/SHELTER.mp4/file",
    "releaseDate": "2026-03-01",
    "isNew": true,
    "upcoming": false,
    "genres": [
      "Action",
      "Thriller",
      "Spy"
    ],
    "featured": false,
    "cast": [
      "Jason Statham",
      "Bodhi Rae Breathnach",
      "Michael Shaeffer"
    ],
    "votes": 0,
    "duration": "1h 47m",
    "desc": "Michael Mason is a recluse on a remote Scottish island who rescues a girl from the sea, unleashing a perilous sequence of events that culminate in an attack on his home, compelling him to face his turbulent history.",
    "castImg": [],
    "id": 1,
    "badge": "new",
    "studio": "Prime Video",
    "backdrop": "https://m.media-amazon.com/images/M/MV5BMzI2ODY3MzQtYzllNy00YWM1LWExZTgtOGIwNjk2MmE2MmY2XkEyXkFqcGc@._V1_.jpg",
    "director": "Ric Roman Waugh",
    "longDesc": "",
    "rating": 6.7,
    "year": 2026,
    "watchUrl": "https://masukestin.com/5wywfeluuj3j"
  },
  {
    "director": "Jeff Zimbalist",
    "backdrop": "https://img4.hulu.com/user/v3/artwork/7831c71a-e354-48a3-b7fa-f3d7530231b0?base_image_bucket_name=image_manager&base_image=77b09654-572e-4fd9-ad92-f73f2d5ca0a7&size=1200x630&format=webp&operations=%5B%7B%22gradient_vector%22%3A%22(0%2C0%2C0%2C0.5)%7C(0%2C0%2C0%2C0)%7C(0%2C600)%7C(0%2C240)%22%7D%2C%7B%22overlay%22%3A%7B%22position%22%3A%22SouthEast%7C(30%2C30)%22%2C%22operations%22%3A%5B%7B%22image%22%3A%22image_manager%7C2f8cf3ba-48c3-4c83-9f83-2fe421f8d71e%22%7D%2C%7B%22resize%22%3A%22204x204%7Cmax%22%7D%2C%7B%22extent%22%3A%22204x204%22%7D%5D%7D%7D%2C%5D",
    "castImg": [],
    "desc": "a biographical drama chronicling the meteoric rise of Edson Arantes do Nascimento from a poverty-stricken childhood in Brazil to becoming a 17-year-old soccer sensation",
    "studio": "Imagine Entertainment",
    "id": 2,
    "badge": "top",
    "year": 2016,
    "watchUrl": "https://www.rebamovie.com/cinema?vd=228cedaa-1878-492a-9877-175bc289ab32",
    "rating": 8.1,
    "longDesc": "a 2016 biographical drama film that chronicles the early life and meteoric rise of the legendary Brazilian footballer, Edson Arantes do Nascimento, known as Pelé",
    "trailer": "XBrfxHOXsDE",
    "title": "Pele: Birth of a Legend",
    "tagline": "A boy with nothing changed everything",
    "poster": "https://upload.wikimedia.org/wikipedia/en/d/df/Pel%C3%A9_%28film_poster%29.jpg",
    "duration": "01:58:20",
    "votes": 23000,
    "upcoming": false,
    "downloadUrl": "",
    "releaseDate": "2016-05-06",
    "isNew": false,
    "cast": [
      "Kevin de Paula",
      "Seu Jorge",
      "Leonardo Lima Carvalho",
      "Mariana Nunes",
      "Milton Gonçalves"
    ],
    "genres": [
      "Soccer",
      "Documentary",
      "Biography"
    ],
    "featured": true
  },
  {
    "votes": 66000,
    "duration": "01:49:13",
    "downloadUrl": "",
    "releaseDate": "2025-07-02",
    "isNew": false,
    "upcoming": false,
    "genres": [
      "Action",
      "Comedy"
    ],
    "featured": false,
    "cast": [
      "Idris Elba",
      "John Cena",
      "Priyanka Chopra Jonas",
      "Paddy Considine",
      "Carla Gugino"
    ],
    "title": "Heads of State",
    "trailer": "8J646zM7UM8",
    "poster": "https://upload.wikimedia.org/wikipedia/en/6/6b/Heads_of_State_poster.jpg",
    "tagline": "The only thing white is the house",
    "watchUrl": "https://www.rebamovie.com/cinema?vd=d2ec9f78-f6f5-4c44-ade1-6ded6516a25d",
    "year": 2025,
    "longDesc": "the highest-ranking, often ceremonial representative of a sovereign state, embodying its unity, legitimacy, and continuity at home and abroad",
    "rating": 6.8,
    "backdrop": "https://www.framerated.co.uk/wp-content/uploads/2025/07/headsstate01.jpg",
    "director": " Ilya Naishuller",
    "castImg": [],
    "desc": "the highest-ranking, often ceremonial, public representative of a sovereign state",
    "id": 3,
    "badge": "",
    "studio": "Prime Video"
  },
  {
    "year": 2024,
    "watchUrl": "https://www.rebamovie.com/cinema?vd=9496c244-3674-44d7-a0a2-ff30926cf7f5",
    "rating": 5.6,
    "longDesc": "We Bury the Dead (2024/2026) is a sci-fi thriller following Ava (Daisy Ridley), a woman searching for her husband in Tasmania after a catastrophic military, YouTube video experimental weapon disaster. ",
    "director": "Zak Hilditch",
    "backdrop": "https://static.wixstatic.com/media/25ad9d_aa0b02a1a7014efbac587ccd418b4350~mv2.jpg/v1/fill/w_568,h_284,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/25ad9d_aa0b02a1a7014efbac587ccd418b4350~mv2.jpg",
    "studio": "XYZ Films",
    "badge": "",
    "id": 4,
    "castImg": [],
    "desc": "We Bury the Dead (2024/2026) is a sci-fi thriller following Ava (Daisy Ridley), a woman searching for her husband in Tasmania after a catastrophic military, YouTube video experimental weapon disaster.",
    "duration": "1h 34m",
    "votes": 8600,
    "cast": [
      "Daisy Ridley",
      "Brenton Thwaites",
      "Mark Coles Smith",
      "Matt Whelan",
      "Chloe Hurst"
    ],
    "featured": false,
    "genres": [
      "Horror",
      "Thriller"
    ],
    "upcoming": false,
    "downloadUrl": "",
    "releaseDate": "2026-01-02",
    "isNew": false,
    "trailer": "iE-W-wEJJqw",
    "title": "We Bury the Dead",
    "tagline": "After a catastrophic military disaster, the dead don't just rise — they hunt",
    "poster": "https://m.media-amazon.com/images/M/MV5BNzQwZDIzMWEtZDNkOS00ODI5LWI1YmYtNDU3MTM0NWQ0MDVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  },
  {
    "poster": "https://upload.wikimedia.org/wikipedia/en/0/00/Fast_%26_Furious_Presents_Hobbs_%26_Shaw_-_theatrical_poster.jpg",
    "tagline": "Fast. Furious. And out of control.",
    "title": "Hobbs & Shaw",
    "trailer": "HZ7PAyCDwEg",
    "featured": true,
    "genres": [
      "Car Action",
      "Adventure",
      "Action"
    ],
    "cast": [
      "Dwayne Johnson",
      "Jason Statham",
      "Idris Elba",
      "Vanessa Kirby",
      "Helen Mirren"
    ],
    "downloadUrl": "https://www.mediafire.com/file/caw3zrvx2j7vv0b/Hobbs_%2526_Shaw.mp4/file",
    "releaseDate": "2019-08-02",
    "isNew": false,
    "upcoming": false,
    "votes": 255000,
    "duration": "2h 17m",
    "badge": "top",
    "id": 5,
    "studio": "Universal Pictures",
    "castImg": [],
    "desc": "Lawman Luke Hobbs and former outlaw Deckard Shaw must team up to stop a genetically enhanced terrorist threatening the world with a deadly virus.",
    "backdrop": "https://m.media-amazon.com/images/M/MV5BNzQxMzNlZjEtOTA2Ni00MTZmLThhZTAtMjI1YjhmYzdmYTE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "director": "David Leitch",
    "longDesc": "Ever since lawman Luke Hobbs and skilled outlaw Deckard Shaw first faced off, they have constantly clashed. But when cyber-genetically enhanced anarchist Brixton gains control of a deadly biological threat capable of wiping out humanity, the two rivals are forced to form an unlikely alliance.\n\nAs they travel across the globe — from London to Samoa — Hobbs and Shaw must put aside their differences, work together, and rely on family to stop a global catastrophe.\n\nThe film delivers explosive action sequences, high-speed chases, intense combat scenes, and humor, expanding the Fast & Furious universe with bigger stunts and a more superhero-style villain.",
    "rating": 6.9,
    "year": 2019,
    "watchUrl": "https://masukestin.com/ethocs6a2ptz"
  },
  {
    "director": "Frank E. Flowers",
    "backdrop": "https://inreviewonline.com/wp-content/uploads/2026/02/the-bluff.png",
    "studio": "Prime Video",
    "id": 6,
    "badge": "new",
    "castImg": [],
    "desc": "A Caribbean woman gets her secret past revealed when her island is invaded by vicious buccaneers.",
    "year": 2026,
    "watchUrl": "https://vibuxer.com/pdxmbwjqoqv7",
    "rating": 7.9,
    "longDesc": "action-adventure film starring Priyanka Chopra Jonas as Ercell, a former female pirate in the 19th-century Caribbean whose quiet life is shattered when her past returns",
    "trailer": "soy2zOo69AE",
    "title": "The Bluff",
    "tagline": "A Caribbean woman gets her secret past revealed when her island is invaded by vicious buccaneers.",
    "poster": "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/The_Bluff_2026_poster.jpeg/250px-The_Bluff_2026_poster.jpeg",
    "duration": "1h 43m",
    "votes": 82000,
    "cast": [
      "Priyanka Chopra Jonas",
      "Karl Urban",
      "Safia Oakley-Green",
      "Ismael Cruz Cordova",
      "Temuera Morrison"
    ],
    "genres": [
      "Drama",
      "Action"
    ],
    "featured": true,
    "upcoming": false,
    "downloadUrl": "https://www.mediafire.com/file/9t3b2rfospuk0fg/BLUFF_A+BY+ROCKY.mp4/file",
    "releaseDate": "2026-02-25",
    "isNew": true
  },
  {
    "director": " Chris Williams",
    "backdrop": "https://hansimcklaus.iwr.sh/post/the-sea-beast-breaking-it-down-for-children/img/TheSeaBeast.jpg",
    "studio": "Netflix",
    "badge": "",
    "id": 7,
    "castImg": [],
    "desc": "When a young girl stows away on the ship of a legendary sea monster hunter, they launch an epic journey into uncharted waters - and make history to boot.",
    "year": 2022,
    "watchUrl": "https://masukestin.com/tjml8rd5f33p",
    "rating": 6.1,
    "longDesc": "a Netflix-animated, action-adventure film directed by Chris Williams, focusing on a legendary sea monster hunter, Jacob Holland, whose life changes when a young girl named Maisie Brumble stows away on his ship",
    "trailer": "P-E-IGQCsPo",
    "title": "The Sea Beast",
    "tagline": "When a young girl stows away on the ship of a legendary sea monster hunter, they launch an epic journey into uncharted waters - and make history to boot.",
    "poster": "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/The_Sea_Beast_film_poster.png/250px-The_Sea_Beast_film_poster.png",
    "duration": "1h 55m",
    "votes": 6500,
    "cast": [
      "Karl Urban(Voice)",
      "Zaris-Angel Hator",
      "Jared Harris",
      "Marianne Jean-Baptiste",
      "Benjamin Plessala",
      "Somali Rose"
    ],
    "genres": [
      "Animation",
      "Comedy",
      "Family"
    ],
    "featured": false,
    "upcoming": false,
    "releaseDate": "2022-07-08",
    "isNew": false,
    "downloadUrl": "https://www.mediafire.com/file/b2pr76qmax1zc0u/The+Sea+Beast++Hd+Mp4.mp4/file"
  },
  {
    "trailer": "Mzw2ttJD2qQ",
    "title": "The Odyssey",
    "tagline": "This movie adapts the famous Greek story Odyssey. It follows Odysseus on a long journey home after the Trojan War, facing monsters, gods, and dangerous adventures. It is one of the most anticipated movies of",
    "poster": "https://m.media-amazon.com/images/M/MV5BN2MyYjk2MWMtODMyZS00MDUyLWE0OGQtOTQ3MGY0MDE0ZjVmXkEyXkFqcGc@._V1_.jpg",
    "duration": "TBA",
    "votes": 0,
    "upcoming": true,
    "downloadUrl": "",
    "releaseDate": "2026-07-17",
    "isNew": false,
    "cast": [
      "Matt Damon",
      "Tom Holland",
      "Anne Hathaway"
    ],
    "featured": false,
    "genres": [
      "Adventure",
      "Action",
      "Epic"
    ],
    "director": "Christopher Nolan",
    "backdrop": "https://static0.colliderimages.com/wordpress/wp-content/uploads/2025/12/the-odessey-matt-damon-1.jpg?w=1200&h=675&fit=crop",
    "castImg": [],
    "desc": "After the Trojan War, Odysseus faces a dangerous voyage back to Ithaca, meeting creatures like the Cyclops Polyphemus, Sirens, and Circe along the way.",
    "studio": "Universal Pictures",
    "badge": "soon",
    "id": 8,
    "year": 2026,
    "watchUrl": "",
    "rating": null,
    "longDesc": "After the Trojan War, Odysseus faces a dangerous voyage back to Ithaca, meeting creatures like the Cyclops Polyphemus, Sirens, and Circe along the way."
  },
  {
    "duration": "TBA",
    "votes": 0,
    "cast": [
      "Morena Baccarin",
      "Idris Elba",
      "Alison Brie",
      "Nicholas Galitzine",
      "Kristen Wiig"
    ],
    "featured": false,
    "genres": [
      "Sci-Fi",
      "Adventure"
    ],
    "upcoming": true,
    "downloadUrl": "",
    "releaseDate": "2026-06-05",
    "isNew": false,
    "trailer": "ZmEx7wQI6RY",
    "title": "Masters of the Universe",
    "tagline": "Based on the famous He-Man franchise, this big-budget fantasy movie will show the battle between He-Man and the villain Skeletor.",
    "poster": "https://m.media-amazon.com/images/M/MV5BN2MzMjMyNmQtYzkwMC00NTM2LThmN2ItMTczMGVmNGY5ODZlXkEyXkFqcGc@._V1_.jpg",
    "year": 2026,
    "watchUrl": "",
    "rating": null,
    "longDesc": "A young man on Earth discovers a fabulous secret legacy as the prince of an alien planet, and must recover a magic sword and return home to protect his kingdom.",
    "director": "Travis Knight",
    "backdrop": "https://editorial.rottentomatoes.com/wp-content/uploads/2026/02/EWKA_Masters_of_the_Universe4.jpg?w=700",
    "studio": "Amazon",
    "badge": "soon",
    "id": 9,
    "castImg": [],
    "desc": "A young man on Earth discovers a fabulous secret legacy as the prince of an alien planet, and must recover a magic sword and return home to protect his kingdom."
  },
  {
    "year": 2026,
    "watchUrl": "",
    "longDesc": "is an upcoming superhero movie from Marvel Studios and part of the Marvel Cinematic Universe.\n\nThe story is expected to bring together many powerful heroes from the Marvel universe to face a massive global threat. The main villain will likely be Doctor Doom, one of the most dangerous and intelligent enemies in Marvel history.\n\nIn the film, the Avengers must reunite when Doctor Doom begins a plan that could destroy worlds and reshape reality. Heroes from different teams and possibly different universes may join forces to stop the disaster before it is too late.\n\nThe movie is expected to feature large-scale battles, advanced technology, and multiverse elements, continuing the storyline that followed Avengers: Endgame.",
    "rating": null,
    "backdrop": "https://images.thedirect.com/media/article_full/avengers-doomsday-deadpool.jpg",
    "director": " Anthony Russo, Joe Russo",
    "castImg": [],
    "desc": "This movie will bring many Marvel heroes together to face a powerful villain called Doctor Doom.",
    "badge": "soon",
    "id": 10,
    "studio": "Marvel Studios",
    "votes": 0,
    "duration": "TBA",
    "downloadUrl": "",
    "releaseDate": "2026-05-12",
    "isNew": false,
    "upcoming": true,
    "genres": [
      "Sci-Fi",
      "Adventure",
      "Action"
    ],
    "featured": false,
    "cast": [
      "Robert Downey Jr.",
      "Pedro Pascal",
      "Chris Hemsworth",
      "Vanessa Kirby",
      "Anthony Mackie"
    ],
    "title": "Avengers: Doomsday",
    "trailer": "399Ez7WHK5s",
    "poster": "https://upload.wikimedia.org/wikipedia/en/e/ee/Avengers_Doomsday_poster.jpg",
    "tagline": "This movie will bring many Marvel heroes together to face a powerful villain called Doctor Doom."
  }
]
];

const GENRES = ["Action","Sci-Fi","Horror","Drama","Comedy","Thriller","Animation","Documentary","Adventure","Romance","History"];
