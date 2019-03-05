import { observable, action, computed, toJS } from 'mobx';
import * as _ from 'lodash';

const { znxj, qj, zpj, db } = Dict.map;

const streamKVKey = 'DEVICE_STREAM';

class device {
  streamKVKey = streamKVKey;
  
  @observable deviceList = [];

  @observable
  streamPreference = []; // 设备开流偏好(实时优先flv)

  @action
  setStreamPreference(streamPreference) {
    this.streamPreference = streamPreference;
    return Promise.resolve(streamPreference);
  }

  @computed
  get cameraList() {
    return this.deviceArray.filter(v => v.deviceType == qj.value || v.deviceType == znxj.value || v.deviceType == zpj.value || v.deviceType == db.value);
  }

  @computed
  get accessControlList() {
    return this.deviceArray.filter(v => v.manufacturerDeviceType == 103406);
  }

  @computed
  get gateList() {
    return this.deviceArray.filter(v => v.manufacturerDeviceType == 100607);
  }

  @computed
  get deviceArray() {
    return this.deviceList.map(v => {
      return {
        deviceName: v.deviceName,
        deviceType: v.deviceType,
        deviceStatus: v.deviceStatus,
        id: v.id,
        latitude: v.latitude,
        longitude: v.longitude,
        cid: v.cid,
        manufacturerDeviceType: v.manufacturerDeviceType,
        operationCenterIds: toJS(v.operationCenterIds),
        organizationIds: toJS(v.organizationIds),
        sn: v.sn,
        placeId:v.placeId,
      };
    });
  }

  @computed
  get cameraArray() {
    return this.cameraList.map(v => {
      return {
        deviceName: v.deviceName,
        deviceType: v.deviceType,
        deviceStatus: v.deviceStatus,
        id: v.id,
        latitude: v.latitude,
        longitude: v.longitude,
        cid: v.cid,
        manufacturerDeviceType: v.manufacturerDeviceType,
        operationCenterIds: toJS(v.operationCenterIds),
        organizationIds: toJS(v.organizationIds),
        placeId:v.placeId,
        sn: v.sn
      };
    });
  }

  @action
  setDeviceList(list) {
    const cameraList = _.orderBy(list, ['deviceStatus', 'deviceName'], ['desc', 'asc']);
    this.deviceList = cameraList;
  }

  /**
   * 查询组织下设备数量（不包含子组织）
   * @param {string} orgId
   */
  queryCameraCountByOrgId(orgId) {
    const cameraList = this.cameraList.filter(v => v.organizationIds && v.organizationIds.indexOf(orgId) > -1);
    const onlineList = cameraList.filter(v => v.deviceStatus * 1 == 1);
    return {
      count: cameraList.length,
      onlineCount: onlineList.length
    };
  }

  /**
   * 查询组织下设备数量（包含子组织）
   * @param {Array} orgIds
   */
  queryCameraCountByIncludeOrgId(orgId) {
    let orgIds = window.GlobalStore.OrgStore.queryOrgIdsForParentOrgId(orgId);
    const cameraList = this.cameraArray.filter(item => {
      let flag = false;
      if (!Array.isArray(item.organizationIds)) {
        item.organizationIds = [];
      }
      for (let i = 0, l = item.organizationIds.length; i < l; i++) {
        if (orgIds.indexOf(item.organizationIds[i]) > -1) {
          flag = true;
          break;
        }
      }
      return flag;
    });
    const onlineList = cameraList.filter(v => v.deviceStatus * 1 == 1);
    return {
      count: cameraList.length,
      onlineCount: onlineList.length
    };
  }

  /**
   * 根据ID获取摄像机
   */
  queryCameraById(id) {
    return this.cameraList.find(v => v.id == id || v.cid == id);
  }

  /**
   * 根据ID集合获取摄像机列表
   * @param {array} ids
   */
  queryCameraListByIds(ids) {
    return this.cameraArray.filter(v => ids.indexOf(v.id) > -1 || ids.indexOf(v.cid) > -1);
  }

  /**
   * 查询组织下设备列表(不包含子组织)
   * @param {string} orgId
   */
  queryCameraByOrgId(orgId) {
    return this.cameraList.filter(v => v.organizationIds && v.organizationIds.indexOf(orgId) > -1);
  }

  /**
   * 查询组织下设备列表(含子组织)
   * @param {string} orgId
   */
  queryCameraByIncludeOrgId(orgId) {
    let orgIds = BaseStore.organization.queryOrgIdsForParentOrgId(orgId);
    const cameraList = this.cameraArray.filter(item => {
      let flag = false;
      if (!Array.isArray(item.organizationIds)) {
        item.organizationIds = [];
      }
      for (let i = 0, l = item.organizationIds.length; i < l; i++) {
        if (orgIds.indexOf(item.organizationIds[i]) > -1) {
          flag = true;
          break;
        }
      }
      return flag;
    });
    return cameraList;
  }

  @action
  clearStore() {
    this.deviceList = [];
    this.streamPreference = [];
  }
}
export default new device();
