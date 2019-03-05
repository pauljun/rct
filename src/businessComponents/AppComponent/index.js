import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomeComponent from './components/Home';
import { Provider } from 'mobx-react';
import { LocaleProvider ,locales} from 'antd';
import { hot } from 'react-hot-loader';

import 'src/assets/style/main.less';
import './style/index.less';

const LoginView = Loader.loadModuleComponent('login');

class App extends Component {
  render() {    
    return (
      <LocaleProvider locale={locales.zh_CN}>
        <Provider {...BaseStore}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/login" render={() => <LoginView />} />
              <Route exact path="/login/:id" render={() => <LoginView />} />
              <Route
                path="/:tabIndex/:module"
                render={() => <HomeComponent />}
              />
              <Route
                path="/"
                render={() => <HomeComponent isRedirect={true} />}
              />
            </Switch>
          </BrowserRouter>
        </Provider>
      </LocaleProvider>
    );
  }
}
export default hot(module)(App)
