import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Layout } from 'antd';
import ContentView from './components/ContentView';
import SiderView from './components/Sider';
import MediaLibrary from '../MediaLibrary/index.js';
import ImportLibSocket from './components/ImportLibSocket.js';

import './style/index.less';

@Decorator.errorBoundary
@withRouter
@inject('menu', 'tab')
@observer
class LayoutView extends React.Component {
  constructor(props) {
    super(props);
    this.unlisten = null;
    this.timer = null;
    this.state = {
      mediaLibVisible: false // 视图库显隐状态
    };
  }

  componentWillMount() {
    const { history, menu, isRedirect } = this.props;
    this.unlisten = history.listen(location => {
      let url = location.pathname.substring(3, location.pathname.length);
      let currentModule = menu.getInfoByUrl(url);
      let menuItem = menu.findCurrentMenu(currentModule.id)
      menuItem && menu.setCurrentMenu(menuItem.name);
    });
    isRedirect && this.computedRenderModule(this.props, true);
  }
  
  
  componentWillReceiveProps(nextProps) {
    this.computedRenderModule(nextProps);
  }
  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.importLib, this.handelImportLib);
    this.unlisten();
  }
  computedRenderModule(props, flag) {
    const { history, match, location, tab, menu } = props;
    const { tabIndex } = match.params;
    const url = location.pathname.replace(`/${tabIndex}/`, '');
    const module = menu.getInfoByUrl(url);
    if (history.action === 'POP' || flag) {
      tab.setPopStoreData({ tabIndex, location, module });
    }
  }

  // 显示、隐藏视图库
  showMediaLibrary = () => {
    this.setState({
      mediaLibVisible: true
    });
  };

  hideMediaLib = () => {
    this.setState({
      mediaLibVisible: false
    });
  };

  render() {
    const { mediaLibVisible } = this.state;
    return (
      <Layout className="content-container">
        <div id="insert-container" />
        <SiderView />
        <ContentView showMediaLibrary={this.showMediaLibrary} />
        <MediaLibrary hideMediaLib={this.hideMediaLib} isVisible={mediaLibVisible} />
        <ImportLibSocket />
      </Layout>
    );
  }
}
export default LayoutView;
