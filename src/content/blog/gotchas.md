---
lang: both
title:
    zh: "前端踩坑速记：el-select 与 Nuxt"
    en: "Frontend Gotchas: el-select & Nuxt"
tags:
  - "vue"
  - "nuxt"
  - "element-ui"
---

<div class="lang-zh">

日常开发中踩过的小坑速记，每条都是排查了半天才发现原因的那种，记下来免得再踩第二次。

## el-select 的 value 类型必须与选项一致

现象：给 el-select 绑定的 `v-model` 赋了值，下拉框却只显示原始值（比如 id），不显示对应的选项文案。

我的场景更绕一点：select 封装在子组件里，选项列表是动态加载的。一开始以为是时序问题——外部组件 `created` 时赋值确实太早，备选项还没渲染出来；但等列表加载完再从外部赋值，依然只显示 id。

真正的原因：**el-select 是靠严格相等匹配选项的**，`value` 的类型必须和选项的 `value` 类型一致。后端返回的 id 是 `String`，而选项的 value 是 `Number`（或反过来），匹配不上就直接把原始值显示出来了。Element UI 对此不会报任何错误或警告，属于典型的"静默失败"。

解决：赋值前统一类型，比如 `Number(id)`，或者在选项渲染时把 value 统一转成字符串。

## Nuxt pages 子目录新建文件后报字体找不到

在 Nuxt 项目的 `pages` 下新建子目录（比如 `pages/account/index.vue`）后，构建突然报错：

```js
ERROR in ./pages/account/index.vue?vue&type=style&index=0&lang=sass& (...)
Module not found: Error: Can't resolve '../assets/fonts/Nunito-Bold.woff2'
in '/Users/william/code/Akkadu_WebApp/docker/node/pages/account'
```

原因：scss 里的 `@font-face` 用了相对路径引用字体。新文件的目录层级变深后，`../assets/...` 解析到了错误的位置：

```scss
/* 旧写法：相对路径，目录层级一变就断 */
@font-face {
  src: url('../assets/fonts/ProstoOne-Regular.woff2') format('woff2');
}
```

改用 webpack 的 `~` 别名，从项目根解析，与文件所在层级无关：

```scss
/* 新写法：~ 开头走 webpack 别名解析 */
@font-face {
  src: url('~assets/fonts/ProstoOne-Regular.woff2') format('woff2');
}
```

教训：凡是可能被不同层级文件引用的静态资源（字体、图片、全局样式），路径一律用别名，别用相对路径。

</div>

<div class="lang-en">

Quick notes on small but time-consuming pitfalls from daily development — the kind that take half a day to track down. Writing them down so I never step on them twice.

## el-select's value type must match its options

Symptom: I assigned a value to the `v-model` of an el-select, but the dropdown showed the raw value (e.g. an id) instead of the matching option's label.

My case was a bit more convoluted: the select was wrapped in a child component and its options were loaded dynamically. At first I suspected timing — assigning the value in the outer component's `created` hook is indeed too early, since the options haven't rendered yet. But even assigning the value after the list loaded still showed only the id.

The real cause: **el-select matches options with strict equality**, so the type of `value` must exactly match the type of each option's `value`. The backend returned the id as a `String` while the options used `Number` (or vice versa); the match fails and el-select silently renders the raw value. Element UI raises no error or warning for this — a classic silent failure.

Fix: normalize the type before assigning, e.g. `Number(id)`, or stringify option values consistently when rendering them.

## "Font not found" after creating a new file in a Nuxt pages subfolder

After creating a new subdirectory under `pages` in a Nuxt project (e.g. `pages/account/index.vue`), the build suddenly failed:

```js
ERROR in ./pages/account/index.vue?vue&type=style&index=0&lang=sass& (...)
Module not found: Error: Can't resolve '../assets/fonts/Nunito-Bold.woff2'
in '/Users/william/code/Akkadu_WebApp/docker/node/pages/account'
```

Cause: the scss `@font-face` referenced the font with a relative path. Once the new file sat one directory deeper, `../assets/...` resolved to the wrong location:

```scss
/* old: relative path — breaks as soon as the directory depth changes */
@font-face {
  src: url('../assets/fonts/ProstoOne-Regular.woff2') format('woff2');
}
```

Switch to webpack's `~` alias, which resolves from the project root regardless of where the file lives:

```scss
/* new: ~ triggers webpack alias resolution */
@font-face {
  src: url('~assets/fonts/ProstoOne-Regular.woff2') format('woff2');
}
```

Lesson: for any static asset (fonts, images, global styles) that files at different directory depths might reference, always use an alias — never a relative path.

</div>
