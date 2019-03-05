import { httpRequest } from "./http";
import community from "./url/community";
import { message } from "antd";

@httpRequest
class communityService {
  /**
   * 小区总览列表查询
   */
  statisticsList(options = {}) {
    BaseStore.actionPanel.setAction(community.statisticsList.value);
    return this.$httpRequest({
      url: community.statisticsList.value,
      method: "POST",
      data: options
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(community.statisticsList.actionName);
        return res.data;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(community.statisticsList.actionName);
        return Promise.reject(e);
      });
  }
  //常住人口列表查询
  queryRegisteredPeople(options = {}) {
    let logInfo = {
			...community.queryRegisteredPeople.logInfo[0]
		};
    BaseStore.actionPanel.setAction(community.queryRegisteredPeople.value);
    return this.$httpRequest({
      url: community.queryRegisteredPeople.value,
      method: "POST",
      data: options,
      logInfo
    })
      .then(res => {
        BaseStore.actionPanel.setAction(
          community.queryRegisteredPeople.actionName
        );
        return res && res.data;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          community.queryRegisteredPeople.actionName
        );
        return Promise.reject(e);
      });
  }
  // 流动人口列表查询
  queryUnregisteredPeople(options = {}) {
    let logInfo = {
			...community.queryUnregisteredPeople.logInfo[0]
		};
    BaseStore.actionPanel.setAction(community.queryUnregisteredPeople.value);
    return this.$httpRequest({
      url: community.queryUnregisteredPeople.value,
      method: "POST",
      data: options,
      logInfo
    })
      .then(res => {
        BaseStore.actionPanel.setAction(
          community.queryUnregisteredPeople.actionName
        );
        return res && res.data;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          community.queryUnregisteredPeople.actionName
        );
        return Promise.reject(e);
      });
  }
  //添加取消关注
  updatePeopleFocus(option) {
    BaseStore.actionPanel.setAction(community.updatePeopleFocus.value);
    return this.$httpRequest({
      url: community.updatePeopleFocus.value,
      method: "post",
      data: option
    }).then(() => {
      SocketEmitter.emit(SocketEmitter.eventName.updatePerson, option);
      BaseStore.actionPanel.setAction(
        community.updatePeopleFocus.actionName
      );
    }).catch(e => {
      BaseStore.actionPanel.removeAction(
        community.updatePeopleFocus.actionName
      );
      return Promise.reject(e);
    });
  }
  //小区人员统计
  countVillagePeople(options = {}) {
    return this.$httpRequest({
      url: community.countVillagePeople.value,
      method: "POST",
      data: options
    }).then(res => res && res.data);
  }
  //小区设备统计
  countVillageDevice(options = {}) {
    return this.$httpRequest({
      url: community.countVillageDevice.value,
      method: "POST",
      data: options
    }).then(res => res && res.data);
  }
  //小区数据资源统计
  countVillageResource(options = {}) {
    return this.$httpRequest({
      url: community.countVillageResource.value,
      method: "POST",
      data: options
    }).then(res => res && res.data);
  }
  //获取社区7天人脸抓拍数
  countFace(options = {}) {
    return this.$httpRequest({
      url: community.countFace.value,
      method: "POST",
      data: options
    }).then(res => res && res.data);
  }

  /**
   * 上传小区形象图片
   */
  uploadVillageImg(data) {
    return this.$httpRequest({
      url: community.uploadVillageImg.value,
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 添加小区
   */
  addVillage(data) {
    return this.$httpRequest({
      url: community.addVillage.value,
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 给小区分配设备
   */
  assignDevice(data) {
    return this.$httpRequest({
      url: community.assignDevice.value,
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 小区已分配设备列表
   */
  assignedDevice(data) {
    return this.$httpRequest({
      url: community.assignedDevice.value,
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 给小区移动组织归属
   */
  assignViillage(data) {
    return this.$httpRequest({
      url: community.assignViillage.value,
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 删除小区
   */
  deleteVillage(data) {
    return this.$httpRequest({
      url: community.deleteVillage.value.replace("<id>", data.id),
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 获取小区列表
   */
  queryVillages(data) {
    return this.$httpRequest({
      url: community.queryVillages.value,
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 重置小区
   */
  resetVillage(data) {
    return this.$httpRequest({
      url: community.resetVillage.value.replace("<id>", data.id),
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 编辑小区基本信息
   */
  updateVillage(data) {
    return this.$httpRequest({
      url: community.updateVillage.value,
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 小区详情
   */
  villageDetail(data) {
    return this.$httpRequest({
      url: community.villageDetail.value.replace("<id>", data.id),
      method: "POST",
      data
    }).then(res => res, err => err);
  }
  /**
   * 绑定aid列表查询
   */
  queryWaitingBindAids(data) {
    return this.$httpRequest({
      url: community.queryWaitingBindAids.value,
      method: "POST",
      data
    }).then(res => res && res.data);
  }
}
export default new communityService();
