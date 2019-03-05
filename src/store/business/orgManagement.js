import { observable, action } from 'mobx';
const initSearch = {
    keywords: '', // 关键字
    limit:10,
    offset:0,
    id:null
}
class OrgManagementStore {
  /**默认选中节点id */
  @observable
  searchData = initSearch
  activeKey = [];
  
  /**初始化搜索条件 */
  initData(searchData={}){
    return this.setData({
      searchData:Object.assign({},initSearch,searchData)
    })
  }

  /**編輯搜索條件 */
  editSearchData(options) {
    const searchData = Object.assign({}, this.searchData, options);
    return this.setData({ searchData });
  }

  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k];
    }
    return Promise.resolve();
  }
}

export default new OrgManagementStore();
