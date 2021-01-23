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
const bucketName = local ? "static_times" : functions.config().bucket.name;
const siteUrl = functions.config().cdn.url;

const cloudframeurl = `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/purge_cache`;

const bucket = storage.bucket(bucketName);

// update realtime database
const updateFirebase = (name, email, fileName) => {
  console.log(`updating preview ${fileName} by ${email}`);
  const current_user = email.replace("@", "_at_").replace(".", "_");
  const now = Date.now();

  fb.db.ref(current_user).set({
    url: fileName,
    edited_by: name,
    timestamp: now.toString(),
  });
};

// update realtime database
const updateFBDoc = (fileName) => {
  const now = Date.now();
  console.log(`${fileName} added to db`);
  fb.db.ref(`${fileName}`).set({
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
        cacheControl: "max-age=30, s-maxage=31536000", // indef CDN cache since we purge manually
      },
    });

    console.log(`${path} uploaded`);
    return await purgeUrl(path);
  } catch (error) {
    console.log(error);
  }
};

const uploadDraft = async (path, doc, name, email) => {
  fb.fbstorage.bucket()
      .file(`drafts/${path}`)
      .save(doc, {
        gzip: true,
        metadata: {
          contentType: "text/html; charset=utf-8",
        },
      }).then((res) => {
        const fbpath = path.replace('.html','')
        updateFirebase(name, email, path);
        updateFBDoc(fbpath);
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
