const functions = require("firebase-functions");
const moment = require("moment");
const Typesense = require("typesense");

const local = process.env.FUNCTIONS_EMULATOR;
const typesenseHost = functions.config().typesense.host;
const typesenseApiKey= functions.config().typesense.apikey;

// typesense collection
const collectionName = local ? "ghost_posts_local" : functions.config().typesense.collectionname;

// indexes new post
const client = new Typesense.Client({
  "nodes": [{
    "host": typesenseHost,
    "port": "443",
    "protocol": "https",
  }],

  "apiKey": typesenseApiKey,
  "connectionTimeoutSeconds": 2,
});

// indexes new post
const indexPostTypesense = async (post) => {
  const {
    plaintext,
    title,
    published_at,
    authors,
    slug,
    id,
    primary_author,
  } = post;

  const path = `${slug}-${id}`;
  const authorNames = authors.map((a) => a.name);
  const tagNames = post.tags.map((t) => t.slug);
  const mainTag = post.tags.filter((t) => t.slug != "front-page")[0].name;
  const pubTimestamp = new Date(published_at).getTime();
  console.log(pubTimestamp);
  const pubDate = moment(published_at).format("MMMM Do YYYY, h:mm a");

  const document = {
    "id": id,
    "path": path,
    "title": title,
    "authors": authorNames,
    "primary_author": primary_author.name,
    "primary_author_facet": primary_author.name,
    "plaintext": plaintext,
    "tags": tagNames,
    "slug": slug,
    "published_timestamp": pubTimestamp,
    "published_at": pubDate,
    "authors_facet": authorNames,
    "tags_facet": tagNames,
    "main _tag_facet": mainTag,
  };

  try {
    await client.collections(collectionName).documents().create(document);
    console.log(`${title} indexed`);
  } catch (error) {
    console.log("index created", error);
  }
};

// updates previously indexed post
const updateIndexPostTypesense = async (post) => {
  const {
    plaintext,
    title,
    slug,
    id,
  } = post;

  const path = `${slug}-${id}`;
  const tagNames = post.tags.map((t) => t.slug);
  const mainTag = post.tags.filter((t) => t.name != "Front Page")[0].name;
  try {
    await client.collections(collectionName)
        .documents(id).update({
          "title": title,
          "content": plaintext,
          "tags": tagNames,
          "tags_facet": tagNames,
          "slug": slug,
          "main _tag_facet": mainTag,
          "path": path,
        });

    console.log(`${title} index updated`);
  } catch (error) {
    console.log("index updated error", error);
  }
};

// deletes post
const deleteFromIndex = async (id) => {
  try {
    await client.collections(collectionName).documents(id).delete();
    console.log(`${id} index deleted`);
  } catch (error) {
    console.log("index delete error", error);
  }
};

// indexes new post
const createSchema = async (collection) => {
  const postsSchema = {
    "name": collection,
    "fields": [
      {"name": "id", "type": "string"},
      {"name": "title", "type": "string"},
      {"name": "authors", "type": "string[]"},
      {"name": "primary_author", "type": "string"},
      {"name": "plaintext", "type": "string"},
      {"name": "tags", "type": "string[]"},
      {"name": "slug", "type": "string"},
      {"name": "path", "type": "string"},
      {"name": "published_timestamp", "type": "int64", "facet": true},
      {"name": "published_at", "type": "string"},
      {"name": "authors_facet", "type": "string[]", "facet": true},
      {"name": "tags_facet", "type": "string[]", "facet": true},
      {"name": "primary_author_facet", "type": "string", "facet": true},
      {"name": "main _tag_facet", "type": "string", "facet": true},
    ],
    "default_sorting_field": "published_timestamp",
  };

  const data = await client.collections().create(postsSchema);

  return data;
};

// indexes new post
const deleteSchema = async (collection) => {
  const result = await client.collections(collection).delete();
  return result;
};

module.exports = {
  indexPostTypesense,
  updateIndexPostTypesense,
  deleteFromIndex,
  createSchema,
  deleteSchema,
};
