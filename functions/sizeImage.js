const sharp = require("sharp");
const path = require("path");
const {Storage} = require("@google-cloud/storage");

const gcs = new Storage();

const sizeImage = async (object, size) => {
  // Get the file name.
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.

  const {imageHeight, imageWidth} = size;

  const imagePrefix = `staticsized_${imageHeight}_${imageWidth}`;

  const fileName = path.basename(filePath);

  const sizedFileName = `${imagePrefix}_${fileName}`;
  const sizedFilePath = path.join(path.dirname(filePath), sizedFileName);
  console.log(sizedFileName);
  console.log(sizedFilePath);

  const metadata = {
    contentType: contentType,
  };

  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);

  //  Create write stream for uploading thumbnail
  const sizedUploadStream = bucket.file(sizedFilePath).createWriteStream({metadata});

  const transformer = sharp()
      .resize({
        width: imageWidth,
        height: imageHeight,
        fit: sharp.fit.inside,
        position: sharp.strategy.entropy,
      });

  // reading from readable stream
  // writing to writable stream
  bucket.file(filePath).createReadStream()
      .pipe(transformer)
      .pipe(sizedUploadStream);

  return new Promise((resolve, reject) =>
    sizedUploadStream.on("finish", resolve).on("error", reject));
};

module.exports = {
  sizeImage,
};
