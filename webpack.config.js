const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const PostCSSPresetEnv = require('postcss-preset-env')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintWebpackPlugin = require('stylelint-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default

const ENV = require('./11ty/env')
const BUILD = require('./src/data/build')

module.exports = {
  mode: BUILD.env,
  performance: { hints: BUILD.isDev ? false : 'warning' },
  // Eval does not work for css source maps
  // `All values enable source map generation except eval and false value.`
  // https://github.com/webpack-contrib/css-loader
  devtool: BUILD.isDev ? 'cheap-module-source-map' : 'source-map',
  entry: [
    path.resolve(__dirname, 'src/assets/scripts/app.js'),
    path.resolve(__dirname, 'src/assets/styles/app.scss'),
  ],
  output: {
    filename: BUILD.isDev ? '[name].js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, '_site/assets'),
    publicPath: '/assets/',
  },
  plugins: [
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: BUILD.isDev ? '[name].css' : '[name].[contenthash].css',
    }),
    !BUILD.isDev &&
      new LicenseInfoWebpackPlugin({
        glob: '{LICENSE,license,License}*',
      }),
    BUILD.isDev &&
      new StyleLintWebpackPlugin({
        configFile: path.resolve(__dirname, '.stylelintrc.js'),
        files: ['src/**/*.scss'],
      }),
  ].filter(Boolean),
  ...(!BUILD.isDev && {
    optimization: {
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
  }),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.s[c|a]ss$/,
        enforce: 'pre',
        loader: 'import-glob-loader',
      },
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  PostCSSPresetEnv({
                    autoprefixer: {
                      grid: true,
                    },
                  }),
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: `images/${
            BUILD.isDev ? '[name][ext]' : '[contenthash][ext]'
          }`,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `_fonts/${
            BUILD.isDev ? '[name][ext]' : '[contenthash][ext]'
          }`,
        },
      },
    ],
  },
  resolve: {
    alias: {
      // Helpful alias for importing src
      '~': path.resolve(ENV.paths.root, 'src'),
    },
  },
  stats: {
    assets: false,
    children: false,
    chunks: false,
    hash: false,
    modules: false,
    publicPath: false,
    timings: false,
    version: false,
    warnings: true,
    colors: {
      green: '\u001b[32m',
    },
  },
}
