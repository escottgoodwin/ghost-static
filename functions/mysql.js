const functions = require("firebase-functions");

const local = process.env.FUNCTIONS_EMULATOR;

const host = functions.config().db.host;
const user= functions.config().db.user;
const password = functions.config().db.password;
const port = functions.config().db.port;
const name = local ? "ghost" : functions.config().db.name;

const knex = require("knex")({
  client: "mysql",
  connection: {
    host: host,
    user: user,
    password: password,
    database: name,
    port: port,
  },
});

module.exports = {
  knex,
};
