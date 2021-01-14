const functions = require('firebase-functions');
var moment = require('moment');
const Typesense = require('typesense');

const typesenseHost = functions.config().typesense.host
const typesenseApiKey= functions.config().typesense.apikey
const collectionName = 'ghost_posts'

let client = new Typesense.Client({
  'nodes': [{
    'host':typesenseHost,
    'port': '443',
    'protocol': 'https',
  }],

  'apiKey': typesenseApiKey,
  'connectionTimeoutSeconds': 2
});

//indexes new post
async function indexPostTypesense(post){
  const {
    title,
    slug,
    id,
    plaintext,
    primary_author,
    authors,
    tags,
    published_at,
  } = post

  const path = `${slug}-${id}`;
  const authorNames = authors.map(a => a.name);
  const tagNames = tags.map(t => t.slug);
  const pubTimestamp = moment(published_at).unix();
  const pubDate = moment(post.post_date).format('MMMM Do YYYY, h:mm a')

  let document = {
    'id':id,
    'path': path,
    'title': title,
    'authors': authorNames,
    'primary_author': primary_author.name,
    'plaintext': plaintext,
    'tags': tagNames,
    'slug': slug,
    'published_timestamp':pubTimestamp,
    'published_at':pubDate,
    'authors_facet':authorNames,
    'tags_facet':tagNames
  }

  try {

    result = await client.collections(collectionName)
    .documents().create(document);
    console.log(result)

  } catch (error) {

    console.log('created',error);

  }
}

//updates previously indexed post
async function updateIndexPostTypesense(post){
  const {
    title,
    slug,
    id,
    plaintext,
    tags,
  } = post

  const path = `${slug}-${id}`;
  const tagNames = tags.map(t => t.slug);

  try {

    result = await client.collections(collectionName)
    .documents(id).update({
      'title': title,
      'content': plaintext,
      'tags': tagNames,
      'tags_facet':tagNames,
      'slug': slug,
      'path': path,
    })

    console.log(result)

  } catch (error) {
    console.log('updated',error);
  }
}

//deletes post
async function deleteFromIndex(id){
    try {
      result = await client.collections(collectionName).documents(id).delete()

      } catch (error) {
      console.log('updated',error);
    }
}

async function createSchema(){
  let postsSchema = {
    'name': 'ghost_posts',
    'fields': [
      {'name': 'id', 'type': 'string' },
      {'name': 'title', 'type': 'string' },
      {'name': 'authors', 'type': 'string[]' },
      {'name': 'primary_author', 'type': 'string' },
      {'name': 'plaintext', 'type': 'string' },
      {'name': 'tags', 'type': 'string[]' },
      {'name': 'slug', 'type': 'string' },
      {'name': 'path', 'type': 'string' },
      {'name': 'published_timestamp', 'type': 'int32' },
      {'name': 'published_at', 'type': 'string' },
      {'name': 'authors_facet', 'type': 'string[]', 'facet': true },
      {'name': 'tags_facet', 'type': 'string[]', 'facet': true },
    ],
    'default_sorting_field': 'published_timestamp'
  }
  const data = await client.collections().create(postsSchema)

  return data

}

async function deleteSchema(){
  const result = await client.collections(collectionName).delete()
  console.log(result)
  return result 
}

module.exports = { 
  indexPostTypesense,
  updateIndexPostTypesense,
  deleteFromIndex,
  createSchema,
  deleteSchema
}