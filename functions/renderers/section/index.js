const {
  uploadFile,
  uploadFileFB,
  writeHtml,
} = require("../uploader");

const {sectionTemplate} = require("./section_template");
const {ghostApi} = require("../../ghost");

const renderGhostSectionPage = async ({name, slug}) => {
  const path = `${slug}.html`;

  // gets all posts where tag matches slug (for the section page) - limited to 5 articles per template layout
  const posts = await ghostApi.posts.browse({limit: 5, include: "tags,authors", filter: "tag:"+slug});

  // renders section page with all posts - business page with all business posts
  const {sectionDoc, sectionDocFb} = sectionTemplate({name, posts, path});

  // writes to temporary storage
  writeHtml(path, sectionDoc);

  // uploads from temporary to gcs
  await uploadFile(path);

  // uploads to fb storage
  await uploadFileFB(path, sectionDocFb);
};

module.exports = {
  renderGhostSectionPage,
};
