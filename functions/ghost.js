const GhostContentAPI = require('@tryghost/content-api');
const functions = require('firebase-functions');

const ghostKey = functions.config().ghost.api

//client for making queries to ghost database
const ghostApi = new GhostContentAPI({
    url: 'http://localhost:8080',
    key: ghostKey,
    version: "v3"
  });

  module.exports = { 
    ghostApi
  }