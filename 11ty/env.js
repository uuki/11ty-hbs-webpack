const path = require('path')
const { ROOT } = require('./utils')

module.exports = {
  paths: {
    root: ROOT,
    manifest: path.resolve(ROOT, '_dist/assets/manifest.json'),
  },
  // config for .eleventy.js
  dir: {
    input: 'src/pages',
    output: '_dist/',
    // ⚠️ These values are both relative to your "dir.input" directory.
    includes: '../includes',
    layouts: '../layouts',
    data: '../data',
  },
}
