# 🎬 MovieNation – How to Run & Deploy

---

## STEP 1 — Install Node.js (one time only)

1. Open your browser and go to: https://nodejs.org
2. Click the big green button that says "LTS" and download it
3. Install it like any normal program (just click Next → Next → Finish)
4. To confirm it worked, open your Terminal / Command Prompt and type:
   ```
   node -v
   ```
   You should see something like: v20.11.0

---

## STEP 2 — Open the Project Folder

1. Extract / unzip the "movienation" folder you downloaded
2. Open your Terminal / Command Prompt
3. Navigate into the folder:
   ```
   cd path/to/movienation
   ```
   Example on Windows:
   ```
   cd C:\Users\YourName\Downloads\movienation
   ```
   Example on Mac:
   ```
   cd ~/Downloads/movienation
   ```

---

## STEP 3 — Install Dependencies

Type this and press Enter:
```
npm install
```
Wait for it to finish (it downloads all required packages).

---

## STEP 4 — Start the Website Locally

```
npm run dev
```

Now open your browser and go to:
👉 http://localhost:5173

Your website is running! 🎉

---

## STEP 5 — Access the Admin Panel

While the site is running, go to:
👉 http://localhost:5173?admin

Default password: movienation

⚠️  CHANGE the password before going live!
Open the file: src/App.jsx
Find this line near the top:
   const ADMIN_PASS = "movienation";
Change "movienation" to your own secret password.

---

## STEP 6 — Deploy Live (Free with Netlify)

### Option A — Drag & Drop (Easiest, no Git needed)

1. Run this command to build the site:
   ```
   npm run build
   ```
2. A folder called "dist" will appear in your project
3. Go to: https://netlify.com and create a free account
4. After logging in, click "Add new site" → "Deploy manually"
5. Drag and drop the "dist" folder onto the page
6. Done! You get a live URL like: https://movienation-abc123.netlify.app

### Option B — GitHub + Netlify (Best for updates)

1. Create a free account on https://github.com
2. Install Git from https://git-scm.com
3. In your terminal inside the movienation folder:
   ```
   git init
   git add .
   git commit -m "MovieNation launch"
   ```
4. Create a new repository on GitHub (click the + button)
5. Copy the commands GitHub gives you to push your code
6. Go to Netlify → "Add new site" → "Import from Git" → Connect GitHub
7. Select your repository
8. Set:
   - Build command:   npm run build
   - Publish directory: dist
9. Click Deploy
10. Now every time you make changes and push to GitHub, Netlify auto-deploys!

---

## Quick Reference

| What                     | Command           |
|--------------------------|-------------------|
| Start local dev server   | npm run dev       |
| Build for production     | npm run build     |
| Preview production build | npm run preview   |

| Page                     | URL                        |
|--------------------------|----------------------------|
| Main site (local)        | http://localhost:5173      |
| Admin panel (local)      | http://localhost:5173?admin|
| Main site (live)         | https://your-netlify-url   |
| Admin panel (live)       | https://your-url?admin     |

---

## Adding Your Own Movies

1. Go to ?admin on your site
2. Login with your password
3. Click "Movies" tab → "Add Movie"
4. Fill in:
   - Title, Year, Genres
   - Description
   - Poster image URL (a direct link to an image)
   - Backdrop image URL (a wide banner image)
   - Watch URL (link to where users can stream)
   - Download URL (link to where users can download)
5. Check "Featured" if you want it to show in the hero carousel
6. Save!

---

That's it! 🚀
