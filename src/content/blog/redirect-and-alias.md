---
title: "Redirect and Alias"
date: 2020-02-01
category: "vue-router"
tags:
  - "vue-router"
---

## 重定向

**注意：注意导航守卫仅仅应用重定向的目标上。**

### 重定向三种应用方式：

#### 1. 字符串形式配置，访问/a 重定向到 /b （地址栏显示/b,内容为/b路由的内容）
```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```
#### 2. 路径对象形式配置，注意这里redirect接受的是个对象。
```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```
#### 3. 方法返回动态配置对象或字符串
  1. 返回字符串
```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // return 重定向的 字符串路径
      return 'b'
    }}
  ]
})
```
 2. 返回路径对象（**注意这里只是路径对象，而不是路由对象，不能使用路由对象所提供的功能如导航首位回调函数**）
```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 路径对象
      return { name: 'foo' }
    }}
  ]
})


//to 所包含的内容
{
  name: undefined
  meta: {}
  path: "/func"
  hash: ""
  query: {}
  params: {}
  fullPath: "/func"
  matched: [{…}]
}
```
## 别名

/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。

```js
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/root', component: Root, alias: '/root-alias' },
    { path: '/home', component: Home,
      children: [
        // 绝对地址 /foo
        { path: 'foo', component: Foo, alias: '/foo' },
        // 相对地址 (/home/bar-alias)
        { path: 'bar', component: Bar, alias: 'bar-alias' },
        // 多个别名，相对地址和绝对地址可以混合
        { path: 'baz', component: Baz, alias: ['/baz', 'baz-alias'] },
        // 默认显示的页面可设置别名为空
        { path: 'default', component: Default, alias: '' },
        // 嵌套路由也可以设置别名
        { path: 'nested', component: Nested, alias: 'nested-alias',
          children: [
            { path: 'foo', component: NestedFoo }
          ]
        }
      ]
    }
  ]
})
```