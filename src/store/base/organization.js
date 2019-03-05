import { observable, action, toJS, computed, autorun } from 'mobx';

class organization {
  orgResource = [];

  @observable orgList = [];

  @action
  clearStore() {
    this.orgList = [];
  }

  @action
  setOrgList(orgList) {
    const list = orgList.map(v => ({
      name: v.organizationName || v.name,
      id: v.id,
      parentId: v.parentId,
      desc: v.desc || v.organizationDescription,
      type: v.organizationType || v.type,
      createTime: v.createTime,
      orgSort: v.orgSort,
      deviceCount: v.deviceCount,
      cameraCount: v.cameraCount
    }));
    this.orgList = list;
    this.orgResource = list;
  }

  @computed
  get orgArray() {
    return this.orgList.map(v => {
      return {
        id: v.id,
        type: 'org',
        parentId: v.parentId,
        name: v.name,
        title: v.name,
        desc: v.desc,
        createTime: v.createTime,
        organizationType: v.type,
        deviceCount: {
          onlineCount: v.deviceCount.onlineCount,
          count: v.deviceCount.count
        },
        cameraCount: {
          onlineCount: v.cameraCount.onlineCount,
          count: v.cameraCount.count
        }
      };
    });
  }

  getOrgResource() {
    return this.orgList.map(v => toJS(v));
  }

  /**
   * @desc 获取组织树数据
   */
  @computed
  get orgTreeData() {
    let orgList = this.orgArray;
    return Utils.computTreeList(orgList);
  }

  /**
   * 获取组织下的所有组织id
   * @param {string} orgId
   * @param {Array} ids = []
   */
  queryOrgIdsForParentOrgId(orgId, ids = []) {
    for (let i = 0, len = this.orgResource.length; i < len; i++) {
      let item = this.orgResource[i];
      if (item.id == orgId) {
        ids.push(item.id);
      }
      if (item.parentId == orgId) {
        this.queryOrgIdsForParentOrgId(item.id, ids);
      }
    }
    return ids;
  }

  /**
   * @desc 根据id获取所有父级组织
   */
  getParentOrgListByOrgId(orgId, list = []) {
    for (let i = 0, len = this.orgResource.length; i < len; i++) {
      let item = this.orgResource[i];
      if (item.id == orgId) {
        list.push(item);
        if (item.parentId) {
          this.getParentOrgListByOrgId(item.parentId, list);
        }
      }
    }
    return list;
  }

  getOrgTreeText(orgId) {
    let arr = this.getParentOrgListByOrgId(orgId);
    let text = '';
    arr.reverse().map((m, i) => {
      return (text = text + m.name + (i == arr.length - 1 ? '' : ' > '));
    });
    return text;
  }

   /**
   * @desc 获取组织信息by id
   */
  getOrgInfoByOrgId(orgId) {
    return this.orgArray.find(v => v.id == orgId);
  }

}

export default new organization();
