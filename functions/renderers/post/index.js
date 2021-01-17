var moment = require('moment');

const uploader = require('../uploader');
const templates = require('./templates');

// renders post from post info with article template
function renderGhostPost(post){

  const { 
    html,
    title,
    feature_image,
    excerpt,
    published_at,
    slug,
    id,
    primary_author
  } = post 

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
  const { slug, id } = post;
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