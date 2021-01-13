var moment = require('moment');

const section = require('../section');
const uploader = require('../uploader');
const templates = require('./templates');
const ghost = require('../../ghost');

function createGhostPost(post){

  const {  
    html, 
    title, 
    feature_image, 
    excerpt,
    published_at, 
    authors,
    slug,
    id,
    primary_author
   } = post

  const path = `${slug}-${id}.html`
  const pubDate = moment(published_at).format('MMMM Do YYYY, h:mm a')
  const authorNames = authors.map(a => `${a.name} `)

  return templates.articlePage({ 
    html, 
    title, 
    excerpt, 
    feature_image,  
    pubDate, 
    authorNames, 
    path, 
    primary_author 
  })

}

async function renderUploadGhostPost(post){
  const t0 = Date.now();
  const { slug, id } = post
  const path = `${slug}-${id}.html`
  const filepath = `/tmp/${path}`

  //generate html from template
  const newDoc = createGhostPost(post)

  if(filepath && newDoc){
    //write render to temp storage
    uploader.writeHtml(filepath, newDoc)

    //upload to storage 
    uploader.uploadFile(filepath)
  }
 
}

module.exports = { 
  renderUploadGhostPost,
}