import { observable, action } from 'mobx'

class vehicle {
  initSearch = {
    limit: 200,
		//offset: 0,
		timerTabsActive: 3,
		cameraIds: [],
		plateNo: '',
		vehicleClasses: null,
		vehicleBrands: null,
		plateColor: null,
		vehicleColor: null,
		score: 85
  }
  @observable searchData = this.initSearch

	/** 初始化查询条件 */
	initData() {
    this.searchData = this.initSearch
  }
  
	/** 编辑搜索条件 */
	@action
	mergeSearchData(options) {
		let params = Object.assign({}, this.searchData, options)
		this.searchData = params
		return new Promise((resolve) => resolve(true))
	}
}

export default new vehicle()