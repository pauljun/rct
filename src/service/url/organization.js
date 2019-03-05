import config from '../config';
const { api, version } = config;
export default {
  orgModule: {
    text: '组织管理',
    code: 104300
  },
  enterOrgModule: {
    text: '进入组织管理界面',
    code: 104399,
    parent: 104300,
    moduleName: 'OrganizationView'
  },
  sortOrganization: {
    value: `${api}user/${version}/organization/sortOrganization`,
    actionName: 'sortOrganization',
    label: '修改同一组织下的所有子组织的展示顺序'
  },
  organizationInfo: {
    value: `${api}user/${version}/organization/organizations`,
    actionName: 'organizationInfo',
    label: '获取组织信息'
  },
  queryChildOrganizationsById: {
    value: `${api}user/${version}/organization/queryChildOrganizationsById`,
    actionName: 'queryChildOrganizationsById',
    label:
      '按条件查询子组织列表(当前运营中心下)(获取当前用户下的所有组织，全局用到)'
  },
  getPlaceIdsByUserId: {
    value: `${api}user/${version}/organization/getPlaceIdsByUserId`,
    actionName: 'getPlaceIdsByUserId',
    label: '获取用户能看到的场所id，包括所属组织的场所id和分配的小区对应的场所id'
  },
  queryOrganizations: {
    value: `${api}user/${version}/organization/queryOrganizations`,
    actionName: 'queryOrganizations',
    label: '查询子组织列表（组织管理用到）'
  },
  deleteOrganization: {
    value: `${api}user/${version}/organization/deleteOrganization`,
    actionName: 'deleteOrganization',
    label: '删除组织',
    logInfo: [
      {
        code: 104304,
        parent: 104300,
        text: '删除组织'
      }
    ]
  },
  updateOrganization: {
    value: `${api}user/${version}/organization/updateOrganization`,
    actionName: 'updateOrganization',
    label: '编辑组织',
    logInfo: [
      {
        code: 104303,
        parent: 104300,
        text: '编辑组织'
      }
    ]
  },
  addOrganization: {
    value: `${api}user/${version}/organization/addOrganization`,
    actionName: 'addOrganization',
    label: '新增组织',
    logInfo: [
      {
        code: 104302,
        parent: 104300,
        text: '新增组织'
      }
    ]
  },
  queryPlacesByOrganizationId: {
    value: `${api}user/${version}/organization/queryPlacesByOrganizationId`,
    actionName: 'queryPlacesByOrganizationId',
    label: '查询组织（本运营中心）下的场所列表',

  },
  updateOrganizationPlaces: {
    value: `${api}user/${version}/organization/updateOrganizationPlaces`,
    actionName: 'updateOrganizationPlaces',
    label: '修改组织(本运营下的组织)下的场所',
    // logInfo: [
    //   {
    //     code: 104302,
    //     parent: 104300,
    //     text: '更新组织下的设备场所'
    //   }
    // ]
  },
  queryPlaces: {
    value: `${api}user${version}/organization/queryPlaces`,
    actionName: 'queryPlaces',
    label: '组织id查询场所列表'
  },
};
