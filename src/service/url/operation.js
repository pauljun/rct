import config from '../config';
const { api, version } = config;
export default {
  getOperationCenterLogo: {
    value: `${api}user/operationCenter/${version}/getOperationCenterLogo`,
    label: '根据url关键字查询合作单位logo和系统logo',
    actionName: 'getOperationCenterLogo'
  },
  operationCenterInfo: {
    value: `${api}user/operationCenter/${version}/operationCenters/<id>`,
    label: '应用系统信息',
    actionName: 'operationCenterInfo'
  },
  queryOperationCenters: {
    value: `${api}user/operationCenter/${version}/queryOperationCenters`,
    label: '查看应用系统列表',
    actionName: 'queryOperationCenters'
  },
  addOperationCenter: {
    value: `${api}user/operationCenter/${version}/addOperationCenter`,
    actionName: 'addOperationCenter',
    label: '新建应用系统'
  },
  changeOperationCenterModuleMenu: {
    value: `${api}user/operationCenter/${version}/changeOperationCenterModuleMenu`,
    actionName: 'changeOperationCenterModuleMenu',
    label: '修改应用系统菜单'
  },
  deleteOperationCenter: {
    value: `${api}user/operationCenter/${version}/deleteOperationCenter/<id>`,
    actionName: 'deleteOperationCenter',
    label: '删除应用系统'
  },
  getContactPhone: {
    value: `${api}user/operationCenter/${version}/getContactPhone`,
    label: '查询应用系统联系人电话',
    actionName: 'getContactPhone'
  },
  updateOperationCenter: {
    value: `${api}user/operationCenter/${version}/updateOperationCenter`,
    actionName: 'updateOperationCenter',
    label: '编辑应用系统'
  },
  queryOperationCenterMenuAndPrivileges: {
    value: `${api}user/operationCenter/${version}/queryOperationCenterMenuAndPrivileges/<id>`,
    label: '查询运营中心资源权限',
    actionName: 'queryOperationCenterMenuAndPrivileges'
  },
  queryOperationCenterInitMenu: {
    value: `${api}user/operationCenter/${version}/queryOperationCenterInitMenu`,
    label: '查询运营中心初始化菜单',
    actionName: 'queryOperationCenterInitMenu'
  },
  updateOperationCenterPlaces: {
    value: `${api}user/operationCenter/${version}/updateOperationCenterPlaces`,
    label: '修改运营中心场所列表',
    actionName: 'updateOperationCenterPlaces'
  },
  queryPlacesByOperationCenterId: {
    value: `${api}user/operationCenter/${version}/queryPlacesByOperationCenterId`,
    label: '通过运营中心查询场所列表',
    actionName: 'queryPlacesByOperationCenterId'
  }
};
