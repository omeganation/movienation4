/* =====================================================
   MOVIENATION — MOVIE DATABASE
   HOW TO ADD WATCH / DOWNLOAD LINKS:
   watchUrl:    put any external streaming URL here
   downloadUrl: put any external download URL here
   ===================================================== */

/* ── FIREBASE CONFIG (replace with yours) ──
   Get it from: console.firebase.google.com
   → Project Settings → Your apps → SDK setup */
const FB_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

/* ── MOVIES ── */
const MOVIES = [
  [
  {
    "id": 1,
    "title": "Oppenheimer",
    "year": 2023,
    "genres": [
      "Drama",
      "Thriller",
      "History"
    ],
    "duration": "3h 0m",
    "rating": 8.9,
    "votes": 524000,
    "director": "Christopher Nolan",
    "studio": "Universal Pictures",
    "cast": [
      "Cillian Murphy",
      "Emily Blunt",
      "Robert Downey Jr.",
      "Matt Damon",
      "Florence Pugh"
    ],
    "castImg": [
      "https://image.tmdb.org/t/p/w185/dm6V24NjjyvdqSP6jd9CgrqaHz9.jpg",
      "https://image.tmdb.org/t/p/w185/6QMVh4Kbs0lHOiGJOhCnHmIcLKk.jpg",
      "https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg",
      "https://image.tmdb.org/t/p/w185/aTOOmVwGxrNLkECKCVexDlN0tSW.jpg",
      "https://image.tmdb.org/t/p/w185/iFo6mEckFrv6xm8KcPqHxmS2H3O.jpg"
    ],
    "tagline": "The world forever changes",
    "desc": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    "longDesc": "Christopher Nolan's sweeping biographical epic explores the life of J. Robert Oppenheimer — his brilliance, his moral conflicts, and the unprecedented destructive power he helped unleash upon the world. Cillian Murphy delivers a career-best performance in this deeply human portrait of history's most consequential scientist.",
    "poster": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    "trailer": "uYPbbksJxIg",
    "watchUrl": "https://www.peacocktv.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "top",
    "featured": true,
    "isNew": false,
    "upcoming": false
  },
  {
    "id": 2,
    "title": "Dune: Part Two",
    "year": 2024,
    "genres": [
      "Sci-Fi",
      "Adventure",
      "Action"
    ],
    "duration": "2h 46m",
    "rating": 8.6,
    "votes": 312000,
    "director": "Denis Villeneuve",
    "studio": "Warner Bros.",
    "cast": [
      "Timothée Chalamet",
      "Zendaya",
      "Rebecca Ferguson",
      "Josh Brolin",
      "Austin Butler"
    ],
    "castImg": [
      "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
      "https://image.tmdb.org/t/p/w185/jGBrwCCzGNgLqKPCJsqjRhpPFTA.jpg",
      "https://image.tmdb.org/t/p/w185/lbnjnm9sBSHNnafVAFzNQE0H1iS.jpg",
      "https://image.tmdb.org/t/p/w185/dd9BvxuNqd5r7jbRZvPmOiMRdCg.jpg",
      "https://image.tmdb.org/t/p/w185/ySba4TLFCDyHUDMFb0DpnTa30YF.jpg"
    ],
    "tagline": "Long live the fighters",
    "desc": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    "longDesc": "Denis Villeneuve's masterful continuation follows Paul Atreides as he embraces his destiny among the Fremen of Arrakis. With breathtaking visuals and a deep philosophical core, Dune: Part Two is a rare big-screen spectacle that rewards patience — and delivers one of cinema's most spectacular conclusions.",
    "poster": "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    "trailer": "Way9Dexny3w",
    "watchUrl": "https://www.max.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "new",
    "featured": true,
    "isNew": true,
    "upcoming": false
  },
  {
    "id": 3,
    "title": "The Dark Knight",
    "year": 2008,
    "genres": [
      "Action",
      "Drama",
      "Thriller"
    ],
    "duration": "2h 32m",
    "rating": 9,
    "votes": 2800000,
    "director": "Christopher Nolan",
    "studio": "Warner Bros.",
    "cast": [
      "Christian Bale",
      "Heath Ledger",
      "Aaron Eckhart",
      "Gary Oldman",
      "Maggie Gyllenhaal"
    ],
    "castImg": [],
    "tagline": "Why so serious?",
    "desc": "Batman raises the stakes in his war on crime as the Joker wreaks chaos on the people of Gotham.",
    "longDesc": "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc on the people of Gotham. Heath Ledger's iconic, Oscar-winning performance as the Joker remains one of cinema's greatest achievements. The Dark Knight transcends the superhero genre to become a profound meditation on chaos, order, and the cost of heroism.",
    "poster": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    "backdrop": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTbpA9rjb5asTF-49u7Epi7Wf03qGvt0MTXA&s",
    "trailer": "kmJLuwP3Mbw",
    "watchUrl": "https://www.max.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "top",
    "featured": true,
    "isNew": false,
    "upcoming": false,
    "releaseDate": null
  },
  {
    "id": 4,
    "title": "Inception",
    "year": 2010,
    "genres": [
      "Sci-Fi",
      "Thriller",
      "Action"
    ],
    "duration": "2h 28m",
    "rating": 8.8,
    "votes": 2400000,
    "director": "Christopher Nolan",
    "studio": "Warner Bros.",
    "cast": [
      "Leonardo DiCaprio",
      "Joseph Gordon-Levitt",
      "Elliot Page",
      "Tom Hardy",
      "Ken Watanabe"
    ],
    "castImg": [],
    "tagline": "Your mind is the scene of the crime",
    "desc": "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.",
    "longDesc": "Dom Cobb is a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets. His rare ability has made him a coveted player in this treacherous new world of business espionage, but it has also made him an international fugitive. Inception is a visionary masterwork — dense, layered, and breathtakingly original.",
    "poster": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    "trailer": "YoHD9XEInc0",
    "watchUrl": "https://www.netflix.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "top",
    "featured": true,
    "isNew": false,
    "upcoming": false
  },
  {
    "id": 5,
    "title": "Deadpool & Wolverine",
    "year": 2024,
    "genres": [
      "Action",
      "Comedy",
      "Sci-Fi"
    ],
    "duration": "2h 8m",
    "rating": 8,
    "votes": 289,
    "director": "Shawn Levy",
    "studio": "Marvel Studios",
    "cast": [
      "Ryan Reynolds",
      "Hugh Jackman",
      "Emma Corrin",
      "Jennifer Garner"
    ],
    "castImg": [],
    "tagline": "Buckle up",
    "desc": "Deadpool is recruited by the Time Variance Authority and convinces Wolverine to save their universe from extinction.",
    "longDesc": "Marvel's most irreverent heroes finally team up in a multiverse-spanning adventure full of meta-humor, explosive action, and genuine heart. Ryan Reynolds and Hugh Jackman have electric chemistry, making this one of the most entertaining superhero films in years — and the most fun MCU outing in a long time.",
    "poster": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    "trailer": "73_1biulkYk",
    "watchUrl": "https://www.disneyplus.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "top",
    "featured": true,
    "isNew": false,
    "upcoming": false,
    "releaseDate": null
  },
  {
    "id": 6,
    "title": "Interstellar",
    "year": 2014,
    "genres": [
      "Sci-Fi",
      "Drama",
      "Adventure"
    ],
    "duration": "2h 49m",
    "rating": 8.7,
    "votes": 2100000,
    "director": "Christopher Nolan",
    "studio": "Paramount Pictures",
    "cast": [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Michael Caine"
    ],
    "castImg": [],
    "tagline": "Mankind was born on Earth. It was never meant to die here.",
    "desc": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    "longDesc": "Christopher Nolan's most ambitious film is a stunning blend of hard science fiction and deeply human emotion. Cooper's mission through a wormhole near Saturn leads to discoveries that challenge the nature of time, gravity, and love itself. Hans Zimmer's score is unforgettable. A modern classic.",
    "poster": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/xu9zaAevzQ5nnrsXN6JnDMMZEta.jpg",
    "trailer": "zSWdZVtXT7E",
    "watchUrl": "https://www.paramountplus.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "top",
    "featured": false,
    "isNew": false,
    "upcoming": false
  },
  {
    "id": 7,
    "title": "Poor Things",
    "year": 2023,
    "genres": [
      "Comedy",
      "Drama",
      "Romance"
    ],
    "duration": "2h 21m",
    "rating": 8.1,
    "votes": 198000,
    "director": "Yorgos Lanthimos",
    "studio": "Searchlight Pictures",
    "cast": [
      "Emma Stone",
      "Mark Ruffalo",
      "Willem Dafoe",
      "Ramy Youssef"
    ],
    "castImg": [],
    "tagline": "Unhinged. Unstoppable. Unbelievable.",
    "desc": "The incredible tale of Bella Baxter, a young woman brought back to life by the brilliant scientist Dr. Godwin Baxter.",
    "longDesc": "A gothic fantasy of female liberation, Poor Things follows Bella Baxter on a wild odyssey through Europe. Emma Stone delivers a fearless, Oscar-winning performance in this delightfully strange and visually inventive film from the director of The Favourite.",
    "poster": "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXSmauJNQaCFPpL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/urdpnRkHRLmWMWWFQPJQKDv7TS5.jpg",
    "trailer": "RlbR5N6veqw",
    "watchUrl": "https://www.disneyplus.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "new",
    "featured": false,
    "isNew": true,
    "upcoming": false
  },
  {
    "id": 8,
    "title": "Inside Out 2",
    "year": 2024,
    "genres": [
      "Animation",
      "Comedy",
      "Drama"
    ],
    "duration": "1h 40m",
    "rating": 7.9,
    "votes": 178000,
    "director": "Kelsey Mann",
    "studio": "Pixar",
    "cast": [
      "Amy Poehler",
      "Maya Hawke",
      "Kensington Tallman",
      "Liza Lapira"
    ],
    "castImg": [],
    "tagline": "You're not in Joy's hands anymore",
    "desc": "Teenager Riley's mind headquarters is thrown into turmoil when Anxiety shows up alongside new Emotions.",
    "longDesc": "Pixar returns to the mind of Riley, now a teenager navigating high school hockey tryouts and evolving friendships. The arrival of Anxiety and new emotions creates a rich emotional tapestry that speaks to anyone who has ever grown up — which is everyone. A worthy and moving sequel.",
    "poster": "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg",
    "trailer": "LEjhY15eCx0",
    "watchUrl": "https://www.disneyplus.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "new",
    "featured": false,
    "isNew": true,
    "upcoming": false
  },
  {
    "id": 9,
    "title": "Alien: Romulus",
    "year": 2024,
    "genres": [
      "Sci-Fi",
      "Horror",
      "Thriller"
    ],
    "duration": "1h 59m",
    "rating": 7.3,
    "votes": 134000,
    "director": "Fede Álvarez",
    "studio": "20th Century Studios",
    "cast": [
      "Cailee Spaeny",
      "David Jonsson",
      "Archie Renaux",
      "Isabela Merced"
    ],
    "castImg": [],
    "tagline": "It's been waiting",
    "desc": "Young space colonizers scavenging a derelict station come face to face with the universe's most terrifying life form.",
    "longDesc": "Set between the events of Alien and Aliens, this tension-filled entry revitalises the franchise with a focus on practical effects, genuine dread, and a gripping survival story. Fede Álvarez brings his mastery of horror to the Alien universe with spectacular — and terrifying — results.",
    "poster": "https://image.tmdb.org/t/p/w500/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/5Sol1Ksp7YOhRKLIVq7TKyH7aQ4.jpg",
    "trailer": "x5ceYjSTCDs",
    "watchUrl": "https://www.hulu.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "new",
    "featured": false,
    "isNew": true,
    "upcoming": false
  },
  {
    "id": 10,
    "title": "The Batman",
    "year": 2022,
    "genres": [
      "Action",
      "Drama",
      "Thriller"
    ],
    "duration": "2h 56m",
    "rating": 7.8,
    "votes": 512000,
    "director": "Matt Reeves",
    "studio": "Warner Bros.",
    "cast": [
      "Robert Pattinson",
      "Zoë Kravitz",
      "Paul Dano",
      "Colin Farrell"
    ],
    "castImg": [],
    "tagline": "Vengeance.",
    "desc": "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind cryptic clues.",
    "longDesc": "Matt Reeves reimagines Batman as a raw, noir detective story. Robert Pattinson's brooding Dark Knight hunts the Riddler through rain-soaked, corrupt Gotham. One of the most atmospheric and assured superhero films ever made — a slow-burn thriller with genuine weight.",
    "poster": "https://image.tmdb.org/t/p/w500/74xTpMXqxbSmMF2IjTgwQFVdg22.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    "trailer": "mqqft2x_Aa4",
    "watchUrl": "https://www.max.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "",
    "featured": false,
    "isNew": false,
    "upcoming": false
  },
  {
    "id": 11,
    "title": "Kingdom of the Planet of the Apes",
    "year": 2024,
    "genres": [
      "Sci-Fi",
      "Action",
      "Drama"
    ],
    "duration": "2h 25m",
    "rating": 7.1,
    "votes": 111000,
    "director": "Wes Ball",
    "studio": "20th Century Studios",
    "cast": [
      "Owen Teague",
      "Freya Allan",
      "Kevin Durand",
      "Peter Macon"
    ],
    "castImg": [],
    "tagline": "For apes, together strong",
    "desc": "Many years after Caesar's reign, a young ape goes on a journey that will lead him to question everything.",
    "longDesc": "Set thousands of years after Caesar's time, this bold new chapter introduces Noa, a young chimpanzee who embarks on a harrowing journey. A worthy continuation of an acclaimed franchise, with stunning visual effects and a story that stands on its own.",
    "poster": "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/fqv8v6AycXKsivp1T5yKtLbGXce.jpg",
    "trailer": "XVgIRPGKRVo",
    "watchUrl": "https://www.hulu.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "new",
    "featured": false,
    "isNew": true,
    "upcoming": false
  },
  {
    "id": 12,
    "title": "Avatar: The Way of Water",
    "year": 2022,
    "genres": [
      "Sci-Fi",
      "Adventure",
      "Action"
    ],
    "duration": "3h 12m",
    "rating": 7.6,
    "votes": 387000,
    "director": "James Cameron",
    "studio": "20th Century Studios",
    "cast": [
      "Sam Worthington",
      "Zoe Saldana",
      "Sigourney Weaver",
      "Kate Winslet"
    ],
    "castImg": [],
    "tagline": "Return to Pandora",
    "desc": "Jake Sully lives with his newfound family on Pandora. When a familiar threat returns, he must fight to protect all he loves.",
    "longDesc": "James Cameron's long-awaited sequel is a breathtaking technical achievement. The underwater sequences on Pandora push the boundaries of filmmaking technology, while the story deepens the Sully family dynamics with genuine emotional stakes. Visually, nothing else compares.",
    "poster": "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/s16H6tpK2utvwpapmrhpormd7XY.jpg",
    "trailer": "d9MyW72ELq0",
    "watchUrl": "https://www.disneyplus.com",
    "downloadUrl": "https://www.amazon.com/prime",
    "badge": "",
    "featured": false,
    "isNew": false,
    "upcoming": false
  },
  {
    "id": 13,
    "title": "Avatar 3",
    "year": 2025,
    "genres": [
      "Sci-Fi",
      "Adventure"
    ],
    "duration": "TBA",
    "rating": null,
    "votes": 0,
    "director": "James Cameron",
    "studio": "20th Century Studios",
    "cast": [
      "Sam Worthington",
      "Zoe Saldana",
      "Kate Winslet"
    ],
    "castImg": [],
    "tagline": "A new world awaits",
    "desc": "The third chapter in James Cameron's Avatar saga returns to Pandora with an entirely new world to explore.",
    "longDesc": "James Cameron's Avatar saga continues. The third chapter promises to explore yet another biome of Pandora, revealing cultures and creatures never before seen.",
    "poster": "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/s16H6tpK2utvwpapmrhpormd7XY.jpg",
    "trailer": "",
    "watchUrl": "",
    "downloadUrl": "",
    "releaseDate": "2025-12-19",
    "badge": "soon",
    "featured": false,
    "isNew": false,
    "upcoming": true
  },
  {
    "id": 14,
    "title": "Avengers: Doomsday",
    "year": 2026,
    "genres": [
      "Action",
      "Sci-Fi"
    ],
    "duration": "TBA",
    "rating": null,
    "votes": 0,
    "director": "Russo Brothers",
    "studio": "Marvel Studios",
    "cast": [
      "Robert Downey Jr.",
      "Chris Evans",
      "Scarlett Johansson",
      "Benedict Cumberbatch"
    ],
    "castImg": [],
    "tagline": "The multiverse must fall",
    "desc": "Earth's mightiest heroes unite to face the ultimate villain — Doctor Doom — in an unprecedented multiverse conflict.",
    "longDesc": "The Avengers reassemble in what promises to be the most epic Marvel event yet. With Doctor Doom controlling the multiverse and beloved heroes returning, this is the film the MCU has been building toward.",
    "poster": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CejMntil.jpg",
    "trailer": "",
    "watchUrl": "",
    "downloadUrl": "",
    "releaseDate": "2026-05-01",
    "badge": "soon",
    "featured": false,
    "isNew": false,
    "upcoming": true
  },
  {
    "id": 15,
    "title": "Mission: Impossible — The Final Reckoning",
    "year": 2025,
    "genres": [
      "Action",
      "Thriller"
    ],
    "duration": "TBA",
    "rating": null,
    "votes": 0,
    "director": "Christopher McQuarrie",
    "studio": "Paramount Pictures",
    "cast": [
      "Tom Cruise",
      "Rebecca Ferguson",
      "Simon Pegg",
      "Ving Rhames"
    ],
    "castImg": [],
    "tagline": "Every mission has a last",
    "desc": "Ethan Hunt faces his deadliest mission yet in the spectacular conclusion of the Mission: Impossible saga.",
    "longDesc": "Tom Cruise returns as Ethan Hunt for what promises to be the most spectacular action film ever made. The final chapter delivers globe-trotting espionage, record-breaking stunts, and emotional finality.",
    "poster": "https://image.tmdb.org/t/p/w500/74xTpMXqxbSmMF2IjTgwQFVdg22.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    "trailer": "",
    "watchUrl": "",
    "downloadUrl": "",
    "releaseDate": "2025-05-23",
    "badge": "soon",
    "featured": false,
    "isNew": false,
    "upcoming": true
  }
]
];

const GENRES = ["Action","Sci-Fi","Horror","Drama","Comedy","Thriller","Animation","Documentary","Adventure","Romance","History"];
