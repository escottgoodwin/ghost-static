// For the default version
const algoliasearch = require("algoliasearch");
const functions = require("firebase-functions");
const moment = require("moment");

const {
  log,
  logError,
} = require("./util");

const local = process.env.FUNCTIONS_EMULATOR;
const collectionName = local ? "ghost_posts_local" : functions.config().algolia.collectionname;
const appId = functions.config().algolia.id;
const apiKey = functions.config().algolia.key;

const client = algoliasearch(appId, apiKey);

const index = client.initIndex(collectionName);

const attributesForFaceting = [
  "primary_author_facet",
  "mainTag",
];

// indexes newly published or published update post
const indexPost = async ({
  plaintext,
  title,
  published_at,
  authors,
  slug,
  id,
  primary_author,
  tags,
}) => {
  // facets for easy filtering of search by post author or section (business/sports...)
  index.setSettings({
    attributesForFaceting,
  }).then(() => {
  // done
    log(`faceted post ${attributesForFaceting.join(" ")}`);
  });

  const indexPost = {
    objectID: id,
    plaintext,
    title,
    published_at,
    authors,
    slug,
    id,
    primary_author,
    primary_author_facet: primary_author.name,
    path: `${slug}-${id}`,
    authorNames: authors.map((a) => a.name),
    tagNames: tags.map((t) => t.slug),
    mainTag: tags.filter((t) => t.slug != "front-page")[0].name,
    pubTimestamp: new Date(published_at).getTime(),
    pubDate: moment(published_at).format("MMMM Do YYYY, h:mm a"),
  };

  await index.saveObject(indexPost)
      .then(({objectID}) => {
        log(`Post indexed for ${collectionName}`, objectID);
      });
};

const deleteIndexPost = async (id) => {
  // Remove the object from Algolia
  await index
      .deleteObject(id)
      .then(() => {
        log(`Post deleted from ${collectionName}`, id);
      })
      .catch((error) => {
        logError(`Error when deleting contact from ${collectionName}`, error);
        process.exit(1);
      });
};

module.exports = {
  indexPost,
  deleteIndexPost,
};
