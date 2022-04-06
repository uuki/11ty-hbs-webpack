module.exports = {
  plugins: ['stylelint-scss'],
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss'],
  ignoreFiles: ['**/node_modules/**'],
  rules: {
    indentation: 2,
    'declaration-block-trailing-semicolon': 'always',
    'scss/selector-no-union-class-name': true,
  },
}
