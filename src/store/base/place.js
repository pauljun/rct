import { observable, action, toJS, computed, autorun } from 'mobx';

class place {
  placeResource = [];

  @observable placeList = [];

  @action
  clearStore() {
    this.placeList = [];
  }

  @action
  setPlaceList(placeList) {
    this.placeList = placeList;
    this.placeResource = this.getPlaceResource();
  }

  @computed
  get placeArray() {
    return this.placeList.map(v => {
      return {
        ...v,
        placeId: v.id,
        id: v.areaCode,
        name: v.areaName,
        parentId: v.parentCode,
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

  getPlaceResource() {
    return this.placeList.map(v => {
      let item = toJS(v);
      item.placeId = item.id;
      item.id = v.areaCode;
      item.parentId = v.parentCode;
      return item;
    });
  }

  /**
   * @desc 获取场所信息by placeId
   */
  getPlaceInfoById(placeId) {
    return this.placeArray.find(v => v.placeId == placeId);
  }

  /**
   * @desc 获取场所列表by placeIds
   */
  getPlaceInfoByIds(placeIds) {
    return this.placeArray.filter(v => placeIds.findIndex(v2 => v2 == v.placeId) > -1);
  }

  /**
   * @desc 获取场所树数据
   */
  @computed
  get placeTreeData() {
    let list = this.placeArray.filter(v => v.deviceCount.count !== 0);
    return Utils.computTreeList(list);
  }

  /**
   * 获取场所下的所有场所id
   * @param {string} orgId
   * @param {Array} ids = []
   */
  queryPlaceIdsForParentId(id, ids = []) {
    for (let i = 0, len = this.placeResource.length; i < len; i++) {
      let item = this.placeResource[i];
      if (item.id == id) {
        ids.push(item.placeId);
      }
      if (item.parentId == id) {
        this.queryPlaceIdsForParentId(item.id, ids);
      }
    }
    return ids;
  }

  /**
   * 获取场所下的所有场所id
   * @param {string} orgId
   * @param {Array} ids = []
   */
  queryChildPlaceForLevel(id, level = 5, list = []) {
    for (let i = 0, len = this.placeResource.length; i < len; i++) {
      let item = this.placeResource[i];
      if (item.id == id) {
        list.push(item);
        if (item.parentId == id) {
          this.queryChildPlaceForLevel(item.id, level, list);
        }
      }
    }
    return list.filter(v => v.level >= level);
  }

  /**
   * @desc 根据id获取所有父级场所
   */
  getParentPlaceListById(id, list = []) {
    for (let i = 0, len = this.placeResource.length; i < len; i++) {
      let item = this.placeResource[i];
      if (item.id == id) {
        list.push(item);
        if (item.parentId) {
          this.getParentPlaceListById(item.parentId, list);
        } else {
          break;
        }
      }
    }
    return list;
  }

  getParentPlaceListByIds(ids, list = []) {
    for (let i = 0, len = this.placeResource.length; i < len; i++) {
      let item = this.placeResource[i];
      if (ids.indexOf(item.id) > -1 && list.findIndex(v => v.id == item.id) === -1) {
        list.push(item);
        if (item.parentId) {
          this.getParentPlaceListById(item.parentId, list);
        } else {
          break;
        }
      }
    }
    return list;
  }
}

export default new place();
