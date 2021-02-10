const functions = require("firebase-functions");

const postRender=require("./renderers/post");
const sectionRender=require("./renderers/section");
const uploader = require("./renderers/uploader");
const algolia = require("./algolia");
const sizeImage = require("./sizeImage");
const {knex} = require("./mysql");

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

  uploader.logUpdate(current);

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

  // render and upload post page
  await postRender.renderUploadGhostPost(current);

  // render and upload author page
  await sectionRender.renderGhostAuthorPage(current.primary_author);

  // update section pages for each tag
  current.tags.forEach(async (tag) => {
    sectionRender.renderGhostSectionPage(tag);
  });

  await algolia.indexPost(current);

  uploader.logUpdate(current);

  res.status(200).send("post created");
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

    await algolia.indexPost(current);
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
  await uploader.deletePostHtml(path);

  // update section pages with associated tags removing the article
  tags.forEach(async (tag) => {
    await sectionRender.renderGhostSectionPage(tag);
  });

  // remove from algolia index
  await algolia.deleteIndexPost(id);

  uploader.logUpdate(current);

  res.status(200).send("post deleted");
});

// gets drafts and published posts by logged in author
exports.getAuthorPosts = functions.https.onCall(async (data, context) => {
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

exports.generateSizedImages = functions.storage.bucket("static-times-media").object().onFinalize((object) => {
  const sizes = [
    {
      name: "360",
      width: 312,
    },
    {
      name: "480",
      width: 427,
    },
    {
      name: "736",
      width: 683,
    },
    {
      name: "980",
      width: 873,
    },
    {
      name: "1280",
      width: 1173,
    },
    {
      name: "1680",
      width: 1217,
    },
  ];

  // 1680 x 1217 = .72
  // 1280 : 1173  = .92
  // 980 : 873 = .89
  // 736 : 683 = .92
  // 480 : 427 = .89
  // 360 : 312 = .87

  sizes.forEach((size) => sizeImage.sizeImage(object, size));
  return "images generated";
});
