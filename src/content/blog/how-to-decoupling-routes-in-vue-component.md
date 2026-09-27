---
lang: en
title: "how to decoupling routes in vue component"
date: 2020-02-04
category: "vue-router"
tags:
  - "vue-router"
---

Have you ever meet a scenario that you need receive params from url. Well then you can use this.\$route.params like this:

```js
// router
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }],
});
// your component
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
};
```

But how about you want to receive params from parent component?
What should you do?
add an judgement Like this?

```js
// your component
const User = {
  template:
    '<div v-if="$route.params.id">User {{ $route.params.id }}</div> <div v-if="!$route.params.id">User {{ $route.params.id }}</div>',
};
```

No you don't.

You had a better choice to use props:

```js
const User = {
  props: ['id'], //be aware here
  template: '<div>User {{ id }}</div>',
};
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      props: true, //set props option equal true
    },
    {
      path: '/user/:id',
      components: {
        default: User,
        sidebar: Sidebar,
      },
      props: {
        default: true, //use params as props in the default component
        sidebar: false, // params will not present as props in sidebar
      },
    },
  ],
});
```

Now you can use id whatever it come from.

Well~ Now we can handle params from router.What if you params come from routes.meta,routes.query an so on?

We can leverage function mode and object mode.

Say we have an router like this.

```js
routes: [
  {
    path: '/decoupling/:id',
    name: 'decouple',
    meta: { title: 'decouple' }, // we have title in meta
    component: () => import('@/components/Decouple'),
    props: route => Object.assign({}, route.query, route.params, route.meta), // we have query and params
  },
];
```

We can pass an object to props option of router object to achieve our goal by leverage function mode.

Access demo url: http://localhost:8081/#/decoupling/123?query_a=1
To receive your params in your component.

```js
export default {
  name: 'Decouple',
  props: ['id', 'query_a', 'title'],
  mounted() {
    console.log(this._props);
  },
};
```

Be aware you should not rely on function mode to change data state since the function can only excute when path change.

---

您是否遇到过需要从 url 接收参数的情况。 您可以这样做 this.\$route.params 像这样：

```js
// router
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }],
});
// your component
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
};
```

但是您想从父组件接收参数怎么样？
你该怎么办？
加上这样的判断？

```js
// your component
const User = {
  template:
    '<div v-if="$route.params.id">User {{ $route.params.id }}</div> <div v-if="!$route.params.id">User {{ $route.params.id }}</div>',
};
```

您有更好的选择 **props**：

```js
const User = {
  props: ['id'], //be aware here
  template: '<div>User {{ id }}</div>',
};
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      props: true, //set props option equal true
    },
    {
      path: '/user/:id',
      components: {
        default: User,
        sidebar: Sidebar,
      },
      props: {
        default: true, //use params as props in the default component
        sidebar: false, // params will not present as props in sidebar
      },
    },
  ],
});
```

现在，无论参数来自何处，您都可以使用您的参数就像使用普通 props 一样。

好现在我们可以处理 routes.params 了。但如果您的参数来自 routes.meta，routes.query 等等该怎么办？

我们可以利用功能模式和对象模式。

假设我们有一个像这样的 router。

```js
routes: [
  {
    path: '/decoupling/:id',
    name: 'decouple',
    meta: { title: 'decouple' }, // we have title in meta
    component: () => import('@/components/Decouple'),
    props: route => Object.assign({}, route.query, route.params, route.meta), // we have query and params
  },
];
```

我们可以将一个对象传给路有对象的 props 选项，以利用功能模式实现我们的目标。  
访问演示网址：/decoupling/123query_a=1  
在组件中接收参数。

```js
export default {
  name: 'Decouple',
  props: ['id', 'query_a', 'title'],
  mounted() {
    console.log(this._props);
  },
};
```

请注意，您不应该依赖功能模式来更改数据状态，因为功能模式的方法只能在跳转页面时才会执行。
