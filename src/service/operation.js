import { httpRequest } from "./http";
import operation from "./url/operation";

@httpRequest
class OperationService {
  /**
   * @desc 根据url关键字获取合作单位logl和系统logo
   * @param {Object} data
   */
  getOperationCenterLogo(data) {
    BaseStore.actionPanel.setAction(
      operation.getOperationCenterLogo.actionName
    );
    return this.$httpRequest({
      url: operation.getOperationCenterLogo.value,
      data: data,
      method: "POST"
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.getOperationCenterLogo.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.getOperationCenterLogo.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * 查询当前应用系统支持的菜单和权限
   */
  queryOperationCenterMenuAndPrivileges(id) {
    BaseStore.actionPanel.setAction(
      operation.queryOperationCenterMenuAndPrivileges.actionName
    );
    return this.$httpRequest({
      method: "post",
      url: operation.queryOperationCenterMenuAndPrivileges.value.replace(
        "<id>",
        id
      ),
      data: { id }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.queryOperationCenterMenuAndPrivileges.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.queryOperationCenterMenuAndPrivileges.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 根据应用系统id查询应用系统详情
   * @param {String} id
   */
  operationCenterInfo(id) {
    BaseStore.actionPanel.setAction(operation.operationCenterInfo.actionName);
    return this.$httpRequest({
      url: operation.operationCenterInfo.value.replace("<id>", id),
      method: "POST",
      data: { id }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.operationCenterInfo.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.operationCenterInfo.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 应用系统列表查询
   * @param {Object} data
   */
  queryOperationCenters(data) {
    BaseStore.actionPanel.setAction(operation.queryOperationCenters.actionName);
    return this.$httpRequest({
      url: operation.queryOperationCenters.value,
      method: "POST",
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.queryOperationCenters.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.queryOperationCenters.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 添加应用系统
   */
  addOperationCenter(data) {
    BaseStore.actionPanel.setAction(operation.addOperationCenter.actionName);
    return this.$httpRequest({
      url: operation.addOperationCenter.value,
      method: "POST",
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.addOperationCenter.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.addOperationCenter.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 删除应用系统
   * @param {Object} data
   */
  deleteOperationCenter(data) {
    BaseStore.actionPanel.setAction(operation.deleteOperationCenter.actionName);
    return this.$httpRequest({
      url: operation.deleteOperationCenter.value.replace("<id>", data.id),
      method: "POST",
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.deleteOperationCenter.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.deleteOperationCenter.actionName
        );
        return Promise.reject(e);
      });
  }
  /**
   * @desc 修改应用系统
   * @param {Object} data
   */
  updateOperationCenter(data) {
    BaseStore.actionPanel.setAction(operation.updateOperationCenter.actionName);
    return this.$httpRequest({
      url: operation.updateOperationCenter.value,
      method: "POST",
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.updateOperationCenter.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.updateOperationCenter.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 配置模块权限
   * @param {Object} data
   */
  changeOperationCenterModuleMenu(data) {
    BaseStore.actionPanel.setAction(
      operation.changeOperationCenterModuleMenu.actionName
    );
    return this.$httpRequest({
      url: operation.changeOperationCenterModuleMenu.value,
      method: "POST",
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.changeOperationCenterModuleMenu.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.changeOperationCenterModuleMenu.actionName
        );
        return Promise.reject(e);
      });
  }
  
  /**
   * @desc 初始化模块权限选项
   * @param {Object} data
   */
  queryOperationCenterInitMenu(data) {
    BaseStore.actionPanel.setAction(
      operation.queryOperationCenterInitMenu.actionName
    );
    return this.$httpRequest({
      url: operation.queryOperationCenterInitMenu.value,
      method: "POST",
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.queryOperationCenterInitMenu.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.queryOperationCenterInitMenu.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 修改运营中心场所列表
   * @param {Object} data
   */
  updateOperationCenterPlaces(data) {
    BaseStore.actionPanel.setAction(
      operation.updateOperationCenterPlaces.actionName
    );
    return this.$httpRequest({
      url: operation.updateOperationCenterPlaces.value,
      method: "POST",
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.updateOperationCenterPlaces.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.updateOperationCenterPlaces.actionName
        );
        return Promise.reject(e);
      });
  }  

  /**
   * 根据运营中心id获取场所列表
   */
  queryPlacesByOperationCenterId(id){
    BaseStore.actionPanel.setAction(
      operation.queryPlacesByOperationCenterId.actionName
    );
    return this.$httpRequest({
      url: operation.queryPlacesByOperationCenterId.value,
      method: "POST",
      data: {
        operationCenterId: id
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.queryPlacesByOperationCenterId.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.queryPlacesByOperationCenterId.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查看运营中心联系人电话
   */
  getContactPhone(ids){
    BaseStore.actionPanel.setAction(
      operation.getContactPhone.actionName
    );
    return this.$httpRequest({
      url: operation.getContactPhone.value,
      method: "POST",
      data: {
        ids
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          operation.getContactPhone.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          operation.getContactPhone.actionName
        );
        return Promise.reject(e);
      });
  }
}
export default new OperationService();
