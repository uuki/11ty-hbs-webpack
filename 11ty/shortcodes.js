const ImageShortcode = require('./utils/image')
const icon = require('./utils/icon')
const webpack = require('./utils/webpack')
const image = new ImageShortcode()

module.exports = {
  /**
   * Allow embedding responsive images
   * {{{image src="image.jpg" alt="Image alt" }}} - Supports multiple srcset separated by commas
   *
   * ## Options
   * media="(max-width: 767px)" // or "(max-width: 767px), (max-width: 1279px)"
   * sizes="100vw" // or "100vw, 100vw"
   * widths=""
   * caption=""
   * className=""
   * lazy="true"
   */
  image: image.run,
  /**
   * Allow embedding svg icon
   * {{{icon "github.svg", "my-class", [24, 24] }}}
   */
  icon,
  /**
   * Allow embedding webpack assets pulled out from `manifest.json`
   * {{{webpack "main.css" }}}
   */
  webpack,
}
