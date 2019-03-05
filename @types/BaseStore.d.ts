declare namespace BaseStore {
  declare namespace user {
    declare var isLogin: boolean;
    declare var systemConfig: Object<any>;
    declare var userInfo: Object<any>;
    function setLoginState(status: boolean): void;
  }

  declare namespace menu {
    declare var auth: Object<{ menu: [any]; func: [any] }>;
    declare var centerMenuList: [any];
    declare var currentMenu: string;
    declare var authList: [any];
    declare var userMenuList: [any];

    function setLoginState(status: boolean): void;
    function getInfoByName(name: string): any;
    function getInfoByUrl(name: string): any;
    function setCurrentMenu(name: string): void;
    function setAuth(menu: [any], func: [any]): void;
    function setCenterMenu(menu: [any]): void;
  }

  declare namespace tab {
    declare var tabIndex: string;
    declare var tabList: [any];
    declare var currentId: string;

    function goPage(
      options: Object<{
        moduleName: string;
        history: History;
        data: Object<any>;
        state: Object<any>;
        isUpdate: boolean;
        action: string;
      }>
    );

    function closeCurrentTab(
      options: Object<{ history: History; action: string }>
    ): void;

    function changeTab(
      options: Object<{ storeId: string; history: History; action: string }>
    ): void;

    function setPopStoreData(
      options: Object<{ tabIndex: string; history: History; module: string }>
    );
  }

  declare namespace organization {
    declare var orgList:[any];
    declare var orgArray:[any];
    declare var orgTreeData:[any];

    function setOrgList(list:[any]):void;
    function getOrgInfoByOrgId(orgId:string):any;
    function queryOrgIdsForParentOrgId(orgId:string, ids:[any]):any;
    function getOrgListByOrgId(orgId:string):any;
    function getParentOrgListByOrgId(orgId:string, list:[any]):any
  }

  declare namespace actionPanel {
    declare var actions: [string];
    declare var actionMaps: [{ name: string; desc: string }];
    function setAction(name: string): void;
    function setActions(names: [string]): void;
    function removeAction(name: string): void;
    function removeActions(names: [string]): void;
  }
}
