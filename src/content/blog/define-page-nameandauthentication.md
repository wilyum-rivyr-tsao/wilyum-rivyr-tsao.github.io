---
lang: en
title: "Define page Name and authtication in router"
date: 2020-02-16
category: "vue-router"
tags:
  - "vue-router"
---

When we are building a vue app. we may use a public header component.The title should follow the router path change.we can simple use meta fields in the route.Here's an example

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: {
            title:'Page title'
            requiresAuth: true,
          }
        }
      ]
    }
  ]
})
```

Aslo we can use meta to store auth demand of the specific path.Just like requiresAuth field above.

-----

当我们构建Vue应用程序时。 我们可以使用公共Header组件，标题应该跟随路由器路径更改而更改，我们可以简单地在路由中使用meta字段，这是一个示例

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: {
            title:'Page title'
            requiresAuth: true,
          }
        }
      ]
    }
  ]
})
```

同样，我们可以使用meta来存储特定路径的身份验证需求。就像上面的requireAuth字段一样。
