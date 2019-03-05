import { httpRequest } from './http';
import tags from './url/tags';

@httpRequest
class tagsService {
  /**
   * @desc 根据id查询标签
   * @param {Any} id
   */
  queryTagsById(id) {
    return this.$httpRequest({
      url: `${tags.queryTagsById.value}${id}`,
      method: 'GET'
    });
  }

  /**
   * @desc 根据标签名称查询标签
   * @param {Object} data
   */
  queryTagsByName(data) {
    return this.$httpRequest({
      url: tags.queryTagsByName.value,
      data: data,
      method: 'POST'
    });
  }

  /**
   * @desc 根据条件查询标签
   * @param {Object} data
   */
  queryTagsByType(data) {
    return this.$httpRequest({
      url: tags.queryTagsByType.value,
      data: data,
      method: 'POST'
    });
  }

  /**
   * @desc 创建标签
   * @param {Object} data
   */
  addTag(data) {
    return this.$httpRequest({
      url: tags.addTag.value,
      data: data,
      method: 'POST'
    });
  }

  /**
   * @desc 根据id数组查询标签
   * @param {Object} data
   */
  queryTagsByIds(data) {
    return this.$httpRequest({
      url: tags.queryTagsByIds.value,
      data: data,
      method: 'POST'
    });
  }
}

export default new tagsService();
