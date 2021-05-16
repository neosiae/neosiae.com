import fs from 'fs'
import frontMatter from 'front-matter'
import Prism from 'prismjs'
import marked from 'marked'
import * as utils from './utils.js'

const ENCODING = {
  encoding: 'utf-8'
}

const buildIndex = () => {
  const template = fs.readFileSync(utils.constructPath('templates', 'index.html'), ENCODING)
  const postsDir = fs.readdirSync(utils.constructPath('posts'))

  const posts = postsDir.map(post => {
    const file = fs.readFileSync(utils.constructPath('posts', post), ENCODING)
    const { attributes: { date, title } } = frontMatter(file)

    return {
      date,
      title,
    }
  })

  const sortedPosts = utils.sortPosts(posts)
  const index = utils.replaceTemplateVariable(template, {
    variable: 'posts',
    value: utils.mapPostsToHTML(sortedPosts)
  })

  fs.writeFileSync(utils.constructPath('build', 'index.html'), index)
}

const buildPosts = () => {
  const template = fs.readFileSync(utils.constructPath('templates', 'post.html'), ENCODING)
  const postsDir = fs.readdirSync(utils.constructPath('posts'))

  const posts = postsDir.map(post => {
    marked.setOptions({
      highlight: (code, lang) => {
        return Prism.highlight(code, Prism.languages[lang], lang)
      },
    })

    const file = fs.readFileSync(utils.constructPath('posts', post), ENCODING)
    const { attributes: { date, description, title }, body } = frontMatter(file)
    const headData = {
      title,
      description,
      post,
    }
    const head = utils.createHead(headData)
    const postHeader = utils.createPostHeader({
      title,
      date: utils.formatDate(date),
    })
    const content = marked(body)
    const postHtml = utils.replaceTemplateVariable(template, [
      {
        variable: 'head',
        value: head,
      },
      {
        variable: 'header',
        value: postHeader,
      },
      {
        variable: 'content',
        value: content,
      },
    ])
    const postPath = utils.constructPostPath(title)

    return {
      postHtml,
      postPath
    }
  })

  posts.forEach(post => {
    fs.writeFileSync(utils.constructPath('build', post.postPath), post.postHtml)
  })
}

const copyStyles = () => {
  const stylesDir = fs.readdirSync(utils.constructPath('styles'))

  stylesDir.forEach((style) => {
    fs.copyFileSync(utils.constructPath('styles', style), utils.constructPath('build', style))
  })
}

const copyImages = () => {
  const imagesDir = fs.readdirSync(utils.constructPath('imgs'))

  imagesDir.forEach((image) => {
    fs.copyFileSync(utils.constructPath('imgs', image), utils.constructPath('build', image))
  })
}

const recreateBuildDir = () => {
  const buildDir = utils.constructPath('build')

  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true })
  }

  fs.mkdirSync(buildDir)
}

(() => {
  recreateBuildDir()
  buildIndex()
  buildPosts()
  copyStyles()
  copyImages()
})()





