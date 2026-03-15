// ═══════════════════════════════════════════════════════════
//  MOVIENATION — FIREBASE CONFIG
//  Replace these values with YOUR Firebase project credentials.
//  Get them from: https://console.firebase.google.com
//  Project Settings → Your apps → Web app → firebaseConfig
// ═══════════════════════════════════════════════════════════

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

// ▼▼▼ FIREBASE CONFIG HERE ▼▼▼
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
// ▲▲▲ END OF YOUR CONFIG ▲▲▲

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ── Collection reference ──
export const moviesRef = () => collection(db, "movies");

// ── Save a single movie (add or update) ──
export async function saveMovieToFirebase(movie) {
  try {
    await setDoc(doc(db, "movies", movie.id), movie);
    return true;
  } catch (e) {
    console.error("Firebase save error:", e);
    return false;
  }
}

// ── Delete a movie ──
export async function deleteMovieFromFirebase(id) {
  try {
    await deleteDoc(doc(db, "movies", id));
    return true;
  } catch (e) {
    console.error("Firebase delete error:", e);
    return false;
  }
}

// ── Save all movies (bulk replace) ──
export async function saveAllMoviesToFirebase(movies) {
  try {
    const promises = movies.map(m => setDoc(doc(db, "movies", m.id), m));
    await Promise.all(promises);
    return true;
  } catch (e) {
    console.error("Firebase bulk save error:", e);
    return false;
  }
}

// ── Real-time listener — calls callback(movies[]) on every change ──
export function subscribeToMovies(callback) {
  return onSnapshot(collection(db, "movies"), (snapshot) => {
    const movies = snapshot.docs.map(d => d.data());
    callback(movies);
  }, (error) => {
    console.error("Firebase listener error:", error);
  });
}

// ── Check if Firebase is configured ──
export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
}
