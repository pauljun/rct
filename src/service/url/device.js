import config from '../config';
const { api, version } = config;
export default {
  queryUserDevices: {
    value: `${api}device/${version}/queryUserDevices`,
    actionName: 'queryUserDevices',
    label: '查询设备' // 用户总设备列表
  },
  countDeviceType: {
    value: `${api}device/${version}/countDeviceByType`,
    actionName: 'countDeviceByType',
    label: '按照类型统计设备数量'
  },
  countOperationCenterDevices: {
    value: `${api}device/${version}/countOperationCenterDevices`,
    actionName: 'countOperationCenterDevices',
    label: '统计应用系统设备数量'
  },
  countOrganizationDeviceStatus: {
    value: `${api}device/${version}/countOrganizationDeviceStatus`,
    actionName: 'countOrganizationDeviceStatus',
    label: '统计组织的在线离线设备数量'
  },
  countPlaceDeviceStatus: {
    value: `${api}device/${version}/countPlaceDeviceStatus`,
    actionName: 'countPlaceDeviceStatus',
    label: '统计场所的在线离线设备数量'
  },
  deviceInfo: {
    value: `${api}device/${version}/devices/<id>`,
    actionName: 'deviceInfo',
    label: '查询设备详细信息',
    logInfo: [
      {
        code: 104601,
        parent: 104600,
        text: '查看设备信息'
      }
    ]
  },
  deviceInfoByCid: {
    value: `${api}device/${version}/getDeviceByCId/<id>`,
    actionName: 'deviceInfoByCid',
    label: '根据cid查询设备详细信息'
  },
  deviceListByOrganization: {
    value: `${api}device/${version}/queryDeviceByOrganization/<id>`,
    actionName: 'deviceInfoByCid',
    label: '根据组织查询设备列表'
  },
  queryDeviceGroup: {
    value: `${api}device/${version}/queryDeviceGroup`,
    actionName: 'queryDeviceGroup',
    label: '查询设备分组列表'
  },
  queryDevices: {
    value: `${api}device/${version}/queryDevices`,
    actionName: 'queryDevices',
    label: '条件组合查询设备数量'
  },
  saveDevice: {
    value: `${api}device/${version}/saveDevice`,
    actionName: 'saveDevice',
    label: '新增设备'
  },
  updateDevice: {
    value: `${api}device/${version}/updateDevice/<id>`,
    actionName: 'updateDevice',
    label: '修改设备信息',
    logInfo: [
      {
        code: 104602,
        parent: 104600,
        text: '编辑设备'
      }
    ]
  },
  updateDeviceGeo: {
    value: `${api}device/${version}/updateDeviceGeo/<id>`,
    actionName: 'updateDeviceGeo',
    label: '修改经纬度',
    logInfo: [
      {
        code: 104604,
        parent: 104600,
        text: '修改经纬度'
      }
    ]
  },
  updateDeviceIsIdleDeal: {
    value: `${api}device/${version}/updateDeviceIsIdleDeal`,
    actionName: 'updateDeviceIsIdleDeal',
    label: '修改设备属性(是否支持闲时处理)'
  },

  updateOperationCenterDevices: {
    value: `${api}device/${version}/updateOperationCenterDevices/<id>`,
    actionName: 'updateOperationCenterDevices',
    label: '分配设备到应用系统/从应用系统解除分配'
  },

  updateOrganizationDevicesBatch: {
    value: `${api}device/${version}/updateOrganizationDevicesBatch`,
    actionName: 'updateOrganizationDevicesBatch',
    label: '分配设备到组织/从组织解除分配'
  },
  updateDeviceStatus: {
    // value: `${api}device/${version}/updateDeviceStatus/<id>/<state>`,
    value: `${api}device/${version}/updateDeviceStatus`,
    actionName: 'updateDeviceStatus',
    label: '更新设备的在线离线状态'
  },
  queryDevicesByOperationCenter: {
    value: `${api}device/${version}/queryDevicesByOperationCenter/<id>`,
    actionName: 'queryDevicesByOperationCenter',
    label: '更新设备的在线离线状态'
  },  
  exportDevice:{
    value: `${api}device/${version}/exportDevice/<id>`,
    actionName: 'exportDevice',
    label: '导出设备表格'
  },
  
  deviceModule: {
    code: 104600,
    text: '设备管理'
  },

  enterDeviceModule: {
    text: '进入设备管理界面',
    code: 104699,
    parent: 104600,
    moduleName: 'deviceView'
  }
};
