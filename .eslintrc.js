const path = require('path')

module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      configFile: path.join(__dirname, '.babelrc.js'),
    },
  },
  rules: {
    'no-console': [
      process.env.NODE_ENV === 'development' ? 'warn' : 'error',
      { allow: ['warn', 'error'] },
    ],
  },
}
