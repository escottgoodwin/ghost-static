const moment = require("moment");

const uploader = require("../uploader");
const templates = require("./templates");

// renders post from post info with article template
const renderGhostPost = (post) => {
  const {
    html,
    title,
    feature_image,
    excerpt,
    published_at,
    slug,
    id,
    primary_author,
  } = post;

  const path = `${slug}-${id}.html`;
  const pubDate = published_at ? moment(published_at).format("MMMM Do YYYY, h:mm a") : moment().format("MMMM Do YYYY, h:mm a");

  return templates.postTemplate({
    html,
    title,
    excerpt,
    feature_image,
    pubDate,
    path,
    primary_author,
  });
};

// new rendered post is written to temporary storage and then upload to google storage
const renderUploadGhostPost = async (post)=> {
  const {slug, id} = post;

  const path = `${slug}-${id}.html`;
  const filepath = `/tmp/${path}`;

  // generate html from template
  const newDoc = renderGhostPost(post);

  if (filepath && newDoc) {
    // write render to temp storage
    uploader.writeHtml(path, newDoc);

    // upload to storage
    uploader.uploadFile(path);
  }
};

// new rendered draft is written to temporary storage uploaded to google storage and updates preview
const renderUploadGhostDraft = async (post)=> {
  const {slug, id, primary_author} = post;
  const {name, email} = primary_author;
  const path = `${slug}-${id}.html`;

  // generate html from template
  const newDoc = renderGhostPost(post);
  // write render upload to storage
  uploader.uploadDraft(path, newDoc, name, email);
};

module.exports = {
  renderUploadGhostPost,
  renderUploadGhostDraft,
};
