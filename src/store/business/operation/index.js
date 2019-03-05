import { observable, action } from 'mobx'

class operation {
  initData = {
    offset: 1,
    limit: 20,
    keywords: ''
  }

  /**
   * @desc 运营中心列表查询条件
   */
  @observable
  searchData = this.initData

  /**
   * @desc 编辑查询条件
   * @param {Object} options 
   */
  @action.bound
  mergeSearchData(options) {
    return new Promise(resolve => {
      this.searchData = Object.assign(this.searchData, {...options})
      resolve()
    })
  }
}

export default new operation()