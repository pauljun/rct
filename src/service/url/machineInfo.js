import config from '../config';
const { api, version } = config
export default {
  // 获取一体机信息列表
  queryMachineInfos: {
    value: `${api}alarm/${version}/machineInfo/queryMachineInfos`,
    label: '获取一体机信息列表',
    actionName: 'queryMachineInfos'
  }
}