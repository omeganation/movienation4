/* =====================================================
   MOVIENATION — FIREBASE CONFIGURATION
   Paste your Firebase project keys below.
   ===================================================== */
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
(function(){
  const ok=Object.values(FB_CONFIG).every(v=>!String(v).startsWith('YOUR_'));
  if(ok){try{firebase.initializeApp(FB_CONFIG);window.MN_FIRESTORE=firebase.firestore();console.info('[MN] 🔥 Firestore connected')}catch(e){console.warn('[MN] Firebase error:',e.message);window.MN_FIRESTORE=null}}
  else{window.MN_FIRESTORE=null;console.info('[MN] localStorage mode — edit js/firebase-config.js to connect Firebase')}
})();
