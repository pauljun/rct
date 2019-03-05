

# 基础数据管理(baseStore)

## baseStore概述

- **每个页面模块都要用到的基础store，挂在window下面，不需要单独引入，可全局使用**

## tabStore

描述：管理项目的页签，提供新增、跳转、替换、删除一系列页签操作。

### **store 数据表**

| 数据名称     | 数据类型           | 说明                          |
| ------------ | ------------------ | ----------------------------- |
| libIndex     | String             | 规针                          |
| tabIndexLibs | Array              | 规针集合                      |
| activeTab    | Object             | 当前激活的tab页签             |
| tabIndex     | @observable String | 当前激活的tab的索引           |
| tabList      | @observable Array  | 所有打开的标签页的tab页签集合 |

#### activeTab

| 参数名    | 参数类型 | 说明              |
| --------- | -------- | ----------------- |
| activeTab | Object   | 当前激活的tab页签 |

> **实例**

    activeTab = {
        icon: "icon-DataPanel_Main"，
        id: "1a695a7c-ed7a-49af-88df-ea2d3ab6fc8b"，
        index: "b"，
        location: {pathname: "/b/jurisdictionOverview/panel", search: "", hash: "", state: 	null, key: "ozie93"}，
        moduleName: "jurisdictionOverview"，
        storeName: []，
        title: "辖区面板"
    }
#### tabList

| 参数名  | 参数类型 | 说明                          |
| ------- | -------- | ----------------------------- |
| tabList | array    | 所有打开的标签页的tab页签集合 |

> **实例**

    tabList = [
    	"charts_1514265268587d2606dbab241d6",
    	"index_15142664291078cc07686488cdd",
    	"plantform_151426642951587dcb75cb7333a",
    	"baselib_1514266430224aba106805d5454",
    	"valuelib_1514266430546b7cdb3cb073897",
    	"judge_15142664308679c7d4a1125a623"
    ]

####  

### **store方法**

#### **changeTab(storeId，history, action = 'push'){}**

- **方法说明**

  更新旧得tab，找到新得tab跳转

- **参数说明**

  必要参数：

  ​	storeId：需要切换过去的tabid

  ​	history:    当前路由对象

  可选参数：

  ​	action ：切换方式，默认为push

- **返回值**

  无

#### **openTab({ module, history, state, action = 'push' }){}**

- **方法说明**

  新增一个tab页签

- **参数说明**

  必要参数：

  ​	module：模块名

  ​        history:    当前路由对象

  可选参数：

  ​        state：需要携带的数据（明文）

  ​	action ：切换方式，默认为push

- **返回值**

  无

#### **deleteTab(storeId, history, action = 'push'){}**

- **方法说明**

  关闭一个tab

- **参数说明**

  必要参数：

  ​	storeId：需要切换过去的tabid

  ​	history:    当前路由对象

  可选参数：

  ​        action ：切换方式，默认为push

- **返回值**

  无

#### **goPage(**moduleName, history, data = {}, state, isUpdate = false, action = 'push'**){}**

- **方法说明**

  跳转至指定tab(路由跳转)

- **参数说明**

  必要参数：

  ​	moduleName：需要跳转的模块名

  ​	history:    当前路由对象

  ​        data: 需要携带的数据（暗文）

  ​        state：需要携带的数据（明文）

  ​        isUpdate：false:新开（默认） true:替换

  可选参数：

  ​        action ：切换方式，默认为push

- **返回值**

  无

#### updateTab({ module, history, state, action = 'push' }){}

- **方法说明**

  更新tab页签

- **参数说明**

  必要参数：

  ​	module：模块名

  ​        history:    当前路由对象

  可选参数：

  ​        state：需要携带的数据（明文）

  ​	action ：切换方式，默认为push

- **返回值**

  无

#### updateTabItem(newTab){}

- **方法说明**

  更新单个tab数据

- **参数说明**

  必要参数：

  ​	newTab：需要更新的tab页签

- **返回值**

  无

#### closeCurrentTab({ history, action = 'push' }){}

- **方法说明**

  关闭当前激活的页签

- **参数说明**

  必要参数：

  ​	history:    当前路由对象

  可选参数：

  ​        action ：切换方式，默认为push

- **返回值**

  无

#### initTab(){}

- **方法说明**

  新开一个页签时初始化store数据

- **返回值**

  无

#### setPopStoreData({ tabIndex, history, module }){}

- **方法说明**

  浏览器刷新，前进，后退的处理方法

- **参数说明**

  必要参数：

  ​	tabIndex：匹配tab的索引        history:    当前路由对象

  ​        module ：匹配到的模块名

- **返回值**

  无

### store实例

> **实例**

