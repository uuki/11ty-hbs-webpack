const util = require('util')
const colors = require('colors')
const { format, formatISO } = require('date-fns')
const { outdent } = require('outdent')
const handlebarsHelpers = require('handlebars-helpers')()
const markdown = require('./utils/markdown')

module.exports = {
  ...handlebarsHelpers,
  /**
   * Allow embedding markdown in `.hbs` files
   * {{#md}}
   * # Heading
   * {{/md}}
   */
  md: (options) => markdown.render(outdent.string(options.fn(this))),
  /**
   * Allow output existing arguments
   * {{#orPrint a b c}}
   * {{this}}
   * {{/or}}
   */
  orPrint: (...args) => {
    args.pop() // pop handlebars options
    return args.find((x) => !!x)
  },
  /**
   * {{#format format value}}
   * {{this}}
   * {{/format}}
   */
  format: (date, f) => {
    let value

    try {
      date = date instanceof Date ? date : new Date(date)
      value = format(date, f)
    } catch (err) {
      console.error(colors.red(err))
    }
    return value
  },
  formatISO: (date) => {
    let value

    try {
      date = date instanceof Date ? date : new Date(date)
      value = formatISO(date)
    } catch (err) {
      console.error(colors.red(err))
    }
    return value
  },
}
