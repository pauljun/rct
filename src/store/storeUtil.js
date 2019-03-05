import { action } from 'mobx';

class storeUtil {

  // 初始化查询条件
  initData(options={}){
    const searchData = Object.assign({}, this.initSearch, options)
    return this.setData({ searchData })
	}

  // 编辑查询条件
  editSearchData(options={}) {
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

export default storeUtil;