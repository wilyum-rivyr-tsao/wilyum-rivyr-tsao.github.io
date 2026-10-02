---
lang: both
title:
    zh: "网页性能优化要点"
    en: "Web Performance Optimization Essentials"
tags:
  - "性能优化"
  - "浏览器渲染"
---

<div class="lang-zh">

## 快速清单

1. 浏览器对并发网络请求数量有限制，减少请求数就能加快页面加载。
2. 页面必须等所有 CSS 下载完成才能正常渲染，所以 JS 文件应放在 CSS 之后引入。
3. 移除无效请求（404、错误资源）。
4. 可以给 JS 加 `async` 的就加上。
5. 压缩图片，图标重新导出为合适的格式（如 PNG/SVG）。

**默认情况下，CSS 被视为阻塞渲染的资源——浏览器在 CSSOM 构建完成之前不会渲染任何已处理的内容。因此务必保持 CSS 精简、尽快送达，并善用媒体类型和查询来解除渲染阻塞。**

### 1. 精简 CSS 并使用合适的媒体类型

在渲染树的构建过程中我们看到，关键渲染路径同时需要 DOM 和 CSSOM 才能构建渲染树。这带来一个重要的性能影响：**HTML 和 CSS 都是阻塞渲染的资源**。HTML 显而易见，没有 DOM 就没有东西可渲染；但 CSS 的要求可能不那么直观——如果尝试在不等待 CSS 的情况下渲染一个典型页面，会得到无样式的闪烁内容（FOUC）。

### 2. 给 script 标签加 async，把非必要 JS 移出关键渲染路径

JavaScript 允许我们修改页面的几乎一切：内容、样式以及对用户交互的响应。然而 JavaScript 也会阻塞 DOM 构建、延迟页面渲染。为了获得最佳性能，让 JavaScript 异步加载，并把不必要的 JavaScript 从关键渲染路径中移除。

**脚本会在它被插入文档的确切位置执行。当 HTML 解析器遇到 script 标签时，会暂停 DOM 构建并把控制权交给 JavaScript 引擎；脚本执行完毕后，浏览器再从中断处继续构建 DOM。**

### 压缩、合并、缓存

针对 HTML / CSS / JS：

1. 最小化字节数（minify + gzip）
2. 减少关键资源数量

### 减少阻塞渲染的资源

1. 在 `<link>` 上使用媒体查询解除渲染阻塞
2. 使用内联 CSS（关键样式）
3. 缩短关键渲染路径长度

### 减少阻塞解析的资源

1. 延迟 JS 执行（defer）
2. 在 `<script>` 上使用 async 属性

</div>

<div class="lang-en">

## Quick Checklist

1. Browsers limit the number of concurrent network requests, so reducing the request count speeds up page loads.
2. A page won't render properly until all its CSS has downloaded, so import JS files after CSS files.
3. Remove bad requests (404s, broken resources).
4. Add `async` to JS files wherever possible.
5. Compress images; re-export icons to a proper format (e.g. PNG/SVG).

**By default, CSS is treated as a render blocking resource, which means that the browser won't render any processed content until the CSSOM is constructed. Make sure to keep your CSS lean, deliver it as quickly as possible, and use media types and queries to unblock rendering.**

### 1. Lean your CSS and use appropriate media types

In render tree construction we saw that the critical rendering path requires both the DOM and the CSSOM to construct the render tree. This creates an important performance implication: **both HTML and CSS are render blocking resources.** The HTML is obvious, since without the DOM we would not have anything to render, but the CSS requirement may be less obvious — rendering a typical page without waiting for CSS produces a flash of unstyled content (FOUC).

### 2. Add async to your script tags and eliminate unnecessary JS from the critical rendering path

JavaScript allows us to modify just about every aspect of the page: content, styling, and its response to user interaction. However, JavaScript can also block DOM construction and delay when the page is rendered. To deliver optimal performance, make your JavaScript async and eliminate any unnecessary JavaScript from the critical rendering path.

**A script is executed at the exact point where it is inserted in the document. When the HTML parser encounters a script tag, it pauses its process of constructing the DOM and yields control to the JavaScript engine; after the JavaScript engine finishes running, the browser then picks up where it left off and resumes DOM construction.**

### Minify, Compress, Cache

For HTML / CSS / JS:

1. Minimize bytes (minify + gzip)
2. Reduce critical resources

### Minimize use of render blocking resources

1. Use media queries on `<link>` to unblock rendering
2. Use inline CSS (for critical styles)
3. Shorten the critical rendering path length

### Minimize use of parser blocking resources

1. Defer JS execution
2. Use the async attribute on `<script>`

</div>
