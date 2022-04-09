# 11ty-hbs-webpack 🎈

eleventy boilerplate based on [clenemt/eleventy-webpack](https://github.com/clenemt/eleventy-webpack).

[![Netlify Status](https://api.netlify.com/api/v1/badges/a1047a32-615e-4e7d-9af8-13d7d9cb73ae/deploy-status)](https://app.netlify.com/sites/xenodochial-morse-1c8f1c/deploys)

[demo](https://xenodochial-morse-1c8f1c.netlify.app/)

## Features

- [eleventy-webpack#features](https://github.com/clenemt/eleventy-webpack/tree/2b0242d3abc63c7135bcad11b9fce73e7ff03a00#features)

And the main changes are as follows

- Use handlebars for template engine
- Modified image shortcode
- Added icon font generation from svg plugin
- Added linter
- Structure modified

## Usage

- Node.js >= 14.17.0

First install the dependencies:

```sh
yarn install
```

Then you can:

| Command               | Description                                   |
| --------------------- | --------------------------------------------- |
| **`yarn dev`** | Run your website on http://localhost:8080 |
| **`yarn build`** | Build your production website inside `/_dist` |
| **`yarn format`**  | Run prettier on all filles except `/_dist` |
| **`yarn analyze`** | Output info on your bundle size |
| **`yarn lint:js`** | Run eslint |
| **`yarn lint:style`** | Run stylelint |

Make sure you use the correct node.js version:

```sh
# with bash nvm
nvm use `cat .nvmrc`
# with windows nvm
nvm use $(cat .nvmrc)
# or just install the version specified inside `.nvmrc`
```

## Webpack

A very simple `webpack.config.js` is included. Feel free to change it.

## Shortcodes

All shortcodes can be used inside `.hbs` files.

- [Handlebars Built-in Helpers](https://handlebarsjs.com/guide/builtin-helpers.html)
  - if
  - unless
  - each
  - with
  - lookup
  - log
- [handlebars-helpers](https://github.com/helpers/handlebars-helpers#helpers)

And the following custom helpers.

<details>
<summary><strong><code>icon</code></strong></summary>
<br>

Any SVG added to `src/assets/icons` is bundled into a symbol sprite file and made available through this shortcode.

```html
<!-- Assuming `src/assets/icons/github.svg` exist -->
{{{ icon "github" }}} Github icon
<!-- Will be rendered as -->
<svg class="icon icon--github" role="img" aria-hidden="true">
  <use xlink:href="/assets/img/sprite.svg#github"></use>
</svg>
```
___
</details>

<details>
<summary><strong><code>image</code></strong></summary>
<br>

Creates a WebP version of the image and the corresponding optimized JPEG / PNG. Images will be created in multiple sizes. See `11ty/shortcodes.js` for default values.

```html
<!-- Assuming `src/assets/img/image.jpeg` of width 100px exist -->
{{{image src="eleventy_logo.png" alt="" }}}
<!-- Will be rendered as -->
<picture>
  <source type="image/webp" srcset="/assets/img/555c1f01-100.webp 100w" media="" sizes="">
  <img src="/assets/img/555c1f01-100.png" loading="lazy" width="100" height="182" alt="">
</picture>

<!-- Additional options -->

<!-- If a title is passed the shortcode will output a <figure> with <figcaption> -->
{{{image src="eleventy_logo.png" alt="" caption="Image title" }}}
<!-- Will be rendered as -->
<figure>
  <picture>
    <source type="image/webp" srcset="/assets/img/555c1f01-100.webp 100w" media="" sizes="">
    <img src="/assets/img/555c1f01-100.png" loading="lazy" width="100" height="182" alt="">
  </picture>
  <figcaption>Image title</figcaption>
</figure>

<!-- This is a multiple source type. *If you add @{n}x as suffix to the image file name, it will be converted to resolution -->
{{{image src="eleventy_logo.png, eleventy_logo@2x.png" alt="" className="image"}}}
<!-- Will be rendered as -->
<picture class="image">
  <source type="image/webp" srcset="/assets/img/555c1f01-100.webp 100w, /assets/img/30eb47cb-200.webp 2x" media="" sizes="">
  <img src="/assets/img/555c1f01-100.png" loading="lazy" width="100" height="182" alt="">
</picture>

<!-- In addition, you can specify the media for each image. -->
{{{image src="eleventy_logo@2x.png, eleventy_logo.png, eleventy_logo@2x.png" alt="" media="(max-width: 767px),"}}}
<!-- Will be rendered as -->
<picture>
  <source type="image/webp" srcset="/assets/img/30eb47cb-200.webp 2x" media="(max-width: 767px)" sizes="">
  <source type="image/webp" srcset="/assets/img/555c1f01-100.webp 100w, /assets/img/30eb47cb-200.webp 2x" media="" sizes="">
  <img src="/assets/img/30eb47cb-200.png" loading="lazy" width="200" height="363" alt="">
</picture>

<!-- It is also possible to automatically resize the image with the widths option -->
{{{image src="eleventy_logo.png" alt="" widths="50, 100"}}}
<!-- Will be rendered as -->
<picture>
  <source type="image/webp" srcset="/assets/img/555c1f01-50.webp 50w" media="" sizes="">
  <source type="image/webp" srcset="/assets/img/555c1f01-100.webp 100w" media="" sizes="">
  <img src="/assets/img/555c1f01-100.png" loading="lazy" width="100" height="182" alt="">
</picture>

___
</details>

<details>
<summary><strong><code>markdown</code></strong></summary>
<br>

Embed markdown easily.

```html
{{#md}}
# Heading
{{/md}}
```
___
</details>

<details>
<summary><strong><code>format</code></strong></summary>
<br>

Format the passed date with [date-fns](https://date-fns.org/v2.16.1/docs/format):

```html
<!-- Assuming page.date is a javascript date or dateString -->
{{format page.date "yyyy" }}{{this}}{{/format}}
<!-- Will be rendered as -->
2021
```
___
</details>

<details>
<summary><strong><code>formatISO</code></strong></summary>
<br>

Format the passed date according to [ISO format](https://date-fns.org/v2.16.1/docs/formatISO):

```html
<!-- Assuming page.date is a javascript date -->
{{formatISO "2021-06-27T18:04:02.024Z" }}
<!-- Will be rendered as -->
2021-06-28T03:04:02+09:00
```
___
</details>

## Thanks

- https://github.com/clenemt/eleventy-webpack
- https://github.com/gregives/twelvety
- https://github.com/hankchizljaw/hylia
- https://github.com/MadeByMike/supermaya
- https://github.com/jeromecoupe/webstoemp
- https://github.com/maxboeck/eleventastic
- https://github.com/deviousdodo/elevenpack
- https://github.com/ixartz/Eleventy-Starter-Boilerplate
- https://github.com/google/eleventy-high-performance-blog
- https://github.com/danurbanowicz/eleventy-netlify-boilerplate
- https://github.com/helpers/handlebars-helpers
