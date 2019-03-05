import config from '../config';
const { api, version } = config;

export default {
  queryAllDict: {
    value: `${api}dictionary/${version}/queryAll`,
    label: '获取历史视频地址',
    actionName: 'queryAllDict',
  }
};
