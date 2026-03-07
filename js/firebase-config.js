/* =====================================================
   MOVIENATION — FIREBASE CONFIG (auto-detect)
   Priority: 1) localStorage saved config
             2) hardcoded FB_CONFIG below
             3) no Firebase → localStorage fallback
   ===================================================== */

/* ── OPTION A: Hardcode your keys here ──────────────────
   OR use Option B (paste in Admin → Settings → Connect)
   ─────────────────────────────────────────────────────── */
const FB_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

/* ── DO NOT EDIT BELOW ── */
(function () {
  window.MN_FIRESTORE = null;

  // Check for config saved via Admin panel (Option B)
  let cfg = null;
  try {
    const saved = localStorage.getItem('mn_fb_config');
    if (saved) cfg = JSON.parse(saved);
  } catch(e) {}

  // Fall back to hardcoded
  if (!cfg) {
    const allOk = Object.values(FB_CONFIG).every(v => !String(v).startsWith('YOUR_'));
    if (allOk) cfg = FB_CONFIG;
  }

  if (!cfg) {
    console.info('[MN] No Firebase config — using localStorage mode.');
    return;
  }

  try {
    // Avoid double-init (if page hot-reloads)
    const app = firebase.apps.length
      ? firebase.apps[0]
      : firebase.initializeApp(cfg);
    window.MN_FIRESTORE = firebase.firestore(app);
    console.info('[MN] 🔥 Firebase Firestore connected!');
  } catch (e) {
    console.warn('[MN] Firebase init error — using localStorage:', e.message);
    window.MN_FIRESTORE = null;
  }
})();
