import { httpRequest } from './http';
import village from './url/village';

@httpRequest
class VillageService {
	/**
   * 小区列表
   * @param {Object} options
   */
	queryList(options) {
		return this.$httpRequest({
			url:village.list.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}

	/**
   *
   * @param {Object} options
   */
	queryCentersByVillage(id) {
		return this.$httpRequest({
			url:village.centerByVillage.value.replace('<id>', id),
			method: 'GET'
		}).then(res => {
      return res
    });
	}
	/**
   *获取小区已分配的运营中心
   * @param {Object} options
   */
	getAssignedCentersByPage(options) {
		return this.$httpRequest({
			url:village.villageCenter.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}
	/**
   *	获取小区未分配的运营中心
   * @param {Object} options
   */
	getUnAssignedCentersByPage(options) {
		return this.$httpRequest({
			url:village.unVillageCenter.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}
	/**
   *	平台管理员给小区分配运营中心
   * @param {Object} options
   */
	distributionCenterToVillage(options) {
		return this.$httpRequest({
			url:village.assignedByDistribution.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}
	/**
   *
   * @param {Object} options
   */
  queryDetail(options) {
		return this.$httpRequest({
			url:`${village.detail.value}/${options}`,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}
	/**
   *
   * @param {Object} options
   */
	resetVillage(options) {
		return this.$httpRequest({
			url:village.resetVillage.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}
	/**
   *
   * @param {Object} options
   */
	addVillage(options) {
		return this.$httpRequest({
			url:village.add.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}
	/**
   *
   * @param {Object} options
   */
	updateVillage(options) {
		return this.$httpRequest({
			url:village.update.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}
	/**
   *
   * @param {Object} options
   */
	assignedByUser(options, description = '编辑小区') {
		let logInfo = {
			description,
			...village.assignedByUser.logInfo[0]
		};
		return this.$httpRequest({
			url:village.assignedByUser.value,
			method: 'POST',
			data: options,
			logInfo
		}).then(res => {
      return res
    });
	}
	assignedVillageDetail(id) {
		return this.$httpRequest({
			url: `${village.detail.value}/${id}`,
			method: 'get'
		}).then(res => {
      return res
    });
	}

	// 获取小区已分配运营中心
	queryVillageDevices(options) {
		return this.$httpRequest({
			url:village.villageDevice.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}

	updateVillageDevices(options) {
		return this.$httpRequest({
			url:village.villageDeviceUpdate.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}
	queryUnbindedVillageDevices(options) {
		return this.$httpRequest({
			url:village.queryUnbindedVillageDevices.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}

	// 小区人口信息导入
	/**
   *
   * @param {Object} options
   */
	UploadCommunityData(options) {
		return this.$httpRequest({
			url:village.communityImport.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}

	// 查询小区人口信息列表
	/**
   *
   * @param {Object} options
   */
	getListCommunityData(options) {
		return this.$httpRequest({
			url:village.listImportCommunityData.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}

	// 批量删除小区人员信息
	/**
   *
   * @param {Object} options
   */
	deleteCommunityPeople(options) {
		return this.$httpRequest({
			url:village.batchDeleteVillagePeoples.value,
			method: 'POST',
			data: options
		}).then(res => {
      return res
    });
	}

	/**获取运营中心已分配和未分配的小区列表 */
	getVillagesByCenterId(centerId){
		return this.$httpRequest({
			url: `${village.villageByCenterId.value}/${centerId}`
		})
	}

	/**给运营中心分配小区 */
	assignedByCenter(options){
		return this.$httpRequest({
			url:village.assignedByCenter.value,
			method: 'POST',
			data:options
		})
	}
}

export default new VillageService();
