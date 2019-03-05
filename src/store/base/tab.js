import { action, observable, autorun, toJS } from 'mobx';

const libIndex = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t';
const tabIndexLibs = libIndex.split(',');
const { uuid, getCache, setCache } = Utils;
class tab {
  constructor() {
    autorun(() => {
      this.initTab();
    });
  }

  @observable
  tabIndex = null;

  @observable
  tabList = [];

  @observable
  currentId = null;

  @action
  clearStore() {
    this.tabIndex = null;
    this.tabList = [];
    this.currentId = null;
  }
  /**
   * 初始化store
   */
  @action
  initTab() {
    this.currentId = getCache('currentId', 'session');
    this.tabList = getCache('tabList', 'session') || [];
    const currentId = this.findTabByStoreId(this.currentId);
    if (currentId) {
      this.tabIndex = currentId.index;
      this.saveStoreData(currentId.storeName, currentId.location.state);
      this.updateTabItem(currentId);
    } else {
      this.tabIndex = libIndex[0];
    }
  }

  /**
   * 根据id获取tab数据
   * @param {string} storeId
   */
  findTabByStoreId(storeId) {
    let item = this.tabList.filter(v => storeId === v.id)[0];
    return toJS(item);
  }

  /**
   * 根据tabIndex返回对应的tab数据
   * @param {string} tabIndex
   */
  findTabByTabIndex(tabIndex) {
    let item = this.tabList.filter(v => tabIndex === v.index)[0];
    return toJS(item);
  }

  /**
   * 验证tabIndex是否符合规针
   * @param {string} tabIndex
   */
  vaildateTabIndex(tabIndex) {
    return tabIndexLibs.indexOf(tabIndex) > -1;
  }

  /**
   * 设置激活的tab标记
   * @param {string} storeId
   */
  @action
  setActiveTab(storeId) {
    this.currentId = storeId;
    setCache('currentId', storeId, 'session');
  }
  goPage({
    moduleName,
    location = window.ReactHistory.location,
    data = {},
    state = {},
    isUpdate = false, // false:新开 true:替换
    action = 'push'
  }) {
    let str = '';
    let keyArr = Object.keys(data);
    if (keyArr.length > 0) {
      keyArr.map((key, index) => {
        str += `${key}=${data[key]}${index !== keyArr.length - 1 ? '&' : ''}`;
      });
      location.search = `?${str}`;
    } else {
      location.search = '';
    }
    const module = BaseStore.menu.getInfoByName(moduleName);
    if (module) {
      !isUpdate
        ? this.openTab({ module, state, location, action })
        : this.updateTab({ module, state, location, action });
    }
  }

  /**
   * 获取当前可用的tabIndex，没有返回undefined
   */
  getFreeTabIndex() {
    let freeTabIndex = [];
    let busyTabIndex = this.tabList.map(v => v.index);
    tabIndexLibs.map(item => {
      if (busyTabIndex.indexOf(item) === -1) {
        freeTabIndex.push(item);
      }
    });
    return freeTabIndex[0];
  }

  /**
   * 新开tab标签
   * @param {Object} module
   * @param {Object} location
   */
  @action
  openTab({ module, location, state, action = 'push' }) {
    let tabIndex = this.getFreeTabIndex();
    if (this.tabList.length > 0) {
      let thisTab = this.findTabByStoreId(this.currentId);
      if (thisTab) {
        const oldStoreData = toJS(this.getStoreData(thisTab.storeName));
        if (thisTab.location.state && thisTab.location.state.pageState) {
          thisTab.location.state = Object.assign({}, oldStoreData, {
            pageState: toJS(thisTab.location.state.pageState)
          });
        } else {
          thisTab.location.state = oldStoreData;
        }
        this.updateTabItem(thisTab);
        this.clearStoreData(module.storeName);
      }
    }
    if (!tabIndex) {
      this.updateTab({ module, location, state, action });
    } else {
      //先更新tabIndex
      this.tabIndex = tabIndex;

      let newLocation = location;
      newLocation.pathname = `/${tabIndex}/${module.url}`;
      newLocation.state = state ? { pageState: state } : null;
      let id = uuid();
      let newTab = {
        moduleName: module.name,
        menuName: module.menuName,
        id: id,
        index: tabIndex,
        storeName: module.storeName,
        location: newLocation,
        icon: module.icon
      };
      this.setActiveTab(id);
      this.addTabList(newTab);
      window.ReactHistory[action](newLocation);
    }
  }

