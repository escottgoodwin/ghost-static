const frametempate = require('../frame/templates');

function postTemplate({ 
    html, 
    title, 
    feature_image, 
    pubDate, 
    excerpt,
    alltags,
    primary_author,
    path
}){
    
    const name = primary_author.name
    const profile_image = primary_author.profile_image


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
                <a class="author-box" href="/author/ghost/">
                    <img class="author-profile-image" src="${profile_image}" alt="Ghost" />
                    <section class="author-box-content">
                        <div class="author-box-label">Author</div>
                        <h5 class="author-box-name">${name}</h5>
                    </section>
                </a>
            </div>

        </footer>

    </section>`

    return frametempate.frame(article,alltags,path)
}

module.exports = { 
    postTemplate,
}