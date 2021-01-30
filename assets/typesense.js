/* global algoliasearch instantsearch */

import TypesenseInstantSearchAdapter from 'https://cdn.skypack.dev/typesense-instantsearch-adapter';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'Wnw62cByEyTMXMNgKCuNXJEmZzKAIcn0', // Be sure to use an API key that only allows searches, in production
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
  instantsearch.widgets.refinementList({
    container: '#author-refinement-list',
    attribute: 'primary_author_facet',
  }),
  instantsearch.widgets.refinementList({
    container: '#section-refinement-list',
    attribute: 'main _tag_facet',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: 
      `<div style="font-size:10px; color:#8F8F8F;">{{ published_at }}</div>
        <a href="{{ path }}.html"
          <h4>
            {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
          </h4>
        </a>
        <p>{{ primary_author }}</p>
      `,
    },
  })
]);

search.start();