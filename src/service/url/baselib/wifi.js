import Config from '../../config';
const { api } = Config;

export default {
  deviceList: {
    value: `${api}wifi/listWifiCaptureDevice`,
    label: 'wifi设备列表',
  },
  list: {
    value: `${api}wifi/listWifiDevice`,
    label: '列表查询',
  }
}