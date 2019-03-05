import config from '../config';
const { api, version } = config
// 布控库url
export default {
  moniteeFaceTaskModule: {
    text: '重点人员布控任务',
    code: 105100,
  },
  enterMoniteeFaceTaskModule: {
    text: '进入重点人员布控布控任务管理界面',
    code: 105199,
    parent: 105100,
    moduleName: 'keyPersonnelTaskView',
  },
  moniteeOutsidersTaskModule: {
    text: '外来人员布控任务',
    code: 106100,
  },
  enterMoniteeOutsidersTaskModule: {
    text: '进入外来人员布控布控任务管理界面',
    code: 106199,
    parent: 106100,
    moduleName: 'outsiderTaskView',
  },
  moniteeAIOTaskModule: {
    text: '专网套件布控任务',
    code: 106300,
  },
  enterMoniteeAIOTaskModule: {
    text: '进入专网套件布控布控任务管理界面',
    code: 106399,
    parent: 106300,
    moduleName: 'privateNetTaskView',
  },
  moniteePhantomTaskModule: {
    text: '魅影布防布控任务',
    code: 106600,
  },
  enterMoniteePhantomTaskModule: {
    text: '进入魅影布防布控任务管理界面',
    code: 106699,
    parent: 106600,
    moduleName: 'eventTaskView',
  },
  queryMonitorTasks: {
    value: `${api}alarm/${version}/monitorTask/queryMonitorTasks`,
    label: '获取布控任务列表',
    actionName: 'queryMonitorTasks'
  },
  setWhetherIgnoreAlarm: {
    value: `${api}alarm/${version}/monitorTask/setWhetherIgnoreAlarm`,
    label: '设置忽略/取消忽略布控任务报警',
    actionName: 'setWhetherIgnoreAlarm'
  },
  changeMonitorTaskRunStatus: {
    value: `${api}alarm/${version}/monitorTask/changeMonitorTaskRunStatus`,
    label: '批量开启或暂停布控任务',
    actionName: 'changeMonitorTaskRunStatus',
    logInfo: [
      {
        type: 'faceTask',
        text: '开始/暂停布控任务',
        code: 105106,
        parent: 105100,
      },
      {
        type: 'outsidersTask',
        text: '开始/暂停布控任务',
        code: 106101,
        parent: 106100,
      },
      {
        type: 'AIOTask',
        text: '开始/暂停布控任务',
        code: 106301,
        parent: 106300,
      },
      {
        type: 'phantomTask',
        text: '开始/暂停布控任务',
        code: 106601,
        parent: 106600,
      }
    ]
  },
  deleteMonitorTask: {
    value: `${api}alarm/${version}/monitorTask/deleteMonitorTask/<id>`,
    label: '删除布控任务',
    actionName: 'deleteMonitorTask',
  },
  addMonitorTask: {
    value: `${api}alarm/${version}/monitorTask/addMonitorTask`,
    label: '新增布控任务',
    actionName: 'addMonitorTask',
    logInfo: [
      {
        type: 'faceTask',
        text: '新建布控任务',
        code: 105102,
        parent: 105100,
      },
      {
        type: 'outsidersTask',
        text: '新建布控任务',
        code: 106102,
        parent: 106100,
      },
      {
        type: 'AIOTask',
        text: '新建布控任务',
        code: 106302,
        parent: 106300,
      },
      {
        type: 'phantomTask',
        text: '新建布控任务',
        code: 106602,
        parent: 106600,
      }
    ]
  },
  updateMonitorTask: {
    value: `${api}alarm/${version}/monitorTask/updateMonitorTask`,
    label: '修改布控任务',
    actionName: 'updateMonitorTask',
    logInfo: [
      {
        type: 'faceTask',
        text: '编辑布控任务基本信息',
        code: 105104,
        parent: 105100,
      },
      {
        type: 'outsidersTask',
        text: '编辑布控任务基本信息',
        code: 106103,
        parent: 106100,
      },
      {
        type: 'AIOTask',
        text: '编辑布控任务基本信息',
        code: 106303,
        parent: 106300,
      },
      {
        type: 'phantomTask',
        text: '编辑布控任务基本信息',
        code: 106603,
        parent: 106600,
      }
    ]
  },
  queryMonitorTaskDetail: {
    value: `${api}alarm/${version}/monitorTask/monitorTasks/<id>`,
    label: '查询布控任务详情',
    actionName: 'queryMonitorTaskDetail',
  }
}