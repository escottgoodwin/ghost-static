const functions = require("firebase-functions");
const path = require("path");

const postRender=require("./renderers/post");
const sectionRender=require("./renderers/section");
const uploader = require("./renderers/uploader");
const algolia = require("./algolia");
const sizeImage = require("./sizeImage");
const {ghostAdminApi} = require("./ghost");

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
  await uploader.deleteHtml(path);

  // update section pages with associated tags removing the article
  tags.forEach(async (tag) => {
    await sectionRender.renderGhostSectionPage(tag);
  });

  // remove from typesense index
  // await ts.deleteFromIndex(id);

  // remove from algolia index
  await algolia.deleteIndexPost(id);

  uploader.logUpdate(current);

  res.status(200).send("post deleted");
});


// gets drafts and published posts by logged in author
exports.getAuthorPosts = functions.https.onCall(async (data, context) => {
  const email = context.auth.token.email;

  const posts = await ghostAdminApi.posts.browse({limit: 5, include: "authors", filter: "authors.email:"+email});

  const drafts = posts.filter((d) => d.status === "draft");
  const published = posts.filter((d) => d.status === "published");

  return {
    drafts,
    published,
  };
});

exports.getAuthorPosts1 = functions.https.onRequest(async (req, res) => {
  const {
    body: {
      email,
    },
  } = req;

  const posts = await ghostAdminApi.posts.browse({limit: 5, include: "authors", filter: "authors.email:"+email});
  const drafts = posts.filter((d) => d.status === "draft");
  const published = posts.filter((d) => d.status === "published");
  const data = {
    drafts,
    published,
  };
  res.status(200).send(data);
});

exports.generateSizedImages = functions.storage.bucket("static-times-media").object().onFinalize((object) => {
  const contentType = object.contentType; // File content type.

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith("image/")) {
    console.log("This is not an image.");
    return null;
  }

  const filePath = object.name; // File path in the bucket.

  const fileName = path.basename(filePath);

  if (fileName.startsWith("staticsized_")) {
    console.log(`Already sized for ${fileName}.`);
    return null;
  }

  const imageSizes = [
    {
      imageHeight: 200,
      imageWidth: 200,
    },
    {
      imageHeight: 400,
      imageWidth: 400,
    },
    {
      imageHeight: 600,
      imageWidth: 600,
    },
  ];

  imageSizes.forEach((size) => sizeImage.sizeImage(object, size));
  return "images generated";
});
