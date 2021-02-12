const frametempate = require("../frame/templates");

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

  // breakpoints= 360px, 480px, 736px, 980px, 1280px  1680px,

  // 1280 w and above, image is 70 viewport width, below 1280 w image is 80 vw

  // main content, date, content, image main, post footer, authors, author-box,
  // post-footer, author-profile-image, author-box-content, author-box-name,
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
                srcset="${fullUrl}-360-static2021${imgExtension} 312w,
                        ${fullUrl}-480-static2021${imgExtension} 427w,
                        ${fullUrl}-736-static2021${imgExtension} 683w,
                        ${fullUrl}-980-static2021${imgExtension} 873w,
                        ${fullUrl}-1280-static2021${imgExtension} 1173w,
                        ${fullUrl}-1680-static2021${imgExtension} 1217w"
                src="${fullUrl}-1280-static2021${imgExtension}"
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

  return frametempate.frame(article, path, title);
};

module.exports = {
  postTemplate,
};
