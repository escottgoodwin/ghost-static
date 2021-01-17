const frameTemplate = require('../frame/templates');

function authorTemplate({ 
    name, 
    profile_image, 
    posts, 
    path
 }){
    const postlist = posts.length>0 ? posts.map(p => postLink(p)).join('') : `<div></div>`
   
    const postCount = posts.length === 1 ? `${posts.length} post` : `${posts.length} posts`

    const template = `
        <header class="author-header">
            <img class="author-profile-image" src="${profile_image}" alt="${name}" />
            <h1>
                <a href="${path}">
                    ${name}
                </a>
            </h1>
            <div class="author-meta">
                <div class="author-stats">
                    ${postCount} <span class="bull">&bull;</span>
                </div>
                <a href="https://feedly.com/i/subscription/feed/https://editorial.ghost.io/author/team/rss/" class="icon fa-rss" target="_blank" rel="noopener"><span class="label" title="RSS">RSS</span></a>
            </div>
        </header>

        <section class="posts">
            ${postlist}
        </section>

        <footer>
            
        </footer>
    `

    return frameTemplate.frame(template, path)
}


function sectionTemplate({ 
    name, 
    posts, 
    path
 }){
    const postlist = posts.length>0 ? posts.slice(1).map(p => postLink(p)).join('') : `<div></div>`
    const featuredPost1 = posts.length>0 ? featuredPost(posts[0]) : `<div></div>`
    
    const template = `
        ${featuredPost1}
        <section>

            <header class="major">
                <h2>
                    ${name}
                </h2>
            </header>

            <section class="posts">
                ${postlist}
            </section>

        </section>
        <footer>
            
        </footer>
    `

    return frameTemplate.frame(template, path)
}

function postLink({ slug, id, title, excerpt, feature_image }){
    const url = `${slug}-${id}.html`
    return `
        <article>
            <a href="${url}" class="image fit">
                <img src="${feature_image}" alt="Welcome to Ghost" />
            </a>
            <h3>
                <a href="${url}">
                    ${title}
                </a>
            </h3>
            <p>
                ${excerpt}
            </p>
            <ul class="actions special">
                <li>
                    <a href="${url}" class="button">
                        Full Story
                    </a>
                </li>
            </ul>
        </article>
    `
}

function featuredPost({ slug, id, title, excerpt, feature_image }){
    const url = `${slug}-${id}.html`
    return `
    <article id="banner">
        <div class="content">
            <header>
                <h1>
                    <a href="${url}">
                        ${title}
                    </a>
                </h1>
            </header>
            <p>
                ${excerpt}
            </p>
            <ul class="actions">
                <li>
                    <a href="${url}" class="button big">
                        Learn More
                    </a>
                </li>
            </ul>
        </div>
        <a href="${url}" class="image object">
            <img src="${feature_image}" alt="Editorial Theme for Ghost" />
        </a>
    </article>
    `
}

module.exports = { 
    authorTemplate,
    sectionTemplate,
}