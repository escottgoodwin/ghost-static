const uploader = require('../uploader');
const templates = require('./templates');
const ghost = require('../../ghost');
const frameTemplate = require('../frame/templates');

async function sectionGhostPage({ name, slug }){
  const path = `${slug}.html`;

  //gets all posts where tag matches slug (for the section page) - limited to 5 articles per template layout
  const posts = await ghost.ghostApi.posts.browse({limit: 5, include: 'tags,authors', filter: 'tag:'+slug})

  //renders section page with all posts - business page with all business posts
  const sectionPage = templates.postsSection(name,posts,path);
  
  //writes to temporary storage
  uploader.writeHtml(path, sectionPage)

  //uploads from temporary storage
  uploader.uploadFile(path)

}

function renderSearchPage(){

  const path = `search.html`;

  //renders search page template
  const searchPage = frameTemplate.renderSearchPage();

  //writes to temporary storage
  uploader.writeHtml(path, searchPage)

  //uploads from temporary storage
  uploader.uploadFile(path)

}

module.exports = { 
  renderSearchPage,
  sectionGhostPage,
}