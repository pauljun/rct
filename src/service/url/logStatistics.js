import Config from '../config';
const { api } = Config;
export default {
  queryLogStatisticsList: {
    value: `${api}statistics/getLogStatistics`,
    lable: '系统数据列表',
    actionName: 'getLogStatistics',
  },
  exportStatisticsLog: {
    value: `${api}statistics/exportStatisticsLog`,
    lable: '导出',
    actionName: 'exportStatisticsLog',
  },
}