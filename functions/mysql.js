const functions = require("firebase-functions");

const local = process.env.FUNCTIONS_EMULATOR;

const host = local ? "172.18.0.1" : functions.config().db.host;
const user= local ? "root" : functions.config().db.user;
const password = local ? "example" : functions.config().db.password;
const port = local ? 3306 : functions.config().db.port;
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
