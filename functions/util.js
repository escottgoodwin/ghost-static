const functions = require("firebase-functions");

const url = functions.config().site.url;

const baseurl = `${url}gen_images/`;

const imageRoot = (feature_image) => feature_image ? feature_image.slice(0, feature_image.lastIndexOf(".")).slice(feature_image.lastIndexOf("/")+1) : "";

const imageExt = (feature_image) => feature_image ? feature_image.slice(feature_image.lastIndexOf(".")) : "";

const resizedImageUrl = (feature_image) => {
  const rootImageUrl = imageRoot(feature_image);

  // get full public image root (wihtout) extension - https://storage.googleapis.com/ghost-public-media/image-file
  return baseurl + rootImageUrl;
};

const log = (message) => functions.logger.log(message);

const logError = (message) => functions.logger.error(message);

module.exports = {
  imageRoot,
  imageExt,
  log,
  logError,
  resizedImageUrl,
};
