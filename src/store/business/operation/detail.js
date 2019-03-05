import { observable, action } from 'mobx'

class operationDetail {
  initData = {
    deviceName: '',
    page: 1,
    pageSize: 20
  }
  @observable
  privilegeInfo = {
    id: '',
    menuIds: '',
    sort:''
  }

  /**
   * @desc 运营中心设备列表查询条件
   */
  @observable
  searchData = this.initData

  /**
   * 配置模块change事件
   */
  @action
  moduleChange = (name) => {
    this.privilegeInfo = { ...this.privilegeInfo, ...name }
  }

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

export default new operationDetail()