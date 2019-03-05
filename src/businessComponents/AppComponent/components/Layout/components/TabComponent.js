import React, { createContext } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

const { Provider, Consumer } = Shared.tabContext;

const NoPage = Loader.NoPage;

@withRouter
@inject('tab')
class TabComponent extends React.Component {
  constructor(props) {
    super(props);
    const { module } = props;
    this.state = {
      ModuleComponent: module ? Loader.loadModuleComponent(module.name) : null
    };
  }
  shouldComponentUpdate(nextProps) {
    const { tab } = nextProps;
    return tab.currentId === this.props.storeId;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.module !== this.props.module) {
      this.setState({
        ModuleComponent: Loader.loadModuleComponent(nextProps.module.name)
      });
    }
  }

  render() {
    const { ModuleComponent } = this.state;
    const { location, tabIndex, storeId } = this.props;
    return (
      <Provider value={{ tabIndex, storeId }}>
        <Consumer>
          {context =>
            ModuleComponent ? (
              <ModuleComponent
                location={location}
                tabIndex={context.tabIndex}
                storeId={context.storeId}
              />
            ) : (
              <NoPage />
            )
          }
        </Consumer>
      </Provider>
    );
  }
}
export default TabComponent;
