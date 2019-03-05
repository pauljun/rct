import { httpRequest } from './http';
import role from './url/role';

@httpRequest
class RoleService {
  queryRoleList(options) {
    return this.$httpRequest({
      url: role.queryRoleList.value,
      method: 'post',
      data: options,
    }).then(res => res);
  }

  roleDetail(options) {
    return this.$httpRequest({
      url: role.roleDetail.value.replace('<id>',options.id),
      method: 'post',
      data:options,
      logInfo:role.roleDetail.logInfo[0]
    }).then(res => res);
  }

  addRole(options) {
    let logInfo = {
      description:`新增【${options.roleName}】角色`,
      ...role.addRole.logInfo[0]
      }
    return this.$httpRequest({
      url: role.addRole.value,
      method: 'post',
      data: options,
      logInfo,
    }).then(res => res);
  }

  changeRole(options) {
    let logInfo = {
      description:`编辑【${options.roleName}】角色`,
      ...role.changeRole.logInfo[0]
      }
    return this.$httpRequest({
      url: role.changeRole.value,
      method: 'post',
      data: options,
      logInfo,
    }).then(res => res);
  }

  deleteRole(options,roleName) {
    let logInfo = {
      description:`移除【${roleName}】角色`,
      ...role.deleteRole.logInfo[0]
      }
    return this.$httpRequest({
      url: role.deleteRole.value.replace('<id>',options),
      method: 'post',
      data: {id:options},
      logInfo,
    }).then(res => res);
  }

  getMenusByOperationCenterId(id) {
    const data = { operationCenterId: id };
    return this.$httpRequest({
      url: role.centerMenu.value,
      method: 'post',
      data
    }).then(res => res);
  }
  getMenuAndPrivilegeByOperationCenterId(id) {
    return this.$httpRequest({
      url: role.centerPrivilegeList.value,
      method: 'post',
      data: { operationCenterId: id },
    }).then(res => res);
  }
}
export default new RoleService();
