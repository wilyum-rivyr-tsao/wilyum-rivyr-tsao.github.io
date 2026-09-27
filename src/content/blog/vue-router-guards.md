---
lang: en
title: "The explain of vue-router guards fllow the sequnce of vue-router call stack"
date: 2020-02-27
category: "vue-router"
tags:
  - "vue-router"
---

1. Navigation triggered.
2. Call `beforeRouteLeave` guards in deactivated components.  
   called when the route that renders this component is about to be navigated away from. has access to `this` component instance.
   **The leave guard is usually used to prevent the user from accidentally leaving the route with unsaved edits. The navigation can be canceled by calling next(false).**
3. Call global `beforeEach` guards.  
   Global before guards are called in creation order, whenever a navigation is triggered. Guards may be resolved asynchronously, and the navigation is considered pending before all hooks have been resolved.

4. Call `beforeRouteUpdate` guards in reused components.  
   Remember that params or query changes won't trigger enter/leave navigation guards.For example, for a route with dynamic params `/foo/:id`, when we navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance will be reused.
   **beforeRouteUpdate called when the route that renders this component has changed,but this component is reused in the new route.** You can either watch the \$route object. `beforeRouteUpdate` has access to `this` component instance.
5. Call `beforeEnter` in route configs. The only guard inside route's config file
   You can define `beforeEnter` guards directly on a route's configuration object:

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
7. Call `beforeRouteEnter` in activated components.  
   called before the route that renders this component is confirmed. **does NOT have access to `this` component instance,because it has not been created yet when this guard is called! Note that beforeRouteEnter is the only guard that supports passing a callback to next.**

   ```js
   beforeRouteEnter (to, from, next) {
      next(vm => {
        // access to component instance via `vm`
      })
    }
   ```

8. Call global `beforeResolve` guards.  
   You can register a global guard with router.beforeResolve. This is similar to router.beforeEach, with the difference that resolve guards will be called right before the navigation is confirmed, after all in-component guards and async route components are resolved.

9. Navigation confirmed.

10. Call global `afterEach` hooks.  
    You can also register global **after hooks**, however unlike guards, **these hooks do not get a next function and cannot affect the navigation.**

11. DOM updates triggered.

12. Call callbacks passed to next in beforeRouteEnter guards with instantiated instances.
