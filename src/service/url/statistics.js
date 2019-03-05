import config from '../config';
const { api, version } = config;
export default {
  statisticsModule: {
    text: '辖区总览',
    code: 107100,
  },
  enterStatisticsModule: {
    text: '进入辖区总览界面',
    code: 107199,
    parent: 107100,
    moduleName: 'Panel'
  },

  // 布控报警数据统计
  countAlarmResultsByHandleType: {
    value: `${api}alarm/${version}/statistics/countAlarmResultsByHandleType`,
    label: '统计不同警情处理情况的警情数'//统计指定时间段内未处理警情、有效警情、无效警情的数目
  },

  countAlarmResultsByMonitorType: {
    value: `${api}alarm/${version}/statistics/countAlarmResultsByMonitorType`,
    label: '统计不同布控类型的警情数'//统计指定时间段内未处理警情、有效警情、无效警情的数目
  },

  countAlarmResultsTrend: {
    value: `${api}alarm/${version}/statistics/countAlarmResultsTrend`,
    label: '警情总数趋势统计'
  },

  countAlarmResultsTrendByAlarmType: {
    value: `${api}alarm/${version}/statistics/countAlarmResultsTrendByAlarmType`,
    label: '各布控类型警情总数趋势统计'
  },

  countAlarmResultsTrendByHandleType: {
    value: `${api}alarm/${version}/statistics/countAlarmResultsTrendByHandleType`,
    label: '不同警情处理情况的警情数趋势统计'
  },

  countEffectiveAlarmResultsInPlaces: {
    value: `${api}alarm/${version}/statistics/countEffectiveAlarmResultsInPlaces`,
    label: '各场所有效报警数统计'
  },

  countMonitorInfos: {
    value: `${api}alarm/${version}/statistics/countMonitorInfos`,
    label: '指定用户布控统计，包括布控库数目、布控人员数目、布控任务数目'
  },
  countMonitorPersonInOperationCenter: {
    value: `${api}alarm/${version}/statistics/countMonitorPersonInOperationCenter`,
    label: '运营中心布控人员数量统计'
  },

  countPersonInfoFromMonitorLib: {
    value: `${api}alarm/${version}/statistics/countPersonInfoFromMonitorLib`,
    label: '统计布控库中的人员数量和图片数量'
  },

  countUnhandledAlarmResults: {
    value: `${api}alarm/${version}/statistics/countUnhandledAlarmResults`,
    label: '统计用户的未处理报警数'
  },

  countPerson: {
    value: `${api}disa/${version}/statistics/countPerson`,
    label: '人脸人体资源统计'
  },
  countPassRecords: {
    value: `${api}vehicle/${version}/countPassRecords`,
    label: '车辆资源统计'
  },
  countPersonDayTrend: {
    value: `${api}disa/${version}/statistics/countPersonDayTrend`,
    label: '按天统计人脸人体资源趋势'
  },
  countByDays: {
    value: `${api}vehicle/${version}/countByDays`,
    label: '按天统计车辆资源趋势'
  },
  countPersonHourTrend: {
    value: `${api}disa/${version}/statistics/countPersonHourTrend`,
    label: '近24小时人脸人体资源统计'
  },
  countByHours: {
    value: `${api}vehicle/${version}/countByHours`,
    label: '近24小时车辆资源统计'
  },
  ALARMBYDAYSTATIS: {
    value: `${api}statistics/getAlarmStatisticsByDay`,
    label: '报警数'//
  },
  storage: {
    value: `${api}statistics/getStorageInfo`,
    babel: '存储'
  },
  flow: {
    value: `${api}statistics/realTimeStatisticsOfEquipmentStatus`,
    babel: '流量'
  },
  setCard: {
    value: `${api}userKvStore/setUserKvStore`,
    label: '设置卡片位置'
  },
  getCard: {
    value: `${api}userKvStore/getUserKvStore`,
    label: '获取卡片位置'
  },
  queryTrackCount: {
    value: `${api}person/${version}/statistics/queryTrackCount`,
    label: '查询aid轨迹聚合统计接口',
    actionName: 'queryTrackCount'
  },
}