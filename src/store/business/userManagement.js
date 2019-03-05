import { observable, action,toJS } from 'mobx';
const initSearch = {
    containSubOrganization:0,
    userRoles:undefined,
    userStatus:undefined,
    limit: 10,
    offset: 0,
    keywords:'',
}
class UserManagementStore {
  /**默认选中节点id */
  @observable 
  activeKey = []

  /**搜索条件 */
  @observable
  searchData = initSearch
  // 初始化查询条件
  initData = (searchData = {}) => {
    return new Promise(resolve => {
      this.setData({
        searchData:Object.assign({},this.searchData,initSearch)
      })
      resolve()
    })
  }
  //系统logo
  @observable systemMes = []
  // 修改store数据
  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k]
    }
  }
  /**編輯搜索條件 */
  editSearchData(options) {
    return new Promise(resolve => {
      let params = Object.assign({}, this.searchData, { ...options })
      this.setData({ searchData: params })
      resolve()
    })
  }

    // /**查询所有用户 */
    // queryUserList(){
    //   let searchData = this.searchData
    //   searchData.organizationId = this.activeKey[0]
    //   return Service.user.queryUsers(searchData)
    // }
  
  // /**
  //  * 获取系统logo
  //  */
  //   getSystemMes = (data) => {
  //     Service.kvStore.getKvStore(data).then(res => {
  //       this.setData({systemMes: (res && eval("("+res.data.storeValue+")")) || []})
  //     }).catch(err => {
  //       console.error('获取系统logo失败', err)
  //     })
  //   }
  



  // /**设置系统logo与名称 */
  // setSystemMes=(item,userId) => {
  //   if(item && item.systemName){
  //     item.systemName = item.systemName.replace(/#/,escape('#'))
  //     item.systemLogo = Utils.escapeUrl(item.systemLogo, true);
  //   }
  //   let systemMes = toJS(this.systemMes)
  //   systemMes.push({
  //     systemId: Utils.uuid(),
  //     systemName: item.systemName,
  //     systemLogo: item.systemLogo,
  //     userList: []
  //   })
  //   return Service.kvStore.setUserKvStore({
  //     userId, 
  //     storeKey: 'SYSTEM_MES',
  //     storeValue: systemMes
  //   }).then(() => {
  //     this.setData({
  //       systemMes
  //     })
  //   })
  // }


// /**删除系统logo和名称 */
//   delSystemMes(id,userId){
//     let systemMes = toJS(this.systemMes)
//     let systemMesNow = systemMes.filter(item => {
//       return item.systemId !== id
//     })
//     let delItem = systemMes.find(item => {
//       return item.systemId === id
//     })
//     this.setData({
//       systemMes: systemMesNow
//     })
//     let systemMesToServer = JSON.parse(JSON.stringify(systemMesNow))
//     systemMesToServer.forEach((item) => {
//       if(item && item.systemName){
//         item.systemName = item.systemName.replace(/#/,escape('#'))
//         item.systemLogo = escape(item.systemLogo)
//       }
//     })
//     const ObjId = searchFormat(delItem.systemLogo.split('?')[1]).obj_id
//    return Service.kvStore.setUserKvStore(
//     {
//       userId, 
//       storeKey: 'SYSTEM_MES',
//       storeValue: systemMesToServer
//     }
//    )
//   }
}

export default new UserManagementStore();
