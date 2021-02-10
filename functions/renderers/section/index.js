const uploader = require("../uploader");
const templates = require("./templates");
const {ghostApi} = require("../../ghost");

const renderGhostSectionPage = async ({name, slug}) => {
  const path = `${slug}.html`;

  // gets all posts where tag matches slug (for the section page) - limited to 5 articles per template layout
  const posts = await ghostApi.posts.browse({limit: 5, include: "tags,authors", filter: "tag:"+slug});

  // renders section page with all posts - business page with all business posts
  const sectionPage = templates.sectionTemplate({name, posts, path});

  // writes to temporary storage
  uploader.writeHtml(path, sectionPage);

  // uploads from temporary storage
  uploader.uploadFile(path);
};

const renderGhostAuthorPage = async ({name, slug, profile_image}) => {
  const path = `${slug}.html`;

  //  gets all posts where tag matches slug (for the section page) - limited to 5 articles per template layout
  const posts = await ghostApi.posts.browse({limit: 5, include: "tags,authors", filter: "primary_author:"+slug});

  // renders section page with all posts - business page with all business posts
  const sectionPage = templates.authorTemplate({name, profile_image, posts, path});

  // writes to temporary storage
  uploader.writeHtml(path, sectionPage);

  // uploads from temporary storage
  uploader.uploadFile(path);
};

module.exports = {
  renderGhostSectionPage,
  renderGhostAuthorPage,
};
