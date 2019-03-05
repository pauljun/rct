import config from '../config';
const { api, version } = config;
export default {
  soldierModule: {
    code: 105500,
    text: '单兵管理'
  },
  enterSoldierModule: {
    text: '进入单兵管理界面',
    code: 105599,
    parent: 105500,
    moduleName: 'soldier',
  },
  querySolosDevice: {
    value: `${api}device/${version}/querySolosDevice`,
    label: '单兵列表',
    actionName:'querySolosDevice',
  },
  registerSolosCamera: {
    value: `${api}device/${version}/registerSolosCamera`,
    label: '新增单兵',
    actionName:'registerSolosCamera',
    logInfo: [{
      code: 105501,
      parent: 105500,
      text: '新增单兵'
    }]
  },
  bindUser: {
    value: `${api}device/${version}/bindUser`,
    label: '绑定单兵',
    actionName:'bindUser',
    logInfo: [{
      code: 105503,
      parent: 105500,
      text: '绑定单兵'
    }]
  },
  unbindUser: {
    value: `${api}device/${version}/unbindUser`,
    label: '解绑单兵',
    actionName:'unbindUser',
    logInfo: [{
      code: 105504,
      parent: 105500,
      text: '解绑单兵'
    }]
  },
};
