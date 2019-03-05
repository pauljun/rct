import config from '../config';
const { api, version } = config;
// 场所档案

export default {
  countPersonByPlaceType: {
    value: `${api}place/${version}/countPersonByPlaceType`,
    label: '查询场所内各场所类型人数统计',
    actionName: 'countPersonByPlaceType'
  },
  placeInfo: {
    value: `${api}place/${version}/places/<id>`,
    label: '根据场所ID查询详情',
    actionName: 'queryPlaceInfo'
  },
  queryPlacesByParentId: {
    value: `${api}place/${version}/queryPlacesByParentId/<parentId>`,
    label: '根据场所ID查询下级场所列表',
    actionName: 'queryPlacesByParentId'
  },
  queryPlaces: {
    value: `${api}place/${version}/queryPlaces`,
    label: '查询行政区划信息',
    actionName: 'queryPlaces'
  },
  queryProvinces: {
    value: `${api}place/${version}/queryProvinces`,
    label: '获取系统中所有省信息',
    actionName: 'queryProvinces'
  },
  queryMinPlaces: {
    value: `${api}place/${version}/queryMinPlaces`,
    label: '查询场所下最小一级场所，如查询洪山区下的小区、学校等',
    actionName: 'queryMinPlaces'
  },
  countMinPlaces: {
    value: `${api}place/${version}/countMinPlaces`,
    label: '查询场所下最低一级场所数量',
    actionName: 'countMinPlaces'
  },
  queryDevices: {
    value: `${api}place/${version}/queryDevices/<placeId>`,
    label: '查询场所内的设备',
    actionName: 'queryDevices'
  },
  countDevices: {
    value: `${api}place/${version}/countDevices/<placeId>`,
    label: '查询场所内的设备数量',
    actionName: 'countDevices'
  },
  countResources: {
    value: `${api}place/${version}/countResources`,
    label: '查询场所内的设备数量',
    actionName: 'countResources'
  },
  countVehiclesResources: {
    value: `${api}place/${version}/countVehiclesResources`,
    label: '查询场所机动车和非机动车资源',
    actionName: 'countVehiclesResources'
  },
  countPersonFrequency: {
    value: `${api}place/${version}/countPersonFrequency`,
    label: '查询场所人次统计，展示场所人员出入规律',
    actionName: 'countPersonFrequency'
  },
  countPersonNum: {
    value: `${api}place/${version}/countPersonNum`,
    label: '查询场所人数统计，展示场所人流量分布规律',
    actionName: 'countPersonNum'
  },
  countTypeByPid: {
    value: `${api}place/${version}/countTypeByPid`,
    label: ' 查询不同类型（常出入，临时出入，长期未出现）人员数量',
    actionName: 'countTypeByPid'
  },
  queryPOIByCenter: {
    value: `${api}place/${version}/queryPOIByCenter`,
    actionName: 'queryPOIByCenter',
    label: '设备周边已有和新场所'
  },
  countPersonGroupByPid: {
    value: `${api}place/${version}/countPersonGroupByPid`,
    actionName: 'countPersonGroupByPid',
    label: '查询每个场所出入人数量'
  },
  inputAssistant: {
    value: `${api}place/${version}/inputAssistant`,
    actionName: 'inputAssistant',
    label: '根据输入，返回地点信息'
  },
  countDeviceResources: {
    value: `${api}place/${version}/countDeviceResources`,
    actionName: 'countDeviceResources',
    label: '查询设备抓拍的人、人脸、人体资源'
  }, 
  countVehiclesByCids: {
    value: `${api}place/${version}/countVehiclesByCids`,
    actionName: 'countVehiclesByCids',
    label: '查询设备抓拍的车辆资源'
  },
  countDeviceCapPersons: {
    value: `${api}place/${version}/countDeviceCapPersons`,
    actionName: 'countDeviceCapPersons',
    label: '查询设备出现的人'
  },
  getPlacesByHasDevice:{
    value: `${api}place/${version}/getPlacesByHasDevice`,
    actionName: 'getPlacesByHasDevice',
    label: '获取所有有设备的场所'
  },
  activeAssociatedPlaces: {
    value: `${api}place/${version}/activeAssociatedPlaces`,
    actionName: 'activeAssociatedPlaces',
    label: '手动关联场所关系'
  },
  getPlacesByConditions: {
    value: `${api}place/${version}/getPlacesByConditions`,
    actionName: 'getPlacesByConditions',
    label: '根据条件批量查询场所'
  },
  countPerson: {
    value: `${api}place/${version}/countPerson`,
    actionName: 'countPerson',
    label: '查询场所不同纬度的统计'
  },
  playPlaceTagsById: {
    value: `${api}place/${version}/playPlaceTagsById`,
    actionName: 'playPlaceTagsById',
    label: '给场所打标签，如给场所打上小区、学校等标签'
  },
  activeAssociatedDeviceToPlace:{
    value: `${api}place/${version}/activeAssociatedDeviceToPlace`,
    actionName: 'activeAssociatedDeviceToPlace',
    label: '手动关联设备场所关系'
  },
  queryDeviceByCenter: {
    value: `${api}place/${version}/queryDeviceByCenter`,
    actionName: 'queryDeviceByCenter',
    label: '根据经纬度或cid查询周边指定距离内的设备'
  },
  getTypeByPid: {
    value: `${api}place/${version}/getTypeByPid`,
    actionName: 'getTypeByPid',
    label: '查询不同类型（常出入，临时出入，长期未出现）人员列表'
  },
  placesExt: {
    value: `${api}place/${version}/placesExt/<id>`,
    actionName: 'placesExt',
    label: '小区绑定场所详情'
  },
};
