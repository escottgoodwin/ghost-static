const title = 'Static Times'
const gh_cdn_url = 'https://cdn.jsdelivr.net/gh/escottgoodwin/ghost-static/assets/'
const url = "https://www.evansgoodwin.com"
const description = "News about the static world."
const favicon = `${gh_cdn_url}favicon.png`
const twitter = 'https://twitter.com/tryghost'
const facebook = 'https://www.facebook.com/ghost'

//site sections - listed on sidebar and has their own page with associated posts
const tags = [
    {
        name:'Front Page',
        slug: 'front-page'
    },
    {
        name:'Business',
        slug: 'business'
    },
    {
        name:'Sports',
        slug: 'sports'
    },
    {
        name:'Search',
        slug: 'search'
    }
]

//links on sidebar
const pageLink = ({ slug, name }) => `<li class="nav-home active"><a href="${slug}.html">${name}</a></li>`

const pagesMenu = pages => pages.map(p => pageLink(p)).join('')

// sidebar, title and footer that frames the main content - post or section pages
// includes links to css and javascript that are hosted on project github assets folder and served through jsdeliver
function frame(content,path){

    const menu = pagesMenu(tags)

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>

            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />

            <title>${title}</title>
            <meta name="HandheldFriendly" content="True" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <link rel="shortcut icon" href="${favicon}">
            <link rel="stylesheet" type="text/css" href="${gh_cdn_url}main.css" />
            <link rel="stylesheet" href="${gh_cdn_url}/font-awesome/css/font-awesome.min.css">


            <meta name="description" content="${description}" />
            <link rel="canonical" href="${url}/${path}" />
            <meta name="referrer" content="no-referrer-when-downgrade" />
            
            <meta property="og:site_name" content="${title}" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="${url}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:url" content="${url}/" />
            <meta property="article:publisher" content="${facebook}" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:url" content="${url}" />
            <meta name="twitter:site" content="${twitter}" />
            
            <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "publisher": {
                    "@type": "Organization",
                    "name": "${description}",
                    "url": "${url}",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "${favicon}",
                        "width": 48,
                        "height": 48
                    }
                },
                "url": "${url}/",
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": "${url}/"
                },
                "description": "${description}"
            }
            </script>

            <meta name="generator" content="Ghost 3.40" />
            <link rel="alternate" type="application/rss+xml" title="Editorial for Ghost" href="${url}/rss/" />

            </head>
            <body class="is-preload home-template">

                <div id="wrapper">
                    <main id="main">
                        <div class="inner">

                            <header id="header">
                                <a href="${url}" class="logo">${title}</a>
                                <ul class="icons">
                                    <li><a href="https://twitter.com/tryghost" class="icon fa-twitter" title="Twitter"><span class="label">Twitter</span></a></li>
                                    <li><a href="https://www.facebook.com/ghost" class="icon fa-facebook" title="Facebook"><span class="label">Facebook</span></a></li>
                                </ul>
                            </header>

                            ${content}

                        </div>
                    </main>

                    <div id="sidebar">
                    <div class="inner">

                    <nav id="menu">
                        <header class="major">
                            <h2>Menu</h2>
                        </header>
                        <ul class="links">
                            ${menu}     
                        </ul>
                    </nav>

                        <footer id="footer">
                            <p class="copyright">&copy; ${title} - All rights reserved<br>
                        </footer>

                    </div>
                </div>

                </div>

                <script src="https://cdn.jsdelivr.net/algoliasearch/3.32.0/algoliasearchLite.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.9.0"></script>
                <script type="module" src="${gh_cdn_url}app.js"></script>
                <script src="${gh_cdn_url}jquery.min.js"></script>
                <script src="${gh_cdn_url}browser.min.js"></script>
                <script src="${gh_cdn_url}breakpoints.min.js"></script>
                <script src="${gh_cdn_url}util.js"></script>
                <script src="${gh_cdn_url}main.js"></script>
               </body>
            </html>
    `
    }

//renders search page that provides real time fulltext search through typsense
//uses algolia's instantsearch library for the ui  
//https://github.com/algolia/instantsearch.js/
function renderSearchPage(){

    const menu = pagesMenu(tags)

    const content = `

    <!DOCTYPE html>
    <html lang="en">
    <head>

        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />

        <title>${title}</title>
        <meta name="HandheldFriendly" content="True" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="shortcut icon" href="${favicon}">
        <link rel="stylesheet" type="text/css" href="${gh_cdn_url}main.css" />
        <link rel="stylesheet" href="${gh_cdn_url}/font-awesome/css/font-awesome.min.css">s
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@7/themes/algolia-min.css">
        <link rel="stylesheet" href="${gh_cdn_url}index.css">
        <link rel="stylesheet" href="${gh_cdn_url}app.css">
        <meta name="description" content="${description}" />
        <link rel="canonical" href="${url}/search.html" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        
        <meta property="og:site_name" content="${title}" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${url}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:url" content="${url}/" />
        <meta property="article:publisher" content="${facebook}" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:url" content="${url}" />
        <meta name="twitter:site" content="${twitter}" />
        
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "publisher": {
                "@type": "Organization",
                "name": "${description}",
                "url": "${url}",
                "logo": {
                    "@type": "ImageObject",
                    "url": "${favicon}",
                    "width": 48,
                    "height": 48
                }
            },
            "url": "${url}/",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "${url}/"
            },
            "description": "${description}"
        }
        </script>

        <meta name="generator" content="Ghost 3.40" />
        <link rel="alternate" type="application/rss+xml" title="${title}" href="${url}/rss/" />

        </head>
        <body class="is-preload home-template">

            <div id="wrapper">
                <main id="main">
                    <div class="inner">

                        <header id="header">
                            <a href="${url}" class="logo">${title}</a>
                            <ul class="icons">
                                    <li><a href="${twitter}" class="icon fa-twitter" title="Twitter"><span class="label">Twitter</span></a></li>
                                    <li><a href="${facebook}" class="icon fa-facebook" title="Facebook"><span class="label">Facebook</span></a></li>
                                <li><a href="https://feedly.com/i/subscription/feed/${url}/rss/" class="icon fa-rss" target="_blank" rel="noopener"><span class="label" title="RSS">RSS</span></a></li>
                            </ul>
                        </header>

                        <div class="container">
                            <div class="search-panel">
                            <div class="search-panel__results">
                                <div id="searchbox"></div>
                                <div id="hits"></div>
                            </div>
                            </div>

                            <div id="pagination"></div>
                        </div>
                        

                    </div>
                </main>

                <div id="sidebar">
                <div class="inner">

                <nav id="menu">
                    <header class="major">
                        <h2>Menu</h2>
                    </header>
                    <ul class="links">
                        ${menu}        
                    </ul>
                </nav>

                    <footer id="footer">
                        <p class="copyright">&copy; ${title} - All rights reserved<br>
                   </footer>

                </div>
            </div>

            </div>

            <script type="module" src="${gh_cdn_url}app.js"></script>
            <script src="${gh_cdn_url}jquery.min.js"></script>
            <script src="${gh_cdn_url}browser.min.js"></script>
            <script src="${gh_cdn_url}breakpoints.min.js"></script>
            <script src="${gh_cdn_url}util.js"></script>
            <script src="${gh_cdn_url}main.js"></script>
            <script src="https://cdn.jsdelivr.net/algoliasearch/3.32.0/algoliasearchLite.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.9.0"></script>
           </body>
        </html>
    `
    return content
}

module.exports = { 
    frame,
    renderSearchPage
}