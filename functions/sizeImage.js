const functions = require("firebase-functions");
const sharp = require("sharp");
const path = require("path");
const {Storage} = require("@google-cloud/storage");

sharp.cache(false);

// bucket name where we upload the resized images4
const publicUploadBucket = functions.config().gcs.publicupload;

// intialize Cloud Storage client
const gcs = new Storage();

// set the content type based on file extension
const getImageFileTypes = (fileName) => {
  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".JPG")) {
    return "image/jpeg";
  }

  if (fileName.endsWith(".png") || fileName.endsWith(".PNG")) {
    return "image/png";
  }

  return "Not an image!";
};

// forms the resized image name with the breakpoint name and -static2021
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
  if (filePath.includes("_o-")) {
    console.log("filtered image");
    return;
  }
  // bucket where the image is uploaded from ghost that we use to create our sized images
  const bucket = gcs.bucket(fileBucket);

  // public bucket where our resized images are uploaded
  const uploadBucket = gcs.bucket(publicUploadBucket);

  const contentType = getImageFileTypes(filePath);

  // if upload is not an image, stop
  if (contentType === "Not an image!") {
    console.log(`${filePath} 'Not an image!'`);
    return null;
  }

  // image type - jpeg or png
  const metadata = {
    contentType: contentType,
  };

  // file name of the original image
  const fileName = path.basename(filePath);

  // breakpoint size (360) and image size (312)
  const {name, width} = size;

  // file name of the resized image with the breakpoint size and appened uniqe name (-static2021)
  // example - im-286221-360-static2021.jpeg for the image with a width of 312
  const sizedFileName = generateFileName(fileName, name);
  console.log(sizedFileName);

  //  Create write stream for uploading thumbnail
  const sizedUploadStream = uploadBucket.file(sizedFileName).createWriteStream({metadata});

  // initiate the sharp resizer
  const transformer = sharp()
      .resize({
        width: width,
        height: null,
      });

  // original image
  const gcsFile = bucket.file(filePath);

  // reading from readable stream of the original image
  // writing to writable stream
  gcsFile.createReadStream()
      .pipe(transformer)
      .pipe(sizedUploadStream);

  // execute resize and upload
  return new Promise((resolve, reject) =>
    sizedUploadStream.on("finish", resolve).on("error", reject));
};
module.exports = {
  sizeImage,
};
