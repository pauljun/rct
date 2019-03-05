import { observable, action } from 'mobx'

class MoniteeTasks {
  @observable  
  searchData = {
      name: '',
      limit: 500,
      queryType: 2, //2-布控任务列表 告警列表类型: 1-全部任务（默认）  2-布控任务列表（自己创建） 3-指派任务 4-本地任务
      taskTypes: ["101501"] //101501-黑名单 101502-未知人员布控
  }

  /**
   * @desc 初始化查询条件
   */
  @action
  initData(){
    this.searchData = {
      name: '',
      limit: 500,
      queryType: 2, // 2-布控任务列表 告警列表类型: 1-全部任务（默认）  2-布控任务列表（自己创建） 3-指派任务 4-本地任务
      taskTypes: ["101501"] //101501-黑名单 101502-未知人员布控 101503-魅影
    }
  }

  /**
   * @desc 编辑查询条件
   * @param {option} options 布控任务相关参数集合
   */
  @action
   editSearchData(options) {
    return new Promise(resolve => {
      let params = Object.assign({}, this.searchData, { ...options })
      this.searchData = params
      resolve()
    })
  }
}

export default new MoniteeTasks();