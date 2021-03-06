// 用户权限字典

export default [
  //系统工具

  { id: 101100000008, module: '系统工具'},
  { id: 100001010084, text: '系统工具',parentId:101100000008 },
  { id: 1100501, text: '智慧广播', parentId: 100001010084 },

  //辖区总览
  { id: 101100000001, module: '数据总览模块'},
  { id: 100001010049, text: '辖区总览', parentId: 101100000001 },
  { id: 1070101, text: '辖区总览查看', parentId: 100001010049},
  //视频监控
  { id:101100000002, module: '视频监控模块' },
  { id: 100001010018, text: '视频监控' ,parentId:101100000002},
  {
    id: 1010101,
    text: '实时视频查看',
    parentId: 100001010018,
    isCancel: [1010103, 1010102]
  },
  {
    id: 1010102,
    text: '历史视频查看',
    parentId: 100001010018,
    isSelect: [1010101],
    isCancel: [1010103]
  },
  //人力情报
  // { id: 1090000, text: '人力情报',module:1},
  // { id: 1090101, text: '新闻列表',parentId:1090000},
  // { id: 1090201, text: '新闻发布',parentId:1090000},
  // { id: 1090301, text: '线索列表',parentId:1090000},
  //人员布控
  { id: 101100000003, module: '布防布控' },
  { id: 100001010046, text: '人员布控布控',parentId:101100000003 },
  { id: 100001010066, text: '实时告警', parentId: 100001010046 },
  { id: 100001010069, text: '重点人员布控', parentId: 100001010046 },
  { id: 100001010070, text: '外来人员布控', parentId: 100001010046 },
  { id: 100001010071, text: '专网套件布控', parentId: 100001010046 },
  //事件布防
  { id: 100001010005, text: '事件布防' ,parentId:101100000003},
  { id: 100001010067, text: '事件提醒',parentId: 100001010005},
  { id: 100001010072, text: '魅影布防', parentId: 100001010005 },

  //数据资源库
  { id: 101100000004, module: '数据资源服务模块'},
  //对象图谱
  { id: 100001010090, text: '对象图谱',parentId:101100000004 },
  { id: 100001010093, text: '人员档案', parentId: 100001010090 },
  { id: 100001010091, text: '场所档案', parentId: 100001010090 },
  { id: 100001010016, text: '数据资源库',parentId:101100000004 },
  { id: 100001010020, text: '人脸图库', parentId: 100001010016 },
  { id: 100001010021, text: '人体图库', parentId: 100001010016 },
  { id: 100001010102, text: '机动车图库', parentId: 100001010016 },
  { id: 100001010103, text: '非机动车图库', parentId: 100001010016 },
  { id: 100001010086, text: 'wifi资源库', parentId: 100001010016 },
  //社区管理
  { id: 101100000005, module: '社区应用模块'},
  { id: 100001010073, text: '社区总览',parentId:101100000005 ,children:[]},
  { id: 100001010052, text: '社区管理',parentId:101100000005 },
  {
    id: 100001010074,
    text: '已登记人员管理',
    parentId: 100001010052,
  },
  {
    id: 100001010075,
    text: '未登记人员管理',
    parentId: 100001010052,
  },
  //系统管理
  { id: 101100000006, module: '默认系统管理模块'},
  { id: 100001010031, text: '系统管理',parentId:101100000006},

  //组织
  { id: 100001010022, text: '组织管理', parentId: 100001010031 },
  //用户
  { id: 100001010023, text: '用户管理', parentId: 100001010031 },
  //角色
  { id: 100001010014, text: '角色管理', parentId: 100001010031 },
  { id: 100001010038, text: '单兵管理', parentId: 100001010031},

  //单兵
  // { id: 100001010038, text: '单兵管理', parentId: 100001010031 },
  // {
  // 	id: 1040601,
  // 	text: '查看单兵信息',
  // 	parentId: 100001010038,
  // 	isCancel: [ 1040605 ]
  // },
  // {
  // 	id: 1040605,
  // 	text: '单兵设备管理',
  // 	parentId: 100001010038,
  // 	isSelect: [ 1040601 ]
  // },

  //设备
  { id: 100001010024, text: '设备管理', parentId: 100001010031 },

  //日志
  { id: 100001010015, text: '日志管理', parentId: 100001010031 },

  //(运营中心)
  { id: 100001010008, text: '小区管理', parentId: 100001010031 },
  //app
  // { id: 8, module: 'APP模块'},
  // { id: 100001010081, text: 'APP权限管理',parentId:8 },
  // {
  //   id: 2010201,
  //   text: '实时视频',
  //   parentId: 100001010081,
  //   isCancel: [2010301, 2010401, 2010501, 2010601]
  // },
  // {
  //   id: 2010301,
  //   text: '以图搜图',
  //   parentId: 100001010081,
  //   isSelect: [2010201]
  // },
  // {
  //   id: 2010401,
  //   text: '人员追踪',
  //   parentId: 100001010081,
  //   isSelect: [2010201]
  // },
  // {
  //   id: 2010501,
  //   text: '人脸图库',
  //   parentId: 100001010081,
  //   isSelect: [2010201]
  // },
  // {
  //   id: 2010601,
  //   text: '人体图库',
  //   parentId: 100001010081,
  //   isSelect: [2010201]
  // },
  // {
  //   id: 2010801,
  //   text: '机动车图库',
  //   parentId: 100001010081
  // },
  // {
  //   id: 2010701,
  //   text: '智慧广播',
  //   parentId: 100001010081
  // }
];
