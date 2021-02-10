const functions = require("firebase-functions");

const local = process.env.FUNCTIONS_EMULATOR;

const host = local ? "db" : functions.config().db.host;
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

const getAuthorDrafts = async (email) => {
  const results = await knex.select("p.id", "p.title", "p.slug", "p.status")
      .from("posts as p")
      .innerJoin("posts_authors as pa", "p.id", "=", "pa.post_id")
      .innerJoin("users as u", "u.id", "=", "pa.author_id")
      .where("u.email", email)
      .orWhere("p.status", "published")
      .orWhere("p.status", "draft");
  return results;
};

module.exports = {
  knex,
  getAuthorDrafts,
};
