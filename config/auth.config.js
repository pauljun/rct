/**
 * id和code与后台对应
 *
 * icon和 iconFont name
 *
 * name和page.config.js中name对应，若没有对应可直接为空或者不填
 *
 * isHide 是否是个假菜单，后台权限挂在菜单下，所以有一些假菜单
 *
 * includeNames [name1,name2] 当是一个占位菜单，跳转的是子菜单时，用到这个配置
 *
 *
 */

const menu = [
  {
    id: '100001010049',
    code: '',
    name: 'jurisdictionOverview',
    isHide: false,
    icon: 'icon-DataPanel_Main',
    menuName: '辖区面板',
    storeName: []
  },
  {
    id: '100001010018',
    code: '',
    name: 'videoSurveillance',
    isHide: false,
    icon: 'icon-_Video',
    menuName: '视频监控',
    storeName: ['viddeModule']
  },
  // 人员布控
  {
    id: '100001010046',
    code: '',
    name: 'personnelMonitor',
    isLocal: false,
    icon: 'icon-_PeopleAlarm',
    menuName: '人员布控',
    storeName: []
  },
  {
    id: '100001010066',
    parentId: '100001010046',
    code: '',
    name: 'personnelRealAlarm',
    isLocal: false,
    icon: 'icon-_Alarm',
    menuName: '实时告警',
    storeName: []
  },
  {
    id: '100001010069',
    code: '',
    name: 'keyPersonnel',
    isLocal: false,
    icon: 'icon-People_Focus_Dark',
    menuName: '重点人员布控-占位',
    parentId: '100001010046',
    storeName: [],
    includeNames: [
      'keyPersonnelHistory',
      'keyPersonnelTaskView',
      'keyPersonnelLibraryView'
    ]
  },
  // 外来人员布控
  {
    id: '100001010070',
    code: '',
    name: 'outsider',
    isLocal: false,
    icon: 'icon-Temporary_Dark',
    menuName: '外来人员布控-占位',
    parentId: '100001010046',
    storeName: [],
    includeNames: ['outsiderHistory', 'outsiderTaskView', 'outsiderLibraryView']
  },

  // 专网套件布控
  {
    id: '100001010071',
    code: '',
    name: 'privateNet',
    isLocal: false,
    icon: 'icon-People_Machine_Main2',
    menuName: '专网套件布控-占位',
    parentId: '100001010046',
    storeName: [],
    includeNames: [
      'privateNetHistory',
      'privateNetTaskView',
      'privateNetLibraryView'
    ]
  },
  // 事件布防
  {
    id: '100001010005',
    code: '',
    name: 'eventPlacement',
    isLocal: false,
    icon: 'icon-_ThingsAlarm',
    menuName: '事件布控'
  },
  {
    id: '100001010067',
    code: '',
    name: 'eventRealNotify',
    isLocal: false,
    icon: 'icon-Alarm_Main',
    menuName: '事件提醒',
    parentId: '100001010005'
  },
  // 魅影布放
  {
    id: '100001010072',
    code: '',
    name: 'eventMonitor',
    isLocal: false,
    icon: 'icon-_PeopleAlarm',
    menuName: '魅影布放',
    parentId: '100001010005',
    storeName: [],
    includeNames: [ 'eventHistoryNotify', 'eventTaskView']
  },
  // 数据资源库
  {
    id: '100001010016',
    code: '',
    name: 'baselib',
    isLocal: false,
    icon: 'icon-_Image',
    menuName: '视图资源库',
    storeName: []
  },
  {
    id: '100001010020',
    code: '',
    name: 'faceLibrary',
    isLocal: false,
    icon: 'icon-Face_Main',
    menuName: '人脸图库',
    storeName: ['face'],
    parentId: '100001010016'
  },
  {
    id: '100001010021',
    code: '',
    name: 'bodyLibrary',
    isLocal: false,
    icon: 'icon-Body_Main',
    menuName: '人体图库',
    storeName: ['body'],
    parentId: '100001010016'
  },
  {
    id: '100001010102',
    code: '',
    name: 'vehicleLibrary',
    isLocal: false,
    icon: 'icon-_CarAlarm',
    menuName: '机动车图库',
    storeName: ['vehicle'],
    parentId: '100001010016'
  },
  {
    id: '100001010086',
    code: '',
    name: 'wifiLibrary',
    isLocal: false,
    icon: 'icon-_Wifi__Green_Dark',
    menuName: 'wifi资源库',
    storeName: [],
    parentId: '100001010016'
  },

  {
    id: '100001010002',
    code: '',
    name: 'resourceSearch',
    isLocal: false,
    icon: 'icon-ImageSearch_Light',
    menuName: '以图搜图',
    storeName: [],
    parentId: '100001010016'
  },
  {
    id: '100001010031',
    code: '',
    name: 'systemManagemrnt',
    isLocal: false,
    icon: 'icon-_Setting',
    menuName: '系统设置',
    storeName: [],
    includeNames: [
      'organization',
      'userView',
      'roleView',
      'villageView',
      'resourceManagement',
      'logger',
      'logStatistical',
      'soldier',
      'deviceView'
    ]
  },
  {
    id: '100001010022',
    code: '',
    name: 'organization',
    isHide: false,
    icon: 'icon-List_Tree_Dark',
    menuName: '组织查看',
    parentId: '100001010031',
    storeName: []
  },
  {
    id: '100001010014',
    code: '',
    name: 'roleView',
    isHide: false,
    isLocal: false,
    icon: 'icon-Control_White_Main2',
    menuName: '角色管理',
    parentId: '100001010031',
    storeName: []
  },
  {
    id: '100001010008',
    code: '',
    name: 'villageView',
    isHide: false,
    isLocal: false,
    icon: 'icon-Community_Dark',
    menuName: '小区管理',
    parentId: '100001010031',
    storeName: []
  },
  {
    id: '100001010052',
    code: '',
    name: 'community',
    isHide: false,
    icon: 'icon-_Community',
    menuName: '社区管理',
    storeName: []
  },
  {
    id: '100001010073',
    code: '',
    name: 'communityOverview',
    isHide: false,
    icon: 'icon-_Community',
    menuName: '社区总览',
    parentId: '100001010052',
    storeName: []
  },
  {
    id: '100001010074',
    code: '',
    name: 'communityRegistered',
    isHide: false,
    icon: 'icon-Often_Dark',
    menuName: '常住人口管理',
    parentId: '100001010052',
    storeName: []
  },
  {
    id: '100001010075',
    code: '',
    name: 'communityUnRegistered',
    isHide: false,
    icon: 'icon-People_Other_Main',
    menuName: '流动人口管理',
    parentId: '100001010052',
    storeName: []
  },
  {
    id: '103001010078',
    code: '',
    name: 'communityRegisterDetail',
    isHide: true,
    icon: 'icon-TreeIcon_People_Main',
    menuName: '常住人口详情',
    parentId: '100001010052'
  },
  {
    id: '103001010099',
    code: '',
    name: 'communityUnregisterDetail',
    isHide: true,
    icon: 'icon-People_Other_Main',
    menuName: '流动人口详情',
    parentId: '100001010052'
  },
  {
    id: '100001010089',
    code: '',
    isHide: false,
    name: 'resourceManagement',
    isLocal: false,
    icon: 'icon-_Platform',
    menuName: '资源管理',
    parentId: '100001010031',
    storeName: []
  },
  {
    id: '100001010088',
    code: '',
    name: 'appManagement',
    isLocal: false,
    icon: 'icon-TreeIcon_index_Dark',
    menuName: '系统应用管理'
  },
  {
    id: '100001010015',
    code: '',
    name: 'logger',
    isLocal: false,
    icon: 'icon-News_Main',
    menuName: '日志管理',
    parentId: '100001010031',
    storeName: []
  },
  {
    id: '100001010036',
    code: '',
    name: 'logStatistical',
    isLocal: false,
    icon: 'icon-Community_Dark',
    menuName: '统计分析',
    parentId: '100001010031',
    storeName: []
  },
  {
    id: '100001010038',
    code: '',
    name: 'soldier',
    isLocal: false,
    icon: 'icon-_Alarm__Main1',
    menuName: '单兵管理',
    parentId: '100001010031',
    storeName: []
  },
  {
    id: '100001010024',
    code: '',
    name: 'deviceView',
    isLocal: false,
    icon: 'icon-_Camera__Main2',
    menuName: '设备列表',
    parentId: '100001010031',
    storeName: []
  },
  {
    id: '100001010023',
    code: '',
    name: 'userView',
    isLocal: false,
    isHide: false,
    icon: 'icon-TreeIcon_People_Main2',
    menuName: '用户列表',
    parentId: '100001010031',
    storeName: []
  },
 
  {
    id: '100001010091',
    code: '',
    name: 'placeFile',
    isHide: false,
    isLocal: false,
    icon: 'icon-Place_Dark',
    menuName: '场所档案',
    storeName: [],
    parentId: '100001010090'
  },
  {
    id: '100001010090',
    code: '',
    name: 'objectMap',
    isHide: false,
    isLocal: false,
    icon: 'icon-Version_Main2',
    menuName: '对象图谱',
    storeName: [],
    includeNames: ['objectMapPersonnel', 'placeFile']
  },
  {
    id: '100001010093',
    code: '',
    name: 'objectMapPersonnel',
    isHide: false,
    isLocal: false,
    icon: 'icon-TreeIcon_People_Main',
    menuName: '查看人员档案',
    parentId: '100001010090'
  },
  
];















