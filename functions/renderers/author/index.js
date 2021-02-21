
const {authorTemplate} = require("./author_template");
const {ghostApi} = require("../../ghost");
const {
  uploadFile,
  uploadFileFB,
  writeHtml,
} = require("../uploader");

const renderGhostAuthorPage = async ({name, slug, profile_image}) => {
  const path = `${slug}.html`;

  //  gets all posts where tag matches slug (for the section page) - limited to 5 articles per template layout
  const posts = await ghostApi.posts.browse({limit: 5, include: "tags,authors", filter: "primary_author:"+slug});

  // renders section page with all posts - business page with all business posts
  const {authorDoc, authorDocFb} = authorTemplate({name, profile_image, posts, path});

  // writes to temporary storage
  writeHtml(path, authorDoc);

  // uploads from temporary to gcs
  await uploadFile(path);

  // uploads to fb storage
  await uploadFileFB(path, authorDocFb);
};

module.exports = {
  renderGhostAuthorPage,
};
