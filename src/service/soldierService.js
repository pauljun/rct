import { httpRequest } from './http';
import soldier from './url/soldier';
import { message } from 'antd';

@httpRequest
class SoldierService {
  queryLiquerySolosDevice(data){
    return this.$httpRequest({
      url: `${soldier.querySolosDevice.value}/${data.operationCenterId}`,
      method: 'post',
      data: data
    }).catch(() => {})
  }

  registerSolosCamera(data){
    let logInfo = {
      description: `新增【${data.deviceName}】单兵`, 
      ...soldier.registerSolosCamera.logInfo[0]
    }
    return this.$httpRequest({
      url: soldier.registerSolosCamera.value,
      method: 'post',
      data: data,
      logInfo,
    }).catch(() => {})
  }

  bindUser(data, logInfoObj){
    let logInfo = {
      description: `绑定单兵【${logInfoObj.soldierName}】到用户【${logInfoObj.loginName}】`, 
      ...soldier.bindUser.logInfo[0]
    }
    return this.$httpRequest({
      url: `${soldier.bindUser.value}/${data.deviceId}/${data.userId}`,
      method: 'post',
      data: data,
      logInfo,
    }).catch(() => {})
  }
  unbindUser(data, logInfoObj = {}) {
    let logInfo = {
      description: `解绑用户【${logInfoObj.loginName}】的单兵【${logInfoObj.soldierName}】`, 
      ...soldier.unbindUser.logInfo[0]
    }
    return this.$httpRequest({
      url: `${soldier.unbindUser.value}/${data.deviceId}/${data.userId}`,
      method: 'POST',
      data: data,
      logInfo,
    })
  }
}

export default new SoldierService()