  /**
   * 增加一个tab数据
   * @param {Object} tab
   */
  @action
  addTabList(tab) {
    this.tabList.push(tab);
    setCache('tabList', this.tabList, 'session');
  }

  /**
   * 更新tab页签
   * @param {object} module
   * @param {object} location
   * @param {string} action
   */
  @action
  updateTab({ module, location, state, action = 'push' }) {
    let tab = this.findTabByStoreId(this.currentId);
    if (!tab) {
      this.openTab({ module, location, state, action });
    } else {
      const isClear = tab.moduleName !== module.name;
      tab.location = location;
      tab.location.state = state ? { pageState: state } : null;
      tab.location.pathname = `/${tab.index}/${module.url}`;
      tab.moduleName = module.name;
      tab.menuName = module.menuName;
      tab.storeName = module.storeName;
      tab.icon = module.icon;
      isClear && this.clearStoreData(tab.storeName);
      this.updateTabItem(tab);

      window.ReactHistory[action](tab.location);
    }
  }

  /**
   * 更新单个tab数据
   * @param {Object} newTab
   */
  @action
  updateTabItem(newTab) {
    for (let i = 0, l = this.tabList.length; i < l; i++) {
      if (this.tabList[i].id === newTab.id) {
        this.tabList[i] = newTab;
        break;
      }
    }
    setCache('tabList', this.tabList, 'session');
  }

  closeCurrentTab({ action = 'push' }) {
    this.deleteTab(this.currentId, action);
  }

  /**
   * 删除tab
   * @param {string} storeId
   * @param {string} action
   */
  @action
  deleteTab(storeId, action = 'push') {
    let tabList = toJS(this.tabList);
    if (tabList.length === 1) {
      return;
    }
    let index = this.tabList.findIndex(v => v.id === storeId);

    let delTab = tabList[index];

    if (delTab.id === this.currentId) {
      let newTab;
      newTab = this.tabList[index + 1]
        ? tabList[index + 1]
        : tabList[index - 1];
      this.setActiveTab(newTab.id);
      this.saveStoreData(newTab.storeName, newTab.location.state);
      window.ReactHistory[action](newTab.location);
    }
    tabList.splice(index, 1);
    this.tabList = tabList;
    setCache('tabList', this.tabList, 'session');
  }

  /**
   * 切换tab
   * @param {string} storeId
   * @param {string} action
   */
  @action
  changeTab(storeId, action = 'push') {
    //TODO 更新旧得tab，找到新得tab跳转
    let oldTab = this.findTabByStoreId(this.currentId);
    this.setActiveTab(storeId);
    let oldState = {};
    let oldStoreData = toJS(this.getStoreData(oldTab.storeName));
    if (oldTab.location.state && oldTab.location.state.pageState) {
      oldState = Object.assign({}, oldStoreData, {
        pageState: oldTab.location.state.pageState
      });
    } else {
      oldState = oldStoreData;
    }
    oldTab.location.state = oldState;
    this.updateTabItem(oldTab);
    let tab = this.findTabByStoreId(storeId);
    this.clearStoreData(tab.storeName);
    this.saveStoreData(tab.storeName, tab.location.state);
    this.updateTabItem(tab);
    window.ReactHistory[action](tab.location);
  }

  /**
   * 清除新开tab的store数据
   * @param {string} storeName
   */
  @action
  getStoreData(storeNames) {
    let state = {};
    if (storeNames) {
      storeNames.map(storeName => {
        state[storeName] = {};
        BusinessStore[storeName] &&
          Object.keys(BusinessStore[storeName]).map(key => {
            state[storeName][key] = toJS(BusinessStore[storeName][key]);
          });
      });
    }
    return state;
  }

  /**
   * 清空store
   * @param {string} storeName
   */
  @action
  clearStoreData(storeNames) {
    if (storeNames) {
      storeNames.map(storeName => {
        let store = BusinessStore[storeName];
        if (store) {
          if (typeof store.initData === 'function') {
            store.initData();
          } else {
            Object.keys(store).map(key => {
              store[key] = null;
            });
          }
        }
      });
    }
  }

