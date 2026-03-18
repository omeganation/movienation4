// ═══════════════════════════════════════════════════════════
//  MOVIENATION — FIREBASE CONFIG
//  1. Go to https://console.firebase.google.com
//  2. Create a project → Add a Web app
//  3. Copy your firebaseConfig and paste it below
//  4. In Firebase Console → Firestore → Rules → paste the rules below
// ═══════════════════════════════════════════════════════════

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  enableIndexedDbPersistence,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDIUFY0gP8r6kME178-cAW_afQSerrkSA",
  authDomain: "movienation01.firebaseapp.com",
  projectId: "movienation01",
  storageBucket: "movienation01.firebasestorage.app",
  messagingSenderId: "800722031223",
  appId: "1:800722031223:web:4d0338cb405bb7f1c26c72",
  measurementId: "G-NNZGJRZWD9"
};
// ───────────────────────────────────────────────────────────

// ─── STEP 2: Firestore Security Rules ──────────────────────
// In Firebase Console → Firestore Database → Rules tab,
// replace the default rules with these:
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /movies/{id} {
//       allow read: if true;
//       allow write: if true;
//     }
//   }
// }
//
// (You can tighten security later once everything works)
// ───────────────────────────────────────────────────────────

// ─── Internal: check if config has been filled in ──────────
export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "YOUR_PROJECT"
  );
}

// ─── Initialize Firebase (only if configured) ──────────────
let db = null;

if (isFirebaseConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Enable offline persistence so the site works even if internet drops briefly
    enableIndexedDbPersistence(db).catch(() => {
      // Fails silently in some environments — not critical
    });
  } catch (e) {
    console.error("Firebase init error:", e);
    db = null;
  }
}

// ─── Save a single movie ────────────────────────────────────
export async function saveMovieToFirebase(movie) {
  if (!db) return { ok: false, error: "Firebase not initialized" };
  try {
    await setDoc(doc(db, "movies", String(movie.id)), {
      ...movie,
      _updatedAt: Date.now(),
    });
    return { ok: true };
  } catch (e) {
    console.error("Firebase save error:", e.code, e.message);
    return { ok: false, error: e.message };
  }
}

// ─── Delete a movie ─────────────────────────────────────────
export async function deleteMovieFromFirebase(id) {
  if (!db) return { ok: false, error: "Firebase not initialized" };
  try {
    await deleteDoc(doc(db, "movies", String(id)));
    return { ok: true };
  } catch (e) {
    console.error("Firebase delete error:", e.code, e.message);
    return { ok: false, error: e.message };
  }
}

// ─── Bulk save (used for initial push of all seed movies) ───
export async function bulkSaveToFirebase(movies) {
  if (!db) return { ok: false, error: "Firebase not initialized" };
  try {
    // Firestore batch limit is 500 — split into chunks
    const CHUNK = 499;
    for (let i = 0; i < movies.length; i += CHUNK) {
      const batch = writeBatch(db);
      movies.slice(i, i + CHUNK).forEach(m => {
        batch.set(doc(db, "movies", String(m.id)), {
          ...m,
          _updatedAt: Date.now(),
        });
      });
      await batch.commit();
    }
    return { ok: true };
  } catch (e) {
    console.error("Firebase bulk save error:", e.code, e.message);
    return { ok: false, error: e.message };
  }
}

// ─── Real-time listener ──────────────────────────────────────
// Returns unsubscribe function.
// onData(movies[]) is called every time Firestore changes.
// onStatus("connecting"|"connected"|"error", message?) is called on state changes.
export function subscribeToMovies(onData, onStatus) {
  if (!db) {
    if (onStatus) onStatus("not-configured");
    return () => {};
  }

  if (onStatus) onStatus("connecting");

  const unsub = onSnapshot(
    collection(db, "movies"),
    { includeMetadataChanges: false },
    (snapshot) => {
      const movies = snapshot.docs
        .map(d => d.data())
        .filter(m => m && m.id && m.title); // filter out corrupt docs
      onData(movies);
      if (onStatus) onStatus("connected");
    },
    (error) => {
      console.error("Firestore listener error:", error.code, error.message);
      if (onStatus) onStatus("error", error.message);
    }
  );

  return unsub;
}
