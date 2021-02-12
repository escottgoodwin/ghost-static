// deploy - wrangler publish
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event))
})

const BUCKET_URL = `http://storage.googleapis.com`

async function serveAsset(event) {
  const url = new URL(event.request.url)
  const cache = caches.default

  //check if route page is already in cache
  let response = await cache.match(event.request)

  //if not in cache, get page from google storage, serve it, and put it in the cache
  if (!response) {
    // if route is domain root, serve the front page, otherwise serve file from google storage that matches route
    // route - http://www.example.com/listings.html 
    // google storage - http://storage.googleapis.com/example-bucket/listings.html
    const bucketName = 'static-times-published'
    fullUrl = url.pathname==='/' ? `${BUCKET_URL}/${bucketName}/front-page.html` : `${BUCKET_URL}/${bucketName}${url.pathname}`
    //reassign response from the cache response to the response from google storage
    response = await fetch(fullUrl)

    //serve and cache response for a year
    const headers = { "Cache-Control": "max-age=0, s-maxage=31536000", }
    response = new Response(response.body, { ...response, headers })
    event.waitUntil(cache.put(event.request, response.clone()))
  }
  //if route is in cache, serve the cached page. 
  return response
}

async function handleRequest(event) {
  if (event.request.method === "GET") {
    let response = await serveAsset(event)
    if (response.status > 399) {
      response = new Response(response.statusText, { status: response.status })
    }
    return response
  } else {
    return new Response("Method not allowed", { status: 405 })
  }
}