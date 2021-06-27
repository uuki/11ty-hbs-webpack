const fs = require('fs')
const env = require('../env')

module.exports = async (name) =>
  new Promise((resolve) => {
    fs.readFile(env.paths.manifest, { encoding: 'utf8' }, (err, data) => {
      let manifest
      if (!err) {
        data = JSON.parse(data)
        // NOTE: Solved the problem that time stamp is attached to the key only for webfont here (should be config with the manifest plugin)
        manifest = Object.keys(data).reduce((acc, cur) => {
          const key = cur.replace(/\?t=(.*)$/, '')
          acc[key] = data[cur]
          return acc
        }, {})
      }
      resolve(err ? `/assets/${name}` : manifest[name])
    })
  })
