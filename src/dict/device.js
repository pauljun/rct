const all = { value: '-1', label: '全部' };

//摄像机状态
const on = { value: '1', label: '在线' };
const off = { value: '0', label: '离线' };

//经纬度状态
const noSet = { value: '0', label: '未设置' };
const isSet = { value: '1', label: '已设置' };

//摄像机类别
export const znxj = { value: '100604', label: '智能枪机' };
export const qj = { value: '100602', label: '球机' };
export const zpj = { value: '100603', label: '抓拍机' };
export const db = { value: '100605', label: '单兵' };

//wifi
export const wifi = { value: '118901', label: 'wifi探针' };

//门禁
export const mj = { value: '103501,103502', label: '门禁' };

//闸机
export const zj = { value: '103407', label: '闸机' };

export const deviceStatus = [all, on, off];

export const deviceLocation = [all, noSet, isSet];

export const cameraType = [all, znxj, qj, zpj];

//摄像机+单兵
export const cameraAndSoldierType = [all, znxj, qj, zpj, db];

//摄像机（无单兵）+门禁
export const deviceAndMjType = [...cameraType, mj];

//所有设备类型
export const deviceType = [...cameraAndSoldierType, mj, zj, wifi];

//摄像机（无单兵）+ 门禁 + 闸机 + wifi
export const communityDeviceType = [...cameraType, mj, zj, wifi];

//{ value: '103406', label: '门禁' }
