---
lang: both
title: "在 React Router v4 中编程式跳转到另一个路由"
tags:
  - "react-router"
  - "react"
---

<div class="lang-zh">

### 如何在 react-router v4 中以编程方式跳转到另一个路由

#### Header.js

首先导入 `withRouter`。通过这个高阶组件，你可以访问 history 对象的属性和最近的 `<Route>` 的 match。`withRouter` 会在路由变化时用与 `<Route>` render props 相同的属性（`{ match, location, history }`）重新渲染被包裹的组件。

```js
// ....
import { withRouter } from 'react-router'

class Header extends Component {
  functionMethod() {
    // 把目标路径 push 进 history
    this.props.history.push("/path");
  }
  // ...
}

// 导出时用 withRouter 包裹组件
export default withRouter(Header);
```

#### 未被 `<Route>` 渲染的公共组件

对于 Navigator 这类通常作为公共组件、并不是由 `<Route></Route>` 渲染出来的组件，需要用 `createBrowserHistory` 为它创建一个 history 对象。参考下面的例子：

```js
//Routers.js

import { createBrowserHistory } from 'history';
// 导入 createBrowserHistory，为 header 组件创建 history 对象
const history = createBrowserHistory();
// ...
class Routers extends Component{
  render(){
    return (

    <BrowserRouter  basename="/platform">
      <div>
        <Header history={history}></Header>
        // 把 history 作为 props 传给 Header.js；
        // 没有 createBrowserHistory 的话这里拿不到 history

        <Switch>
            <Route
                path={"/bom"}
                children={({history}) => (
                  <Bom history={history}></Bom>
                )}
            >
            </Route>
            // ....
            </Switch>
            </div>
        </BrowserRouter>
    )
  }
}
// ...
export default Routers;
```

</div>

<div class="lang-en">

### How to do a redirect to another route programmatically with react-router v4

#### Header.js

First of all, just import `withRouter`. With this higher-order component, you get access to the history object's properties and the closest `<Route>`'s match. `withRouter` will re-render its component every time the route changes with the same props as `<Route>` render props: `{ match, location, history }`.

```js
// ....
import { withRouter } from 'react-router'

class Header extends Component {
  functionMethod() {
    // then push your path into history.
    this.props.history.push("/path");
  }
  // ...
}

// export the component wrapped in withRouter.
export default withRouter(Header);
```

#### For components not rendered by a Route

For a Navigator that is normally used as a shared component and is not rendered by `<Route></Route>`, you need `createBrowserHistory` to create a history object for it. Consider the following example:

```js
//Routers.js

import { createBrowserHistory } from 'history';
// import createBrowserHistory to create a history object for the header component
const history = createBrowserHistory();
// ...
class Routers extends Component{
  render(){
    return (

    <BrowserRouter  basename="/platform">
      <div>
        <Header history={history}></Header>
        // pass history as a prop to Header.js;
        // without createBrowserHistory you would not be able to access history here

        <Switch>
            <Route
                path={"/bom"}
                children={({history}) => (
                  <Bom history={history}></Bom>
                )}
            >
            </Route>
            // ....
            </Switch>
            </div>
        </BrowserRouter>
    )
  }
}
// ...
export default Routers;
```

</div>
