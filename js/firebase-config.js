/* =====================================================
   MOVIENATION — FIREBASE CONFIG (auto-detect)
   Priority: 1) localStorage saved config
             2) hardcoded FB_CONFIG below
             3) no Firebase → localStorage fallback
   ===================================================== */

/* ── OPTION A: Hardcode your keys here ──────────────────
   OR use Option B (paste in Admin → Settings → Connect)
   ─────────────────────────────────────────────────────── */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkly_76tjXhBFhnTJ9cOtORoSOq1YGHP8",
  authDomain: "movienation-1.firebaseapp.com",
  projectId: "movienation-1",
  storageBucket: "movienation-1.firebasestorage.app",
  messagingSenderId: "236535077737",
  appId: "1:236535077737:web:9cab53046c037127e9fbf8",
  measurementId: "G-BCT6G788XD"
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
    const allOk = Object.valuesObject.values(firebaseConfig).every(v => !String(v).startsWith('YOUR_'));
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
