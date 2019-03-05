import { observable, action } from 'mobx';

const initSearch = {
  offset: 0,
  limit: 10,
  deviceName: '',
  cid:'',
  keywords:'',
  // deviceType: '100605',
  operationCenterId:null,
}
class SoldierStore {
  @observable
  searchData = initSearch
  // 初始化编辑条件
  initData = (searchData={}) => {
      return this.setData({
        searchData:Object.assign({},initSearch,searchData)
      })
  }

  /**編輯搜索條件 */
  editSearchData(options) {
    const searchData = Object.assign({}, this.searchData, options)
    return this.setData({ searchData })
  }

  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k]
    }
    return Promise.resolve()
  }
}

export default new SoldierStore();
