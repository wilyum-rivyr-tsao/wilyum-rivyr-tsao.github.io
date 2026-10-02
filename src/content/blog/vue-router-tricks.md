---
lang: both
title: "vue-router 实战六则"
tags:
  - "vue"
  - "vue-router"
---

<div class="lang-zh">

日常用 vue-router 时反复用到的六个技巧合集：重定向与别名、用 meta 管理页面标题和鉴权、去掉 URL 里的 #、导航守卫的完整调用顺序、用 props 解耦路由参数、以及路由参数变化时如何更新页面数据。每则都短小独立，随查随用。

## 一、重定向与别名

**注意：导航守卫只应用在重定向的目标路由上，不会为源路由再跑一遍。**

重定向有三种写法：

1. 字符串形式：访问 `/a` 重定向到 `/b`（地址栏显示 `/b`，渲染 `/b` 的内容）。

```js
const router = new VueRouter({
  routes: [{ path: '/a', redirect: '/b' }],
});
```

2. 路径对象形式：`redirect` 接收一个对象。

```js
const router = new VueRouter({
  routes: [{ path: '/a', redirect: { name: 'foo' } }],
});
```

3. 函数形式：动态返回字符串或路径对象（注意只是路径对象，不是路由对象，不能使用路由对象上的方法）。函数接收目标路由 `to` 作为参数。

```js
const router = new VueRouter({
  routes: [
    {
      path: '/a',
      redirect: to => {
        // to 包含 name/meta/path/hash/query/params/fullPath/matched
        return { name: 'foo' }; // 也可以 return 'b'
      },
    },
  ],
});
```

**别名**：`/a` 的别名是 `/b`，意味着用户访问 `/b` 时 URL 保持为 `/b`，但路由匹配按 `/a` 处理，就像访问 `/a` 一样。

```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/root', component: Root, alias: '/root-alias' },
    {
      path: '/home',
      component: Home,
      children: [
        // 绝对地址 /foo
        { path: 'foo', component: Foo, alias: '/foo' },
        // 相对地址（/home/bar-alias）
        { path: 'bar', component: Bar, alias: 'bar-alias' },
        // 多个别名，相对和绝对地址可以混合
        { path: 'baz', component: Baz, alias: ['/baz', 'baz-alias'] },
        // 默认显示的页面可设置别名为空
        { path: 'default', component: Default, alias: '' },
        // 嵌套路由也可以设置别名
        {
          path: 'nested',
          component: Nested,
          alias: 'nested-alias',
          children: [{ path: 'foo', component: NestedFoo }],
        },
      ],
    },
  ],
});
```

## 二、用 meta 定义页面标题与鉴权

构建 Vue 应用时通常会有一个公共 Header 组件，标题需要跟随路由变化。最简单的做法是把标题放在路由的 `meta` 字段里，同时也可以把该路由的鉴权需求（如 `requiresAuth`）一并放进去，配合全局守卫读取。

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
          meta: {
            title: 'Page title',
            requiresAuth: true,
          },
        },
      ],
    },
  ],
});
```

## 三、去掉 URL 中的 #（history 模式）

想去掉 URL 里的 `#`，需要在创建 router 实例时使用 `history.pushState` 模式：

```js
const router = new VueRouter({
  mode: 'history',
  routes: [...],
});
```

因为 Vue 是单页面应用，开启 history 模式后，当用户直接访问某个前端路由而服务器上没有匹配的静态资源时，服务端需要配置把所有请求回退到应用主页面（如 `index.html`），否则会 404。

## 四、导航守卫的完整调用顺序

一次导航触发的完整解析流程如下：

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave`——即将离开当前路由时调用，可以访问组件实例 `this`。通常用来防止用户在有未保存编辑时误离开，调用 `next(false)` 可以取消导航。
3. 调用全局 `beforeEach` 守卫——按注册顺序执行，守卫可以是异步的，全部 resolve 之前导航一直处于 pending 状态。
4. 在被复用的组件里调用 `beforeRouteUpdate`——动态参数路由（如 `/foo/:id`）在 `/foo/1` 和 `/foo/2` 之间跳转时组件实例会被复用，enter/leave 守卫不会触发，此时用 `beforeRouteUpdate`（或 watch `$route`）响应参数变化，可以访问 `this`。
5. 调用路由配置里的 `beforeEnter`——唯一直接写在路由配置对象上的守卫。

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      },
    },
  ],
});
```

6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`——在渲染该组件的路由被确认前调用，此时组件实例还没创建，**不能访问 `this`**。它是唯一支持给 `next` 传回调的守卫，通过回调拿到实例：

```js
beforeRouteEnter(to, from, next) {
  next(vm => {
    // 通过 vm 访问组件实例
  });
}
```

8. 调用全局 `beforeResolve` 守卫——与 `beforeEach` 类似，区别是它在所有组件内守卫和异步路由组件都解析完之后、导航被确认之前调用。
9. 导航被确认。
10. 调用全局 `afterEach` 钩子——注意这些是钩子不是守卫，**没有 `next` 函数，不能影响导航**。
11. 触发 DOM 更新。
12. 用创建好的实例调用 `beforeRouteEnter` 里传给 `next` 的回调。

## 五、用 props 解耦路由参数

组件里需要 URL 参数时，最直接的方式是用 `$route.params`：

```js
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }],
});

