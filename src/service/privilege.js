import { httpRequest } from './http';
import privilege from './url/privilege';
import _ from 'lodash';

@httpRequest
class PrivilegeService {
  queryUserPrivileges(id){
    BaseStore.actionPanel.setAction(privilege.userPrivilege.actionName);
    return this.$httpRequest({
      method: 'post',
      url: privilege.userPrivilege.value.replace('<id>', id),
      data: { id }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(privilege.userPrivilege.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(privilege.userPrivilege.actionName);
        return Promise.reject(e);
      });
  }
  queryRolePrivileges(id){
    BaseStore.actionPanel.setAction(privilege.rolePrivilege.actionName);
    return this.$httpRequest({
      method: 'post',
      url: privilege.rolePrivilege.value.replace('<id>', id),
      data: { id }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(privilege.rolePrivilege.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(privilege.rolePrivilege.actionName);
        return Promise.reject(e);
      });
  }
}
export default new PrivilegeService();
