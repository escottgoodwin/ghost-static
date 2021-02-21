const {
  imageExt,
  resizedImageUrl,
} = require("../../util");

const {
  frame,
  framefb,
} = require("../frame/frame_template");

// generate section
const sectionTemplate = ({
  name,
  posts,
  path,
}) => {
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
    sectionDoc: frame(template, path, name),
    sectionDocFb: framefb(template, path, name),
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

  // get full public image root (wihtout) extension - https://storage.googleapis.com/ghost-public-media/image-file
  const fullUrl = resizedImageUrl(feature_image);
  // get the extension for the file - from 2021/2/1/image-file.jpg => .jpg
  const imgExtension = imageExt(feature_image);

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

  // get full public image root (wihtout) extension - https://storage.googleapis.com/ghost-public-media/image-file
  const fullUrl = resizedImageUrl(feature_image);
  // get the extension for the file - from 2021/2/1/image-file.jpg => .jpg
  const imgExtension = imageExt(feature_image);

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
  sectionTemplate,
  postLink,
};
