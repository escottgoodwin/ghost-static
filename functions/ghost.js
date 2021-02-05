const GhostContentAPI = require("@tryghost/content-api");
const GhostAdminAPI = require('@tryghost/admin-api');
const functions = require("firebase-functions");

const local = process.env.FUNCTIONS_EMULATOR;
const ghostKey = functions.config().ghost.apikey;
const ghostUrl = functions.config().ghost.url;

const ghostAdminApi = new GhostAdminAPI({
  url: 'http://localhost:8080',
  key: "60170e22ace23c0001b08d17:e5eab2ca678312a84d8fe5efa7dc983c67d7ce357a6ca1bdead073bd2bae3ce4",
  version: "v3"
});

module.exports = {
  ghostAdminApi,
};
