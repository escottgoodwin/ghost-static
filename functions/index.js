const functions = require('firebase-functions');

const postRender=require('./renderers/post');
const sectionRender=require('./renderers/section');
const uploader = require('./renderers/uploader');
const ts = require('./typesense');

//creates predefined typesense schema
exports.createSchema = functions.https.onRequest(async (req, res) => {
    const data = await ts.createSchema()
    res.status(200).send(JSON.stringify(data));
});

//deletes typesense schema
exports.deleteSchema = functions.https.onRequest(async (req, res) => {
  const result = await ts.deleteSchema()
  res.status(200).send(result);
});

//when post is published in ghost, renders and uploads to new post page
//rerenders the section page for each tag of the post
exports.createGhostPost = functions.https.onRequest(async (req, res) => {
  
  const { 
    body: {
      post: {
        current 
      }, 
    }, 
  } = req; 

  await postRender.renderUploadGhostPost(current);
   
  await sectionRender.renderGhostAuthorPage(current.primary_author);

  // update section pages
  current.tags.forEach(async tag => { sectionRender.renderGhostSectionPage(tag) });
    
  //creates typesense index entry for post
  await ts.indexPostTypesense(current);
  
  res.status(200).send('doc created');
});

//when post is published post in ghost is updated, renders and uploads the new post page to google storage
//rerenders and uploads the section page for each tag of the post
exports.updateGhostPost = functions.https.onRequest(async (req, res) => {
  
  const { 
    body: {
      post: {
        current 
      }, 
    }, 
  } = req; 

  if(current){
  //render post page
  await postRender.renderUploadGhostPost(current);

  await sectionRender.renderGhostAuthorPage(current.primary_author);

  //update section pages with associated tags
  current.tags.forEach(tag => { sectionRender.renderGhostSectionPage(tag) })
    
  //index in typesense
  await ts.updateIndexPostTypesense(current);
  }

  res.status(200).send('doc updated');
});

//when post is unpublished in ghost, post page is deleted from google storage
//rerenders and uploads the section page for each tag of the post - page without the deleted article
exports.deleteGhostPost = functions.https.onRequest(async (req, res) => {

  const { 
    body: {
      post: {
        current 
      }, 
    }, 
  } = req; 

  const slug = current.slug
  const id = current.id
  const tags = current.tags
  const path = `${slug}-${id}.html`;

  //delete article in storage
  await uploader.deleteHtml(path);

  // update section pages with associated tags removing the article
  tags.forEach(async tag => { await sectionRender.renderGhostSectionPage(tag) });

  //remove from typesense index
  await ts.deleteFromIndex(id);

  res.status(200).send('post deleted');
});

///renders typesense search page
exports.renderSearchPage = functions.https.onRequest(async (req, res) => {
    sectionRender.renderSearchPage()
    res.status(200).send('search page');
});