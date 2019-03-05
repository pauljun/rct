import Config from '../config';

// 标签服务

export default {
  queryTagsById: {
    value: `${Config.api}tag/v1/tags/`,
    label: '根据id查询标签',
    actionName: 'queryTagsById'
  },
  queryTagsByName: {
    value: `${Config.api}tag/v1/queryByName`,
    label: '根据标签名称查询标签',
    actionName: 'queryTagsByName'
  },
  queryTagsByType: {
    value: `${Config.api}tag/v1/query`,
    label: '根据条件查询标签',
    actionName: 'queryTagsByType'
  },
  addTag: {
    value: `${Config.api}tag/v1/add`,
    label: '创建标签',
    actionName: 'addTag'
  },
  queryTagsByIds: {
    value: `${Config.api}tag/v1/ids`,
    label: '根据id数组查询标签',
    actionName: 'queryTagsById'
  },
}