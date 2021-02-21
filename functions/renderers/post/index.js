const moment = require("moment");
const {postTemplate} = require("./post_template");

const {
  uploadFile,
  uploadFileFB,
  writeHtml,
  uploadDraft,
} = require("../uploader");

const {
  imageExt,
  resizedImageUrl,
} = require("../../util");

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

  const pubDate = published_at ? moment(published_at).format("MMMM Do YYYY, h:mm a") : moment().format("MMMM Do YYYY, h:mm a");

  // get full public image root (wihtout) extension - https://storage.googleapis.com/ghost-public-media/image-file
  const fullUrl = resizedImageUrl(feature_image);
  // get the extension for the file - from 2021/2/1/image-file.jpg => .jpg
  const imgExtension = imageExt(feature_image);

  return postTemplate({
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
  const {postDoc, postDocFb} = renderGhostPost(post);

  if (filepath && postDoc) {
    // write render to temp storage
    writeHtml(path, postDoc);

    // upload to storage
    await uploadFile(path);

    await uploadFileFB(path, postDocFb);
  }
};

// new rendered draft is written to temporary storage uploaded to google storage and updates preview
const renderUploadGhostDraft = async (post)=> {
  const {id, primary_author} = post;
  const {name, email} = primary_author;
  const path = `${id}.html`;

  // generate html from template
  const {postDoc} = renderGhostPost(post);
  // write render upload to storage
  uploadDraft(path, postDoc, name, email);


  // delete temp rendered html file
};

module.exports = {
  renderUploadGhostPost,
  renderUploadGhostDraft,
};
