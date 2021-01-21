const frametempate = require("../frame/templates");

// create post
const postTemplate = ({
  html,
  title,
  feature_image,
  pubDate,
  excerpt,
  alltags,
  primary_author,
  path,
}) => {
  const {
    name,
    slug,
    profile_image,
  } = primary_author;

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

        <div class="image main">
            <img src="${feature_image}" alt="${title}" />
        </div>

        <div class="content">
            ${html}
        </div>

        <footer class="post-footer">

            <div class="authors">
                <a class="author-box" href="${slug}.html">
                    <img class="author-profile-image" src="${profile_image}" alt="Ghost" />
                    <section class="author-box-content">
                        <div class="author-box-label">
                            Author
                        </div>
                        <h5 class="author-box-name">
                            ${name}
                        </h5>
                    </section>
                </a>
            </div>

        </footer>

    </section>`;

  return frametempate.frame(article, alltags, path);
};

module.exports = {
  postTemplate,
};
