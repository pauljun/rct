import { httpRequest } from './http';
import kvStore from './url/kvStore';

@httpRequest
class KvStoreService {
  /**
   * @desc 获取用户键值对信息
   */
  getKvStore(data) {
    BaseStore.actionPanel.setAction(kvStore.getKvStore.actionName);
    return this.$httpRequest({
      method: 'post',
      url: kvStore.getKvStore.value,
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(kvStore.getKvStore.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(kvStore.getKvStore.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 设置用户键值对
   */
  setUserKvStore(data) {
    data.storeValue = JSON.stringify(data.storeValue);
    BaseStore.actionPanel.setAction(kvStore.setUserKvStore.actionName);
    return this.$httpRequest({
      url: kvStore.setUserKvStore.value,
      method: 'POST',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(kvStore.setUserKvStore.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(kvStore.setUserKvStore.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取用户键列表
   */
  listUserKey(data) {
    BaseStore.actionPanel.setAction(kvStore.listUserKey.actionName);
    return this.$httpRequest({
      url: kvStore.listUserKey.value,
      method: 'POST',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(kvStore.listUserKey.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(kvStore.listUserKey.actionName);
        return Promise.reject(e);
      });
  }
}
export default new KvStoreService();
