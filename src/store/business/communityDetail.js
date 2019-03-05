
import { observable, action } from 'mobx';


let searchDataInit = {
	vids: [],
	currentPage: 1,
	pageType: 0,
	pageSize: 99999,
	timeType: 3,
	startTime: '',
	endTime: ''
};

class CommunityDetail {
	@observable searchData = searchDataInit;
	/**获取初始的查询条件 */
	getInitSearchData() {
		return searchDataInit;
	}

	@action
	setData(json) {
		for (var k in json) {
			if (this.hasOwnProperty(k)) {
				this[k] = json[k];
			}
		}
		return Promise.resolve();
	}
	/**編輯搜索條件 */
	editSearchData(options) {
		return new Promise((resolve) => {
			let params = Object.assign({}, this.searchData, options);
			this.searchData = params;
			// this.setData({ searchData: params });
			resolve();
		});
	}
	/**初始化查询条件 */
	initData() {
		this.searchData = searchDataInit;
	}
}

export default new CommunityDetail();