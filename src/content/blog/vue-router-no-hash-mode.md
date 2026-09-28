---
lang: en
title: "Vue Router No Hash Mode"
category: "vue-router"
tags:
  - "vue-router"
---

To get rid of # in URL we need to use `history.pushState`.We can simply config in it when new vue-router istance:

```js
const router = new VueRouter({
mode: 'history',
routes: [...]
})
```

since Vue is sigle page app we need server config to be redirect to Vue application main page for example index.html when none static assets matched user request.

去除 URL 中的#号需要使用 vue-router 的 `history.pushState`,在 new vue-router 实例的时候配置。

```js
const router = new VueRouter({
mode: 'history',
routes: [...]
})
```

由于，vue 是单页面应用,如果服务器上没有静态资源能匹配用户的请求则，服务端需要配置所有连接都跳转到 vue 项目的主页面如 index.html
