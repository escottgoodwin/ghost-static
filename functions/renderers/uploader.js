const functions = require("firebase-functions");
const fetch = require("node-fetch");
const fs = require("fs");
const {Storage} = require("@google-cloud/storage");
const fb = require("../firebase");
const storage = new Storage();

const local = process.env.FUNCTIONS_EMULATOR;
const cfAuthKey = functions.config().cloudflare.authkey;
const cfZoneId = functions.config().cloudflare.zoneid;
const cfEmail = functions.config().cloudflare.email;
const bucketName = local ? "static-times-local" : functions.config().bucket.name;
const siteUrl = functions.config().cdn.url;

const cloudframeurl = `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/purge_cache`;

const bucket = storage.bucket(bucketName);

// update realtime database
const updateFBDoc = (fileName) => {
  const fbpath = fileName.replace(".html", "");
  const now = Date.now();
  console.log(`${fbpath} added to db`);
  fb.db.ref(fbpath).set({
    url: fileName,
    timestamp: now.toString(),
  });
};

// writes to temporary file
const writeHtml = (path, newDoc) => {
  const filepath = `/tmp/${path}`;
  fs.writeFile(filepath, newDoc, (err) => {
    if (err) throw err;
    console.log(`${filepath} Saved!`);
  });
};

// uploads to google storage from temporary file and purges cloudflare cache
// sets cache for 30 seconds and cloudflare cache for a year -
// all subsequent requests for url will come directly from the cache for the next year
// until page is updated and cache is purged
const uploadFile = async (path) => {
  const filepath = `/tmp/${path}`;
  try {
    await bucket.upload(filepath, {
      gzip: true,
      metadata: {
        contentType: "text/html; charset=utf-8",
        cacheControl: "max-age=0, s-maxage=0", // indef CDN cache since we purge manually
      },
    });
    console.log(`${path} uploaded`);
    updateFBDoc(path);
    return await purgeUrl(path);
  } catch (error) {
    console.log(error);
  }
};

// update to drafts folder in fb storage and update real time db
const uploadDraft = async (path, doc) => {
  fb.fbstorage.bucket()
      .file(path)
      .save(doc, {
        gzip: true,
        metadata: {
          contentType: "text/html; charset=utf-8",
        },
      }).then((res) => {
        updateFBDoc(path);
      }).catch((e) => {
        console.log(e);
      });
};

// purges cloudflare cache with authenticated request for single url to allow updated page to load
const purgeUrl = async (path) => {
  const purgeUrl = `${siteUrl}${path}`;

  // if front page is rerendered, purge site root address as well
  const files = path === "front-page.html" ? [purgeUrl, siteUrl] : [purgeUrl];

  const data = {files};

  // purge cache request
  const response = await fetch(cloudframeurl, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Email": cfEmail,
      "X-Auth-Key": cfAuthKey,
    },
    method: "POST",
  });
  console.log(`${purgeUrl} purged`);
  return response;
};

// deletes html file from google storage when unpublished and purges from cloudflare cache
const deleteHtml = async (path) => {
  const filename = path;
  await bucket.file(filename).delete();
  console.log(`${filename} deleted`);
  return await purgeUrl(filename);
};

module.exports = {
  uploadFile,
  uploadDraft,
  purgeUrl,
  deleteHtml,
  writeHtml,
};
