import config from '../config';
const { api, version } = config;

export default {
  getKvStore: {
    value: `${api}user/userKvStore/${version}/getKvStore`,
    label: '获取用户键值对信息',
    actionName: 'getKvStore'
  },
  setUserKvStore: {
    value: `${api}user/userKvStore/${version}/setUserKvStore`,
    label: '设置用户键值对',
    actionName: 'setUserKvStore'
  },
  listUserKey: {
    value: `${api}user/userKvStore/${version}/listUserKey`,
    label: '获取用户键列表',
    actionName: 'listUserKey'
  }
};
