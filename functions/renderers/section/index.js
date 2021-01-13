const uploader = require('../uploader');
const templates = require('./templates');
const ghost = require('../../ghost');
const frameTemplate = require('../frame/templates');

async function sectionGhostPage({ name, slug }){
  const t0 = Date.now();
  const path = `${slug}.html`;
  const filepath = `/tmp/${path}`

  const posts = await ghost.ghostApi.posts.browse({limit: 5, include: 'tags,authors', filter: 'tag:'+slug})

  const sectionPage = templates.postsSection(name,posts,path);
  
  uploader.writeHtml(filepath, sectionPage)

  uploader.uploadFile(filepath)

}

function renderSearchPage(){

  const path = `search.html`;
  const filepath = `/tmp/${path}`

  const searchPage = frameTemplate.renderSearchPage();

  uploader.writeHtml(filepath, searchPage)

  uploader.uploadFile(filepath)

}

module.exports = { 
  renderSearchPage,
  sectionGhostPage,
}