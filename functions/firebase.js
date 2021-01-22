const admin = require("firebase-admin");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  databaseURL: "https://phototasker-7d477.firebaseio.com",
  storageBucket: "phototasker-7d477.appspot.com",
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();
const fbstorage = admin.storage();

module.exports = {
  db,
  fbstorage,
};