```
class tabModel {
  // 数据
  const libIndex = 'a,b,c,d,e,f,g,h,i,g,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
  const tabIndexLibs = [a,b,c,d,e,f,g,h,i,g,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z']
  // 当前打开tab页索引
  @observable tabIndex = ''
  // 所有打开的标签页集合
  @observable tabList = []

  // 方法
  initTab(){}
  // 切换当前打开的tab
  changeTab(storeId，history, action = 'push'){}

  findTabByStoreId(storeId) {}

  // 新增tab
  openTab({ module, history, state, action = 'push' }){}

  // 关闭tab
  deleteTab(storeId, history, action = 'push'){}

  // 跳转至指定tab(路由跳转)
  goPage(moduleName, history, data = {}, state, isUpdate = false, action = 'push'){}
  // 更新页签
  updateTab({ module, history, state, action = 'push' }){}
  
  findTabByTabIndex(tabIndex){}
  
  vaildateTabIndex(tabIndex) {}
  
  setActiveTab(storeId) {}
  
  getFreeTabIndex() {}
  
  addTabList(tab) {}
  
  updateTabItem(newTab) {}
  
  closeCurrentTab({ history, action = 'push' }){}
  
  getStoreData(storeNames) {}
  
  clearStoreData(storeNames) {}
  
  saveStoreData(storeNames, state) {}
  
  createNotFoundTab(tab, tabIndex){}
  
  setPopStoreData({ tabIndex, history, module, childModule }){}
  

```



## menuStore

描述：管理项目的菜单与权限。

### **store 数据表**

| 数据名称     | 数据类型            | 说明                 |
| ------------ | ------------------- | -------------------- |
| authMenuList | @observable Array   | 当前用户模块权限列表 |
| privileges   | @observable Array   | 当前用户操作权限列表 |
| activeMenu   | @observable String  | 默认选中的路由名称   |
| collapsed    | @observable Boolean | 菜单是否展开         |
| spinning     | @observable Boolean | 全局spinning         |
| spinningTip  | @observable String  | 全局spinning提示信息 |

#### activeMenu

| 参数名     | 参数类型 | 说明                        |
| ---------- | -------- | --------------------------- |
| activeMenu | String   | 默认选中/当前激活的路由名称 |

> **实例**

```
activeTab = 'JurisdictionOverview'
```

#### 

### **store方法**

#### **authRouterList(){}**

- **方法说明**

  根据有权限的列表生成权限路由列表

- **返回值**


#### **findModuleForOparate(actionName){}**

- **方法说明**

  根据操作权限找到对应的模块

- **参数说明**

  必要参数：

  ​	actionName：操作按钮的唯一标识

- **返回值**


#### **menuList(){}**

- **方法说明**

  计算当前路由几何的树结构,过滤操作权限

- **返回值**

  树结构的menuList

#### **getMenuForId(**id){}

- **方法说明**

  根据id获取路由对象

- **参数说明**

  必要参数：

  ​	id: 路由id

- **返回值**


####  getMenuForUrl(url)

- **方法说明**

  根据url地址获取路由对象

- **参数说明**

  必要参数：

  ​	url：需要跳转url地址

- **返回值**


#### getAuthAction(actionName){}

- **方法说明**

  获取按钮权限

- **参数说明**

  必要参数：

  ​	actionName：当前操作按钮的唯一标识

- **返回值**


#### findModuleForOparate(actionName){}

- **方法说明**

  根据操作权限找到对应的模块

- **参数说明**

  必要参数：

  ​	actionName：当前操作按钮的唯一标识

- **返回值**


### store实例

> **实例**

```
class MenuStore {
  //当前用户模块权限列表
  @observable authMenuList = []
  //当前用户操作权限列表
  @observable privileges = []

  @observable activeMenu = 'JurisdictionOverview'; //默认选中的路由名称

  @observable collapsed = true;

  @observable spinning = false; // 全局spinning

  @observable spinningTip = ''; // 全局spinning提示信息

  // 方法
  // 设置全局spinning，提示信息
  setSpinning(spinning = true, spinningTip = ''){}
	
  authRouterList(){}
  
  getChildMenusForId(id){}
  
  getMenuForName(name) {}
	
  getMenuForId(id){}

  menuList(){}
  
  getMenuNotAuthByName(name) {}
  
  getTopLevelMenuForId(id) {}
  
  getDefaultBottomLevelForId(id) {}
  
   getMenuForUrl(url) {}
  
  getAuthAction(actionName) {}
  
 findModuleForOparate(actionName) {}
 
 setActiveMenu(name) {}
 
 setMenuCollapsed(flag) {}
 
 setAuthMenuList(menuList, privileges){}
 
 setCenterMenuList(list){}
 
 getMenusByOperationCenterId(id){}
```



