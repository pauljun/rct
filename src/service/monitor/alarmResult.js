import alarm from '../url/alarm';
import { httpRequest } from '../http';

const alarmType = {
  1: 'faceAlarm', // 重点人员告警
  2: 'outsidersAlarm', // 外来人员告警
  3: 'phantomAlarm', // 魅影历史提醒
  4: 'AIOAlarm', // 专网套件告警
  5: 'personnelRealAlarm', // 实时告警
  6: 'phantomRealAlarm' // 魅影实时提醒
};

@httpRequest
class AlarmResult {
  /**
   * @desc 获取警情列表
   * @param {Object} data
   */
  queryAlarmResults(data) {
    BaseStore.actionPanel.setAction(alarm.queryAlarmResults.actionName);
    return this.$httpRequest({
      url: alarm.queryAlarmResults.value,
      data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(alarm.queryAlarmResults.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(alarm.queryAlarmResults.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查看历史警情详情
   * @param {Object} data
   */
  alarmResults({ id, libType, isRealAlarm }) {
    BaseStore.actionPanel.setAction(alarm.alarmResults.actionName);
    // let logType = libType;
    // if (isRealAlarm) {
    //   logType = libType !== 3 ? 5 : 6;
    // }
    // let description = '';
    // switch (+libType) {
    //   case 1:
    //     description = `查看重点人员布控告警信息, 信息ID：${id}`;
    //     break;
    //   case 2:
    //     description = `查看外来人员布控告警信息, 信息ID：${id}`;
    //     break;
    //   case 3:
    //     description = `查看魅影布防事件提醒信息, 信息ID：${id}`;
    //     break;
    //   case 4:
    //     description = `查看专网套件布控告警信息, 信息ID：${id}`;
    //     break;
    //   default:
    //     break;
    // }
    // const logInfo = {
    //   description,
    //   ...alarm.alarmDetail.logInfo.find(v => v.type === alarmType[logType])
    // };
    return this.$httpRequest({
      url: alarm.alarmResults.value.replace('<id>', id),
      data: { id },
      method: 'POST'
      // logInfo
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(alarm.alarmResults.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(alarm.alarmResults.actionName);
        return Promise.reject(e);
      });
  }

  /**警情处理 */
  handleAlarmResult = (data, logData = {}) => {
    BaseStore.actionPanel.setAction(alarm.handleAlarmResult.actionName);
    let logType = logData.libType;
    if (logData.isRealAlarm) {
      logType = logData.libType !== 3 ? 5 : 6;
    }
    let description = '';
    const isEffective = data.isEffective ? '有效' : '无效';
    switch (logData.libType) {
      case 1:
        description = `标记重点人员布控告警为【${isEffective}】, 信息ID：${
          data.id
        }`;
        break;
      case 2:
        description = `标记外来人员布控告警为【${isEffective}】, 信息ID：${
          data.id
        }`;
        break;
      case 3:
        description = `标记魅影布防事件提醒为【${isEffective}】, 信息ID：${
          data.id
        }`;
        break;
      default:
        break;
    }
    const logInfo = {
      description,
      ...alarm.handleAlarmResult.logInfo.find(
        v => v.type === alarmType[logType]
      )
    };
    return this.$httpRequest({
      url: alarm.handleAlarmResult.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(alarm.handleAlarmResult.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(alarm.handleAlarmResult.actionName);
        return Promise.reject(e);
      });
  };
}

export default new AlarmResult();
