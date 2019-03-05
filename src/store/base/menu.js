import { observable, action, computed, toJS, autorun } from 'mobx';
import { orderBy } from 'lodash';

let pageConfig = [];
for (let k in ModuleConfig) {
  if (ModuleConfig[k].isPage) {
    pageConfig.push(ModuleConfig[k]);
  }
}

let menuPermissions = AuthConfig.menu;
let funcPermissions = AuthConfig.func;

for (let k in menuPermissions) {
  let item = pageConfig.find(v => v.name === menuPermissions[k].name);
  if (item && item.url) {
    menuPermissions[k].url = item.url;
  }
}

for (let k in funcPermissions) {
  let item = pageConfig.find(v => v.name === funcPermissions[k].name);
  if (item && item.url) {
    funcPermissions[k].url = item.url;
  }
}

class menu {
  // 当前用户模块权限列表
  @observable auth = {
    menu: [], //[],
    func: [] //[]
  };

  @observable centerMenuList = []; //[]; //当前运营中心支持的菜单

  @observable currentMenu = Utils.getCache('currentMenu', 'local') || ''; //默认选中的路由名称

  @action
  clearStore() {
    this.centerMenuList = [];
    this.currentMenu = '';
    this.auth = {
      menu: [],
      auth: []
    };
  }

  /**
   * 根据有权限的列表生成权限路由列表
   */
  @computed
  get authList() {
    return [].concat(this.auth.menu, this.auth.func);
  }

  /**
   * 根据name获取路由菜单和权限信息
   * @param {string} name
   */
  getInfoByName(name) {
    return this.authList.find(v => v.name === name);
  }

  /**
   * 根据url获取路由菜单和权限信息
   * @param {string} name
   */
  getInfoByUrl(url) {
    return this.authList.find(v => v.url === url);
  }

  /**
   * 根据id获取路由菜单和权限信息
   * @param {string} name
   */
  getInfoById(id) {
    return this.authList.find(v => v.id === id);
  }

  /**
   * @desc 根据id查找当前id所对应的menu
   * @param {string} id
   */
  findCurrentMenu(id) {
    let menuItem = this.getInfoById(id);
    if (this.auth.menu.findIndex(v => v.name === menuItem.name) > -1) {
      return menuItem;
    } else {
      if (menuItem.parentId) {
        return this.findCurrentMenu(menuItem.parentId);
      } else {
        return false;
      }
    }
  }

  /**
   * 修改当前选中的路由
   * @param {string} name
   */
  @action
  setCurrentMenu(name) {
    let module = this.getInfoByName(name);
    if (!!module && name !== this.currentMenu) {
      this.currentMenu = name;
      Utils.setCache('currentMenu', this.currentMenu, 'local');
    }
  }

  /**
   * 计算当前路由几何的树结构,过滤操作权限
   */
  @computed
  get userMenuList() {
    let arr = [];
    for (let i = 0, l = this.auth.menu.length; i < l; i++) {
      let menu = this.auth.menu[i];
      let item = this.centerMenuList.find(v => v.id == menu.id);
      if (item && menu.isHide !== true) {
        arr.push({
          id: item.id,
          parentId: item.parentId,
          icon: menu.icon,
          name: menu.name,
          url: menu.url,
          storeName: menu.storeName,
          menuName: item.menuName,
          title: menu.title,
          includeNames: menu.includeNames
        });
      }
    }
    return Utils.computTreeList(toJS(arr));
  }

  /**
   * 设置权限列表
   * @param {Array} menu
   * @param {Array} func
   */
  @action
  setAuth(menu, func) {
    let menuArr = menuPermissions.filter(v => v.isLocal);
    let funcArr = funcPermissions.filter(v => v.isLocal);
    let tempMenuArr = [];
    let tempFuncArr = [];
    menuPermissions.map(item => {
      const menuItem = menu.find(v => v.id == item.id);
      if (menuItem && menuArr.findIndex(v => v.id == item.id) === -1) {
        tempMenuArr.push({ ...item, menuName: menuItem.menuName, title: item.menuName, sort: `${menuItem.moduleSort}${menuItem.sort}` });
      }
    });
    funcPermissions.map(item => {
      const funcItem = func.find(v => v.id == item.id);
      if (funcItem && funcArr.findIndex(v => v.id == item.id) === -1) {
        tempFuncArr.push({ ...item, menuName: funcItem.privilegeName, title: item.menuName });
      }
    });
    tempMenuArr = orderBy(tempMenuArr, ['sort', 'desc']);
    this.auth = {
      menu: [].concat(tempMenuArr, menuArr),
      func: [].concat(tempFuncArr, funcArr)
    };
  }

  /**
   * 设置当前运营中心支持的菜单
   * @param {array} list
   */
  @action
  setCenterMenu(list) {
    let arr = [];
    const localMenu = AuthConfig.menu.filter(v => v.isLocal && v.id);
    for (let i in localMenu) {
      let item = list.find(v => v.id == localMenu[i].id);
      !item && arr.push(localMenu[i]);
    }
    this.centerMenuList = [].concat(list, arr);
  }
}

export default new menu();
