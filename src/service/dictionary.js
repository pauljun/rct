import { httpRequest } from './http';
import dictionary from './url/dictionary';

@httpRequest
class DictionaryService {
  /**
   * @desc 获取历史视频
   */
  queryAll() {
    BaseStore.actionPanel.setAction(dictionary.queryAllDict.actionName);
    return this.$httpRequest({
      method: 'post',
      url: dictionary.queryAllDict.value
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(dictionary.queryAllDict.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(dictionary.queryAllDict.actionName);
        return Promise.reject(e);
      });
  }
}
export default new DictionaryService();
