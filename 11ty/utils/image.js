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
        urlPath: '/assets/images/',
        outputDir: path.join(env.dir.output, 'assets/images'),
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
    const fullSrc = isFullUrl(src) ? src : `./src/assets/images/${src}`
    const ext = getExtension(src)
    const resMatched = path.basename(src, `.${ext}`).match(/@(\d{1}x)/i) || []
    const config = { ...this.config.image, ...options }

    config.formats = ext === 'webp' ? ['webp', 'jpeg'] : ['webp', ext]

    try {
      EleventyImage(fullSrc, config)
    } catch (err) {
      console.error('\n\x1b[31mERROR\x1b[0m creating image:')
      console.error(`> (${src})`)
      console.error(`  ${err}\n`)
      return ''
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
        const suffix = resMatched[1] ? ` ${resMatched[1]}` : ` ${data.width}w`
        data.url = [`${data.url}${suffix}`]
        return data
      })
    })

    return { metadata, fallback }
  }

  /**
   * Generate HTML
   */
  _generateHTML(metadata, options = {}) {
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
                `<source type="image/${image.format}" srcset="${url}" media="${
                  media[i] ? media[i][j] || '' : ''
                }" sizes="${sizes[i] ? sizes[i][j] || '' : ''}">`
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
    return metadata.reduce((acc, data) => {
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

    const metadata = parseArray(src).map((s) => this._generate(s, options))

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