const User = {
  template: '<div>User {{ $route.params.id }}</div>',
};
```

但这样组件和路由就耦合在一起了——如果同一个组件还要从父组件接收参数，就得在模板里加一堆 `v-if` 判断。更好的选择是把路由参数声明为 props：

```js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>',
};

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },
    // 命名视图下可以分别配置
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false },
    },
  ],
});
```

这样无论参数来自路由还是父组件，组件里都当成普通 props 使用。如果参数还来自 `query`、`meta` 等地方，可以用函数模式统一组装：

```js
routes: [
  {
    path: '/decoupling/:id',
    name: 'decouple',
    meta: { title: 'decouple' },
    component: () => import('@/components/Decouple'),
    props: route => Object.assign({}, route.query, route.params, route.meta),
  },
];
```

访问 `/decoupling/123?query_a=1`，组件里就能直接接收：

```js
export default {
  name: 'Decouple',
  props: ['id', 'query_a', 'title'],
  mounted() {
    console.log(this._props);
  },
};
```

注意：不要依赖函数模式来修改数据状态，因为这个函数只在路由变化时执行一次。

## 六、路由参数变化时更新页面数据

路由参数（如 `/anypath/:id` 的 id）变化时，组件被复用，除了页面刷新外 Vue 不会重跑生命周期函数。有两种方式在参数变化时重新拉取数据。

**方式一：watch `$route`**

```html
<template>
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
```

```js
export default {
  data() {
    return { loading: false, post: null, error: null };
  },
  created() {
    // 组件创建后拉取初始数据
    this.fetchData();
  },
  watch: {
    // 路由变化时重新执行
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      this.error = this.post = null;
      this.loading = true;
      // getPost 替换为你的数据请求方法
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false;
        if (err) {
          this.error = err.toString();
        } else {
          this.post = post;
        }
      });
    },
  },
};
```

**方式二：在导航完成前取数（路由守卫）**

```js
export default {
  data() {
    return { post: null, error: null };
  },
  beforeRouteEnter(to, from, next) {
    // 进入前组件实例尚未创建，通过 next 的回调拿到 vm
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post));
    });
  },
  // 组件已渲染、仅路由参数变化时走这里（对应第四则的 beforeRouteUpdate）
  beforeRouteUpdate(to, from, next) {
    this.post = null;
    getPost(to.params.id, (err, post) => {
      this.setData(err, post);
      next();
    });
  },
  methods: {
    setData(err, post) {
      if (err) {
        this.error = err.toString();
      } else {
        this.post = post;
      }
    },
  },
};
```

两种方式的区别：watch 方式是导航完成后在组件内取数，页面先渲染再出 loading；守卫方式是导航确认前就把数据取好，进入页面即是完整内容。按交互需要选择。

</div>

<div class="lang-en">

Six vue-router techniques I reach for again and again in real projects: redirects and aliases, managing page titles and auth via `meta`, removing the `#` from URLs, the full navigation-guard resolution order, decoupling route params with props, and refreshing data when route params change. Each section is short and self-contained.

## 1. Redirects and Aliases

**Note: navigation guards only run on the redirect target, not on the source route.**

There are three ways to configure a redirect:

1. String form: visiting `/a` redirects to `/b` (the address bar shows `/b` and renders `/b`'s content).

```js
const router = new VueRouter({
  routes: [{ path: '/a', redirect: '/b' }],
});
```

2. Location object form: `redirect` accepts an object.

```js
const router = new VueRouter({
  routes: [{ path: '/a', redirect: { name: 'foo' } }],
});
```

3. Function form: dynamically return a string or a location object (note: a location object, not a route object — you can't call route-object methods on it). The function receives the target route `to`.

```js
const router = new VueRouter({
  routes: [
    {
      path: '/a',
      redirect: to => {
        // to contains name/meta/path/hash/query/params/fullPath/matched
        return { name: 'foo' }; // or return 'b'
      },
    },
  ],
});
```

**Alias**: if `/a` has the alias `/b`, visiting `/b` keeps the URL as `/b` but matches the route as if the user visited `/a`.

```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/root', component: Root, alias: '/root-alias' },
    {
      path: '/home',
      component: Home,
      children: [
        // absolute path /foo
        { path: 'foo', component: Foo, alias: '/foo' },
        // relative path (/home/bar-alias)
        { path: 'bar', component: Bar, alias: 'bar-alias' },
        // multiple aliases, mixing relative and absolute
        { path: 'baz', component: Baz, alias: ['/baz', 'baz-alias'] },
        // an empty alias for the default page
        { path: 'default', component: Default, alias: '' },
        // nested routes can have aliases too
        {
          path: 'nested',
          component: Nested,
          alias: 'nested-alias',
          children: [{ path: 'foo', component: NestedFoo }],
        },
      ],
    },
  ],
});
```

## 2. Page Titles and Auth via Route meta

A Vue app usually has a shared Header component whose title should follow the current route. The simplest approach is to put the title in the route's `meta` field — and while you're there, store the route's auth requirement (e.g. `requiresAuth`) too, then read it in a global guard.

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
          meta: {
            title: 'Page title',
            requiresAuth: true,
          },
        },
      ],
    },
  ],
});
```

## 3. Removing the # from URLs (history mode)

To get rid of the `#` in the URL, configure the router instance to use `history.pushState` mode:

