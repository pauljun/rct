import { observable, action } from 'mobx';

class VillageListStore {
	@observable
	searchData = {
		key: '',
		page: 1,
		pageSize: 10
	};

	@action
	initData() {
		this.searchData = {
			key: '',
			page: 1,
			pageSize: 10
		};
	}

	@action
	mergeSearchData(data) {
		this.searchData = Object.assign(this.searchData, { ...data });
	}

	queryVillages() {
		let searchData = {
			containSuborganization:true,
			limit: this.searchData.pageSize,
			offset: (this.searchData.page - 1)*this.searchData.pageSize
		};
		searchData.keywords = this.searchData.key;
		return Service.community.queryVillages(searchData);
	}
}

export default new VillageListStore();