// ================================================= //
// ================ 以下为按钮权限 ================== //
// ================================================= //
const func = [
  {
    id: '100001000114',
    code: '',
    name: 'deviceManagement',
    isLocal: false,
    isHide: false,
    icon: 'icon-_Camera__Main2',
    menuName: '编辑设备',
    parentId: '100001010024',
    storeName: []
  },
  {
    id: '100001000252',
    code: '',
    name: 'deviceFile',
    isHide: false,
    isLocal: false,
    icon: 'icon-_Video',
    menuName: '设备档案',
    storeName: [],
    parentId: '100001010091'
  },
  {
    id: '100001000251',
    code: '',
    name: 'personnelCompositionAnalysis',
    isHide: false,
    isLocal: false,
    icon: 'icon-_Video',
    menuName: '人员组成分析',
    storeName: [],
    parentId: '100001010091'
  },
  {
    id: '100001000205',
    code: '',
    name: 'userModify',
    isLocal: false,
    isHide: false,
    icon: 'icon-TreeIcon_People_Main2',
    menuName: '新增用户',
    parentId: '100001010031',
    storeName: []
  },
  {
    id: '100001000205',
    code: '',
    name: 'userEdit',
    isLocal: false,
    isHide: false,
    icon: 'icon-TreeIcon_People_Main2',
    menuName: '用户编辑',
    parentId: '100001010023',
    storeName: []
  },

  {
    id: '100001000248',
    code: '',
    name: 'appManagementDetail',
    isLocal: false,
    isHide: false,
    icon: 'icon-TreeIcon_index_Dark',
    menuName: '应用系统信息',
    parentId: '100001010088',
    storeName: []
  },
  {
    id: '100001000253',
    code: '',
    name: 'objectMapPersonnel',
    isHide: false,
    isLocal: false,
    icon: 'icon-PeopleInfo',
    menuName: '查看人员档案',
    parentId: '100001010093'
  },
  {
    id: '100001000253',
    code: '',
    name: 'objectMapPersonnelList',
    isHide: true,
    isLocal: false,
    icon: 'icon-PeopleInfo',
    menuName: '人员档案',
    parentId: '100001010093'
  },
  {
    id: '100001000253',
    code: '',
    name: 'objectMapPersonnelDetailPloy',
    isHide: true,
    isLocal: false,
    icon: 'icon-PeopleInfo',
    menuName: '人员档案详情',
    parentId: '100001010093'
  },
  {
    id: '100001000253',
    code: '',
    name: 'objectMapPersonnelDetailAid',
    isHide: true,
    isLocal: false,
    icon: 'icon-PeopleInfo',
    menuName: '人员档案详情',
    parentId: '100001010093'
  },
  {
    id: '100001000253',
    code: '',
    name: 'objectMapPersonnelDetailEntry',
    isHide: true,
    isLocal: false,
    icon: 'icon-PeopleInfo',
    menuName: '人员档案详情',
    parentId: '100001010093'
  },
  {
    id: '100001000253',
    code: '',
    name: 'objectMapPersonnelSnapshot',
    isHide: true,
    isLocal: false,
    icon: 'icon-TreeIcon_People_Main',
    menuName: '抓拍记录',
    parentId: '100001010093'
  },
  {
    id: '100001000247',
    code: '',
    name: 'appManagementAdd',
    isLocal: false,
    isHide: false,
    icon: 'icon-TreeIcon_index_Dark',
    menuName: '新建应用系统',
    parentId: '100001010088',
    storeName: []
  },
  // 重点人员布控
  {
    id: '100001000201',
    code: '',
    name: 'keyPersonnelHistory',
    isLocal: false,
    icon: 'icon-Alarm_Main2',
    menuName: '历史告警',
    parentId: '100001010069',
    storeName: []
  },
  {
    id: '100001000130',
    code: '',
    name: 'keyPersonnelTaskView',
    isLocal: false,
    icon: 'icon-News_Main',
    menuName: '任务管理',
    parentId: '100001010069',
    storeName: []
  },
  {
    id: '100001000208',
    code: '',
    name: 'keyPersonnelTaskManage',
    isLocal: false,
    icon: 'icon-_Main1',
    menuName: '重点人员布控任务-添加',
    parentId: '100001010069',
    storeName: []
  },
  {
    id: '100001000137',
    code: '',
    name: 'keyPersonnelLibraryView',
    isLocal: false,
    icon: 'icon-Layer_Main',
    menuName: '重点人员库管理',
    parentId: '100001010069'
  },
  {
    id: '100001000141',
    code: '',
    name: 'keyPersonnelLibraryManage',
    isLocal: false,
    icon: 'icon-_Main1',
    menuName: '重点人员布控库-添加',
    parentId: '100001010069'
  },
  // 外来人员布控
  {
    id: '100001000202',
    code: '',
    name: 'outsiderHistory',
    isLocal: false,
    icon: 'icon-Alarm_Main2',
    menuName: '历史告警',
    parentId: '100001010070',
    storeName: []
  },
  {
    id: '100001000172',
    code: '',
    name: 'outsiderTaskView',
    isLocal: false,
    icon: 'icon-News_Main',
    menuName: '任务管理',
    parentId: '100001010070',
    storeName: []
  },
  {
    id: '100001000209',
    code: '',
    name: 'outsiderTaskManage',
    isLocal: false,
    icon: 'icon-_Main1',
    menuName: '外来人员布控任务-添加',
    parentId: '100001010070',
    storeName: []
  },
  {
    id: '100001000178',
    code: '',
    name: 'outsiderLibraryView',
    isLocal: false,
    icon: 'icon-Layer_Main',
    menuName: '合规人员库管理',
    parentId: '100001010070',
    storeName: []
  },
  {
    id: '100001000182',
    code: '',
    name: 'outsiderLibraryManage',
    isLocal: false,
    icon: 'icon-_Main1',
    menuName: '合规人员布控库-添加',
    parentId: '100001010070',
    storeName: []
  },
  {
    id: '100001000215',
    code: '',
    name: 'privateNetHistory',
    isLocal: false,
    icon: 'icon-Alarm_Main2',
    menuName: '历史告警',
    parentId: '100001010071',
    storeName: []
  },
  {
    id: '100001000193',
    code: '',
    name: 'privateNetTaskView',
    isLocal: false,
    icon: 'icon-News_Main',
    menuName: '任务管理',
    parentId: '100001010071',
    storeName: []
  },
  {
    id: '100001000194',
    code: '',
    name: 'privateNetTaskManage',
    isLocal: false,
    icon: 'icon-_Main1',
    menuName: '专网套件布控任务-添加',
    parentId: '100001010071',
    storeName: []
  },
  // 专网布控
  {
    id: '100001000196',
    code: '',
    name: 'privateNetLibraryView',
    isLocal: false,
    icon: 'icon-Layer_Main',
    menuName: '专网库管理',
    parentId: '100001010071',
    storeName: []
  },
  {
    id: '100001000197',
    code: '',
    name: 'privateNetLibraryManage',
    isLocal: false,
    icon: 'icon-_Main1',
    menuName: '专网套件布控库-添加',
    parentId: '100001010071',
    storeName: []
  },
  // 魅影
  {
    id: '100001000234',
    code: '',
    name: 'eventHistoryNotify',
    isLocal: false,
    icon: 'icon-Alarm_Main2',
    menuName: '历史提醒',
    parentId: '100001010072',
    storeName: []
  },
  {
    id: '100001000187',
    code: '',
    name: 'eventTaskView',
    isLocal: false,
    icon: 'icon-News_Main',
    menuName: '任务管理',
    parentId: '100001010072',
    storeName: []
  },
  {
    id: '100001000207',
    code: '',
    name: 'eventTaskManage',
    isLocal: false,
    icon: 'icon-_Main1',
    menuName: '魅影布防任务-添加',
    parentId: '100001010072',
    storeName: []
  },
  // 布控模块和事件模块告警详情
  {
    id: '100001000201',
    code: '',
    name: 'keyPersonnelDetail',
    isLocal: false,
    icon: 'icon-Clock_Main',
    menuName: '重点人员告警详情',
    parentId: '100001010069'
  },
  {
    id: '100001000202',
    code: '',
    name: 'outsiderDetail',
    isLocal: false,
    icon: 'icon-Clock_Main',
    menuName: '外来人员告警详情',
    parentId: '100001010070'
  },
  {
    id: '100001000215',
    code: '',
    name: 'privateNetDetail',
    isLocal: false,
    icon: 'icon-Clock_Main',
    menuName: '专网告警详情',
    parentId: '100001010071'
  },
  {
    id: '100001000234',
    code: '',
    name: 'eventDetail',
    isLocal: false,
    icon: 'icon-Clock_Main',
    menuName: '魅影提醒详情',
    parentId: '100001010072'
  },
  {
    id: '100001000204',
    code: '',
    name: 'roleModify',
    isLocal: false,
    icon: 'icon-Control_White_Main2',
    menuName: '角色修改',
    storeName: []
  },
  {
    id: '100001000144',
    code: '',
    name: 'jurisdictionSetting',
    isLocal: false,
    icon: 'icon-DataPanel_Main',
    menuName: '自定义辖区面板',
    storeName: []
  },
  //小区
  {
    id: '100001000225',
    code: '',
    name: 'villageDetail',
    isLocal: false,
    icon: 'icon-Community_Dark',
    menuName: '小区详情',
    parentId: '100001010008',
    storeName: []
  },
  {
    id: '100001000238',
    code: '',
    name: 'faceLibraryDetail',
		isLocal: true,
		isHide: false,
    icon: 'icon-StructuredFace_Main',
    menuName: '人脸图库详情',
    storeName: [],
    parentId: '100001010016'
  },
  {
    id: '100001000244',
    code: '',
    name: 'wifiLibraryDetail',
    isLocal: true,
    icon: 'icon-Car_Main',
    menuName: 'wifi资源库详情',
    storeName: [],
    parentId: '100001010016'
  },
  {
    id: '100001000239',
    code: '',
    name: 'bodyLibraryDetail',
		isLocal: true,
		isHide: false,
    icon: 'icon-StructuredBody_Main',
    menuName: '人体图库详情',
    storeName: [],
    parentId: '100001010016'
  },
  {
    id: '100001000246',
    code: '',
    name: 'vehicleLibraryDetail',
		isLocal: true,
		isHide: false,
    icon: 'icon-Car_Main',
    menuName: '机动车图库详情',
    storeName: [],
    parentId: '100001010016'
  },
  {
    id: '100001000225',
    code: '',
    name: 'peopleEntry',
    isLocal: false,
    icon: 'icon-_Community__Main',
    menuName: '小区人员录入',
    parentId: '100001010008',
    storeName: []
  },
  // 实时报警管理（查看和处理）人员布控
  {
    id: '100001000200',
    code: '',
    name: 'alarmResultHandle',
    isLocal: false,
    menuName: '实时报警管理（查看和处理）人员布控',
    parentId: '100001010066',
  },
  // 实时报警管理（查看和处理）事件布放 
  {
    id: '100001000211',
    code: '',
    name: 'eventMonitorHandle',
    isLocal: false,
    menuName: '实时报警管理（查看和处理）事件布放 ',
    parentId: '100001010067',
  },
  {
    id: '100001000255', // 待修改
    code: '',
    name: 'videoAbstract',
    isLocal: false,
    icon: 'icon-Camera_Dark',
    menuName: '视频摘要',
    parentId: '100001010018', // 待修改
    storeName: []
  },
  {
    id: Math.random(),
    code: '',
    name: 'resourceSearchDetail',
    isLocal: true,
    icon: 'icon-ImageSearch_Light',
    menuName: '以图搜图详情',
    storeName: [],
    parentId: '100001010016'
  },  
  {
    id: Math.random(),
    code: '',
    name: 'resourceTrajectory',
    isLocal: true,
    icon: 'icon-Trajectory_Main2',
    menuName: '生成轨迹',
    storeName: [],
    parentId: '100001010016'
  },
  {
    id: '100001000240',
    code: '',
    name: 'BaselibImgDownload',
    isLocal: false,
    menuName: '资源库图片下载',
    parentId: '100001010082',
  },
  {
    id: '100001000076',
    code: '',
    name: 'DownloadVideo',
    isLocal: false,
    menuName: '历史录像下载',
    parentId: '100001010082',
  },
  {
    id: '100001000075',
    code: '',
    name: 'historyVideo',
    isLocal: false,
    menuName: '历史录像查看',
    parentId: '100001010018',
  },
  {
    id: '100001000166',
    code: '',
    name: 'deviceLocation',
    isLocal: false,
    menuName: '地图标注',
    parentId: '100001010024',
  },
  {
    id: '100001000203',
    code: '',
    name: 'soldierManagement',
    isLocal: false,
    menuName: '单兵设备管理权限',
    parentId: '100001010038',
  },

  {
    id: '100001000206',
    code: '',
    name: 'organizationManage',
    isLocal: false,
    icon:'icon-List_Tree_Dark',
    menuName: '组织管理',
    parentId: '100001010022',
  },
];

module.exports = {
  menu,
  func
};
