# MovieNation — Complete Setup & Growth Guide

## Table of Contents
1. [Step 1 — Set Up Firebase (Go Live)](#firebase)
2. [Step 2 — Deploy Your Website](#deploy)
3. [How the Website Works](#how-it-works)
4. [Using the Admin Panel](#admin-panel)
5. [How to Make Money](#monetization)
6. [How to Grow & Trend](#growth)
7. [Frequently Asked Questions](#faq)

---

## 1. Set Up Firebase (Go Live) {#firebase}

Right now, movies you add in admin are saved in your own browser only.
To make movies appear on the real website for all visitors, you need Firebase (free).

### Step 1 — Create a Firebase account
1. Go to **https://console.firebase.google.com**
2. Sign in with your Google account (Gmail)
3. Click **"Add project"**
4. Give it a name, e.g. `movienation`
5. Disable Google Analytics (not needed), then click **Create project**

### Step 2 — Create a Firestore database
1. In your project, click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for now — you can secure it later)
4. Choose your closest region (e.g. `us-central1` or `europe-west1`)
5. Click **Done**

### Step 3 — Get your Firebase config keys
1. Click the ⚙️ gear icon → **Project settings**
2. Scroll down to **"Your apps"**
3. Click the `</>` (Web) button
4. Register the app with a nickname (e.g. `movienation-web`)
5. Copy the `firebaseConfig` object that appears

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "movienation-xxxxx.firebaseapp.com",
  projectId: "movienation-xxxxx",
  storageBucket: "movienation-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123...",
};
```

### Step 4 — Paste your keys into the code
Open `src/firebase.js` and replace the placeholder values:
```javascript
const firebaseConfig = {
  apiKey:            "PASTE_YOUR_KEY_HERE",
  authDomain:        "PASTE_YOUR_DOMAIN_HERE",
  ...
};
```

### Step 5 — Push your seed movies to Firebase
1. Run the site locally: `npm install && npm run dev`
2. Go to `http://localhost:5173/?admin`
3. Log in with password: `movienation` (change this!)
4. Go to **Movies** tab
5. Your 12 seed movies are already in localStorage — click any movie's Edit and save it once to push it to Firebase, or use Import to upload your movie list

**That's it. Once connected, every movie you add in Admin goes LIVE on the website instantly for all visitors.**

---

### Securing Firebase (Before Going Public)
By default Firestore is in "test mode" (anyone can read/write). To lock it down:

1. In Firebase Console → Firestore → **Rules** tab
2. Replace the rules with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can READ movies
    match /movies/{movieId} {
      allow read: if true;
      allow write: if false; // Only your app writes via Admin panel
    }
  }
}
```

This lets everyone see movies, but only your admin panel can add/edit/delete them.

---

## 2. Deploy Your Website {#deploy}

### Option A — Netlify (Recommended, Free)
1. Go to **https://netlify.com** and sign up free
2. Drag and drop your `dist/` folder onto Netlify
3. To build: run `npm run build` in your project folder
4. Your site is live at a URL like `https://movienation-abc123.netlify.app`
5. To get a custom domain (e.g. `movienation.rw`), add it in Netlify → Domain settings

### Option B — Vercel (Also Free)
1. Push your code to GitHub
2. Go to **https://vercel.com** and import the repo
3. Build command: `npm run build`, Output folder: `dist`
4. Click Deploy

### Option C — Firebase Hosting (Same account, Free)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public directory: dist
# Single page app: yes
npm run build
firebase deploy
```

### Changing the Admin Password
Open `src/App.jsx` and find line:
```javascript
const ADMIN_PASS = "movienation";
```
Change `"movienation"` to a strong password. Never share it.

---

## 3. How the Website Works {#how-it-works}

### What Users See
```
Home Page
├── Hero Carousel (your Featured movies, auto-slide)
├── Top 5 Trending (movies you manually marked as trending)
├── Latest Releases (newest movies by year)
└── Genre Sections (Action, Drama, Sci-Fi, etc.)

Movie Card → Click → Quick Info Modal
                     ├── Overview (description, cast, director)
                     ├── [Watch Now] → Goes to WATCH PAGE
                     └── [Download] → Opens your download link

Watch Page (full page)
├── Embedded YouTube trailer (or stream button)
├── Movie details (runtime, language, country, cast)
├── Share buttons (Facebook, Twitter, WhatsApp, Instagram)
├── Copy link
└── "You May Also Like" sidebar
```

### Navigation
- **Movies** — Home page with hero, trending, recent
- **Explorer** — Browse all movies by genre
- **Search** — Search by title, director, cast, year
- **Settings** — Dark/light mode toggle

### Admin Panel
- Access: `yoursite.com?admin`
- Password: whatever you set in ADMIN_PASS

---

## 4. Using the Admin Panel {#admin-panel}

### Dashboard
Shows real-time stats from Firebase:
- Total movies, total streams, downloads, published count
- Bar chart of most-streamed movies
- Full table ranked by streams

### Adding a Movie
1. Go to Admin → Movies tab
2. Click **Add Movie**
3. Fill in all fields:
   - **Title** — Movie name
   - **Slug** — Auto-generated URL (e.g. `dune-part-two`)
   - **Year** — Release year
   - **Genres** — Comma separated: `Action, Drama`
   - **Director** — Director's name
   - **Cast** — Comma separated: `Actor 1, Actor 2`
   - **Runtime** — Minutes (e.g. `148`)
   - **Language** — e.g. `English` or `French, English`
   - **Country** — e.g. `USA`
   - **Description** — 2-3 sentences
   - **Poster URL** — Direct image URL (JPG/PNG)
   - **Backdrop URL** — Wide image for the hero/background
   - **Watch URL** — Your streaming link
   - **Download URL** — Your download link
   - **Trailer URL** — YouTube link (embeds on Watch page)
   - **Featured** — Toggle ON to show in the hero carousel
   - **Trending** — Toggle ON to appear in Top 5 trending
   - **SEO fields** — Title, description, keywords for Google
4. Click **Publish Now** → Movie appears live for everyone

### Editing a Movie
Admin → Movies → click the edit ✏ icon on any row

### Setting Trending
Admin → Trending tab → Toggle any movie ON/OFF → Set rank number (1-5)

### Importing Many Movies at Once
Admin → Import → Click "Import JSON" → Upload a JSON file with movie data
This is perfect when you have 50+ movies to add at once.

---

## 5. How to Make Money {#monetization}

### Method 1 — Google AdSense (Easiest — Passive Income)
Place ads between movie sections. Once approved by Google AdSense, you earn money every time visitors see or click ads.

**Setup:**
1. Apply at **https://adsense.google.com**
2. Paste your AdSense code into `index.html`
3. Typical earnings: $1–$10 per 1,000 page views (depends on country/niche)
4. **Estimate:** 10,000 monthly visitors × $3 RPM = ~$30/month starting

### Method 2 — Affiliate Links for Streaming Services
Partner with streaming platforms and earn commission when users sign up.

- **Amazon Prime Video** — Join Amazon Associates, link your Watch URLs to Prime
- **Hotstar / Netflix / Showmax** — Check if they have affiliate programs in your region
- **Impact.com / ShareASale** — Aggregators with many streaming affiliate programs

**How:** When a user clicks "Watch Now", redirect them through your affiliate link. You earn commission per signup.

### Method 3 — VPN Affiliate Links
Many movie sites earn from VPN recommendations. Users often need VPNs to access streaming content.

- **NordVPN** — Up to $100/sale commission
- **ExpressVPN** — $13–$36/sale
- **Surfshark** — Competitive rates

Add a banner like: "Stream from anywhere — Get NordVPN" with your affiliate link.

### Method 4 — Sell Premium Access
Create a "Premium" tier:
- Free: Browse movies, watch trailers
- Premium ($3–$10/month): Access to download links, HD quality

Integrate with **Paystack** (Rwanda/Africa-friendly), **Stripe**, or **Flutterwave**.

### Method 5 — Sponsored Content
Once you have traffic, charge movie distributors or streaming services to feature their movies in your hero banner or trending section. A featured spot on a site with 50K visitors = $100–$500/placement.

### Method 6 — YouTube Channel
Create a channel reviewing movies you feature on your site. Each video drives traffic back to your site. Monetize with YouTube ads, links in description.

### Realistic Income Timeline
| Months | Visitors | Monthly Revenue |
|--------|----------|----------------|
| 1–3    | 500–2K   | $0–$10 (building) |
| 4–6    | 5K–15K   | $20–$80 |
| 7–12   | 20K–50K  | $100–$500 |
| Year 2 | 100K+    | $500–$2,000+ |

---

## 6. How to Grow & Trend {#growth}

### SEO (Google Search — Free Long-term Traffic)
Your site already has SEO fields in the movie form. Use them well:
- **SEO Title:** "Watch Dune Part Two (2024) Free Online | MovieNation"
- **SEO Description:** "Stream or download Dune Part Two online. Epic sci-fi starring Timothée Chalamet. Watch now on MovieNation."
- **Keywords:** "dune part two, watch dune free, timothee chalamet movie"

**Extra tips:**
- Add every new popular movie within 24 hours of release
- Use the movie's real name as the slug (auto-generated already)
- Write real descriptions — Google penalizes copy-paste

### Social Media Growth

**Instagram (@movienation_rw or similar)**
- Post movie posters daily with captions like "Watch [Movie] free on our site — link in bio"
- Stories with polls: "Have you watched [Movie]? Yes/No"
- Reels with movie trailer clips (short, 15-30 seconds)
- Use hashtags: #newmovie #watchfree #movie2024 #Rwanda #Africa

**TikTok**
- Most powerful for rapid growth
- Post "Top 10 movies you must watch" videos
- Quick 30-second clips of trailers with your URL overlaid
- One viral TikTok can bring 50,000+ visitors in a day

**Facebook**
- Create a page and a Facebook Group like "MovieNation — Free Movies"
- Invite friends, they invite friends
- Post "New movie added!" every time you publish one
- Pin your website link to the top of the group

**WhatsApp**
- Create a WhatsApp Channel or broadcast list
- Send "New movie added:" messages with direct watch links
- Very effective in Rwanda and East Africa

**X / Twitter**
- Post whenever you add a popular movie
- Use trending movie hashtags

### Content Strategy
Post at least **5 new movies per week**, focusing on:
1. **Trending movies** (what's popular on Netflix, in cinemas right now)
2. **Classic movies** (timeless films people always search for)
3. **Local content** (Rwandan, African films — less competition, loyal audience)
4. **Bollywood & Nollywood** (huge demand in Africa)

### Email/WhatsApp Newsletter
Collect visitor contacts (add a "Get notified" button to the site later) and message them every time you add new movies. Loyal returning visitors are more valuable than one-time traffic.

### Trending Movies Strategy
When a movie trends on social media (new release, Oscar wins, viral moment), add it to your site **immediately** and mark it trending. People are already searching — you capture that traffic.

Use **Google Trends** (trends.google.com) and **Twitter Trending** to know what to add next.

---

## 7. Frequently Asked Questions {#faq}

**Q: Why do I see example.com in Watch/Download URLs?**
A: Those are placeholders. In Admin → Movies, edit each movie and replace the watchUrl and downloadUrl with your real streaming/download links.

**Q: Where do I get the actual movie files/streams?**
A: MovieNation is a directory platform — you link to existing sources. Options:
- Your own file hosting (Google Drive, Mega, Mediafire)
- Licensed streaming platforms you partner with
- Legal free sources (YouTube, Tubi, Pluto TV)

**Q: How do I get movie poster images?**
A: Use TMDB (The Movie Database — themoviedb.org). Search any movie, right-click the poster, copy image address. Or use a CDN service like Cloudinary to host your own.

**Q: Firebase free plan — how much can I store?**
A: Firebase Spark (free) includes:
- 1 GB Firestore storage
- 50,000 reads per day
- 20,000 writes per day
This supports thousands of movies and millions of page views per month. You'll only need to upgrade when you're making real revenue.

**Q: Can I change the site name/branding?**
A: Yes. Search for "MovieNation" in App.jsx and replace with your brand name. Update the logo image in `/public/favicon.png`.

**Q: How do I change the admin password?**
A: In `src/App.jsx`, find `const ADMIN_PASS = "movienation"` and change the password.

**Q: The site works but is slow — how do I make it faster?**
A: After running `npm run build`, the site is already optimized. For extra speed: use Cloudflare CDN (free), compress your movie poster images, and enable Firestore offline caching.

---

*MovieNation v5.0 — Built with React + Vite + Firebase*
