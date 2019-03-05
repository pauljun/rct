/**
 * 配置页面路由
 */
module.exports = [
  {
    name: 'jurisdictionOverview',
    url: 'jurisdictionOverview/panel',
    description: '辖区总览'
  },
  {
    name: 'jurisdictionSetting',
    url: 'jurisdictionOverview/jurisdictionSetting',
    description: '自定义辖区面板'
  },

  // -------------------------------------------------------- 

  {
    name: 'videoSurveillance',
    url: 'videoSurveillance',
    description: '视频监控'
  },
  {
    name: 'videoAbstract',
    url: 'videoSurveillance/videoAbstract',
    description: '视频摘要'
  },

  // --------------------------------------------------------

  {
    name: 'personnelRealAlarm',
    url: 'personnelMonitor/realAlarm',
    description: '实时告警'
  },

  // ------------------------重点人员布控--------------------------------
  // 布控模块增加过渡单包-后期移除
  {
    name: 'keyPersonnel',
    // url: 'personnelMonitor/keyPersonnel',
    description: '重点人员模块',
    noPage:true
  },
  {
    name: 'keyPersonnelHistory',
    url: 'personnelMonitor/keyPersonnel/history',
    description: '重点人员历史告警'
  },
  {
    name: 'keyPersonnelLibraryView',
    url: 'personnelMonitor/keyPersonnel/library/view',
    description: '重点人员库查看'
  },
  {
    name: 'keyPersonnelLibraryManage',
    url: 'personnelMonitor/keyPersonnel/library/manage',
    description: '重点人员库管理'
  },
  {
    name: 'keyPersonnelTaskView',
    url: 'personnelMonitor/keyPersonnel/task/view',
    description: '重点人员布控任务查看'
  },
  {
    name: 'keyPersonnelTaskManage',
    url: 'personnelMonitor/keyPersonnel/task/manage',
    description: '重点人员布控任务管理'
  },
  {
    name: 'keyPersonnelDetail',
    url: 'personnelMonitor/keyPersonnel/detail',
    description: '重点人员告警详情'
  },
  // --------------------------------------------------------
  {
    name: 'outsider',
    description: '外来人员布控',
    noPage:true
  },
  {
    name: 'outsiderHistory',
    url: 'personnelMonitor/outsider/history',
    description: '外来人员历史告警'
  },
  {
    name: 'outsiderLibraryView',
    url: 'personnelMonitor/outsider/library/view',
    description: '合规人员库查看'
  },
  {
    name: 'outsiderLibraryManage',
    url: 'personnelMonitor/outsider/library/manage',
    description: '合规人员库管理'
  },
  {
    name: 'outsiderTaskView',
    url: 'personnelMonitor/outsider/task/view',
    description: '外来人员布控任务查看'
  },
  {
    name: 'outsiderTaskManage',
    url: 'personnelMonitor/outsider/task/manage',
    description: '外来人员布控任务管理'
  },
  {
    name: 'outsiderDetail',
    url: 'personnelMonitor/outsider/detail',
    description: '外来人员告警详情'
  },
  // --------------------------------------------------------
  {
    name: 'privateNet',
    description: '专网套件布控',
    noPage:true
  },
  {
    name: 'privateNetHistory',
    url: 'personnelMonitor/privateNet/history',
    description: '专网历史告警'
  },
  {
    name: 'privateNetLibraryView',
    url: 'personnelMonitor/privateNet/library/view',
    description: '专网布控库查看'
  },
  {
    name: 'privateNetLibraryManage',
    url: 'personnelMonitor/privateNet/library/manage',
    description: '专网布控库管理'
  },
  {
    name: 'privateNetTaskView',
    url: 'personnelMonitor/privateNet/task/view',
    description: '专网布控任务查看'
  },
  {
    name: 'privateNetTaskManage',
    url: 'personnelMonitor/privateNet/task/manage',
    description: '专网布控任务管理'
  },
  {
    name: 'privateNetDetail',
    url: 'personnelMonitor/privateNet/detail',
    description: '专网布控任务告警详情'
  },
  // -------------------------------------------------------- //
  /**
   * 对应魅影布防模块 所有的路由
   */
  {
    name: 'eventRealNotify',
    url: 'eventMonitor/realNotify',
    description: '事件实时提醒'
  },
  {
    name: 'eventMonitor',
    description: '魅影布防',
    noPage:true
  },
  {
    name: 'eventHistoryNotify',
    url: 'eventMonitor/historyNotify',
    description: '事件历史提醒'
  },
  {
    name: 'eventTaskView',
    url: 'eventMonitor/task/view',
    description: '事件任务查看'
  },
  {
    name: 'eventTaskManage',
    url: 'eventMonitor/task/manage',
    description: '事件任务管理'
  },
  {
    name: 'eventDetail',
    url: 'eventMonitor/detail',
    description: '魅影提醒详情'
  },

  // --------------------------------------------------------
  { 
    name: 'faceLibrary', 
    url: 'resourceLibrary/face', 
    description: '人脸图库' 
  },
  { 
    name: 'faceLibraryDetail', 
    url: 'resourceLibrary/face/detail', 
    description: '人脸图库详情' 
  },
  { 
    name: 'bodyLibrary', 
    url: 'resourceLibrary/body', 
    description: '人体图库' 
  },
  { 
    name: 'bodyLibraryDetail', 
    url: 'resourceLibrary/body/detail', 
    description: '人体图库详情' 
  },
  {
    name: 'vehicleLibrary',
    url: 'resourceLibrary/vehicle',
    description: '机动车图库'
  },
  {
    name: 'vehicleLibraryDetail',
    url: 'resourceLibrary/vehicle/detail',
    description: '机动车图库详情'
  },
  {
    name: 'wifiLibrary',
    url: 'resourceLibrary/wifi',
    description: 'wifi资源库'
  },
  {
    name: 'wifiLibraryDetail',
    url: 'resourceLibrary/wifi/detail',
    description: 'wifi资源库'
  },  
  {
    name: 'resourceSearch',
    url: 'resourceLibrary/search',
    description: '以图搜图'
  },
  {
    name: 'resourceSearchDetail',
    url: 'resourceLibrary/search/detail',
    description: '以图搜图详情'
  },
  {
    name: 'resourceTrajectory',
    url: 'resourceLibrary/trajectory',
    description: '生成轨迹'
  },
  // --------------------------------------------------------

  {
    name: 'communityOverview',
    url: 'community/overview',
    description: '社区总览'
  },
  {
    name: 'communityRegistered',
    url: 'community/registered',
    description: '常住人口管理'
  },
  {
    name: 'communityUnRegistered',
    url: 'community/unRegistered',
    description: '流动人口管理'
  },
  {
    name:'communityRegisterDetail',
    url:'community/registeredDetail',
    description:'常住人口详情'
  },
  {
    name:'communityUnregisterDetail',
    url:'community/unRegisteredDetail',
    description:'流动人口详情'
  },

  // --------------------------------------------------------
  {
    name: 'organization',
    url: 'systemManagement/organization',
    description: '组织查看'
  },
  {
    name: 'userView',
    url: 'systemManagemrnt/user/view',
    description: '用户列表'
  },
  {
    name: 'userModify',
    url: 'systemManagemrnt/user/modify',
    description: '新增用户'
  },
  {
    name: 'userEdit',
    url: 'systemManagemrnt/user/userEdit',
    description: '编辑用户'
  },


  { 
    name: 'soldier',
    url: 'systemManagement/soldier', 
    description: '单兵管理' 
  },

  {
    name: 'roleView',
    url: 'systemManagemrnt/role/view',
    description: '角色列表'
  },
  {
    name: 'roleModify',
    url: 'systemManagemrnt/role/modify',
    description: '角色修改'
  },
  {
    name: 'deviceView',
    url: 'systemManagemrnt/device/view',
    description: '设备列表'
  },
  {
    name: 'deviceManagement',
    url: 'systemManagemrnt/device/modify',
    description: '编辑设备'
  },
  {
    name: 'villageView',
    url: 'systemManagemrnt/village/view',
    description: '小区列表'
  },
  {
    name: 'villageDetail',
    url: 'SystemManagement/village/detail',
    description: '小区详情'
  },
  {
    name: 'peopleEntry',
    url: 'SystemManagement/village/peopleEntry',
    description: '人员录入'
  },
  {
    name: 'logStatistical',
    url: 'systemManagement/logStatistical',
    description: '统计分析'
  },
  {
    name: 'centerVillageView',
    url: 'systemManagement/centerVillage/view',
    description: '小区列表(admin)'
  },
  {
    name: 'centerVillageModify',
    url: 'systemManagement/centerVillage/modify',
    description: '小区修改(admin)'
  },
  {
    name: 'personnelEntry',
    url: 'systemManagement/personnelEntry',
    description: '小区信息录入'
  },
  {
    name: 'appManagement',
    url: 'appManagement/view',
    description: '应用系统管理'
  },

  {
    name: 'appManagementDetail',
    url: 'appManagement/detail',
    description: '应用系统信息'
  },
  {
    name: 'appManagementAdd',
    url: 'appManagement/add',
    description: '新建应用系统'
  },
  {
    name: 'resourceManagement',
    url: 'resourceManagement',
    description: '资源管理'
  },
  {
    name: 'logger',
    url: 'systemManagement/logger',
    description: '日志管理'
  },
  
  // --------------------------------------------------------
  {
    name: 'objectMap',
    description: '对象图谱',
    noPage:true
  },
  {
    name: 'objectMapPersonnel',
    url: 'objectMap/personnel',
    description: '人员档案'
  },
  {
    name: 'objectMapPersonnelList',
    url: 'objectMap/personnel/List',
    description: '人员档案搜索'
  },
  {
    name: 'objectMapPersonnelDetailPloy',
    url: 'objectMap/personnel/detailPloy',
    description: '人员档案详情'
  },
  {
    name: 'objectMapPersonnelDetailAid',
    url: 'objectMap/personnel/detailAid',
    description: '人员档案详情'
  },
  {
    name: 'objectMapPersonnelDetailEntry',
    url: 'objectMap/personnel/detailEntry',
    description: '人员档案详情'
  },
  {
    name: 'objectMapPersonnelSnapshot',
    url: 'objectMap/personnel/snapshot',
    description: '人员档案详情'
  },
  {
    name: 'placeFile',
    url: 'objectMap/placeFile',
    description: '场所档案'
  },
  {
    name: 'deviceFile',
    url: 'objectMap/deviceFile',
    description: '设备档案'
  },
  {
    name: 'personnelCompositionAnalysis',
    url: 'objectMap/placeFile/personnelCompositionAnalysis',
    description: '人员组成分析'
  },
];
