const yaml = require('js-yaml')
const promisedHandlebars = require('promised-handlebars')
const Q = require('q')
const Handlebars = promisedHandlebars(require('handlebars'), {
  Promise: Q.Promise,
})
const NavigationPlugin = require('@11ty/eleventy-navigation')
const ErrorOverlayPlugin = require('eleventy-plugin-error-overlay')

const env = require('./11ty/env')
const markdown = require('./11ty/utils/markdown')
const helpers = require('./11ty/helpers')
const shortcodes = require('./11ty/shortcodes')
const transforms = require('./11ty/transforms')

module.exports = (config) => {
  // Supports async helpers
  config.setLibrary('hbs', Handlebars)

  // Allow for customizing the built in markdown parser.
  config.setLibrary('md', markdown)

  // Allow eleventy to understand yaml files
  config.addDataExtension('yml', (contents) => yaml.load(contents))

  // Plugins
  config.addPlugin(NavigationPlugin)

  // Shows error name, message, and fancy stacktrace
  config.addPlugin(ErrorOverlayPlugin)

  // Install handlebars helpers
  Object.keys(helpers).forEach((key) => {
    config.addHandlebarsHelper(key, helpers[key])
  })

  // Transforms
  Object.keys(transforms).forEach((key) => {
    config.addTransform(key, transforms[key])
  })

  // Shortcodes
  Object.keys(shortcodes).forEach((key) => {
    config.addShortcode(key, shortcodes[key])
  })

  // Pass-through files
  // Everything inside static is copied verbatim to `_dist/static`
  config.addPassthroughCopy({ 'src/static': './static' })

  // BrowserSync Overrides
  config.setBrowserSyncConfig({
    ...config.browserSyncConfig,
    // @see https://browsersync.io/docs/options
    server: ['_dist'],
    // Reload when manifest file changes
    files: [env.paths.manifest],
    // Speed/clean up build time
    ui: false,
    ghostMode: false,
    open: true,
    startPath: '/',
  })

  return {
    templateFormats: ['hbs', 'md', '11ty.js'],
    htmlTemplateEngine: 'hbs',
    passthroughFileCopy: true,
    dir: { ...env.dir },
  }
}
