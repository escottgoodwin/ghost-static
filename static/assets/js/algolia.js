const searchClient = algoliasearch('RDHTAZM1DM', '91a45d40f008b8913962712992a694a5');
const hits = document.querySelector('#hits');
hits.style.display = 'none';

const input = document.querySelector('#searchBox');
input.addEventListener('input', function(e) {
    hits.style.display = e.currentTarget.value === '' ? 'none' : '';
});

const search = instantsearch({
    indexName: 'ghost_posts',
    searchClient,
});

search.addWidget({
init: function(opts) {
    const helper = opts.helper;
    const input = document.querySelector('#searchBox');
    input.addEventListener('input', function(e) {

    helper.setQuery(e.currentTarget.value) // update the parameters
            .search(); // launch the query
    });
}
});

instantsearch.widgets.pagination({
    container: document.querySelector('#pagination'),
});

search.addWidget({
render: function(opts) {
    const results = opts.results;
    // read the hits from the results and transform them into HTML.
    hits.innerHTML = results.hits.map(function(h) {
    return '<li><div style="font-size:10px; color:#8F8F8F;">' + h.pubDate + ' <b> ' + h.mainTag +' </b> </div> ' + '<a href=" ' + h.objectID.html + '"> <div style="margin-bottom:10px"> ' + h._highlightResult.title.value + ' ' + h.primary_author_facet + '</div>  </a></li>'
}).join('');
}
});

search.addWidgets([
    instantsearch.widgets.refinementList({
    container: '#author-refinement-list',
    attribute: 'primary_author_facet',
    }),
    instantsearch.widgets.refinementList({
    container: '#section-refinement-list',
    attribute: 'mainTag',
    }),
])
search.start();