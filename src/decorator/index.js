import React from 'react';
import { Provider, inject } from 'mobx-react';
import { isEmpty } from 'lodash';

/**
 * 不可修改
 * @param {Object} target
 * @param {string} name
 * @param {object.descriptor} descriptor
 */
function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

/**
 * 不可枚举
 * @param {Object} target
 * @param {string} name
 * @param {object.descriptor} descriptor
 */
function unenumerable(target, name, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

/**
 * 错误边界处理
 * @param {Component} WrappedComponent
 */
function errorBoundary(WrappedComponent) {
  class ErrorBoundaryWithComponent extends React.Component {
    constructor() {
      super();
      this.ErrorBoundary = Loader.loadBaseComponent('ErrorBoundary');
    }
    componentWillUnmount() {
      this.ErrorBoundary = null;
    }
    render() {
      const ErrorBoundary = this.ErrorBoundary;
      const { forwardRef, ...props } = this.props;
      return (
        <ErrorBoundary>
          <WrappedComponent {...props} ref={forwardRef} />
        </ErrorBoundary>
      );
    }
  }
  return React.forwardRef((props, ref) => <ErrorBoundaryWithComponent {...props} forwardRef={ref} />);
}

/**
 * 注入业务组件的Stores,同时可注入globalstore 注入后组件不需要再inject
 * @param  {...any} props
 */
function businessProvider(...props) {
  let store = {};
  props.map(storeName => {
    if (BusinessStore[storeName]) {
      store[storeName] = BusinessStore[storeName];
    } else {
      // throw new Error(
      //   `不存在${storeName},请查看/src/store/Module/index.js 是否挂载！`
      // );
    }
  });
  return function(WrappedComponent) {
    const ModuleInject = inject(...props)(WrappedComponent);
    class InjectWrappedComponent extends React.Component {
      render() {
        const { forwardRef, ...props } = this.props;
        return isEmpty(store) ? (
          <ModuleInject {...props} ref={forwardRef} />
        ) : (
          <Provider {...store}>
            <ModuleInject {...props} ref={forwardRef} />
          </Provider>
        );
      }
    }
    return React.forwardRef((props, ref) => <InjectWrappedComponent {...props} forwardRef={ref} />);
  };
}

/**
 * @desc 深层判断 组件是否更新
 * @param {*} component
 */
function shouldComponentUpdate(component) {
  const shouldCustomUpdate = component.prototype.shouldComponentUpdate;
  if (!shouldCustomUpdate) {
    component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
      let oldProps, newProps;
      if (this.props.children) {
        const { children, ...props } = this.props;
        oldProps = props;
      } else {
        oldProps = this.props;
      }
      if (nextProps.children) {
        const { children, ...props } = nextProps;
        newProps = props;
      } else {
        newProps = nextProps;
      }
      const isPropsEqual = Utils.isEqual(oldProps, newProps);
      const isStateEqual = Utils.isEqual(this.state, nextState);
      if ((!isPropsEqual && !isStateEqual) || (!isPropsEqual && isStateEqual) || (isPropsEqual && !isStateEqual)) {
        return true;
      }
      if (isPropsEqual && isPropsEqual) {
        return false;
      }
    };
  }
}

/**
 * 注入组件actions，当BaseStore.actionPanel下的actions符合条件时，
 * 当前组件会注入’disabled‘属性 和action-panel，disable-sapce的className，设置了鼠标禁用和透明度0.8的样式
 * 组件内部需要实现disabled是的逻辑
 * @param  {...any} names
 */
function withActionPanel({ condition, names }) {
  return function(Component) {
    class WithActionPanelWrapComponent extends React.Component {
      constructor() {
        super();
        this.ActionPanel = Loader.loadBusinessComponent('ActionPanel');
      }
      componentWillUnmount() {
        this.ActionPanel = null;
      }
      render() {
        const ActionPanel = this.ActionPanel;
        const { forwardRef, ...props } = this.props;
        return (
          <ActionPanel condition={condition} actionNames={names}>
            <Component {...props} ref={forwardRef} />
          </ActionPanel>
        );
      }
    }
    return React.forwardRef((props, ref) => <WithActionPanelWrapComponent {...props} forwardRef={ref} />);
  };
}

/**
 * 记录进入日志
 * @param  { code } 操作功能code
 * @param  { parent } 操作模块code
 */
function withEntryLog(config) {
  return function(Component) {
    return class extends React.Component {
      componentDidMount() {
        if (config) {
          this.saveLog(config);
        } else {
          const infoList = Service.url.getLogInfoList();
          const pathname = window.location.pathname;
          const url = pathname.substring(3, pathname.length);
          const moduleInfo = BaseStore.menu.getInfoByUrl(url) || {};
          const params = infoList.find(v => v.moduleName === moduleInfo.name);
          params && this.saveLog(params);
        }
      }
      saveLog(params) {
        Service.logger.save({
          code: params.code,
          parent: params.parent
        });
      }
      render() {
        return <Component {...this.props} />;
      }
    };
  };
}

function withTab(Component) {
  const { Consumer } = Shared.tabContext;
  class WithTabConponent extends React.Component {
    render() {
      const { forwardRef, ...props } = this.props;
      return <Consumer>{context => <Component {...context} {...props} ref={forwardRef} />}</Consumer>;
    }
  }
  return React.forwardRef((props, ref) => <WithTabConponent {...props} forwardRef={ref} />);
}

const Decorator = {
  readonly,
  unenumerable,
  errorBoundary,
  businessProvider,
  shouldComponentUpdate,
  withActionPanel,
  withEntryLog,
  withTab
};

export default Decorator;
