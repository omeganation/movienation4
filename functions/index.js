const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addMovie = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "Only admin allowed",
    );
  }

  return admin.firestore().collection("movies").add({
    title: data.title,
    year: data.year,
    views: 0,
  });
});
