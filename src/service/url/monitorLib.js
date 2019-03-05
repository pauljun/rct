import config from '../config';
const { api, version } = config
export default {
  moniteeFaceLibModule: {
    text: '重点人员布控库',
    code: 105000,
  },
  enterMoniteeFaceLibModule: {
    text: '进入重点人员布控布控库管理界面',
    code: 105099,
    parent: 105000,
    moduleName: 'keyPersonnelLibraryView',
  },
  moniteeOutsidersLibModule: {
    text: '外来人员布控库',
    code: 106000,
  },
  enterMoniteeOutsidersLibModule: {
    text: '进入外来人员布控合规人员库管理界面',
    code: 106099,
    parent: 106000,
    moduleName: 'outsidersBlackLibView',
  },
  moniteeAIOLibModule: {
    text: '专网套件布控库',
    code: 106200,
  },
  enterMoniteeAIOLibModule: {
    text: '进入专网套件布控布控库管理界面',
    code: 106299,
    parent: 106200,
    moduleName: 'AIOLibsView',
  },
  queryMonitorLibs: {
    value: `${api}alarm/${version}/monitorLib/queryMonitorLibs`,
    label: '获取布控库列表',
    actionName: 'queryMonitorLibs'
  },
  queryMonitorLibDetail: {
    value: `${api}alarm/${version}/monitorLib/monitorLibs/<id>`,
    label: '查询布控库详情',
    actionName: 'queryMonitorLibDetail'
  },
  deleteMonitorLib: {
    value: `${api}alarm/${version}/monitorLib/deleteMonitorLib/<id>`,
    label: '删除布控库',
    actionName:'deleteMonitorLibs',
    logInfo: [
      {
        type: 1,
        text: '删除布控库',
        code: 105003,
        parent: 105000
      },
      {
        type: 2,
        text: '删除布控库',
        code: 106004,
        parent: 106000
      },
    ]
  },
  addMonitorLib: {
    value: `${api}alarm/${version}/monitorLib/addMonitorLib`,
    label: '新增布控库',
    actionName:'addMonitorLib',
    logInfo: [
      {
        type: 1,
        text: '新增布控库',
        code: 105002,
        parent: 105000
      },
      {
        type: 2,
        text: '新增布控库',
        code: 106005,
        parent: 106000
      },
    ]
  },
  updateMonitorLib: {
    value: `${api}alarm/${version}/monitorLib/updateMonitorLib`,
    label: '修改布控库',
    actionName:'updateMonitorLib',
    logInfo: [
      {
        type: 1,
        text: '编辑布控库基本信息',
        code: 105004,
        parent: 105000
      },
      {
        type: 2,
        text: '编辑布控库基本信息',
        code: 106001,
        parent: 106000
      },
      {
        type: 4,
        text: '编辑专网套件布控库信息',
        code: 106202,
        parent: 106200
      }
    ]
  },
  importMachineMonitorLibs: {
    value: `${api}alarm/${version}/monitorLib/importMachineMonitorLibs`,
    label: '导入布控库（一体机）',
    actionName: 'importMachineMonitorLibs',
    logInfo: [
      {
        text: '导入专网套件布控库',
        code: 106201,
        parent: 106200
      }
    ]
  },
  updateMonitorLibPerson: {
    value: `${api}alarm/${version}/monitorLib/updateMonitorLibPerson`,
    label: '修改布控人员信息',
    actionName: 'updateMonitorLibPerson',
    logInfo: [
      {
        type: 1,
        text: '编辑重点人员',
        code: 105009,
        parent: 105000
      },
      {
        type: 2,
        text: '编辑合规人员',
        code: 106006,
        parent: 106000
      },
    ]
  },
  deleteMonitorLibPersons: {
    value: `${api}alarm/${version}/monitorLib/deleteMonitorLibPersons`,
    label: '批量删除布控对象',
    actionName:'deleteMonitorLibPersons',
    logInfo: [
      {
        type: 1,
        text: '移除重点人员',
        code: 105010,
        parent: 105000
      },
      {
        type: 2,
        text: '移除合规人员',
        code: 106003,
        parent: 106000
      },
    ]
  },
  deleteMonitorLibPersonPicture: {
    value: `${api}alarm/${version}/monitorLib/deleteMonitorLibPersonPicture/<id>`,
    label: '删除单个布控对象的单个特征图片',
    actionName:'deleteMonitorLibPersonPicture',
  },
  addMonitorLibPersons: {
    value: `${api}alarm/${version}/monitorLib/addMonitorLibPersons`,
    label: '批量新增布控对象',
    actionName:'addMonitorLibPersons',
    logInfo: [
      {
        type: 1,
        text: '添加重点人员',
        code: 105008,
        parent: 105000
      },
      {
        type: 2,
        text: '添加合规人员',
        code: 106002,
        parent: 106000
      },
    ]
  },
  // 布控对象图片上传
  uploadMonitorPersonPic: {
    value: `${api}alarm/${version}/upload/uploadMonitorPersonPic`,
    label: '上传单张布控对象图片到服务',
    actionName:'uploadMonitorPersonPic',
  },
  // 删除布控对象图片-羚羊云删除
  deleteMonitorPersonPic: {
    value: `${api}alarm/${version}/upload/deleteMonitorPersonPic`,
    label: '删除布控对象图片-羚羊云删除',
    actionName:'deleteMonitorPersonPic',
  },
  // 一体机布控库导入文件上传-上传羚羊云获取url
  uploadMachnieMonitorLibFile: {
    value: `${api}alarm/${version}/upload/uploadMachnieMonitorLibFile`,
    label: '上传一体机布控库到服务器',
    actionName: 'uploadMachnieMonitorLibFile'
  },
  // 获取一体机布控库导入变化详情
  getMachineMonitorLibsChanges: {
    value: `${api}alarm/${version}/monitorLib/getMachineMonitorLibsChanges`,
    label: '获取布控库导入变化（一体机）',
    actionName: 'getMachineMonitorLibsChanges'
  }
}