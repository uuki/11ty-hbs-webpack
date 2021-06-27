const path = require('path')

module.exports = {
  ROOT: process.env.PWD || process.cwd(),
  isFullUrl: (url) => {
    try {
      return !!new URL(url)
    } catch {
      return false
    }
  },
  getExtension(str) {
    return path.extname(str).slice(1).toLowerCase()
  },
  parseArray(str) {
    return str.replace(/\s/g, '').split(',')
  },
  parseArray3d(str, delimiter = '|') {
    return str
      .replace(/\s/g, '')
      .split(delimiter)
      .map((x) => x.split(','))
  },
}
