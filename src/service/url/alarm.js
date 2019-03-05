import config from '../config';
const { api, version } = config;

export default {
  queryAlarmResults: {
    value: `${api}alarm/${version}/alarmResult/queryAlarmResults`,
    label: '获取警情列表',
    actionName:'queryAlarmResults'
  },

  alarmResults: {
    value: `${api}alarm/${version}/alarmResult/alarmResults/<id>`,
    label: '查看历史警情详情',
    actionName:'alarmResults',
    logInfo: [
      {
        type: 'personnelRealAlarm',
        code: 105801,
        parent: 105800,
        text: '查看告警信息',
      },
      {
        type: 'faceAlarm',
        code: 105203,
        parent: 105200,
        text: '查看告警信息',
      },
      {
        type: 'outsidersAlarm',
        code: 105901,
        parent: 105900,
        text: '查看告警信息',
      },
      {
        type: 'AIOAlarm',
        code: 107201,
        parent: 107200,
        text: '查看告警信息',
      },
      {
        type: 'phantomRealAlarm',
        code: 106401,
        parent: 106400,
        text: '查看提醒信息',
      },
      {
        type: 'phantomAlarm',
        code: 106501,
        parent: 106500,
        text: '查看提醒信息',
      },
    ]
  },
  handleAlarmResult: {
    value: `${api}alarm/${version}/alarmResult/handleAlarmResult`,
    label: '设置警情有效性',
    logInfo: [
      {
        type: 'personnelRealAlarm',
        code: 105802,
        parent: 105800,
        text: '处理告警信息',
      },
      {
        type: 'faceAlarm',
        code: 105202,
        parent: 105200,
        text: '处理告警信息',
      },
      {
        type: 'outsidersAlarm',
        code: 105905,
        parent: 105900,
        text: '处理告警信息',
      },
      {
        type: 'phantomRealAlarm',
        code: 106405,
        parent: 106400,
        text: '处理提醒信息',
      },
      {
        type: 'phantomAlarm',
        code: 106505,
        parent: 106500,
        text: '处理提醒信息',
      },
    ]
  },
}