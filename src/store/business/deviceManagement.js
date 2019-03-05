import { observable, action } from 'mobx';
import _ from 'lodash';
import { cloneDeep } from 'lodash';
const {deviceAndMjType} = Dict.map

export const ModelData = {
  offset: 0,
  limit: 10,
  deviceName: '',
  cid:'',
  keywords:'',
  placeIds:[],
  deviceStatus:undefined,
  deviceTypes:'-1',
  hadLocation:undefined,
  distributionState: undefined,
  includeSubOrganizations: false,
  lygroupId: '-1',
  sn: '',
  installationSite:'-1',//場所類型,
  pathId:'-1',
  industry1:'-1',//行业
};

class DeviceManagementStore {
  @observable
  activeKey = [];

  @observable
  searchData = ModelData;

  @observable
  formData = {};

  @action
  initData() {
    this.activeKey = [];
    this.initSearchForm();
    this.formData = {};
  }

  @action
  initSearchForm(){
    this.searchData = ModelData;
  }

  @action
  mergeFormData(data) {
    this.formData = Object.assign(this.formData, { ...data });
  }

  @action
  mergeSearchData(data) {
    this.searchData = Object.assign(this.searchData, { ...data });
  }
  @action
  setData(json) {
    for (var k in json) {
      if (this.hasOwnProperty(k)) {
        this[k] = json[k];
      }
    }
  }
  // /**获取羚羊云分组 */
  // queryLingyangOrgs() {
  //   return Service.device.queryLingyangOrgs().then(res => {
  //     return [].concat([{ id: '-1', name: '全部分组' }], res.data.groups);
  //   });
  // }

  // /**
  //  * 分配设备到组织
  //  * @param {Object} data
  //  */
  // updateDeviceOrg(data) {
  //   return Service.device.updateDeviceOrg(data);
  // }

  // updateDeviceGeo(data){
  //   return Service.device.updateDeviceGeo(data)
  // }


  // /**列表查询 */
  // getList = (orgIds) => {
  //   let searchData = cloneDeep(this.searchData);
  //   _.forIn(searchData, (value, key) => {
  //     if (value===""||value===null||value===undefined||value === '-1') {
  //       searchData = _.omit(searchData, [key]);
  //     }
  //   });
  //   if (orgIds.length) {
  //     searchData.orgIds = orgIds;
  //   } else {
  //     searchData.orgIds = this.activeKey;
  //   }
  //   if(searchData.deviceTypes){
  //     searchData.deviceTypes = searchData.deviceTypes.split(',')
  //     if(searchData.deviceTypes[0]==='100603'){
  //       searchData.deviceTypes.push('100607')
  //     }
  //   }else{
  //     let deviceTypes = []
  //     deviceAndMjType.filter(v => v.value !== '-1').map(v => {
  //       deviceTypes = deviceTypes.concat(v.value.split(','))
  //       return v
  //     })
  //     searchData.deviceTypes = deviceTypes
  //   }
  //   return Service.device.deviceListByOrganization(searchData);
  // }

 
  // getCameraInfoByDeviceId(id) {
  //   return Service.device.queryDeviceVo(id);
  // }


  // updateCameraInfo() {
  //   let options = {
  //     id: this.formData.id,
  //     cameraOrientation: this.formData.cameraOrientation,
  //     deviceName: this.formData.deviceName,
  //     image_invert: this.formData.image_invert,
  //     inOutDirection:+this.formData.inOutDirection,
  //     industry1:this.formData.industry1,
  //     industry2:this.formData.industry2,
  //     installationMethod:this.formData.installationMethod,
  //     installationSite:this.formData.installationSite,
  //     isIdleDeal:+this.formData.isIdleDeal,
  //     maintenancePhone:this.formData.maintenancePhone,
  //     osd: this.formData.osd,
  //     resolution: this.formData.resolution,
  //     video_quality:this.formData.video_quality,
  //     alarmBean:{
  //       count: this.formData.count,
  //       interval: this.formData.interval,
  //       push: this.formData.push,
  //       sensitivity:this.formData.sensitivity,
  //       zone: this.formData.zone
  //     }
  //   };
  //   for (let k1 in options) {
  //     if (options[k1] === undefined || options[k1] === 'undefined') {
  //       delete options[k1];
  //     }
  //     for (let k2 in options.alarmBean) {
  //       if (
  //         options.alarmBean[k2] === undefined ||
  //         options.alarmBean[k2] === 'undefined'
  //       ) {
  //         delete options.alarmBean[k2];
  //       }
  //     }
  //   }
  //   return Service.device.updateDevice(options);
  // }
}

export default new DeviceManagementStore();
