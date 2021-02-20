const frameTemplate = require("../frame/templates");

const baseurl = "https://storage.googleapis.com/ghost-public-media/";

// generate author
const authorTemplate = ({
  name,
  profile_image,
  posts,
  path,
}) => {
  const pageStyle = "section";

  const postlist = posts.length>0 ? posts.map((p) => postLink(p)).join("") : "<div></div>";

  const postCount = posts.length === 1 ? `${posts.length} post` : `${posts.length} posts`;

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
                <a href="https://feedly.com/i/subscription/feed/https://editorial.ghost.io/author/team/rss/" class="icon fa-rss" target="_blank" rel="noopener">
                    <span class="label" title="RSS">
                        RSS
                    </span>
                </a>
            </div>
        </header>
        <section class="posts">
            ${postlist}
        </section>
        <footer>
        </footer>
    `;

  return {
    authorDoc: frameTemplate.frame(template, path, name, pageStyle),
    authorDocFb: frameTemplate.framefb(template, path, name, pageStyle),
  };
};

// generate section
const sectionTemplate = ({
  name,
  posts,
  path,
}) => {
  const pageStyle = "section";

  const postlist = posts.length>0 ? posts.slice(1).map((p) => postLink(p)).join("") : "<div></div>";

  const featuredPost1 = posts.length>0 ? featuredPost(posts[0]) : "<div></div>";

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
    `;

  return {
    sectionDoc: frameTemplate.frame(template, path, name, pageStyle),
    sectionDocFb: frameTemplate.framefb(template, path, name, pageStyle),
  };
};

// generate link
const postLink = ({
  id,
  title,
  excerpt,
  feature_image,
}) => {
  const url = `${id}.html`;

  const rootImageUrl = feature_image ? feature_image.slice(0, feature_image.lastIndexOf(".")).slice(feature_image.lastIndexOf("/")+1) : "";

  // get the extension for the file - from 2021/2/1/image-file.jpg => .jpg
  const imgExtension = feature_image ? feature_image.slice(feature_image.lastIndexOf(".")) : "";

  // get full public image root (wihtout) extension - https://storage.googleapis.com/ghost-public-media/image-file
  const fullUrl = baseurl + rootImageUrl;

  return `
        <article>
            <a href="${url}" class="image fit">
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
                sizes="(min-width: 1680px) 33vw, 
                       (min-width: 736px) 40vw, 
                        90vw"
                alt="${title}"
            />
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
    `;
};

// generate post
const featuredPost = ({
  id,
  title,
  excerpt,
  feature_image,
}) => {
  const url = `${id}.html`;

  const rootImageUrl = feature_image ? feature_image.slice(0, feature_image.lastIndexOf(".")).slice(feature_image.lastIndexOf("/")+1) : "";

  // get the extension for the file - from 2021/2/1/image-file.jpg => .jpg
  const imgExtension = feature_image ? feature_image.slice(feature_image.lastIndexOf(".")) : "";

  // get full public image root (wihtout) extension - https://storage.googleapis.com/ghost-public-media/image-file
  const fullUrl = baseurl + rootImageUrl;

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
            <img 
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
            sizes="(min-width: 620px) 45vw, 
                    90vw"
            alt="${title}"
        />
        </a>
    </article>
    `;
};

module.exports = {
  authorTemplate,
  sectionTemplate,
};
