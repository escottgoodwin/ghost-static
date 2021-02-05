const searchClient = algoliasearch('PROJECT ID', 'SEACRCH ONLY API KEY');

const search = instantsearch({
  indexName: 'ghost_posts',
  searchClient,
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
      attribute: 'mainTag',
    }),
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: 
        `<div style="font-size:10px; color:#8F8F8F;">{{ pubDate }}</div>
          <a href="{{ path }}.html"
            <h4>
              {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
            </h4>
          </a>
          <p>{{ primary_author_facet }}</p>
        `,
      },
    })
  ]);

search.start();
