import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

let App;

if (process.env.NODE_ENV !== 'production') {
  AuthConfig.menu.findIndex(v => v.name === 'test') === -1 &&
    AuthConfig.menu.push({
      id: '9527',
      code: '',
      name: 'test',
      isHide: false,
      icon: 'icon-People_Other_Main',
      menuName: '测试页面',
      title: '测试页面',
      storeName: '',
      parentId: '',
      isLocal: true
    });

  let utils = require('./utils').default;
  let dict = require('./dict').default;
  let LM_DB = require('./db').default;
  
  window.Utils = utils;
  window.Dict = dict;
  window.LM_DB = LM_DB;

  let loader = require('./loader').default;
  window.Loader = loader;

  let decorator = require('./decorator').default;
  window.Decorator = decorator;

  let service = require('./service').default;
  window.Service = service;

  let shared = require('./shared').default;
  window.Shared = shared;

  let map = require('./map').default;
  window.LMap = map;

  let socketEmitter = require('./libs/event/socketEmitter').default;
  window.SocketEmitter = socketEmitter;

  let businessStores = require('./store/business').default;
  let baseStores = require('./store/base').default;

  window.BusinessStore = businessStores;
  window.BaseStore = baseStores;

  App = require('./businessComponents/AppComponent').default;
} else {
  App = Loader.loadBusinessComponent('AppComponent');
}


ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();
