const functions = require("firebase-functions");
const sharp = require("sharp");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {Storage} = require("@google-cloud/storage");

const {logError} = require("./util");

sharp.cache(false);

// bucket name where we upload the resized images4
const publicUploadBucket = functions.config().gcs.publicmediaupload;

// intialize Cloud Storage client
const gcs = new Storage();

const uploadBucket = gcs.bucket(publicUploadBucket);

const extractFileNameWithoutExtension = (filePath, ext) => {
  const basepath = path.basename(filePath, ext);
  return basepath.slice(basepath.lastIndexOf("/")+1);
};

/**
 * convert to file type
 * @param {buffer} buffer image buffer
 * @param {string} imageType convert to image type
 * @return {buffer} converted image type buffer
 */

const convertType = (buffer, imageType) => {
  if (imageType === "jpg" || imageType === "jpeg") {
    return sharp(buffer).jpeg().toBuffer();
  } else if (imageType === "png") {
    return sharp(buffer).png().toBuffer();
  } else if (imageType === "webp") {
    return sharp(buffer).webp().toBuffer();
  } else if (imageType === "tiff") {
    return sharp(buffer).tiff().toBuffer();
  }
  return buffer;
};

/**
 * resizing image to specified width and autoscale height
 * @param {buffer} file image buffer
 * @param {number} size resize to width
 * @return {buffer} resized image buffer
 */
const resize = (file, size) => sharp(file).resize({width: size}).toBuffer();

const supportedImageContentTypeMap = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  tiff: "image/tiff",
  webp: "image/webp",
};


const resizeImage = async ({object, size, convertExt}) => {
  const filePath = object.name; // File path in the bucket.
  const width = size.width;
  const name = size.name;

  const fileExtension = path.extname(filePath); // .jpg for image_to_resize.jpg
  const fileNameWithoutExtension = extractFileNameWithoutExtension(filePath, fileExtension); // image_to_resize for image_to_resize.jpg

  const objectMetadata = object;

  // if original file extension is same as convertExt then use original final extension for resized file
  // if extensions diff then use the convertExt for resized image cx
  const modifiedExtensionName = convertExt===fileExtension ? fileExtension : convertExt;

  // if original extension is same as convertExt set original content type or set content type for convertExt
  // if convertExt=wepb and original ext=jpg, set content type "image/webp"
  const imageContentType = convertExt===fileExtension ? object.contentType : supportedImageContentTypeMap[convertExt];

  // put together full file name for resized image
  // image_to_resize_200.jpg or if converting to new content type (webp) image_to_resize_200.webp
  const modifiedFileName = `${fileNameWithoutExtension}_${name}${modifiedExtensionName}`;

  // full path of resized image with original director
  const modifiedFilePath = `gen_images/${modifiedFileName}`;

  const bucket = gcs.bucket(object.bucket);

  let modifiedFile;
  let originalFile;
  let filePath1;

  try {
    // file_to_resize.jpg is downloaded to tmp/file_to_resize.jpg
    // we manipulate tmp file with sharp
    filePath1 = filePath.slice(filePath.lastIndexOf("/")+1);
    originalFile = path.join(os.tmpdir(), filePath1);

    // Download file from bucket to temp dir with name same as object file name

    await bucket.file(filePath).download({destination: originalFile});

    // file in tmp dir where we will write the resized image buffer to then upload from
    modifiedFile = path.join(os.tmpdir(), modifiedFileName);

    const metadata = {
      contentDisposition: objectMetadata.contentDisposition,
      contentEncoding: objectMetadata.contentEncoding,
      contentLanguage: objectMetadata.contentLanguage,
      contentType: imageContentType,
      cacheControl: objectMetadata.cacheControl,
      metadata: objectMetadata.metadata || {},
    };

    // Generate a resized image buffer using Sharp.
    let modifiedImageBuffer = await resize(originalFile, width);

    // Generate a converted image type buffer using Sharp.
    if (convertExt!==fileExtension ) {
      modifiedImageBuffer = await convertType(modifiedImageBuffer, convertExt);
    }
    // create download file destination in temp dir

    // Generate a image file using Sharp to modifiedFile destination
    await sharp(modifiedImageBuffer).toFile(modifiedFile);

    // Uploading the modified image.
    await uploadBucket.upload(modifiedFile, {
      destination: modifiedFilePath,
      metadata,
    });

    return {size, success: true};
  } catch (err) {
    logError(`${size} ${err}`);

    return {size, success: false};
  } finally {
    try {
      // Make sure the local resized file is cleaned up to free up disk space.
      if (modifiedFile) {
        fs.unlinkSync(modifiedFile);
      }
    } catch (err) {
      logError(`${err}`);
    }
  }
};

module.exports = {
  resizeImage,
};
