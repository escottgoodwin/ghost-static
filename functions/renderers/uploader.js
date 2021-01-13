const functions = require('firebase-functions');
const fetch = require('node-fetch');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const cfAuthKey = functions.config().cloudflare.authkey
const zoneid = functions.config().cloudflare.zoneid
const bucketName = functions.config().bucket.name
const siteurl = functions.config().site.url

const bucket = storage.bucket(bucketName)

function writeHtml(path, newDoc){
  const filepath = `/tmp/${path}`
  fs.writeFile(filepath, newDoc, err => {
    if (err) throw err;
    console.log(`${filepath} Saved!`);
  });
}

async function uploadFile(path) {
  const filepath = `/tmp/${path}`
    await bucket.upload(filepath, {
      gzip: true,
      metadata: {
        contentType: "text/html; charset=utf-8",
        cacheControl: "max-age=30, s-maxage=31536000" // indef CDN cache since we purge manually
      },
    });
    console.log(`${path} uploaded`)
    return await purgeUrl(path)
}

async function purgeUrl(path){
  const purgeUrl = `${siteurl}/${path}`;
  
  const cloudframeurl =  `https://api.cloudflare.com/client/v4/zones/${zoneid}/purge_cache`
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