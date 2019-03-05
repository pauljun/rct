import Config from '../../config';
const { api, version } = Config;

export default {
	vehicleLibModule: {
    text: '机动车图库',
    code: 105600,
  },
  enterVehicleLibModule: {
    text: '进入机动车图库界面',
    code: 105699,
    parent: 105600,
    moduleName: 'bodyLibrary', //TODO: 这个moduleName好像不对,但是搬过来就是这个
  },
  carDetailModule: {
    code: 105601,
    parent: 105600,
    text: '查看机动车抓拍图片',
  },
  queryPassRecords: {
    value: `${api}vehicle/${version}/queryPassRecords`,
    label: '机动车图库列表',
    actionName: 'queryPassRecords',
  },
  uploadImg: {
    value: `${api}vehicle/${version}/img/uploadImg`,
    label: '上传机动车以图搜图图片',
    actionName: 'passUploadImg',
  },
  queryVehiclePictures: {
    value: `${api}vehicle/${version}/queryVehiclePictures`,
    label: '根据图片搜索机动车图片列表',
    actionName: 'queryVehiclePictures',
  },
}