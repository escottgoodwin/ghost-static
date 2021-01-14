const functions = require('firebase-functions');
const fetch = require('node-fetch');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const cfAuthKey = functions.config().cloudflare.authkey
const zoneid = functions.config().cloudflare.zoneid
const bucketName = functions.config().bucket.name
const siteurl = functions.config().site.url

const cloudframeurl =  `https://api.cloudflare.com/client/v4/zones/${zoneid}/purge_cache`

const bucket = storage.bucket(bucketName)

// writes to temporary file
function writeHtml(path, newDoc){
  const filepath = `/tmp/${path}`
  fs.writeFile(filepath, newDoc, err => {
    if (err) throw err;
    console.log(`${filepath} Saved!`);
  });
}

// uploads to google storage from temporary file and purges cloudflare cache
// sets cache for 30 seconds and cloudflare cache for a year - 
// all subsequent requests for url will come directly from the cache for the next year
// until page is updated and cache is purged
async function uploadFile(path) {
  const filepath = `/tmp/${path}`
    await bucket.upload(filepath, {
      gzip: true,
      metadata: {
        contentType: "text/html; charset=utf-8",
        cacheControl: "max-age=30, s-maxage=31536000" // indef CDN cache since we purge manually
      },
    })
    console.log(`${path} uploaded`)
    return await purgeUrl(path)
}

// purges cloudflare cache with authenticated request for single url to allow updated page to load
async function purgeUrl(path){
  const purgeUrl = `${siteurl}${path}`;
  
  const data = {files:[purgeUrl]};
  const response = await fetch(cloudframeurl, {
      body: JSON.stringify(data),
      headers: {
          "Content-Type": "application/json",
          "X-Auth-Email": "evansgoodwin@gmail.com",
          "X-Auth-Key": cfAuthKey
          },
      method: "POST"
  });
  console.log(`${purgeUrl} purged`)
  return response
}

//deletes html file from google storage when unpublished and purges from cloudflare cache
async function deleteHtml(path){
  const filename = path
  await bucket.file(filename).delete();
  console.log(`${filename} deleted`)
  return await purgeUrl(filename)
}

module.exports = { 
  uploadFile,
  purgeUrl,
  deleteHtml,
  writeHtml
}