## userStore

描述：管理用户信息，登录，token,修改皮肤等。

### **store 数据表**

| 数据名称     | 数据类型            | 说明              |
| ------------ | ------------------- | ----------------- |
| isLogin      | @observable Boolean | 登陆状态          |
| userInfo     | @observable Object  | 用户基本信息      |
| theme        | @observable String  | j进入页面默认主题 |
| lyToken      | @observable String  | l羚羊云token      |
| userList     | @observable Array   | 用户列表          |
| centerInfo   | @observable Object  | 运营中心信息      |
| systemConfig | @observable Object  | 系统自定义配置    |

#### activeMenu

| 参数名   | 参数类型 | 说明     |
| -------- | -------- | -------- |
| userInfo | Object   | 用户信息 |

> **实例**

```
userInfo = {
	createTime: "1530667510841"，
    createUser: "101000000001"，
    deviceId: ""，
    id: "101000000547"，
    lastLoginTime: "1545996305001"，
    loginName: "wwj"，
    modifyTime: "1543979208337"，
    modifyUser: "101000000547"，
    optCenterId: "100100000333"，
    organizationId: "100101000806"，，
    phoneNum: "13100609928"，
    pwdSalt: ""，
    realName: "运营中心管理员"，
    roleId: "100000110471"，
    systemLogo: "https://jxsr-oss1.antelopecloud.cn/files?obj_id=5c0740bb8000400c04302c28&access_token=2147500044_3356491776_1576080023_4197ff5c2ea3c5abf3c2b8d6f0e931fd"，
    userAvatar: "https://jxsr-oss1.antelopecloud.cn/files?obj_id=5bc85d368000400904201478&access_token=2147500041_3356491776_1571393677_1467c134ec7a69fdae8095954c6fe4fb"，
    userGrade: 99，
    userPwd: ""，
    userType: 100702，
    validEndTime: "1628006399000"，
    validStartTime: "1533266779143"，
    validState: 104406，
}
```

#### 

### **store方法**

#### **setTheme(name){}**

- **方法说明**

  设置主题

  **参数说明**

  必要参数：

  ​	name：主题名称

- **返回值**


#### **loginAction(options){}**

- **方法说明**

  登录接口

- **参数说明**

  必要参数：

  ​	options：登录提交的数据

- **返回值**


#### **queryUserInfo(){}**

- **方法说明**

  查询用户信息

- **返回值**


#### **getMenuForId(**id){}

- **方法说明**

  根据id获取路由对象

- **参数说明**

  必要参数：

  ​	id: 路由id

- **返回值**


####  queryLyToken()

- **方法说明**

  查询羚羊云的token

- **返回值**


#### setLoginState(flag){}

- **方法说明**

  修改登陆状态

- **参数说明**

  必要参数：

  ​	flag：登录状态

- **返回值**


#### addUser(options){}

- **方法说明**

  新增用户

- **参数说明**

  必要参数：

  ​	options：新增用户信息

- **返回值**

#### updateUser(options){}

- **方法说明**

  更新用户

- **参数说明**

  必要参数：

  ​	options：更新用户信息

- **返回值**

#### sendLoginIdentifyCode(phoneNum){}

- **方法说明**

  发送手机有验证码

- **参数说明**

  必要参数：

  ​	phoneNum：手机号

- **返回值**

#### editUserLogp(options){}

- **方法说明**

  修改用户头像

- **参数说明**

  必要参数：

  ​	options：用户头像的url

- **返回值**

#### deleteUser(options){}

- **方法说明**

  删除用户

- **参数说明**

  必要参数：

  ​	options：用户id

- **返回值**

#### changePassword(options){}

- **方法说明**

  修改密码

- **参数说明**

  必要参数：

  ​	options：新密码

- **返回值**

#### getSystemTime(){}

- **方法说明**

  获取系统服务器时间

- **返回值**

#### changePassword(options){}

- **方法说明**

  根据权限查询当前组织权限下的所有用户

- **参数说明**

  必要参数：

  ​	options：新密码

- **返回值**

#### queryUserByPrivilegeIdAndOrgIds(options){}

- **方法说明**

  根据权限查询当前组织权限下的所有用户

- **参数说明**

  必要参数：

  ​	options：权限

- **返回值**

#### getLoginCode(options){}

- **方法说明**

  获取登录验证码

- **参数说明**

  必要参数：

  ​	options：手机号

- **返回值**

#### getOptByLoginKeyUrl(options){}

- **方法说明**

  根据url关键字获取合作单位logl和系统logo

- **参数说明**

  必要参数：

  ​	options：url关键字

- **返回值**

#### queryUserByPrivilegeIdAndOrgIds(options){}

