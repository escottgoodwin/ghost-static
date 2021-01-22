const mysql = require("mysql");
const functions = require("firebase-functions");

const local = process.env.FUNCTIONS_EMULATOR;

const host = functions.config().db.host;
const user= functions.config().db.user;
const password = functions.config().db.password;
const port = functions.config().db.port;
const name = local ? 'ghost' : functions.config().db.name;

// run mysql query with variables
const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: name,
  port: port,
});

// run mysql query with variables
connection.connect();

// run mysql query with variables
const mysqlQuery = (sqlQuery, queryVariables) => {
  return new Promise((resolve, reject) => {
    connection.query(
        sqlQuery,
        queryVariables,
        (err, result) => {
          return err ? reject(err) : resolve(result);
        }
    );
  });
};

module.exports = {
  mysqlQuery,
};
