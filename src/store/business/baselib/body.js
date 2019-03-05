import { observable, action } from 'mobx'

class body {
  initSearch = {
    limit: 210,
		timerTabsActive: 3,
		cameraIds: [],
		sex: null, 
		placeType: null, 
		upColor: null, 
		lowerColor: null, 
		head: null, 
		goods: null, 
		bodyFeature: [],
		upperTexture: null, 
		lowerTexture: null, 
		nation: null,
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

export default new body()