- **方法说明**

  根据权限查询当前组织权限下的所有用户

- **参数说明**

  必要参数：

  ​	options：权限

- **返回值**

#### logout(){}

- **方法说明**

  用户登出

- **返回值**

### store实例

> **实例** 

```
class UserStore {
    @observable
  btnInfo = {}; // 按钮权限

  @observable
  isLogin = false;

  @observable
  userInfo = {};

  @observable
  theme = getCacheItem('theme', 'local') || 'default-theme';

  @observable
  lyToken = null;

  @observable
  userList = [];

  @observable
  centerInfo = {};

  @observable
  systemConfig = {};
  
  updataLyToken(token) {}
  
  setTheme(name) {}
  
  loginAction(options){}
  
  queryUserInfo() {}
  
  queryLyToken() {}
  
  setLoginState(flag) {}
  
  addUser(options) {}
  
  userLogout() {}
  
  updateUser(options) {}
  
  sendLoginIdentifyCode(phoneNum) {}
  
  editUserLogp(options) {}
  
  deleteUser(options) {}
  
  getUserList(params) {}
  
  changePassword(params) {}
  
  getSystemTime() {}
  
  queryCenterInfo(id) {}
  
  getUserZoomLevelCenter() {}
   
  countAlarmCountByUserIds(data) {}
   
  queryUserByPrivilegeIdAndOrgIds(params) {}
  
  getLoginCode(data) {}
  
  getOptByLoginKeyUrl(data) {}
  
  logout() {}
  
}
```



## actionPanelStore

描述：管理项目的页签，提供新增、跳转、替换、删除一系列页签操作。

### **store 数据表**

| 数据名称 | 数据类型          | 说明           |
| -------- | ----------------- | -------------- |
| actions  | @observable Array | 动作名称的集合 |

#### activeTab

| 参数名  | 参数类型 | 说明           |
| ------- | -------- | -------------- |
| actions | Array    | 动作名称的集合 |

> **实例**

```
actions = ['test']
```

#### 

### **store方法**

#### **setAction(name){}**

- **方法说明**

  更新旧得tab，找到新得tab跳转

- **参数说明**

  必要参数：

  ​	storeId：需要切换过去的tabid

  ​	history:    当前路由对象

  可选参数：

  ​	action ：切换方式，默认为push

- **返回值**

  无

#### **openTab({ module, history, state, action = 'push' }){}**

- **方法说明**

  新增一个tab页签

- **参数说明**

  必要参数：

  ​	module：模块名

  ​        history:    当前路由对象

  可选参数：

  ​        state：需要携带的数据（明文）

  ​	action ：切换方式，默认为push

- **返回值**

  无

#### **deleteTab(storeId, history, action = 'push'){}**

- **方法说明**

  关闭一个tab

- **参数说明**

  必要参数：

  ​	storeId：需要切换过去的tabid

  ​	history:    当前路由对象

  可选参数：

  ​        action ：切换方式，默认为push

- **返回值**

  无

#### **goPage(**moduleName, history, data = {}, state, isUpdate = false, action = 'push'**){}**

- **方法说明**

  跳转至指定tab(路由跳转)

- **参数说明**

  必要参数：

  ​	moduleName：需要跳转的模块名

  ​	history:    当前路由对象

  ​        data: 需要携带的数据（暗文）

  ​        state：需要携带的数据（明文）

  ​        isUpdate：false:新开（默认） true:替换

  可选参数：

  ​        action ：切换方式，默认为push

- **返回值**

  无

#### updateTab({ module, history, state, action = 'push' }){}

- **方法说明**

  更新tab页签

- **参数说明**

  必要参数：

  ​	module：模块名

  ​        history:    当前路由对象

  可选参数：

  ​        state：需要携带的数据（明文）

  ​	action ：切换方式，默认为push

- **返回值**

  无

#### updateTabItem(newTab){}

- **方法说明**

  更新单个tab数据

- **参数说明**

  必要参数：

  ​	newTab：需要更新的tab页签

- **返回值**

  无

#### closeCurrentTab({ history, action = 'push' }){}

- **方法说明**

  关闭当前激活的页签

- **参数说明**

  必要参数：

  ​	history:    当前路由对象

  可选参数：

  ​        action ：切换方式，默认为push

- **返回值**

  无

#### initTab(){}

- **方法说明**

  新开一个页签时初始化store数据

- **返回值**

  无

#### setPopStoreData({ tabIndex, history, module }){}

- **方法说明**

  浏览器刷新，前进，后退的处理方法

- **参数说明**

  必要参数：

  ​	tabIndex：匹配tab的索引        history:    当前路由对象

  ​        module ：匹配到的模块名

- **返回值**

  无

### store实例

> **实例**

