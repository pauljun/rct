import React from 'react';
import NoPage from './components/NoPage';
import NoData from './components/NoData';
import Loading from './components/Loading';
import LoadError from './components/LoadError';

/**
 * 加载模块组件
 * @param {string} name
 */
function loadModuleComponent(name, exportName) {
  return loadComponent(name, 'moduleComponent', exportName);
}

/**
 * 加载基础组件
 * @param {string} name
 */
function loadBaseComponent(name, exportName) {
  return loadComponent(name, 'baseComponent', exportName);
}

/**
 * 加载业务组件
 * @param {string} name
 */
function loadBusinessComponent(name, exportName) {
  return loadComponent(name, 'businessComponent', exportName);
}

function systemImport(output, exportName) {
  return window.System.import(output).then(module => {
    return exportName ? module.default[exportName] : module.default;
  });
}

let loaderCss = {};

function loaderStyle(name) {
  return new Promise((resolve, reject) => {
    if (!ModuleCssConfig[name] || loaderCss[name]) {
      resolve();
    } else {
      loaderCss[name] = true;
      let link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', ModuleCssConfig[name]);
      link.addEventListener('load', () => {
        resolve();
      });
      link.addEventListener('error', e => {
        reject(e);
      });
      document.head.appendChild(link);
    }
  });
}

if (process.env.NODE_ENV === 'production') {
  loaderStyle('map');
  loaderStyle('loader');
}

/**
 * 加载js
 * @param {string} name
 */
function loadScript(name, exportName) {
  if (process.env.NODE_ENV === 'production') {
    return loaderStyle(name).then(() => systemImport(`${ModuleConfig[name].output}`, exportName));
  } else {
    if(!ModuleConfig[name].input){
      return loaderStyle(name).then(() => systemImport(`${ModuleConfig[name].output}`, exportName));
    }
    const path = ModuleConfig[name].input.replace(/^src\//, '');
    return import('src/' + path).then(module => {
      return exportName ? module.default[exportName] : module.default;
    });
  }
}

function loadComponent(name, moduleName, exportName) {
  class LoadWrapComponent extends React.Component {
    constructor() {
      super();
      this.state = { C: null, isError: false, loaded: false };
      this.isModule = moduleName === 'moduleComponent';
      this.isDone = false;
    }
    componentDidUpdate() {
      const { isError, loaded } = this.state;
      if (loaded && !this.isDone && !isError) {
        this.isDone = true;
        this.props.loadSuccess && this.props.loadSuccess();
      }
    }
    componentDidCatch(error, info) {
      console.error(error, info);
      console.warn(`loaderror -> name:${name}, moduleName:${moduleName}, exportName:${exportName}`);
      this.setState({ isError: true });
    }
    async componentDidMount() {
      if (!ModuleConfig[name]) {
        //TODO 404处理
        this.setState({ C: NoPage });
      }
      try {
        const entry = await loadScript(name, exportName);
        entry
          ? this.setState({ C: entry, loaded: true })
          : this.setState({
              C: this.isModule ? NoPage : LoadError,
              isError: true,
              loaded: true
            });
      } catch (e) {
        console.error(e);
        //TODO 错误处理
        this.setState({ C: this.isModule ? NoPage : LoadError, isError: true });
      }
    }
    render() {
      const { forwardRef, loadSuccess, ...props } = this.props;
      const { C, isError } = this.state;
      let loadProps;
      if (isError) {
        loadProps = { moduleName, name };
        return <LoadError {...loadProps} />;
      }
      return C ? <C {...props} ref={forwardRef} /> : this.isModule ? <Loading /> : null;
    }
  }
  return React.forwardRef((props, ref) => <LoadWrapComponent {...props} forwardRef={ref} />);
}

function loadDecComponent({ name, exportName, Component, hasArgs, args }) {
  class LoadWrapComponent extends React.Component {
    constructor() {
      super();
      this.state = { C: null, isError: false, loaded: false };
      this.isDone = false;
    }
    componentDidUpdate() {
      const { isError, loaded } = this.state;
      if (loaded && !this.isDone && !isError) {
        this.isDone = true;
        this.props.loadSuccess && this.props.loadSuccess();
      }
    }

    async componentDidMount() {
      if (!ModuleConfig[name]) {
        //TODO 404处理
        this.setState({ C: NoPage });
      }
      try {
        const dec = await loadScript(name, exportName);
        dec
          ? this.setState({
              C: hasArgs ? dec(...args)(Component) : dec(Component),
              loaded: true
            })
          : this.setState({
              C: Component,
              isError: true,
              loaded: true
            });
      } catch (e) {
        console.error(e);
        //TODO 错误处理
        this.setState({ C: Component, isError: true });
      }
    }
    render() {
      const { forwardRef, loadSuccess, ...props } = this.props;
      const { C, isError } = this.state;
      if (isError) {
        console.error(`load dec error name:${name} exportName:${exportName}`);
      }
      return C ? <C {...props} ref={forwardRef} /> : <Loading />;
    }
  }
  return React.forwardRef((props, ref) => <LoadWrapComponent {...props} forwardRef={ref} />);
}

const Loader = {
  loadBaseComponent,
  loadBusinessComponent,
  loadComponent,
  loadModuleComponent,
  loadDecComponent,
  loadScript,
  loaderStyle,
  NoPage,
  NoData,
  Loading
};

export default Loader;
