import { observable, action } from 'mobx';

const initSearch = {
	begin: null,
	end: null,
	type: 1,
	pageSize: 10,
	currentPage: 1
} 

class StatisticStore {
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
	updateSearchData(options) {
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

export default new StatisticStore();
