const fetch = require("node-fetch");
const fs = require("fs");
const {Storage} = require("@google-cloud/storage");
const {
  db,
  fbstorage,
  functions,
} = require("../firebase");

const storage = new Storage();

const local = process.env.FUNCTIONS_EMULATOR;
const cfAuthKey = functions.config().cloudflare.authkey;
const cfZoneId = functions.config().cloudflare.zoneid;
const cfEmail = functions.config().cloudflare.email;
const bucketName = local ? "static-times-local" : functions.config().bucket.name;
const siteUrl = functions.config().cdn.url;

const cloudframeurl = `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/purge_cache`;

const bucket = storage.bucket(bucketName);

const logUpdate = (current) => {
  const {
    authors,
    title,
  } = current;

  const now = new Date().getTime();

  authors.forEach((a) => {
    const email = a.email.replace("@", "_at_").replace(".", "_dot_");
    const ref = db.ref(email);
    ref.set({
      updated: now,
      title,
    });
    console.log(`${title} updated in db for ${email}`);
  });
};

// update realtime database
const updateFBDoc = (fileName) => {
  const fbpath = fileName.replace(".html", "");
  const now = Date.now();
  console.log(`${fbpath} added to db`);
  db.ref(fbpath).set({
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
  fbstorage.bucket()
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
const deletePostHtml = async (path) => {
  await bucket.file(path).delete();
  console.log(`${path} deleted`);
  return await purgeUrl(path);
};

module.exports = {
  uploadFile,
  uploadDraft,
  purgeUrl,
  deletePostHtml,
  writeHtml,
  logUpdate,
};
