import { httpRequest } from './http';
import device from './url/device';

@httpRequest
class DeviceService {
  /**
   * @desc 获取用户的所有设备 全局用
   * @param {*} data
   */
  queryUserDevices(data) {
    BaseStore.actionPanel.setAction(device.queryUserDevices.value);
    return this.$httpRequest({
      url: device.queryUserDevices.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(device.queryUserDevices.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.queryUserDevices.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 获取用户的所有设备 设备管理用
   * @param {*} data
   */
  queryDevices(data) {
    BaseStore.actionPanel.setAction(device.queryDevices.value);
    return this.$httpRequest({
      url: device.queryDevices.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(device.queryDevices.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.queryDevices.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 按照类型统计设备数量
   * @param {*} data
   */
  countDeviceType(data) {
    BaseStore.actionPanel.setAction(device.countDeviceType.value);
    return this.$httpRequest({
      url: device.countDeviceType.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(device.queryUserDevices.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.queryUserDevices.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 统计应用系统设备数量
   * @param {*} data
   */
  countOperationCenterDevices(data) {
    BaseStore.actionPanel.setAction(device.countOperationCenterDevices.value);
    return this.$httpRequest({
      url: device.countOperationCenterDevices.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          device.countOperationCenterDevices.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          device.countOperationCenterDevices.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 统计组织的在线离线设备数量
   * @param {*} data
   */
  countOrganizationDeviceStatus(data) {
    BaseStore.actionPanel.setAction(device.countOrganizationDeviceStatus.value);
    return this.$httpRequest({
      url: device.countOrganizationDeviceStatus.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          device.countOrganizationDeviceStatus.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          device.countOrganizationDeviceStatus.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 统计场所的在线离线设备数量
   * @param {*} data
   */
  countPlaceDeviceStatus(data) {
    BaseStore.actionPanel.setAction(device.countPlaceDeviceStatus.value);
    return this.$httpRequest({
      url: device.countPlaceDeviceStatus.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          device.countPlaceDeviceStatus.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          device.countPlaceDeviceStatus.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询设备详细信息
   * @param {*} id
   */
  queryDeviceInfo(id,isSoldier = false) {
    const { deviceName } = BaseStore.device.queryCameraById(id) || {};
    BaseStore.actionPanel.setAction(device.deviceInfo.value);
    return this.$httpRequest({
      url: device.deviceInfo.value.replace('<id>', id),
      method: 'post',
      data: { id },
      logInfo: isSoldier
        ? {}
        : {
            description: `查看设备【${deviceName}】信息`,
            ...device.deviceInfo.logInfo[0]
          }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(device.deviceInfo.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.deviceInfo.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询设备详细信息 cid
   * @param {*} cid
   */
  queryDeviceInfoByCid(cid) {
    BaseStore.actionPanel.setAction(device.deviceInfoByCid.value);
    return this.$httpRequest({
      url: device.deviceInfoByCid.value.replace('<id>', cid),
      method: 'post',
      data: { cid }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(device.deviceInfoByCid.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.deviceInfoByCid.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 根据组织查询设备列表
   * @param {*} id
   */
  deviceListByOrganization(data) {
    const organizationId = data.orgIds[0]
    BaseStore.actionPanel.setAction(device.deviceInfoByCid.value);
    return this.$httpRequest({
      url: device.deviceListByOrganization.value.replace('<id>', organizationId),
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(device.deviceInfoByCid.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.deviceInfoByCid.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询设备分组列表
   */
  queryDeviceGroup() {
    BaseStore.actionPanel.setAction(device.queryDeviceGroup.value);
    return this.$httpRequest({
      url: device.queryDeviceGroup.value,
      method: 'post'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(device.queryDeviceGroup.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.queryDeviceGroup.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 更新设备
   * @param {*} data
   */
  updateDevice(data) {
    BaseStore.actionPanel.setAction(device.updateDevice.value);
    data.otherInfo=data.otherInfo ? data.otherInfo : { deviceType:data.deviceType,deviceName:data.deviceName }
    return this.$httpRequest({
      url: device.updateDevice.value.replace('<id>', data.id),
      method: 'post',
      data,
      logInfo: {
        description: `编辑${
          data.otherInfo&&data.otherInfo.deviceType != 100605 ? '设备' : '单兵'
        }【${data.otherInfo.deviceName || data.otherInfo.cameraInfo.name}】信息`,
        ...device.updateDevice.logInfo[0]
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(device.updateDevice.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.updateDevice.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * 更新设备GEO
   * @param {*} data
   */
  updateDeviceGeo(data) {
    const { deviceName } = BaseStore.device.queryCameraById(data.id) || {};
    BaseStore.actionPanel.setAction(device.updateDeviceGeo.value);
    return this.$httpRequest({
      url: device.updateDeviceGeo.value.replace('<id>', data.id),
      method: 'post',
      data,
      logInfo: {
        description: `修改设备【${deviceName}】经纬度为：[${data.longitude},${
          data.latitude
        }]`,
        ...device.updateDeviceGeo.logInfo[0]
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(device.updateDeviceGeo.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.updateDeviceGeo.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 根据拉流状态判断设备状态不对时，向后台反馈设备状态
   * @param {*} deviceId
   * @param {*} deviceStatus
   */
  updateDeviceStatus(deviceId, deviceStatus) {
    BaseStore.actionPanel.setAction(device.updateDeviceStatus.value);
    return this.$httpRequest({
      url: device.updateDeviceStatus.value,
      method: 'POST',
      data: {
        deviceId,
        onLine: deviceStatus
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          device.updateDeviceStatus.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          device.updateDeviceStatus.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 分配设备到应用系统/从应用系统解除分配
   * @param {*} data
   */
  updateOperationCenterDevices(data) {
    BaseStore.actionPanel.setAction(device.updateOperationCenterDevices.value);
    return this.$httpRequest({
      url: device.updateOperationCenterDevices.value.replace('<id>', data.operationCenterId),
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          device.updateOperationCenterDevices.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          device.updateOperationCenterDevices.actionName
        );
        return Promise.reject(e);
      });
  }
  /**
   * @desc 分配设备到组织/从组织解除分配
   * @param {*} data
   */
  updateOrganizationDevicesBatch(data) {
    BaseStore.actionPanel.setAction(
      device.updateOrganizationDevicesBatch.value
    );
    return this.$httpRequest({
      url: device.updateOrganizationDevicesBatch.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          device.updateOrganizationDevicesBatch.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          device.updateOrganizationDevicesBatch.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * 设备导出
   * @param {*} organizationId
   */
  exportDevice(organizationId) {
    BaseStore.actionPanel.setAction(device.exportDevice.value);
    return fetch(device.exportDevice.value.replace('<id>', organizationId), {
      method: 'post',
      data: { id: organizationId },
      headers: {
        Authorization: Utils.getCache('token', 'session')
      }
    }).then(res => res.blob()).then(blob => {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = '设备列表';
        link.click();
        window.URL.revokeObjectURL(link.href);
        BaseStore.actionPanel.removeAction(device.exportDevice.actionName);
        return Promise.resolve();
    }).catch(e => {
      BaseStore.actionPanel.removeAction(device.exportDevice.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 根据应用系统查询设备
   */
   
  queryDevicesByOperationCenter(data){
    BaseStore.actionPanel.setAction(device.queryDevicesByOperationCenter.value);
    return this.$httpRequest({
      url: device.queryDevicesByOperationCenter.value.replace('<id>', data.operationCenterId),
      method: 'post',
      data
    }).then(res => {
        BaseStore.actionPanel.removeAction(device.queryDevicesByOperationCenter.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(device.queryDevicesByOperationCenter.actionName);
        return Promise.reject(e);
      });
  }
}

export default new DeviceService();
