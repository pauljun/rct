import React from 'react';
import { Layout, Button } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import TabContainer from './TabContainer';
import RootHead from './Header';
import ThemeConfig from 'src/assets/theme/index';

const { Content, Header } = Layout;

const ImageView = Loader.loadBaseComponent('ImageView');
const Logo = '/resource/image/logo.png';

@withRouter
@inject('user')
@observer
class ContentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }
  changeTheme = (theme, themeName) => {
    window.less
      .modifyVars(theme)
      .then(() => {
        SocketEmitter.emit(SocketEmitter.eventName.themeChange, theme);
        console.log(' theme change success ');
      })
      .catch(error => {
        console.log(' theme error ', error);
      });
  };
  render() {
    const { user } = this.props;
    const { systemConfig, appInfo } = user;
    return (
      <Content className="content-wrapper">
        <Header className="container-header">
          <div className="logo">
            <span className="logo-img">
              <ImageView src={systemConfig.systemLogo || appInfo.systemLogoUrl} defaultSrc={Logo} />
            </span>
            <span className="logo-name">{systemConfig.systemName || appInfo.operationCenterName}</span>
          </div>
          <div className="user-Action">
            {/* <ThemeGroup changeTheme={this.changeTheme} /> */}
            <RootHead showMediaLibrary={this.props.showMediaLibrary} />
          </div>
        </Header>
        <TabContainer />
      </Content>
    );
  }
}

function ThemeGroup({ changeTheme }) {
  return (
    <div className="theme-btn">
      {ThemeConfig.map(v => (
        <Button type="primary" onClick={() => changeTheme(v.value, v.name)}>
          {v.label}
        </Button>
      ))}
    </div>
  );
}

export default ContentView;
