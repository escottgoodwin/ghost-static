const moment = require("moment");

const uploader = require("../uploader");
const templates = require("./templates");

const baseurl = "https://storage.googleapis.com/ghost-public-media/";

// renders post from post info with article template
const renderGhostPost = ({
  html,
  title,
  feature_image,
  excerpt,
  published_at,
  id,
  primary_author,
}) => {
  const path = `${id}.html`;

  console.log(path);

  const pubDate = published_at ? moment(published_at).format("MMMM Do YYYY, h:mm a") : moment().format("MMMM Do YYYY, h:mm a");

  // get image root file name - from 2021/2/1/image-file.jpg => image-file
  const rootImageUrl = feature_image ? feature_image.slice(0, feature_image.lastIndexOf(".")).slice(feature_image.lastIndexOf("/")+1) : "";

  // get the extension for the file - from 2021/2/1/image-file.jpg => .jpg
  const imgExtension = feature_image ? feature_image.slice(feature_image.lastIndexOf(".")) : "";

  // get full public image root (wihtout) extension - https://storage.googleapis.com/ghost-public-media/image-file
  const fullUrl = baseurl + rootImageUrl;

  return templates.postTemplate({
    html,
    title,
    pubDate,
    excerpt,
    primary_author,
    path,
    imgExtension,
    fullUrl,
  });
};

// new rendered post is written to temporary storage and then upload to google storage
const renderUploadGhostPost = async (post)=> {
  const {id} = post;

  const path = `${id}.html`;
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
  const {id, primary_author} = post;
  const {name, email} = primary_author;
  const path = `${id}.html`;

  // generate html from template
  const newDoc = renderGhostPost(post);
  // write render upload to storage
  uploader.uploadDraft(path, newDoc, name, email);

  // delete temp rendered html file
};

module.exports = {
  renderUploadGhostPost,
  renderUploadGhostDraft,
};
