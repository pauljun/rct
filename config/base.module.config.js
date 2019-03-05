/**
 * input webpack entry
 * output systemJS import cnd url //编译目录在 /public/static/js/[name].js
 * 请不要随意修改！
 */

const pages = require('./page.config');
const components = require('./components.config');

let moduleConfig = {
  login: {
    input: 'src/pages/login/index.js',
    output: '/static/js/pages/login.js',
    isPage: true
  }
};

pages.map(v => {
  //TODO isPage决定是否是一个路由级别的配置
  if (v.noPage) {
    moduleConfig[v.name] = {
      isPage: false,
      ...v
    };
  } else {
    moduleConfig[v.name] = {
      input: `src/pages/${v.name}/index.js`,
      output: `/static/js/pages/${v.name}.js`,
      isPage: true,
      ...v
    };
  }
});

/**
 *  @desc isLib 决定compile all 时是不回执行的
 */
const libraryConfig = {
  EchartsReact: {
    input: 'src/libs/echarts-for-react/index.js',
    output: '/static/js/libs/EchartsReact.min.js',
    globalName: 'EchartsReact',
    isLib: true
  },
  ReactDnD: {
    input: 'src/libs/react-dnd/index.js',
    output: '/static/js/libs/ReactDnD.min.js',
    globalName: 'ReactDnD',
    isLib: true
  },
  HTML5Backend: {
    input: 'src/libs/react-dnd-html5-backend/index.js',
    output: '/static/js/libs/HTML5Backend.min.js',
    globalName: 'HTML5Backend',
    isLib: true
  },
  ReactVirtualized: {
    input: 'src/libs/react-virtualized/index.js',
    output: '/static/js/libs/ReactVirtualized.min.js',
    globalName: 'ReactVirtualized',
    isLib: true
  }
};

const dependenceConfig = {
  utils: {
    input: 'src/utils/index.js',
    output: '/static/js/utils/utils.js',
    globalName: 'Utils',
    isDep: true
  },
  db: {
    input: 'src/db/index.js',
    output: '/static/js/db/db.js',
    globalName: 'LM_DB',
    isDep: true
  },
  dict: {
    input: 'src/dict/index.js',
    output: '/static/js/dict/dict.js',
    globalName: 'Dict',
    isDep: true
  },
  socketEmitter: {
    input: 'src/libs/event/socketEmitter.js',
    output: '/static/js/libs/socketEmitter.js',
    globalName: 'SocketEmitter',
    isDep: true
  },
  service: {
    input: 'src/service/index.js',
    output: '/static/js/service/service.js',
    globalName: 'Service',
    isDep: true
  },
  loader: {
    input: 'src/loader/index.js',
    output: '/static/js/loader/loader.js',
    globalName: 'Loader',
    isDep: true
  },
  decorator: {
    input: 'src/decorator/index.js',
    output: '/static/js/decorator/decorator.js',
    globalName: 'Decorator',
    isDep: true
  },
  baseStore: {
    input: 'src/store/base/index.js',
    output: '/static/js/store/baseStore.js',
    globalName: 'BaseStore',
    isDep: true
  },
  businessStore: {
    input: 'src/store/business/index.js',
    output: '/static/js/store/businessStore.js',
    globalName: 'BusinessStore',
    isDep: true
  },
  map: {
    input: 'src/map/index.js',
    output: '/static/js/map/map.js',
    globalName: 'LMap',
    isDep: true
  },
  shared: {
    input: 'src/shared/index.js',
    output: '/static/js/shared/shared.js',
    globalName: 'Shared',
    isDep: true
  }
};

module.exports = {
  ...dependenceConfig,
  ...components.baseComponent,
  ...components.businessComponent,
  ...libraryConfig,
  ...moduleConfig
};
