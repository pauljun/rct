import { httpRequest } from './http';
import organization from './url/organization';

@httpRequest
class OrganizationService {
  /**
   * 获取组织结构 初始化用到
   * @param {*} id
   */
  queryChildOrganizationsById(options) {
    BaseStore.actionPanel.setAction(
      organization.queryChildOrganizationsById.actionName
    );
    return this.$httpRequest({
      url: organization.queryChildOrganizationsById.value,
      method: 'post',
      data: { selectChildOrganization: true, ...options }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.queryChildOrganizationsById.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.queryChildOrganizationsById.actionName
        );
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询组织列表 组织管理用
   * @param {*} data
   */
  queryOrganizations(data) {
    BaseStore.actionPanel.setAction(organization.queryOrganizations.actionName);
    return this.$httpRequest({
      url: organization.queryOrganizations.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.queryOrganizations.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.queryOrganizations.actionName
        );
        return Promise.reject(e);
      });
  }
  /**
   * 查询组织信息
   */
  organizationInfo(id) {
    BaseStore.actionPanel.setAction(organization.organizationInfo.actionName);
    return this.$httpRequest({
      url: `${organization.organizationInfo.value}/${id}`,
      method: 'post',
      data: { id }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.organizationInfo.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.organizationInfo.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 组织排序
   * @param {*} data
   */
  sortOrganization(data) {
    BaseStore.actionPanel.setAction(organization.sortOrganization.actionName);
    return this.$httpRequest({
      url: organization.sortOrganization.value,
      method: 'post',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.sortOrganization.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.sortOrganization.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 删除组织
   * @param {*} data
   * @param {*} organizationName
   */
  deleteOrganization = (data, organizationName) => {
    BaseStore.actionPanel.setAction(organization.deleteOrganization.actionName);
    let logInfo = {
      description: `移除【${organizationName}】组织`,
      ...organization.deleteOrganization.logInfo[0]
    };
    return this.$httpRequest({
      url: `${organization.deleteOrganization.value}/${data.id}`,
      method: 'post',
      data,
      logInfo
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.deleteOrganization.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.deleteOrganization.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 更新组织
   * @param {*} data
   */
  updateOrganization = (data) => {
    let logInfo = {
      description: `编辑【${data.organizationName}】组织`,
      ...organization.updateOrganization.logInfo[0]
    };
    BaseStore.actionPanel.setAction(organization.updateOrganization.actionName);
    return this.$httpRequest({
      url: organization.updateOrganization.value,
      method: 'post',
      data,
      logInfo
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.updateOrganization.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.updateOrganization.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 新增组织
   * @param {*} options
   */
  addOrganization = (options) => {
    let logInfo = {
      description: `新增【${options.organizationName}】组织`,
      ...organization.addOrganization.logInfo[0]
    };
    BaseStore.actionPanel.setAction(organization.addOrganization.actionName);
    return this.$httpRequest({
      url: organization.addOrganization.value,
      method: 'post',
      data: options,
      logInfo
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.addOrganization.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.addOrganization.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询组织（本运营中心）下的场所列表
   * @param {*} data
   */
  queryPlacesByOrganizationId(options) {
    BaseStore.actionPanel.setAction(
      organization.queryPlacesByOrganizationId.actionName
    );
    return this.$httpRequest({
      url: organization.queryPlacesByOrganizationId.value,
      method: 'post',
      data:options,
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.queryPlacesByOrganizationId.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.queryPlacesByOrganizationId.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 更新组织下的场所
   * @param {*} data
   */
  updateOrganizationPlaces = (data) => {
    // console.log(data,'场所信息')
    // let logInfo = {
    //   description:`更新【${data}】组织下的设备场所`,
    //   ...organization.updateOrganizationPlaces.logInfo[0]
    //   }
    BaseStore.actionPanel.setAction(
      organization.updateOrganizationPlaces.actionName
    );
    return this.$httpRequest({
      url: organization.updateOrganizationPlaces.value,
      method: 'post',
      data,
      // logInfo
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.updateOrganizationPlaces.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.updateOrganizationPlaces.actionName
        );
        return Promise.reject(e);
      });
  }
    /**
   * @desc 获取用户能看到的场所id，包括所属组织的场所id和分配的小区对应的场所id
   * @param {*} data
   */
  getPlaceIdsByUserId = (data) => {
    BaseStore.actionPanel.setAction(
      organization.getPlaceIdsByUserId.actionName
    );
    return this.$httpRequest({
      url: organization.getPlaceIdsByUserId.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          organization.getPlaceIdsByUserId.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          organization.getPlaceIdsByUserId.actionName
        );
        return Promise.reject(e);
      });
  }
}
export default new OrganizationService();
