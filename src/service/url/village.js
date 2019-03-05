import config from '../config';
const { api } = config;
export default {
  villageModule: {
    code: 107000,
    text: '小区管理',
  },
  enterVillageModule: {
    text: '进入小区管理界面',
    code: 107099,
    parent: 107000,
    moduleName: 'VillageView',
  },
  list: {
    value: `${api}cloud/community/villageManageListByPage`,
    label: '获取小区列表'
  },
  centerByVillage:{
    value:`${api}cloud/community/getCentersByVillage/<id>`,
    label:'获取小区分配的运营中心(业务变更-废弃）'
  },
  assignedByCenter:{
    value:`${api}cloud/community/assignedByVillage`,
    label:'平台管理员给小区分配运营中心(业务变更-废弃）'
  },
  detail:{
    value:`${api}cloud/village/villages`,
    label:'查看小区详情'
  },
  resetVillage:{
    value:`${api}cloud/community/resetVillage`,
    label:'重置小区'
  },
  assignedByUser:{
    value:`${api}cloud/community/assignedByUser`,
    label:'运营中心管理员给小区分配用户(业务变更-废弃）',
    logInfo: [{
      code: 107001,
      parent: 107000,
      text: '编辑小区'
     }]
  },
  villageDevice:{
    value:`${api}villageDevice/queryVillageDevices`,
    label:'查询小区绑定设备'
  },
  villageDeviceUpdate:{
    value:`${api}villageDevice/update`,
    label:'小区绑定设备'
  },
  queryUnbindedVillageDevices:{
    value:`${api}villageDevice/queryUnbindedVillageDevices`,
    label:'查询未分配到小区的设备(业务变更-合并）'
  },
  add:{
    value:`${api}cloud/community/createVillage`,
    label:'新增小区'
  },
  update:{
    value:`${api}cloud/community/updateVillage`,
    label:'更新小区'
  },
  villageDevices:{
    value:`${api}cloud/community/countDeviceByVillage`,
    label:'获取小区已分配设备'
  },
  villageCenter:{
    value:`${api}cloud/community/getAssignedCentersByPage`,
    label:'获取小区已分配运营中心(业务变更-废弃）'
  },
  unVillageCenter:{
    value:`${api}cloud/community/getUnallocatedCentersByPage`,
    label:'获取小区未分配的运营中心(业务变更-废弃）'
  },
  assignedByDistribution: {
    value:`${api}cloud/community/assignedByVillage`,
    label:'平台管理员给小区分配运营中心(业务变更-废弃）'
  },
  communityImport:{
    value:`${api}import/communityData`,
    label:'社区数据导入'
  },
  listImportCommunityData:{
    value:`${api}import/listImportCommunityData`,
    label:'查询导入小区人员细信息'
  },
  batchDeleteVillagePeoples:{
    value:`${api}cloud/community/batchDeleteVillagePeoples`,
    label:'批量删除小区人员信息'
  },
  villageByCenterId: {
    value: `${api}cloud/community/getVillagesByCenterId`,
    label: '根据运营中心获取已分配和未分配的小区列表'
  },
  ASSIGNED_BY_CENTER: {
    value: `${api}cloud/community/assignedByCenter`,
    label: '平台管理员给运营中心分配小区(业务变更-废弃）'
  }
}
