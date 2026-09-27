---
lang: en
title: "font not found error happens when created a new file under subfolder in of nuxt pages folder"
date: 2019-06-29
category: "Project_summary_reports"
tags:
  - "nuxt"
  - "scss"
  - "webpack"
---

```js
ERROR in ./pages/account/index.vue?vue&type=style&index=0&lang=sass& (./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/vue-loader/lib??vue-loader-options!./pages/account/index.vue?vue&type=style&index=0&lang=sass&)
Module not found: Error: Can't resolve '../assets/fonts/Nunito-Bold.woff2' in '/Users/william/code/Akkadu_WebApp/docker/node/pages/account'
```

### cause:
font file not import in correct way inside of scss file.

old:
```scss
@font-face {
  src: url('../assets/fonts/ProstoOne-Regular.woff2') format('woff2');
}
```

after:
```scss
@font-face {
  src: url('~assets/fonts/ProstoOne-Regular.woff2') format('woff2');
}
```