  /**
   * 还原store
   * @param {string} storeName
   * @param {Object} state
   */
  @action
  saveStoreData(storeNames, state) {
    if (storeNames && window.BusinessStore) {
      storeNames.map(storeName => {
        let store = BusinessStore[storeName];
        let _state = state ? state[storeName] || {} : {};
        store &&
          Object.keys(_state).map(key => {
            store[key] = _state[key] || null;
          });
      });
    }
  }

  /**
   * 创建一个404页签
   * @param {Object} tab
   * @param {string} tabIndex
   */
  createNotFoundTab(tab, tabIndex) {
    if (tab) {
      tab.moduleName = '404';
      tab.menuName = 'Not Found';
      tab.storeName = null;
      tab.index = tabIndex;
      tab.location.pathname = `/${tabIndex ? tabIndex : this.tabIndex}/404`;
      tab.location.state = null;
      return tab;
    } else {
      return {
        id: uuid(),
        moduleName: '404',
        menuName: 'Not Found',
        storeName: null,
        index: tabIndex,
        location: {
          state: null
        }
      };
    }
  }

  /**
   * 浏览器刷新，前进，后退的处理方法
   * @param {string} tabIndex
   * @param {History} location
   * @param {string} moduleName
   */
  @action
  setPopStoreData({ tabIndex, location, module }) {
    let oldTab = this.findTabByStoreId(this.currentId);
    
    // TODO 当URL匹配的index违背规则的时候跳转404
    if (!this.vaildateTabIndex(tabIndex)) {
      let newTabIndex = this.getFreeTabIndex();
      let tab;
      if (newTabIndex) {
        tab = this.createNotFoundTab(null, newTabIndex);
        this.addTabList(tab);
      } else {
        tab = this.createNotFoundTab(oldTab, this.tabIndex);
        this.updateTabItem(tab);
      }
      this.setActiveTab(tab.id);
      window.ReactHistory.replace(tab.location);
      return false;
    }
    let newTab = this.findTabByTabIndex(tabIndex);
    if (oldTab && oldTab !== newTab) {
      let oldState = this.getStoreData(oldTab.storeName);
      if (oldTab.location.state && oldTab.location.state.pageState) {
        oldTab.location.state = {
          pageState: { ...oldTab.location.state.pageState },
          ...oldState
        };
      } else {
        oldTab.location.state = oldState;
      }

      this.updateTabItem(oldTab);
    }

    // TODO 当URL匹配到index对应的tab 同时匹配到Module
    if (newTab && module) {
      this.clearStoreData(newTab.storeName);
      let newLocation = {
        ...location,
        state: newTab.location.state,
        key: newTab.location.key
      };
      newTab.location = newLocation;
      newTab.moduleName = module.name;
      newTab.storeName = module.storeName;
      newTab.menuName = module.menuName;
      newTab.icon = module.icon;
      this.saveStoreData(newTab.storeName, newTab.location.state);
      this.updateTabItem(newTab);
      this.setActiveTab(newTab.id);
      return false;
    }

    // TODO URL的index没有匹配到tab但匹配到module
    if (module) {
      let newLocation = location;
      newLocation.pathname = `/${tabIndex}/${module.url}`;
      let id = uuid();
      let newTab = {
        moduleName: module.name,
        menuName: module.menuName,
        id: id,
        index: tabIndex,
        storeName: module.storeName,
        location: newLocation,
        icon: module.icon
      };
      this.saveStoreData(newTab.storeName, newTab.location.state);
      this.setActiveTab(id);
      this.addTabList(newTab);
      this.tabIndex = newTab.index;
    } else {
      // TODO URL的index没有匹配到tab和module
      let newTabIndex = this.getFreeTabIndex();
      let tab;
      if (newTabIndex) {
        tab = this.createNotFoundTab(null, newTabIndex);
        this.addTabList(tab);
      } else {
        tab = this.createNotFoundTab(oldTab, this.tabIndex);
        this.updateTabItem(tab);
      }
      this.setActiveTab(tab.id);
      window.ReactHistory.replace(tab.location);
    }
  }
}

export default new tab();
