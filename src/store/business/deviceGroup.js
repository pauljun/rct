import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import * as _ from 'lodash';

const KEY = 'MY_GROUP';
class deviceGroup {
  @observable
  listMap = {};

  @action
  initGroupData() {
    const { userInfo } = BaseStore.user;
    return Service.kvStore.getKvStore({
      userId: userInfo.id, 
      storeKey: KEY
    }).then(res => {
      const storeValue = JSON.parse(res.data.storeValue);
      this.setData(storeValue);
    });
  }

  @action
  setData(result) {
    this.listMap = result;
  }

  @computed
  get list() {
    let list = [];
    if (_.isEmpty(this.listMap)) {
      return list;
    }
    let map = this.listMap;
    try {
      map.groups.map(v => {
        const ids = map.sets
          .filter(x => x.split(':')[0] === v)
          .map(x => x.split(':')[1].split('/')[0]);
        const deviceList = BaseStore.device.queryCameraListByIds(ids);
        list.push({ groupName: v, deviceList });
      });
    } catch (e) {
      console.warn('转换分组数据异常', e);
    }
    return list;
  }

  @computed
  get groupCountDevice() {
    const temDeviceArr = this.list.map(v => v.deviceList);
    let deviceListByGroup = [];
    temDeviceArr.forEach(item => {
      deviceListByGroup = deviceListByGroup.concat(item.map(v => v.id));
    });
    deviceListByGroup = [...new Set([...deviceListByGroup])];
    return deviceListByGroup.length;
  }

  getgroupsbycid = key => {
    let map = this.listMap;
    return (
      map &&
      map.sets &&
      map.sets
        .filter(x => {
          return x.split(':')[1] === key;
        })
        .map(x => x.split(':')[0])
    );
  };

  /**
   * 添加分组和设备
   * @param {Object} item
   */
  add(item) {
    let mapData = this.listMap;
    let groups = new Set(mapData && mapData.groups);
    if (groups.has(item.groupName)) {
      message.warn('分组名称已存在！');
      return Promise.reject('分组名称已存在！');
    }
    let sets = new Set(mapData && mapData.sets);
    groups.add(item.groupName);
    item.deviceIds.map(v => {
      sets.add(`${item.groupName}:${v}`);
    });
    mapData = {
      groups: Array.from(groups),
      sets: Array.from(sets)
    };
    return this.setGroupData(mapData)
  }

  /**
   * 修改分组和设备
   * @param {*} item
   * @param {*} options
   */
  editGroup(item, options) {
    let mapData = this.listMap;
    let groups = mapData.groups.concat([]);
    let sets = mapData.sets.concat([]);
    groups[mapData.groups.indexOf(item.groupName)] = options.groupName;
    sets = sets.filter(v => {
      return v.split(':')[0] !== item.groupName;
    });
    options.deviceIds.map(v => {
      sets.push(`${options.groupName}:${v}`);
    });
    return this.setGroupData({ groups, sets })
  }

  /**
   * 删除分组
   */
  delete(item) {
    let mapData = this.listMap;
    let groups = mapData.groups.filter(v => {
      return v !== item.groupName;
    });
    let sets = mapData.sets.filter(v => {
      return v.split(':')[0] !== item.groupName;
    });
    return this.setGroupData({ groups, sets })
  }

  /**
   * 同一设备添加或删除分组
   * @param {Array} items
   * @param {bool} isAdd
   */
  editDevice(items, isEmpty) {
    let mapData = this.listMap;
    let sets = mapData.sets.filter(v => v.indexOf(items[0].deviceKey) === -1);
    if(!isEmpty) {
      let arr = new Set(sets);
      items.map(item => {
        arr.add(`${item.groupName}:${item.deviceKey}`);
      });
      sets = Array.from(arr);
    }
    return this.setGroupData({ 
      groups: mapData.groups,
      sets
    })
  }

  /**
   * 同一设备删除分组
   * @param {Array} items
   * @param {bool} isAdd
   */
  deleteGroupDevice(item) {
    let mapData = this.listMap;
    let sets = new Set(mapData.sets);
    sets.delete(`${item.groupName}:${item.deviceKey}`);
    let arr = Array.from(sets);
    return this.setGroupData({ 
      groups: mapData.groups,
      sets: arr
    })
  }

  // 存储分组数据
  setGroupData(mapData) {
    // if (mapData.sets.length > 100) {
    //   message.warn('单个分组最大支持100个设备！');
    //   return Promise.reject('单个分组最大支持100个');
    // }
    const { userInfo } = BaseStore.user;
    return Service.kvStore.setUserKvStore({
      userId: userInfo.id, 
      storeKey: KEY, 
      storeValue: mapData
    }).then(() => {
      this.setData(mapData);
    });
  }
}
export default new deviceGroup();
