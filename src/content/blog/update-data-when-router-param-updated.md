---
title: "Update data of vue page when router params updated"
date: 2020-02-24
category: "vue-router"
tags:
  - "vue-router"
---

When router params updated the Vue will not run the lifecyle agian except the page refresh.How can we fetch data when the param (such as /anypath/:id)changed?
There's two way to acheive this.

## Use watch

```html
<template>
  <div class="post">
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

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
    return {
      loading: false,
      post: null,
      error: null,
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      this.error = this.post = null;
      this.loading = true;
      // replace `getPost` with your data fetching util / API wrapper
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

## Fetch Before Navigation

```js
export default {
  data() {
    return {
      post: null,
      error: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post));
    });
  },
  // when route changes and this component is already rendered,
  // the logic will be slightly different.
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

---

# 更新路由参数时更新页面数据

路由器参数更新后，除了页面刷新外 vue 不会重新运行生命周期 函数. （例如/anypath/:id）id 更改后但 path 并未改变该如何获取页面数据？

实现此目的有两种方法。

## 利用 Watch

```html
<template>
  <div class="post">
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

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
    return {
      loading: false,
      post: null,
      error: null,
    };
  },
  created() {
    // 在组件created之后拉取初始数据
    this.fetchData();
  },
  watch: {
    // 监听router对象改变，然后执行拉取数据函数
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      this.error = this.post = null;
      this.loading = true;
      // replace `getPost` with your data fetching util / API wrapper
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

## 利用路由守卫

```js
export default {
  data() {
    return {
      post: null,
      error: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    getPost(to.params.id, (err, post) => {
      // 请求API获取数据then(){
      // ()=>{执行next}
      // }
      // 在未进入页面前vue示例未挂载所以用vm
      next(vm => vm.setData(err, post));
    });
  },
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
