const {
  frame,
  framefb,
} = require("../frame/frame_template");

// create post
const postTemplate = ({
  html,
  title,
  pubDate,
  excerpt,
  primary_author,
  path,
  imgExtension,
  fullUrl,
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
            <img 
            srcset="${fullUrl}_312${imgExtension} 312w,
                ${fullUrl}_397${imgExtension} 397w,
                ${fullUrl}_427${imgExtension} 427w,
                ${fullUrl}_574${imgExtension} 574w,
                ${fullUrl}_683${imgExtension} 683w,
                ${fullUrl}_873${imgExtension} 873w,
                ${fullUrl}_1173${imgExtension} 1173w,
                ${fullUrl}_1217${imgExtension} 1217w"
            src="${fullUrl}_1173${imgExtension}"
                sizes="(min-width: 1280w) 70vw, 90vw"
                alt="${title}"
            />
        </div>
        <div class="content">
            ${html}
        </div>
        <footer class="post-footer">
            <div class="authors">
                <a class="author-box" href="${slug}.html">
                    <img class="author-profile-image" src="${profile_image}" alt="${name}" />
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

  return {
    postDoc: frame(article, path, title),
    postDocFb: framefb(article, path, title),
  };
};

module.exports = {
  postTemplate,
};
