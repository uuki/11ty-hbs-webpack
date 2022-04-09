const { outdent } = require('outdent')
const ICON_DEFAULT_SIZE = 16

module.exports = (name, { className = null, size = ICON_DEFAULT_SIZE }) => {
  if (!Array.isArray(size)) size = [size]

  const classes = [
    'icon',
    `icon--${name}`,
    Boolean(className) && className,
  ].filter(Boolean)

  return outdent({ newline: '' })`
    <svg class="${classes.join(' ')}" role="img" aria-hidden="true" width="${
    size[0]
  }" height="${size[1] || size[0]}">
      <use xlink:href="/assets/img/sprite.svg#${name}"></use>
    </svg>`
}
