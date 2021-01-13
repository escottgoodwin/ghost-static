const title = 'Static Times'
const cdnurl = 'https://cdn.jsdelivr.net/gh/escottgoodwin/slswp/assets/'
const url = "https://www.evansgoodwin.com"
const description = "News about the static world."
const favicon = `${cdnurl}favicon.png`
const twitter = 'https://twitter.com/tryghost'
const facebook = 'https://www.facebook.com/ghost'

function authorPage(primary_author, tags, path, posts){
    const { name, profile_image, email, bio, location, website, facebook, twitter } = primary_author
    const postlist = posts.map(p => postLink(p)).join('')
    const template = `
    <header class="author-header">
        <img class="author-profile-image" src="${profile_image}" alt="Ghost" />
        <h1><a href="/author/ghost/">${name}</a></h1>
            <p class="content">${bio}</p>
        <div class="author-meta">
            <div class="author-location icon fa-map-pin">${location} <span class="bull">&bull;</span></div>
            <div class="author-stats">
               
            </div>
            <a href = "mailto: ${email}" class="icon fa-envelope" title="Email"><span class="label">${email}</span></a>
            <a href="${website}" class="icon fa-globe" title="Website"><span class="label">Website</span></a>
            <a href="${twitter}" class="icon fa-twitter" title="Twitter"><span class="label">Twitter</span></a>
            <a href="${facebook}" class="icon fa-facebook" title="Facebook"><span class="label">Facebook</span></a>
        </div>
    </header>

    <section>

        <section class="posts">
            ${postlist}
        </section>


    </section>
    <footer>
        <nav class="pagination" role="navigation">
            <span class="page-number">Page 1 of 2</span>
            <a class="page next older-posts" href="/author/ghost/page/2/">Older Posts</a>
        </nav>
    </footer>
    `
    return frame(template,tags,path)
}

function postsSection(name, posts, alltags, path){
    const postlist = posts.map(p => postLink(p)).join('')
    const featuredPost1 = featuredPost(posts[0])
    
    const template = `
        ${featuredPost1}
        <section>

            <header class="major">
                <h2>${name}</h2>
            </header>

            <section class="posts">
                ${postlist}
            </section>

        </section>
        <footer>
            <nav class="pagination" role="navigation">
                <span class="page-number">Page 1 of 2</span>
                <a class="page next older-posts" href="/page/2/">Older Posts</a>
            </nav>
        </footer>
    `

    return frame(template, alltags, path)
}

function postLink({ slug, id, title, excerpt, feature_image }){
    const url = `${slug}-${id}.html`
    return `
        <article>
            <a href="${url}" class="image fit"><img src="${feature_image}" alt="Welcome to Ghost" /></a>
            <h3><a href="${url}">${title}</a></h3>
            <p>
                ${excerpt}
            </p>
            <ul class="actions special">
                <li><a href="${url}" class="button">Full Story</a></li>
            </ul>
        </article>
    `
}

const pageLink = ({ slug, name }) => `<li class="nav-home active"><a href="${slug}.html">${name}</a></li>`

const pagesMenu = pages => pages.map(p => pageLink(p)).join('')

function featuredPost(post){
    const { slug, id, title, excerpt, feature_image } = post
    const url = `${slug}-${id}.html`
    return `
    <article id="banner">
        <div class="content">
            <header>
                <h1><a href="${url}">${title}</a></h1>
            </header>
            <p>${excerpt}</p>
            <ul class="actions">
                <li><a href="${url}" class="button big">Learn More</a></li>
            </ul>
        </div>
        <a href="${url}" class="image object">
            <img src="${feature_image}" alt="Editorial Theme for Ghost" />
        </a>
    </article>
    `
}

function articlePage({ 
    html, 
    title, 
    feature_image, 
    pubDate, 
    authorNames,
    excerpt,
    alltags,
    primary_author
}){
    const { name, profile_image, email, bio} = primary_author
    const article =`
    <section>

        <header class="main content">
            <span class="date">${pubDate}</span>
            <h1>
                ${title}
            </h1>
            <p class="content">
                ${excerpt}
            </p>
        </header>

        <div class="image main"><img src="${feature_image}" alt="Welcome to Ghost" /></div>

        <div class="content">
        ${html}
        </div>

        <footer class="post-footer">

            <div class="authors">
                <img class="author-profile-image" src="${profile_image}" alt="Ghost" />
                <section class="author-box-content">
                    <div class="author-box-label">Author</div>
                    <h5 class="author-box-name">${name}</h5>
                </section>
            </div>

        </footer>

    </section>`

    return frame(article,alltags)
}

function frame(content,tags,path){

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
            <link rel="stylesheet" type="text/css" href="${cdnurl}main.css" />
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
                                    <a href="https://editorial.ghost.io" class="logo">${title}</a>
                                <ul class="icons">
                                        <li><a href="https://twitter.com/tryghost" class="icon fa-twitter" title="Twitter"><span class="label">Twitter</span></a></li>
                                        <li><a href="https://www.facebook.com/ghost" class="icon fa-facebook" title="Facebook"><span class="label">Facebook</span></a></li>
                                    <li><a href="https://feedly.com/i/subscription/feed/https://editorial.ghost.io/rss/" class="icon fa-rss" target="_blank" rel="noopener"><span class="label" title="RSS">RSS</span></a></li>
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
                            <li class="nav-home active"><a href="search.html">Search</a></li>     
                        </ul>
                    </nav>

                        <footer id="footer">
                            <p class="copyright">&copy; Editorial for Ghost - All rights reserved<br>
                        </footer>

                    </div>
                </div>

                </div>

                <script type="module" src="${cdnurl}app.js"></script>
                <script src="${cdnurl}jquery.min.js"></script>
                <script src="${cdnurl}browser.min.js"></script>
                <script src="${cdnurl}breakpoints.min.js"></script>
                <script src="${cdnurl}util.js"></script>
                <script src="${cdnurl}main.js"></script>
               </body>
            </html>
    `
    }

function renderSearchPage(tags){

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
        <link rel="stylesheet" type="text/css" href="${cdnurl}main.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@7/themes/algolia-min.css">
        <link rel="stylesheet" href="${cdnurl}index.css">
        <link rel="stylesheet" href="${cdnurl}app.css">
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
        <link rel="alternate" type="application/rss+xml" title="Editorial for Ghost" href="${url}/rss/" />

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
                        <li class="nav-home active"><a href="search.html">Search</a></li>   
                    </ul>
                </nav>

                    <footer id="footer">
                        <p class="copyright">&copy; ${title} - All rights reserved<br>
                   </footer>

                </div>
            </div>

            </div>

            <script type="module" src="${cdnurl}app.js"></script>
            <script src="${cdnurl}jquery.min.js"></script>
            <script src="${cdnurl}browser.min.js"></script>
            <script src="${cdnurl}breakpoints.min.js"></script>
            <script src="${cdnurl}util.js"></script>
            <script src="${cdnurl}main.js"></script>
            <script src="https://cdn.jsdelivr.net/algoliasearch/3.32.0/algoliasearchLite.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.9.0"></script>
           </body>
        </html>
    `
    return content
}

module.exports = { 
    articlePage,
    postsSection,
    renderSearchPage,
    authorPage
}