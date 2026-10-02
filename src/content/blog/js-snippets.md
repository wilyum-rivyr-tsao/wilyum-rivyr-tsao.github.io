---
lang: both
title: "JavaScript 实用片段集"
tags:
  - "javascript"
  - "snippets"
---

<div class="lang-zh">

这是一篇 JavaScript 实用代码片段合集，收录了三个日常开发中高频遇到的小问题：可靠的类型判断、URL 参数替换、常用表单校验正则。每个片段都来自真实项目里的踩坑记录，随取随用。

## 更可靠的类型判断

`typeof` 对 `new String()` 返回 `"object"`，`instanceof` 对字符串字面量返回 `false`，单靠它们判断类型会踩坑。需要准确区分原始值和包装对象时，用 `Object.prototype.toString.call` 统一拿到内部类型。

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

## 用正则替换 URL 参数

在没有 `URLSearchParams` 的老代码里，经常需要手写 URL 参数替换：用正则定位 `name=value&` 片段并整体换掉。片段末尾还附了一个用 `slice(0, -1)` 去掉字符串最后一个字符的小技巧。

```js
var url  = 'www.something.com?some_parameter_name=old_parameter_value&';

var parameter_name = 'name=';
var url_regex = new RegExp(parameter_name + '[^&]+' + '&');
var old_par = url_regex.exec(url);
var = new_par = 'new_parameter_name=new_parameter_value';
url = url.replace(old_par,new_par);

// chop/slice/trim off last character(& symbol) in string for possibly  use.

var str = "12345.00";
str = str.substring(0, str.length - 1);
// but the slice syntax is much clearer
var str = "12345.00";
str = str.slice(0, -1);
```

## 常用表单校验正则

做表单校验时反复用到的正则集合：手机号、三档密码强度、邮箱与手机号混合、价格格式（限定整数和小数位数），直接可用。

```js
// 手机号：
/^1[3|5|7|8]\d{9}$/gi


// 密码 ：
//强：字母+数字+特殊字符 
 ^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$ 
     
//中：字母+数字，字母+特殊字符，数字+特殊字符
     ^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$
 
//弱：纯数字，纯字母，纯特殊字符
^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$

// 重复密码：
case 'repw':
regex = new RegExp(`^${this.data.pw_val}$`)
break;

// 邮箱和手机号：
^(1[3|5|7|8]\d{9})|([\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3})$

// 价格正则
^\d{0,10}(\.\d{1,4})?$
// 限定整数为10位数字，小数为4位数字

```

</div>

<div class="lang-en">

A collection of practical JavaScript snippets covering three everyday problems: reliable type checking, URL parameter replacement, and ready-to-use form validation regexes. Each snippet comes from real project experience — grab and go.

## A More Reliable Way to Type-Check

`typeof` returns `"object"` for `new String()`, while `instanceof` returns `false` for string literals — neither alone gives you the full picture. When you need to tell primitives apart from wrapper objects, `Object.prototype.toString.call` exposes the exact internal type.

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

## Replacing a URL Parameter with Regex

In legacy code without `URLSearchParams`, you often have to swap a query parameter by hand: use a regex to locate the `name=value&` fragment and replace it wholesale. A small bonus trick at the end shows how `slice(0, -1)` cleanly drops the last character of a string.

```js
var url  = 'www.something.com?some_parameter_name=old_parameter_value&';

var parameter_name = 'name=';
var url_regex = new RegExp(parameter_name + '[^&]+' + '&');
var old_par = url_regex.exec(url);
var = new_par = 'new_parameter_name=new_parameter_value';
url = url.replace(old_par,new_par);

// chop/slice/trim off last character(& symbol) in string for possibly  use.

var str = "12345.00";
str = str.substring(0, str.length - 1);
// but the slice syntax is much clearer
var str = "12345.00";
str = str.slice(0, -1);
```

## Commonly Used Form Validation Regexes

A set of regexes you reach for again and again in form validation: phone numbers, three tiers of password strength, a combined email-or-phone pattern, and a price format with capped integer and decimal digits.

```js
// 手机号：
/^1[3|5|7|8]\d{9}$/gi


// 密码 ：
//强：字母+数字+特殊字符 
 ^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$ 
     
//中：字母+数字，字母+特殊字符，数字+特殊字符
     ^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$
 
//弱：纯数字，纯字母，纯特殊字符
^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$

// 重复密码：
case 'repw':
regex = new RegExp(`^${this.data.pw_val}$`)
break;

// 邮箱和手机号：
^(1[3|5|7|8]\d{9})|([\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3})$

// 价格正则
^\d{0,10}(\.\d{1,4})?$
// 限定整数为10位数字，小数为4位数字

```

</div>
