---
lang: en
title: "How to do a redirect to another route programmatically with react router v4"
tags:
  - "react-router"
  - "react"
---

### How to do a redirect to another route programmatically with react-router v4.


#### Header.js
#### first of all just import withRouter, with this,You can get access to the history object’s properties and the closest <Route>'s match via the withRouter higher-order component. withRouter will re-render its component every time the route changes with the same props as <Route> render props: { match, location, history }.

``` js
// ....
import { withRouter } from 'react-router'

class Header extends Component {
  functionMethod() {
    // then push you path into history.
    this.props.history.push( "/path");
  }
  // ...
}

// export component by invoke withRouter.
export default withRouter(Header);
```

#### And for Navigator which normally used as public component and it not rendered by <Route></Route> you need use createBrowserHistory to create history object for it. Consider following example.


``` js
//Routers.js

import { createBrowserHistory } from 'history';
// import createBrowserHistory to create react history object for header component
const history = createBrowserHistory();
// ...
class Routers extends Component{
  render(){
    return (

    <BrowserRouter  basename="/platform">
      <div>
        <Header history={history}></Header>
        // set history as Header.js's props without createBrowserHistory you will not able to access history here.

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
