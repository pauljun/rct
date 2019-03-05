import config from '../config';
const { api, version } = config;


export default {
  queryLogs: {
    value: `${api}log/${version}/queryLogs`,
    lable: '查询操作日志列表',
    actionName: 'queryLogs',
  },

  exportLogs: {
    value: `${api}log/${version}/exportLogs`,
    lable: '导出操作日志',
    actionName: 'exportLogs',
  },
  save: {
    value: `${api}log/${version}/addLog`,
    label: '日志存储'
  }
};
