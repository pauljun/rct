import { observable, action } from 'mobx';

export const ModelData1 = {
  roleName: '',
  pageNum: 1,
  pageSize: 10
}
export const ModelData2 = {
  id: '',
  organizationId: '',
  privilegeIds: '',
  roleDesc: '',
  roleName: '',
  roleType: 111903
}


class RoleManagementStore {
  @observable
  searchData = ModelData1

    /**
  * 表单信息
  */
 @observable
 RoleSettingInfo = ModelData2

 @action
  initData() {
    this.initSearchForm()
  }

  @action
  initSearchForm(){
    this.searchData = ModelData1;
    this.RoleSettingInfo = ModelData2;
  }

  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k]
    }
  }
   /**
   * change事件
   */
  @action
  roleChange = (name) => {
    this.RoleSettingInfo = { ...this.RoleSettingInfo, ...name }
  }

  /**編輯搜索條件 */
  editSearchData(options) {
    return new Promise(resolve => {
      let params = Object.assign({}, this.searchData, { ...options })
      this.setData({ searchData: params })
      resolve()
    })
  } 
  
  /**查询角色 */
  queryRoleList=() => {
		let searchData = {
      roleName: this.searchData.roleName,
			limit: this.searchData.pageSize,
			offset: (this.searchData.pageNum - 1)*this.searchData.pageSize
    };
    return Service.role.queryRoleList(searchData)
  }
}


export default new RoleManagementStore();