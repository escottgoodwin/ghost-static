const functions = require('firebase-functions');

const postRender=require('./renderers/post');
const sectionRender=require('./renderers/section');
const uploader = require('./renderers/uploader');
const ts = require('./typesense');

exports.createSchema = functions.https.onRequest(async (req, res) => {
    const data = await ts.createSchema()
    res.status(200).send(JSON.stringify(data));
});

exports.deleteSchema = functions.https.onRequest(async (req, res) => {
  const result = await ts.deleteSchema()
  res.status(200).send(result);
});

exports.createGhostPost = functions.https.onRequest(async (req, res) => {
 
  const { current } = req.body.post

  //render post page
  await postRender.renderUploadGhostPost(current)

  // update section pages
  const { tags } = current
  tags.forEach(async tag => { await sectionRender.sectionGhostPage(tag) });
    
  //index
  await ts.indexPostTypesense(current);
  
  res.status(200).send('doc created');
});

exports.updateGhostPost = functions.https.onRequest(async (req, res) => {

  const { current } = req.body.post

  //render post page
  await postRender.renderUploadGhostPost(current)

  // update section pages with associated tags
  const { tags } = current
  tags.forEach(async tag => { await sectionRender.sectionGhostPage(tag) });
    
  //index in typesense
  await ts.updateIndexPostTypesense(current);

  res.status(200).send('doc updated');
});

exports.deleteGhostPost = functions.https.onRequest(async (req, res) => {

  const { slug, id, tags } = req.body.post.current
  const path = `${slug}-${id}.html`;

  //delete article in storage
  await uploader.deleteHtml(path);

  // update section pages with associated tags removing the article
  tags.forEach(async tag => { await sectionRender.sectionGhostPage(tag) });

  //remove from typesense index
  await ts.deleteFromIndex(id);

  res.status(200).send('post deleted');
});

exports.renderSearchPage = functions.https.onRequest(async (req, res) => {
    sectionRender.renderSearchPage()
    console.log('search page')
    res.status(200).send('searche page');
});