const path = require('path')
const { outdent } = require('outdent')
const EleventyImage = require('@11ty/eleventy-img')
const markdown = require('./markdown')
const {
  isFullUrl,
  getExtension,
  parseArray,
  parseArray3d,
} = require('./index')
const env = require('../env')

class Image {
  constructor(config = {}) {
    const defaultConfig = {
      base: null, // Keep the structure based on this directory * wip
      image: {
        urlPath: '/assets/img/',
        outputDir: path.join(env.dir.output, 'assets/img'),
        widths: config.defaultImagesWidths || [null],
        ...(config.defaultImagesSizes
          ? { sizes: config.defaultImagesSizes }
          : {}),
      },
    }

    this.config = { ...defaultConfig, ...config }
    this._bind()
  }

  _bind() {
    this.run = this.run.bind(this)
  }

  /**
   * Image optimization
   */
  _generate(src, options = {}) {
    const fullSrc = isFullUrl(src) ? src : `./src/assets/img/${src}`
    const ext = getExtension(src)
    const resMatched = path.basename(src, `.${ext}`).match(/@(\d{1}x)/i) || []
    const resRatio = resMatched[1] || ''
    const config = { ...this.config.image, ...options }

    config.formats = ext === 'webp' ? ['webp', 'jpeg'] : ['webp', ext]

    try {
      EleventyImage(fullSrc, config)
    } catch (err) {
      console.error(
        `\n--------------------------\n\x1b[31mERROR\x1b[0m [shortcodes/image] ${err}:\n> ${src}\n--------------------------`
      )
      return false
    }

    // get metadata
    const metadata = EleventyImage.statsSync(fullSrc, config)

    // fallback image
    const fallback = JSON.parse(
      JSON.stringify(metadata[ext.replace('jpg', 'jpeg')].reverse())
    )[0]

    // add suffix
    Object.keys(metadata).forEach((ext) => {
      metadata[ext] = metadata[ext].map((data) => {
        const suffix = resRatio ? ` ${resRatio}` : ` ${data.width}w`
        data.url = [`${data.url}${suffix}`]
        return data
      })
    })

    return { metadata, fallback, resRatio }
  }

  /**
   * Generate HTML
   */
  _generateHTML(metadata, options = {}) {
    if (!metadata.length) {
      return ''
    }

    const normalizedData = this._mergeSource(metadata)
    const fallback = normalizedData.fallback
    const { alt, lazy, caption, className } = options
    const media = options.media ? parseArray3d(options.media) : [[]]
    const sizes = options.sizes ? parseArray3d(options.sizes) : [[]]

    const source = outdent({ newline: '' })`
      ${normalizedData.metadata.webp
        .map((image, i) =>
          image.url
            .map(
              (url, j) =>
                `<source type="image/${image.format}" srcset="${
                  Array.isArray(url) ? url.join(', ') : url
                }" media="${media[i] ? media[i][j] || '' : ''}" sizes="${
                  sizes[i] ? sizes[i][j] || '' : ''
                }">`
            )
            .join('')
        )
        .join('')}
    `

    const picture = outdent({ newline: '' })`
    <picture${className && !caption ? ` class="${className}"` : ''}>
      ${source}
      <img
        src="${fallback.url}"
        loading="${lazy ? 'lazy' : 'eager'}"
        width="${fallback.width}"
        height="${fallback.height}" alt="${alt}">
    </picture>`

    return caption
      ? outdent({ newline: '' })`
      <figure${className ? ` class="${className}"` : ''}>
        ${picture}
        <figcaption>${markdown.renderInline(
          typeof caption === 'string' ? caption : ''
        )}</figcaption>
      </figure>`
      : picture
  }

  /**
   * Normalize metadata
   */
  _mergeSource(metadata) {
    const meta = metadata.reduce((acc, data) => {
      if (!Object.keys(acc).length) {
        acc = { ...data }
        return acc
      }

      Object.keys(data.metadata).forEach((ext) => {
        // webp[] and any[]
        const imgs = data.metadata[ext]

        acc.metadata[ext] = acc.metadata[ext].map((img, i) => {
          const otherImage = imgs[i] || {}
          img.url = img.url.concat(otherImage.url)
          return img
        })
      })
      return acc
    }, {})

    // If the image has a resolution specified, the previous images are grouped.
    Object.keys(meta.metadata).forEach((ext) => {
      let lastGroupedIndex = 0

      meta.metadata[ext] = meta.metadata[ext].map((data) => {
        data.url = data.url.reduce((acc, cur) => {
          if (/\s\d{1}x$/.test(cur)) {
            acc.splice(
              lastGroupedIndex,
              acc.length,
              acc.slice(lastGroupedIndex).concat(cur)
            )
            lastGroupedIndex = acc.length
          } else {
            acc.push(cur)
          }
          return acc
        }, [])
        return data
      })
    })

    return meta
  }

  run(context) {
    const {
      src = '',
      alt = '',
      media,
      sizes,
      widths,
      caption,
      className,
      lazy = true,
    } = context.hash || {}

    const options = {
      widths: widths ? parseArray(widths) : this.config.image.widths,
    }

    const metadata = parseArray(src)
      .map((s) => this._generate(s, options))
      .filter(Boolean)

    const html = this._generateHTML(metadata, {
      alt,
      media,
      sizes,
      caption,
      className,
      lazy,
    })

    return html
  }
}

module.exports = Image
