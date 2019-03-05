import { observable, action } from 'mobx';

const initSearch = {
	modules: undefined,
	functions: undefined,
	centerIds: [],
	organizationIds: undefined,
	userAgent:undefined,
	startTime: undefined,
	endTime: undefined,
	description:undefined,
	limit:10,
	offset:0,
	userName:undefined,
	// userName: undefined,
	// current: 1,
	// pageNum: 1,
	// pageSize: 10,
} 

class LogManagementStore {
	/**搜索条件 */
	@observable
	searchData = initSearch

	/**
	 * 初始化查询条件
	 * @param {*} searchData 
	 */
  initData(searchData={}){
    return this.setData({
      searchData: Object.assign({}, initSearch, searchData)
    })
	}

 /**
	* 編輯搜索條件
	*/
	editSearchData(options) {
		let searchData = Object.assign({}, this.searchData, options);
		return this.setData({ searchData });
	}

	@action
	setData(json) {
		for (var k in json) {
			this[k] = json[k];
		}
		return Promise.resolve()
	}
}

export default new LogManagementStore();
