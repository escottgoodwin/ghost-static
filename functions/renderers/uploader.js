const fetch = require("node-fetch");
const fs = require("fs");
const {Storage} = require("@google-cloud/storage");

const { 
  log,
  logError
 } = require('../utils');

const {
  db,
  fbstorage,
  functions,
} = require("../firebase");
const { logError } = require("../util");

const storage = new Storage();

const local = process.env.FUNCTIONS_EMULATOR;
const cfAuthKey = functions.config().cloudflare.authkey;
const cfZoneId = functions.config().cloudflare.zoneid;
const cfEmail = functions.config().cloudflare.email;
const bucketName = local ? functions.config().gcs.cfuploadlocal : functions.config().gcs.cfupload;
const fbBucketName = functions.config().gcs.fbupload;
const siteUrl = functions.config().site.url;
const fbsiteUrl = functions.config().site.fburl;

const cloudframeurl = `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/purge_cache`;

const bucket = storage.bucket(bucketName);

// updates author item in fb database when article is updated that they are an author for
// triggers update of preview posts list - shifts from drafts to published or vice versa
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
    log(`${title} updated in db for ${email}`);
  });
};

// update realtime database to trigger preview reload
const updateFBDoc = (fileName) => {
  const fbpath = fileName.replace(".html", "");
  const now = Date.now();
  log(`${fbpath} added to db`);
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
    log(`${filepath} Saved!`);
  });
};

// deletes temporary file
const deleteHtml = (path) => {
  const filepath = `/tmp/${path}`;
  fs.unlink(filepath, (err) => {
    if (err) throw err;
    log(`successfully deleted ${filepath}`);
  });
};

// uploads to google storage from temporary file and purges cloudflare cache
// sets browser cache for 0 seconds and the cloudflare cache for a year -
// all subsequent requests for url will come directly from the cache for the next year
// until page is updated and cache is purged

const uploadFileFB = async (path, doc) => {
  await storage
      .bucket(fbBucketName)
      .file(path)
      .save(doc, {
        gzip: true,
        metadata: {
          contentType: "text/html; charset=utf-8",
          cacheControl: "max-age=0, s-maxage=31536000", // indef CDN cache since we purge manually
        },
      });

  log(`${path} uploaded fb`);

  // trigger render reload in preview
  updateFBDoc(path);

  // purge cache for path in fb hosting - http://www.example.com/business.html
  const purgeUrl = `${fbsiteUrl}${path}`;
  await fetch(purgeUrl, {method: "PURGE"});
  log(`purged fb ${purgeUrl }`);

  // if page uploaded in front-page, also purge fb hosting root url http://www.example.com/
  if (path === "front-page.html") {
    await fetch(fbsiteUrl, {method: "PURGE"});
    log(`purged fb ${fbsiteUrl}`);
  }
  return;
};

// uploads to google storage, updates fb database to trigger preview update and purges cloudflare cache
const uploadFile = async (path) => {
  const filepath = `/tmp/${path}`;
  try {
    await bucket.upload(filepath, {
      gzip: true,
      metadata: {
        contentType: "text/html; charset=utf-8",
        cacheControl: "max-age=0, s-maxage=31536000",
      },
    });
    log(`${path} uploaded`);

    updateFBDoc(path);

    return await purgeUrl(path);
  } catch (error) {
    logError(error);
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
      }).catch((error) => {
        logError(error);
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
  log(`${purgeUrl} cf purged`);
  return response;
};

// deletes html file from google storage when unpublished and purges from cloudflare cache
const deletePostHtml = async (path) => {
  await bucket.file(path).delete();
  await bucket.file(fbBucketName).delete();
  log(`${path} deleted`);
  return await purgeUrl(path);
};

module.exports = {
  uploadFile,
  uploadDraft,
  purgeUrl,
  deletePostHtml,
  writeHtml,
  deleteHtml,
  logUpdate,
  uploadFileFB,
};
