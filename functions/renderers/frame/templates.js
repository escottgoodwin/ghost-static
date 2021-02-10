const title = "Static Times";
const gh_cdn_url = "https://cdn.jsdelivr.net/gh/escottgoodwin/ghost-static/assets";
const url = "https://www.evansgoodwin.com";
const description = "News about the static world.";
const favicon = `${gh_cdn_url}favicon.png`;
const twitter = "https://twitter.com/tryghost";
const facebook = "https://www.facebook.com/ghost";

// site sections - listed on sidebar and has their own page with associated posts
const tags = [
  {
    name: "Front Page",
    slug: "front-page",
  },
  {
    name: "Business",
    slug: "business",
  },
  {
    name: "Sports",
    slug: "sports",
  },
  {
    name: "Search",
    slug: "search",
  },
];

// links on sidebar
const pageLink = ({slug, name}) => `<li class="nav-home active"><a href="${slug}.html">${name}</a></li>`;

// links on sidebar
const pagesMenu = (pages) => pages.map((p) => pageLink(p)).join("");

// sidebar, title and footer that frames the main content - post or section pages includes links to css and javascript that are hosted on project github assets folder and served through jsdeliver
const frame = (content, path) => {
  const menu = pagesMenu(tags);

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
            <link rel="stylesheet" type="text/css" href="${gh_cdn_url}/main.css" />
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
            <script src="/__/firebase/8.2.5/firebase-analytics.js"></script>

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

                <script src="${gh_cdn_url}/jquery.min.js"></script>
                <script src="${gh_cdn_url}/browser.min.js"></script>
                <script src="${gh_cdn_url}/breakpoints.min.js"></script>
                <script src="${gh_cdn_url}/util.js"></script>
                <script src="${gh_cdn_url}/main.js"></script>
               </body>
            </html>
    `;
};

module.exports = {
  frame,
};
