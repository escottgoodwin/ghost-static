const functions = require("firebase-functions");
const sharp = require("sharp");
const path = require("path");
const {Storage} = require("@google-cloud/storage");

const publicUploadBucket = functions.config().gcs.publicupload;

const gcs = new Storage();

const getImageFileTypes = (fileName) => {
  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".JPG")) {
    return "image/jpeg";
  }

  if (fileName.endsWith(".png") || fileName.endsWith(".PNG")) {
    return "image/png";
  }

  return "Not an image!";
};

const generateFileName = (fileName, name) => {
  const imageSuffix = `-${name}-static2021`;

  const rootImageUrl = fileName.slice(0, fileName.lastIndexOf(".")).slice(fileName.lastIndexOf("/")+1);

  const imgExtension = fileName.slice(fileName.lastIndexOf("."));

  return rootImageUrl + imageSuffix + imgExtension;
};

const sizeImage = async (object, size) => {
  // Get the file name.
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.

  const contentType = getImageFileTypes(filePath);

  if (contentType === "Not an image!") {
    console.log(`${filePath} 'Not an image!'`);
    return null;
  }

  const {name, width} = size;

  const fileName = path.basename(filePath);

  const sizedFileName = generateFileName(fileName, name);
  console.log(sizedFileName);

  const metadata = {
    contentType: contentType,
  };

  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);

  const uploadBucket = gcs.bucket(publicUploadBucket);

  //  Create write stream for uploading thumbnail
  const sizedUploadStream = uploadBucket.file(sizedFileName).createWriteStream({metadata});

  const transformer = sharp()
      .resize({
        width: width,
        height: null,
      });

  const gcsFile = bucket.file(filePath);

  // reading from readable stream
  // writing to writable stream
  gcsFile.createReadStream()
      .pipe(transformer)
      .pipe(sizedUploadStream);

  return new Promise((resolve, reject) =>
    sizedUploadStream.on("finish jpg", resolve).on("error", reject));
};

module.exports = {
  sizeImage,
};
