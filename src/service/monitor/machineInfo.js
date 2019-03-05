import { httpRequest } from '../http';
import machineInfo from '../url/machineInfo.js';

@httpRequest
class MachineInfo {
  /**
   * @desc 获取布控任务列表
   * @param {object} data 
   */
  queryMachineInfos(data = {}) {
    BaseStore.actionPanel.setAction(machineInfo.queryMachineInfos.actionName);
    return this.$httpRequest({
      url: machineInfo.queryMachineInfos.value,
      method: 'post',
      data
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(machineInfo.queryMachineInfos.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(machineInfo.queryMachineInfos.actionName);
      return Promise.reject(e);
    });
  }
}

export default new MachineInfo();
