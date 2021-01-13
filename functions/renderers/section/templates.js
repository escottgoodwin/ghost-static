const frameTemplate = require('../frame/templates');

function postsSection(name, posts, alltags, path){
    const postlist = posts.length>0 ? posts.map(p => postLink(p)).join('') : `<div></div>`
    const featuredPost1 = posts.length>0 ? featuredPost(posts[0]) : `<div></div>`
    
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
           
        </footer>
    `

    return frameTemplate.frame(template, alltags, path)
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

module.exports = { 
    postsSection,
}