import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';

import LayoutView from '../Layout';

const { Loading, NoPage } = Loader;

@withRouter
@inject('tab', 'user', 'menu', 'device')
@observer
class HomeComponent extends Component {
  constructor(props) {
    super(props);
    let { user, history } = props;
    window.ReactHistory = history;
    this.state = {
      isInitData: false,
      initError: false,
      isRedirect: false
    };
    if (!user.isLogin) {
      user.logout();
      return;
    }
    this.timer = null;

    this.startComputedSystemTime();
  }

  startComputedSystemTime() {
    this.computedSystemTimeDef();
    this.timer = setInterval(() => {
      this.computedSystemTimeDef();
    }, 60 * 1000);
  }

  systemDef() {
    let time = Date.now().valueOf();
    return Service.user.getServerTimeStamp().then(res => {
      let def = Date.now().valueOf() - time;
      return Date.now().valueOf() - res + def;
    });
  }

  computedSystemTimeDef() {
    let { user } = this.props;
    let arr = [];
    for (let i = 0; i < 2; i++) {
      arr.push(this.systemDef());
    }
    return Promise.all(arr).then(res => {
      let num = res.reduce((c, n) => c + n);
      user.setSystemTimeDef(Math.round(num / 2));
    });
  }
  componentDidMount() {
    let { user } = this.props;
    
    if (!user.isLogin) {
      return;
    }
    message.config({
      top: 52,
      maxCount: 5
    });
    this.initialization()
      .then(() => {
        this.goDefaultPage();
        setTimeout(() => {
          this.setState({ isInitData: true });
        }, 10);
      })
      .catch(e => {
        console.error(e);
        this.setState({ initError: true, isInitData: true });
      });
  }

  async initialization() {
    const { user, menu, device } = this.props;
    const result = await Service.user.queryUserInfo({
      id: Utils.getCache('userId', 'session')
    });
    const userInfo = result.data;
    SocketEmitter.connect();

    const resultArr = await Promise.all([
      Service.privilege.queryUserPrivileges(userInfo.id),
      Service.operation.queryOperationCenterMenuAndPrivileges(userInfo.operationCenterId), //获取运营中心菜单
      Service.operation.operationCenterInfo(userInfo.operationCenterId), //获取运营中心信息
      Service.user.getSystemInfo(userInfo.id), //获取用户系统信息
      Service.dictionary.queryAll(), //查询字典
      Service.device.queryUserDevices({ offset: 0, limit: 100000 }),

      Shared.queryOrganizationDevice(),
      Shared.queryPlaceDeviceAndPerson()
      // this.Initialization()
    ]);
    //TODO 设置用户信息
    user.setUserInfo(userInfo);

    //TODO 设置用户权限
    menu.setAuth(resultArr[0].data.menus, resultArr[0].data.privileges);

    //TODO 设置当前用户所在运营中心支持的菜单
    menu.setCenterMenu(resultArr[1].data.menus);

    //TODO 设置运营中心信息
    user.setCenterInfo(resultArr[2].data);

    //TODO 设置应用信息
    user.setSystemConfig(resultArr[3].data);

    Dict.append(resultArr[4].data);

    device.setDeviceList(resultArr[5].data.list);
  }

  goDefaultPage(index = 0) {
    const { menu, tab, location, isRedirect } = this.props;
    if (!isRedirect) {
      this.setState({ isRedirect: true });
      return false;
    }
    const moduleName = menu.currentMenu;
    const moduleInfo = menu.getInfoByName(moduleName);
    if (moduleInfo) {
      tab.goPage({
        moduleName: moduleName,
        location,
        action: 'replace',
        isUpdate: true
      });
      menu.setCurrentMenu(moduleName);
    } else {
      let menuName;
      let includeNames = menu.userMenuList[index].includeNames;
      if (Array.isArray(includeNames) && includeNames.length > 0) {
        for (let i in includeNames) {
          let menuItem = menu.getInfoByName(includeNames[i]);
          if (menuItem) {
            menuName = includeNames[i];
            break;
          }
        }
        !menuName && this.goDefaultPage(index++);
      } else {
        menuName = menu.userMenuList[0].name;
      }
      let module = menu.getInfoByName(menuName);
      if (module) {
        console.log('跳转默认', module);
        tab.goPage({
          moduleName: module.name,
          location,
          action: 'replace',
          isUpdate: true
        });
        let item = menu.findCurrentMenu(module.id);
        menu.setCurrentMenu(item.name);
      }
    }
  }

  componentDidUpdate() {
    const { user } = this.props;
    if (!user.isLogin) {
      user.logout();
    }
  }

  componentWillUnmount() {
    SocketEmitter.disconnect();
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    const { isInitData, isRedirect, initError } = this.state;
    if (!isInitData) {
      return <Loading />;
    }
    if (initError) {
      return <NoPage />;
    }

    return <LayoutView isRedirect={isRedirect} />;
  }
}
export default HomeComponent;
