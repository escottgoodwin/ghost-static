var moment = require('moment');

const uploader = require('../uploader');
const templates = require('./templates');

// renders post from post info with article template
function renderGhostPost(post){

  const html = post.html 
  const title = post.title 
  const feature_image = post.feature_image 
  const excerpt = post.excerpt
  const published_at = post.published_at 
  const slug = post.slug
  const id = post.id
  const primary_author = post.primary_author

  const path = `${slug}-${id}.html`
  const pubDate = moment(published_at).format('MMMM Do YYYY, h:mm a')

  return templates.postTemplate({ 
    html, 
    title, 
    excerpt, 
    feature_image,  
    pubDate, 
    path, 
    primary_author 
  })

}

// new rendered post is written to temporary storage and then upload to google storage
async function renderUploadGhostPost(post){
  const t0 = Date.now();
  const slug = post.slug;
  const id = post.id;
  const path = `${slug}-${id}.html`;
  const filepath = `/tmp/${path}`;

  //generate html from template
  const newDoc = renderGhostPost(post)

  if(filepath && newDoc){
    //write render to temp storage
    uploader.writeHtml(path, newDoc)

    //upload to storage 
    uploader.uploadFile(path)
  }
 
}

module.exports = { 
  renderUploadGhostPost,
}