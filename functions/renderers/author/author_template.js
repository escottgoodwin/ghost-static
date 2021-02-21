const {
  frame,
  framefb,
} = require("../frame/frame_template");

const {postLink} = require("../section/section_template");

// generate author
const authorTemplate = ({
  name,
  profile_image,
  posts,
  path,
}) => {
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
    authorDoc: frame(template, path, name),
    authorDocFb: framefb(template, path, name),
  };
};

module.exports = {
  authorTemplate,
};
