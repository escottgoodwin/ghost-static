const functions = require("firebase-functions");
var admin = require("firebase-admin");

const postRender=require("./renderers/post");
const sectionRender=require("./renderers/section");
const uploader = require("./renderers/uploader");
const ts = require("./typesense");
const {knex} = require("./mysql");

var db = admin.database();

const logUpdate = current => {

  const { 
    authors, 
    title 
  } = current

  const now = new Date().getTime()

  authors.forEach(a => {
    const email = a.email.replace('@','_at_').replace('.','_dot_');
    var ref = db.ref(email);
    ref.set({
      updated: now,
      title
    });
  })
  
}

// creates predefined typesense schema
exports.createSchema = functions.https.onRequest(async (req, res) => {
  const {collectionName} = req.body;
  const data = await ts.createSchema(collectionName);
  res.status(200).send(JSON.stringify(data));
});

// deletes typesense schema
exports.deleteSchema = functions.https.onRequest(async (req, res) => {
  const {collectionName} = req.body;
  const result = await ts.deleteSchema(collectionName);
  res.status(200).send(result);
});

// fires on saved draft, triggers preview update
exports.createGhostDraft = functions.https.onRequest(async (req, res) => {
  const {
    body: {
      post: {
        current,
      },
    },
  } = req;

  postRender.renderUploadGhostDraft(current);

  res.status(200).send("draft updated");
});

// fires on saved draft, triggers preview update
exports.updateGhostDraft = functions.https.onRequest(async (req, res) => {
  const {
    body: {
      post: {
        current,
      },
    },
  } = req;

  postRender.renderUploadGhostDraft(current);

  res.status(200).send("draft updated");
});

// when post is published in ghost, renders and uploads to new post page
// rerenders the section page for each tag of the post
exports.createGhostPost = functions.https.onRequest(async (req, res) => {
  const {
    body: {
      post: {
        current,
      },
    },
  } = req;

  await postRender.renderUploadGhostPost(current);

  await sectionRender.renderGhostAuthorPage(current.primary_author);

  // update section pages
  current.tags.forEach(async (tag) => {
    sectionRender.renderGhostSectionPage(tag);
  });
  // creates typesense index entry for post
  await ts.indexPostTypesense(current);

  logUpdate(current);

  res.status(200).send("doc created");
});

// when post is published post in ghost is updated, renders and uploads the new post page to google storage
// rerenders and uploads the section page for each tag of the post
exports.updateGhostPost = functions.https.onRequest(async (req, res) => {
  const {
    body: {
      post: {
        current,
      },
    },
  } = req;

  if (current) {
  // render post page
    await postRender.renderUploadGhostPost(current);

    await sectionRender.renderGhostAuthorPage(current.primary_author);

    // update section pages with associated tags
    current.tags.forEach((tag) => {
      sectionRender.renderGhostSectionPage(tag);
    });

    // index in typesense
    await ts.updateIndexPostTypesense(current);
  }

  res.status(200).send("doc updated");
});

// when post is unpublished in ghost, post page is deleted from google storage
// rerenders and uploads the section page for each tag of the post - page without the deleted article
exports.deleteGhostPost = functions.https.onRequest(async (req, res) => {
  const {
    body: {
      post: {
        current,
      },
    },
  } = req;

  const slug = current.slug;
  const id = current.id;
  const tags = current.tags;
  const path = `${slug}-${id}.html`;

  // delete article in storage
  await uploader.deleteHtml(path);

  // update section pages with associated tags removing the article
  tags.forEach(async (tag) => {
    await sectionRender.renderGhostSectionPage(tag);
  });

  // remove from typesense index
  await ts.deleteFromIndex(id);

  logUpdate(current);

  res.status(200).send("post deleted");
});

// /renders typesense search page
exports.renderSearchPage = functions.https.onRequest(async (req, res) => {
  sectionRender.renderSearchPage();
  res.status(200).send("search page");
});

// gets drafts and published posts by logged in author
exports.getAuthorDraftsCall = functions.https.onCall(async (data, context) => {
  const email = context.auth.token.email;

  const results = await knex.select("p.id", "p.title", "p.slug", "p.status")
      .from("posts as p")
      .innerJoin("posts_authors as pa", "p.id", "=", "pa.post_id")
      .innerJoin("users as u", "u.id", "=", "pa.author_id")
      .where("u.email", email)
      .orWhere("p.status", "published")
      .orWhere("p.status", "draft");

  const drafts = results.filter((d) => d.status === "draft");
  const published = results.filter((d) => d.status === "published");

  return {
    drafts,
    published,
  };
});
