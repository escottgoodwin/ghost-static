const GhostAdminAPI = require("@tryghost/admin-api");
const functions = require("firebase-functions");

const local = process.env.FUNCTIONS_EMULATOR;
const ghostKey = local ? "60170e22ace23c0001b08d17:e5eab2ca678312a84d8fe5efa7dc983c67d7ce357a6ca1bdead073bd2bae3ce4" : functions.config().ghost.ghostkey;
const ghostUrl = local ? "http://localhost:8080" : functions.config().ghost.url;

const ghostAdminApi = new GhostAdminAPI({
  url: ghostUrl,
  key: ghostKey,
  version: "v3",
});

module.exports = {
  ghostAdminApi,
};
