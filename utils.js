import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const replaceTemplateVariable = (template, replacement) => {
  let replacedTemplate = template

  if (Array.isArray(replacement)) {
    for (const { variable, value } of replacement) {
      replacedTemplate = replacedTemplate.replace(new RegExp(`{${variable}}`), value)
    }
  } else {
    const { variable, value } = replacement

    replacedTemplate = template.replace(new RegExp(`{${variable}}`), value)
  }

  return replacedTemplate
}

export const replaceMdWithHtml = (post) => post.replace('.md', '.html')

export const constructPath = (...paths) => path.join(__dirname, ...paths)

export const constructPostPath = (post) => `${post.toLowerCase().split(' ').join('-')}.html`

export const createHead = ({ title, description, post }) =>
  `
    <title>neosiae — ${title}</title>
    <meta name="description"        content="${description}">
    <meta property="og:url"         content="https://neosiae.com/${replaceMdWithHtml(post)}" />
    <meta property="og:type"        content="article" />
    <meta property="og:title"       content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image"       content="cover.jpg" />
    <meta name="twitter:card"       content="summary_large_image" />
    <meta name="twitter:image"      content="cover.jpg" />
  `

export const createPostHeader = ({ title, date }) =>
  `
    <header>
      <h1>${title}</h1>
      <span class="date">${date}</span>
    </header>
  `

export const formatDate = (date) => date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export const mapPostsToHTML = (posts) =>
  posts.map((post) =>
    `
      <div class="post">
        <a href="${constructPostPath(post.title)}">
          <h1>${post.title}</h1>
        </a>
        <span class="date">${formatDate(post.date)}</span>
      </div>
    `
  ).join('\n')

export const sortPosts = (posts) => posts.sort((a, b) => b.date - a.date)
