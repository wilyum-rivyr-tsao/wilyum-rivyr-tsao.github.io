---
lang: en
title: "Optimizing"
tags:
  - "性能优化"
  - "浏览器渲染"
---

#### 1. browser limited the number of network request, so reduce request number will speed up web page speed.  

#### 2. Web page not going to be  able render properly until it's downloaded all the CSS. So import JS file after CSS file

#### 3. remove bad request.

#### 4. async JS file if it could be.

#### 5. Compress images, reexport icons to png




**By default, CSS is treated as a render blocking resource, which means that the browser won't render any processed content until the CSSOM is constructed. Make sure to keep your CSS lean, deliver it as quickly as possible, and use media types and queries to unblock rendering.**

### 1. Lean your css file and use  appropriate  media types.

In the render tree construction we saw that the critical rendering path requires both the DOM and the CSSOM to construct the render tree. This creates an important performance implication: **both HTML and CSS are render blocking resources.** The HTML is obvious, since without the DOM we would not have anything to render, but the CSS requirement may be less obvious. What would happen if we try to render a typical page without blocking rendering on CSS?


### 2.Add async property to your JS tag, eliminate unnecessary JS from the critical rendering path.

JavaScript allows us to modify just about every aspect of the page: content, styling, and its response to user interaction. However, JavaScript can also block DOM construction and delay when the page is rendered. To deliver optimal performance, make your JavaScript async and eliminate any unnecessary JavaScript from the critical rendering path.

**Our script is executed at the exact point where it is inserted in the document. When the HTML parser encounters a script tag, it pauses its process of constructing the DOM and yields control to the JavaScript engine; after the JavaScript engine finishes running, the browser then picks up where it left off and resumes DOM construction.**

### Minify Compress Cache
HTML CSS JS
1.Minimize Bytes  
2.Reduce critical resource.  

### Minimize use of render blocking resources.
1.use media queries on <link> to unblock rendering.  
2.use inline CSS.  
3.shorten CRD length.  

### Minimize use of parser blocking resources
1.defer JS execution  
2.use async attribute on <script>




