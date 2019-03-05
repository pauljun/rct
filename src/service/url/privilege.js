import config from '../config';
const { api, version } = config;

export default {
  userPrivilege: {
    value: `${api}user/privilege/${version}/queryUserMenuAndPrivileges/<id>`,
    label: '查询用户资源权限',
    actionName: 'userPrivilege'
  },
  rolePrivilege:{
    value: `${api}user/privilege/${version}/queryRoleMenuAndPrivileges/<id>`,
    label: '查询角色资源权限',
    actionName: 'rolePrivilege'
  }
}