const GhostContentAPI = require("@tryghost/content-api");
const functions = require("firebase-functions");

const local = process.env.FUNCTIONS_EMULATOR;
const ghostKey = functions.config().ghost.apikey;
const ghostUrl = functions.config().ghost.url;

// client for making queries to ghost database
const ghostApi = new GhostContentAPI({
  url: local ? "http://localhost:8080" : ghostUrl,
  key: local ? "f354b2450d8f9b04e72421c624" : ghostKey,
  version: "v3",
});

module.exports = {
  ghostApi,
};
