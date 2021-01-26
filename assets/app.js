/* global algoliasearch instantsearch */

import TypesenseInstantSearchAdapter from 'https://cdn.skypack.dev/typesense-instantsearch-adapter';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'JcWx2J2nq3vZYMHRY5LYAcHN4lpRTfNJ', // Be sure to use an API key that only allows searches, in production
    nodes: [
      {
        host: 'u7c0pfjloi4wv8zdp-1.a1.typesense.net',
        port: '443',
        protocol: 'https',
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  //  filterBy is managed and overridden by InstantSearch.js. To set it, you want to use one of the filter widgets like refinementList or use the `configure` widget.
  additionalSearchParameters: {
    queryBy: 'plaintext',
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const search = instantsearch({
  searchClient,
  indexName: 'ghost_posts',
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
      <div>
      <img src="{{feature_image}}" align="left" alt="{{name}}" width=100 style="margin-right: 10px;"/>
      <div class="hit-name">
        {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
      </div>
      <div >
        {{ "attribute": "authors" }}
      </div>
      <div class="hit-price">{{published_at}}</div>
    </div>
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();