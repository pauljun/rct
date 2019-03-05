import { observable, autorun, action } from 'mobx';
import cookie from 'js-cookie';

window.timeDifference = 0;

class user {
  @observable isLogin = false;
  @observable systemConfig = {};
  @observable userInfo = {};
  @observable appInfo = {};
  // 布控一体机导入文件成功路径
  @observable filePath = '';
  // 获取系统时间的误差
  @observable timeDifference = 0;


  /**
   * 获取系统服务器时间
   */
  get systemTime() {
    return Date.now() - this.timeDifference;
  }

  @action
  updateFilePath(filePath) {
    this.filePath = filePath;
  }

  @action
  clearStore() {
    this.timeDifference = 0;
    this.isLogin = false;
    this.systemConfig = {};
    this.appInfo = {};
    sessionStorage.removeItem('isLogin');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('systemConfig');
    sessionStorage.removeItem('appInfo');
  }

  /**
   * 修改登陆状态
   * @param {Boolean} flag
   */
  @action
  setLoginState(flag) {
    this.isLogin = flag;
    Utils.setCache('isLogin', flag, 'session');
  }

  /**
   * 更新用户信息
   * @param {Object} userInfo
   */
  @action
  setUserInfo(userInfo) {
    this.userInfo = userInfo;
    Utils.setCache('userInfo', userInfo, 'session');
  }

  /**
   * 获取系统信息
   * @param {} info
   */
  @action
  setSystemConfig(info) {
    document.title = info.systemName || '羚眸';
    this.systemConfig = info;
    Utils.setCache('systemConfig', info, 'session');
  }

  @action
  updateUserAvatar(url) {
    this.userInfo.userAvatarUrl = url;
  }

  /**
   * 获取运营中心信息
   * @param {*} info
   */
  @action
  setCenterInfo(info) {
    this.appInfo = info;
    Utils.setCache('appInfo', info, 'session');
  }

  @action
  setSystemTimeDef(num) {
    if (this.timeDifference === 0 || num < this.timeDifference * 2) {
      window.timeDifference = this.timeDifference = num;
    }
  }

  @action
  logout(flag) {
    if (!window.ReactHistory) {
      return;
    }
    const { pathname, search } = window.ReactHistory.location;
    Service.user.loginOut().then(() => {
      BaseStore.user.clearStore();
      let loginType = cookie.get('loginType') || '';
      const url = encodeURIComponent(`${pathname}${search}`);
      if (loginType && loginType !== 'undefined') {
        window.ReactHistory.replace(`/login/${loginType}${!flag ? `?redirect=${url}` : ''}`);
      } else {
        window.ReactHistory.replace(`/login${!flag ? `?redirect=${url}` : ''}`);
      }
      BaseStore.device.clearStore();
      BaseStore.organization.clearStore();
      BaseStore.tab.clearStore();
      BaseStore.menu.clearStore();
      sessionStorage.clear();
    });
  }

  constructor() {
    autorun(() => {
      const isLogin = Utils.getCache('isLogin', 'session');
      const userInfo = Utils.getCache('userInfo', 'session') || {};
      const appInfo = Utils.getCache('appInfo', 'session') || {};
      const systemConfig = Utils.getCache('systemConfig', 'session') || {};
      this.setLoginState(!!isLogin);
      this.setUserInfo(userInfo);
      this.setCenterInfo(appInfo);
      this.setSystemConfig(systemConfig);
    });
  }
}
export default new user();
