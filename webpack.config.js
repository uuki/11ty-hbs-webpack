const path = require('path')
const Dotenv = require('dotenv-webpack')
const TerserPlugin = require('terser-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintWebpackPlugin = require('stylelint-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default

const __Eleventy = require('./11ty/env')
const ENV = require('./src/data/build')

module.exports = {
  mode: ENV.NODE_ENV,
  performance: { hints: ENV.isDev ? false : 'warning' },
  // Eval does not work for css source maps
  // `All values enable source map generation except eval and false value.`
  // https://github.com/webpack-contrib/css-loader
  devtool: ENV.isDev ? 'cheap-module-source-map' : 'source-map',
  entry: {
    'js/app': path.resolve(__dirname, 'src/assets/js/app.ts'),
    'css/style': path.resolve(__dirname, 'src/assets/styles/app.scss'),
  },
  output: {
    filename: ENV.isDev ? '[name].js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, '_dist/assets'),
    publicPath: '/assets/',
    chunkFilename: 'js/chunk/[name].chunk.[chunkhash:5].js',
  },
  plugins: [
    new WebpackManifestPlugin(),
    new Dotenv({
      path: path.resolve(__dirname, `.env.${ENV.NODE_ENV}`),
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: 'src/assets/img/**/*.{jpg,png,gif,svg,webp}',
              destination: '_dist/assets/img',
            },
          ],
        },
      },
    }),
    ENV.isDev &&
      new StyleLintWebpackPlugin({
        configFile: path.resolve(__dirname, '.stylelintrc.js'),
        files: ['src/assets/styles/**/*.{scss}'],
      }),
    new MiniCssExtractPlugin({
      filename: ENV.isDev ? '[name].css' : '[name].[contenthash].css',
    }),
    !ENV.isDev &&
      new LicenseInfoWebpackPlugin({
        glob: '{LICENSE,license,License}*',
      }),
  ].filter(Boolean),
  ...(!ENV.isDev && {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: true },
          },
        }),
        new CssMinimizerPlugin(),
      ],
    },
  }),
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.ts[x]?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader',
      },
      {
        test: /\.s[c|a]ss$/,
        exclude: /node_modules/,
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
                  require('postcss-custom-media')(),
                  require('postcss-import')(),
                  require('postcss-normalize')(),
                  require('autoprefixer')({ grid: true }),
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
          filename: `img/${ENV.isDev ? '[name][ext]' : '[contenthash][ext]'}`,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `_fonts/${
            ENV.isDev ? '[name][ext]' : '[contenthash][ext]'
          }`,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json', '.yaml', '.yml'],
    alias: {
      '@': path.resolve(__Eleventy.paths.root, 'src'),
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
