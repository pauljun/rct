import { observable, action } from 'mobx'

class search {
  initSearch = {
		score: 85,
		cameraIds: [],
		sex: null,
		current: 1,
		pageSize: 24
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

export default new search()