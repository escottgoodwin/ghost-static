const admin = require("firebase-admin");

// Fetch the service account key JSON file contents
// const serviceAccount = require("/Users/evangoodwin/Downloads/phototasker-7d477-firebase-adminsdk-gzibz-0464da3676.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://phototasker.firebaseio.com",
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();
const storage = admin.storage();

module.exports = {
  db,
  storage,
};
