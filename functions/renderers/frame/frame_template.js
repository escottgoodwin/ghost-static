const functions = require("firebase-functions");

const siteTitle = functions.config().site.sitetitle;
const gh_cdn_url = functions.config().site.ghcdnurl;
const url = functions.config().site.url;
const fburl = functions.config().site.fburl;
const description = functions.config().site.description;
const favicon = `${gh_cdn_url}/favicon.png`;
const twitter = functions.config().site.twitter;
const facebook = functions.config().site.facebook;

const apiKey = functions.config().site.apikey;
const authDomain = functions.config().site.authdomain;
const databaseURL = functions.config().site.databaseurl;
const projectId = functions.config().site.projectid;
const storageBucket = functions.config().site.storagebucket;
const messagingSenderId = functions.config().site.messagingsenderid;
const appId = functions.config().site.appid;
const measurementId = functions.config().site.measurementid;

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

// links on sidebarfire
const pagesMenu = (pages) => pages.map((p) => pageLink(p)).join("");

// sidebar, title and footer that frames the main content - post or section pages includes links to css and javascript that are hosted on project github assets folder and served through jsdeliver
const frame = (
    content,
    path,
    pageTitle,
) => {
  const menu = pagesMenu(tags);

  return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />

                <title>${pageTitle}-${siteTitle}</title>
                <meta name="HandheldFriendly" content="True" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="shortcut icon" href="${favicon}">
                <link rel="stylesheet" type="text/css" href="${url}assets/css/main.css" />
                
                <meta name="description" content="${description}" />
                <link rel="canonical" href="${url}${path}" />
                <meta name="referrer" content="no-referrer-when-downgrade" />
            
                <meta property="og:site_name" content="${siteTitle}" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="${url}" />
                <meta property="og:description" content="${description}" />
                <meta property="og:url" content="${url}" />
                <meta property="article:publisher" content="${facebook}" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="${siteTitle}" />
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
                        "@id": "${url}"
                    },
                    "description": "${description}"
                }
                </script>
                <meta name="generator" content="Ghost 3.40" />
                <link rel="alternate" type="application/rss+xml" title="${siteTitle}" href="${url}rss/" />
            </head>
            <body class="is-preload home-template">
                <div id="wrapper">
                    <main id="main">
                        <div class="inner">
                            <header id="header">
                                <a href="${url}" class="logo">
                                    ${siteTitle}
                                </a>
                                <ul class="icons">
                                    <li>
                                        <a href="${twitter}" class="icon fa-twitter" title="Twitter">
                                            <span class="label">
                                                Twitter
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="${facebook}" class="icon fa-facebook" title="Facebook">
                                            <span class="label">
                                                Facebook
                                            </span>
                                        </a>
                                    </li>
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
                            <p class="copyright">&copy; ${siteTitle} - All rights reserved<br>
                        </footer>
                    </div>
                </div>
            </div>

            <script src="${url}assets/js/jquery-3.5.1.min.js"></script>
            <script src="${url}assets/js/browser.min.js"></script>
            <script src="${url}assets/js/breakpoints.min.js"></script>
            <script src="${url}assets/js/util.js"></script>
            <script src="${url}assets/js/main.js"></script>
        </body>
    </html>
    `;
};

const framefb = (
    content,
    path,
    pageTitle,
) => {
  const menu = pagesMenu(tags);

  return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />

                <title>${pageTitle}-${siteTitle}</title>
                <meta name="HandheldFriendly" content="True" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="shortcut icon" href="${favicon}">
                <link rel="stylesheet" type="text/css" href="/assets/css/main.css" />

                <meta name="description" content="${description}" />
                <link rel="canonical" href="${fburl}${path}" />
                <meta name="referrer" content="no-referrer-when-downgrade" />
            
                <meta property="og:site_name" content="${siteTitle}" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="${fburl}" />
                <meta property="og:description" content="${description}" />
                <meta property="og:url" content="${fburl}" />
                <meta property="article:publisher" content="${facebook}" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="${siteTitle}" />
                <meta name="twitter:description" content="${description}" />
                <meta name="twitter:url" content="${fburl}" />
                <meta name="twitter:site" content="${twitter}" />
            
                <script type="application/ld+json">
                {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "publisher": {
                        "@type": "Organization",
                        "name": "${description}",
                        "url": "${fburl}",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "${favicon}",
                            "width": 48,
                            "height": 48
                        }
                    },
                    "url": "${fburl}",
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": "${fburl}"
                    },
                    "description": "${description}"
                }
                </script>
                <meta name="generator" content="Ghost 3.40" />
                <link rel="alternate" type="application/rss+xml" title="${siteTitle}" href="${fburl}rss/" />
                <link rel="manifest" href="/manifest.json">
            </head>
            <body class="is-preload home-template">
                <div id="wrapper">
                    <main id="main">
                        <div class="inner">
                            <header id="header">
                                <a href="${fburl}" class="logo">
                                    ${siteTitle}
                                </a>
                                <ul class="icons">
                                    <li>
                                        <a href="${twitter}" class="icon fa-twitter" title="Twitter">
                                            <span class="label">
                                                Twitter
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="${facebook}" class="icon fa-facebook" title="Facebook">
                                            <span class="label">
                                                Facebook
                                            </span>
                                        </a>
                                    </li>
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
                            <p class="copyright">&copy; ${siteTitle} - All rights reserved<br>
                        </footer>
                    </div>
                </div>
            </div>

            <!-- The core Firebase JS SDK is always required and must be listed first -->
            <script src="https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js"></script>
            
            <script src="https://www.gstatic.com/firebasejs/8.2.7/firebase-analytics.js"></script>
            <!-- Add the standard Performance Monitoring library -->
            <script src="https://www.gstatic.com/firebasejs/8.2.7/firebase-performance.js"></script>
            <script>
              // Your web app's Firebase configuration
              // For Firebase JS SDK v7.20.0 and later, measurementId is optional
              var firebaseConfig = {
                apiKey: "${apiKey}",
                authDomain: "${authDomain}",
                databaseURL: "${databaseURL}",
                projectId: "${projectId}",
                storageBucket: "${storageBucket}",
                messagingSenderId: "${messagingSenderId}",
                appId: "${appId}",
                measurementId: "${measurementId}"
              };
              // Initialize Firebase
              firebase.initializeApp(firebaseConfig);
              firebase.analytics();
              var perf = firebase.performance();
            </script>

            <script src="${fburl}assets/js/jquery-3.5.1.min.js"></script>
            <script src="${fburl}assets/js/browser.min.js"></script>
            <script src="${fburl}assets/js/breakpoints.min.js"></script>
            <script src="${fburl}assets/js/util.js"></script>
            <script src="${fburl}assets/js/main.js"></script>
        </body>
    </html>
    `;
};


module.exports = {
  frame,
  framefb,
};
