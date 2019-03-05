import { httpRequest } from '../http';
import monitorTask from '../url/monitorTask';
const taskTypeDict = [
  {type: "101501", logType: 'faceTask', text: '重点人员布控任务'},
  {type: "101502", logType: 'outsidersTask', text: '外来人员布控任务'},
  {type: "101503", logType: 'phantomTask', text: '魅影布防布控任务'},
  {type: "101504", logType: 'AIOTask', text: '专网套员布控任务'},
]

@httpRequest
class MonitorTask {
  /**
   * @desc 获取布控任务列表
   * @param {object} data 
   */
  queryMonitorTasks(data = {}) {
    BaseStore.actionPanel.setAction(monitorTask.queryMonitorTasks.actionName);
    return this.$httpRequest({
      url: monitorTask.queryMonitorTasks.value,
      method: 'post',
      data
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorTask.queryMonitorTasks.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorTask.queryMonitorTasks.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 设置忽略/取消忽略他人授权的布控任务报警
   * @param {object} data 
   */
  setWhetherIgnoreAlarm(data = {}) {
    BaseStore.actionPanel.setAction(monitorTask.setWhetherIgnoreAlarm.actionName);
    return this.$httpRequest({
      url: monitorTask.setWhetherIgnoreAlarm.value,
      method: 'post',
      data
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorTask.setWhetherIgnoreAlarm.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorTask.setWhetherIgnoreAlarm.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 根据id删除布控库
   * @param {string} id 布控任务id
   */
  deleteMonitorTask(id){
    BaseStore.actionPanel.setAction(monitorTask.deleteMonitorTask.actionName);
    return this.$httpRequest({
      url: monitorTask.deleteMonitorTask.value.replace('<id>', id),
      method: 'post',
      data: {
        id
      }
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorTask.deleteMonitorTask.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorTask.deleteMonitorTask.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 新增布控任务
   * @param {object} options 布控任务相关数据集合
   * @param {string} taskType 布控任务类型
   */
  addMonitorTask(options, taskType=[]) {
    BaseStore.actionPanel.setAction(monitorTask.addMonitorTask.actionName);
    const taskInfo = taskTypeDict.find(v => v.type === (taskType[0] || options.taskType));
    const logInfo = {
      description: `添加${taskInfo.text}【${options.name}】`,
      ...monitorTask.addMonitorTask.logInfo.find(v => v.type === taskInfo.logType)
    }
    return this.$httpRequest({
      url: monitorTask.addMonitorTask.value,
      method: 'post',
      data: options,
      logInfo
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorTask.addMonitorTask.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorTask.addMonitorTask.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 修改布控任务
   * @param {object} options 布控任务相关数据集合
   * @param {string} taskType 布控任务类型
   */
  updateMonitorTask(options, taskType) {
    BaseStore.actionPanel.setAction(monitorTask.updateMonitorTask.actionName);
    const taskInfo = taskTypeDict.find(v => v.type === (taskType || options.taskType));
    const logInfo = {
      description: `编辑${taskInfo.text}【${options.name}】`,
      ...monitorTask.updateMonitorTask.logInfo.find(v => v.type === taskInfo.logType)
    }
    return this.$httpRequest({
      url: monitorTask.updateMonitorTask.value,
      method: 'post',
      data: options,
      logInfo
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorTask.updateMonitorTask.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorTask.updateMonitorTask.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 开始暂停任务
   * @param {array} id 布控任务id
   * @param {string} type 开始or暂停
   * @param {string} taskType 布控任务类型
   * @param {string} taskName 布控任务名称
   */
  changeMonitorTaskRunStatus({ids, type, taskTypes, taskName}) {
    BaseStore.actionPanel.setAction(monitorTask.changeMonitorTaskRunStatus.actionName);
    const taskInfo = taskTypeDict.find(v => v.type === taskTypes[0]);
    const logInfo = {
      description: `${type==='1'?'开启':'暂停'}${taskInfo.text}【${taskName}】`,
      ...monitorTask.changeMonitorTaskRunStatus.logInfo.find(v => v.type === taskInfo.logType)
    }
    return this.$httpRequest({
      url: monitorTask.changeMonitorTaskRunStatus.value,
      method: 'post',
      data: { taskIds: ids, type },
      logInfo
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorTask.changeMonitorTaskRunStatus.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorTask.changeMonitorTaskRunStatus.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 根据id获取布控任务详情
   * @param {string} id 布控任务id
   */
  queryMonitorTaskDetail(id){
    BaseStore.actionPanel.setAction(monitorTask.queryMonitorTaskDetail.actionName);
    return this.$httpRequest({
      url: monitorTask.queryMonitorTaskDetail.value.replace('<id>', id),
      method: 'post',
      data: {
        id
      }
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorTask.queryMonitorTaskDetail.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorTask.queryMonitorTaskDetail.actionName);
      return Promise.reject(e);
    });
  }
}

export default new MonitorTask();
