const GhostContentAPI = require('@tryghost/content-api');
const functions = require('firebase-functions');

const local = process.env.FUNCTIONS_EMULATOR
const ghostKey = functions.config().ghost.apikey
const ghostUrl = functions.config().ghost.url

//client for making queries to ghost database
const ghostApi = new GhostContentAPI({
    url: local ? 'http://localhost:8080' : ghostUrl,
    key: local ? '26efe6c63cab74ff045ca03c07' : ghostKey,
    version: "v3"
  });

  module.exports = { 
    ghostApi
  }