```js
const router = new VueRouter({
  mode: 'history',
  routes: [...],
});
```

Since a Vue app is a single-page application, once history mode is on the server must be configured to fall back to the app's main page (e.g. `index.html`) whenever a request matches no static asset — otherwise deep links will 404.

## 4. The Full Navigation Guard Resolution Order

A complete navigation goes through these steps:

1. Navigation triggered.
2. Call `beforeRouteLeave` in deactivated components — invoked when the route rendering this component is about to be navigated away from; has access to `this`. Commonly used to prevent leaving with unsaved edits; call `next(false)` to cancel the navigation.
3. Call global `beforeEach` guards — run in registration order whenever a navigation is triggered. Guards may resolve asynchronously; the navigation stays pending until all of them resolve.
4. Call `beforeRouteUpdate` in reused components — for a dynamic route like `/foo/:id`, navigating between `/foo/1` and `/foo/2` reuses the same component instance, so enter/leave guards don't fire. Use `beforeRouteUpdate` (or watch `$route`) to react to param changes; has access to `this`.
5. Call `beforeEnter` in route configs — the only guard defined directly on the route config object.

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      },
    },
  ],
});
```

6. Resolve async route components.
7. Call `beforeRouteEnter` in activated components — invoked before the route rendering this component is confirmed. The instance hasn't been created yet, so there's **no access to `this`**. It's the only guard that supports a callback passed to `next`:

```js
beforeRouteEnter(to, from, next) {
  next(vm => {
    // access the component instance via vm
  });
}
```

8. Call global `beforeResolve` guards — similar to `beforeEach`, but called right before the navigation is confirmed, after all in-component guards and async route components have resolved.
9. Navigation confirmed.
10. Call global `afterEach` hooks — these are hooks, not guards: **they get no `next` function and cannot affect the navigation**.
11. DOM updates triggered.
12. Call the `next` callbacks from `beforeRouteEnter` with the created instances.

## 5. Decoupling Route Params with Props

When a component needs a URL parameter, the direct way is `$route.params`:

```js
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }],
});

const User = {
  template: '<div>User {{ $route.params.id }}</div>',
};
```

But this couples the component to the router — if the same component also receives params from a parent, you end up with `v-if` checks everywhere. The better option is declaring route params as props:

```js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>',
};

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },
    // named views can be configured individually
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false },
    },
  ],
});
```

Now the component treats params as plain props no matter where they come from. If params also come from `query`, `meta`, and so on, use function mode to assemble them:

```js
routes: [
  {
    path: '/decoupling/:id',
    name: 'decouple',
    meta: { title: 'decouple' },
    component: () => import('@/components/Decouple'),
    props: route => Object.assign({}, route.query, route.params, route.meta),
  },
];
```

Visiting `/decoupling/123?query_a=1`, the component receives everything directly:

```js
export default {
  name: 'Decouple',
  props: ['id', 'query_a', 'title'],
  mounted() {
    console.log(this._props);
  },
};
```

Caveat: don't rely on function mode to mutate data state — the function only runs when the route changes.

## 6. Refreshing Data When Route Params Change

When a route param (like the id in `/anypath/:id`) changes, the component is reused and Vue won't rerun lifecycle hooks short of a full page refresh. There are two ways to refetch data on param change.

**Option 1: watch `$route`**

```html
<template>
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
```

```js
export default {
  data() {
    return { loading: false, post: null, error: null };
  },
  created() {
    // fetch the initial data once the view is created
    this.fetchData();
  },
  watch: {
    // call the method again whenever the route changes
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      this.error = this.post = null;
      this.loading = true;
      // replace getPost with your data fetching util / API wrapper
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false;
        if (err) {
          this.error = err.toString();
        } else {
          this.post = post;
        }
      });
    },
  },
};
```

**Option 2: fetch before navigation (route guards)**

```js
export default {
  data() {
    return { post: null, error: null };
  },
  beforeRouteEnter(to, from, next) {
    // the instance doesn't exist yet; access it via next's callback
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post));
    });
  },
  // when only the params change on an already-rendered component
  // (this is the beforeRouteUpdate from section 4)
  beforeRouteUpdate(to, from, next) {
    this.post = null;
    getPost(to.params.id, (err, post) => {
      this.setData(err, post);
      next();
    });
  },
  methods: {
    setData(err, post) {
      if (err) {
        this.error = err.toString();
      } else {
        this.post = post;
      }
    },
  },
};
```

The difference: the watch approach fetches inside the component after navigation, so the page renders first and then shows a loading state; the guard approach fetches before the navigation is confirmed, so the page arrives with complete content. Pick based on the interaction you want.

</div>
