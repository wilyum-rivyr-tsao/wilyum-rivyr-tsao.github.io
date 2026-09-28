---
lang: en
title: "A better way to typecheck for JS"
tags:
  - "js-技巧"
  - "type-checking"
---

```js
  var toString = Object.prototype.toString;
  var strLit = 'example';
  var strStr = String('example')​;
  var strObj = new String('example');

  console.log(typeof strLit); // string    
  console.log(typeof strStr); // string
  console.log(typeof strObj); // object

  console.log(strLit instanceof String); // false
  console.log(strStr instanceof String); // false
  console.log(strObj instanceof String); // true

  console.log(toString.call(strLit)); // [object String]
  console.log(toString.call(strStr)); // [object String]
  console.log(toString.call(strObj)); // [object String]
```
