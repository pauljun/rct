import { observable, action } from 'mobx';
import _ from 'lodash';
import { cloneDeep } from 'lodash';
const {deviceType} = Dict.map

export const ModelData = {
  offset: 0,
  limit: 20,
  deviceName: undefined,
  keywords: undefined,
  placeIds: undefined,
  deviceStatus:undefined,
  deviceTypes: undefined,
  lygroupId: undefined,
};

class ResourceManagementStore {
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

  // /**列表查询 */
  // getList = (orgIds) => {
  //   let searchData = cloneDeep(this.searchData);
  //   _.forIn(searchData, (value, key) => {
  //     if (!value || value === '-1') {
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
  //     searchData.hadLocation = searchData.hadLocation==='0' ? false : searchData.hadLocation==='1' ? true:undefined
  //     searchData.deviceTypes = deviceTypes
  //     searchData.offset=0
  //   }
  //   return Service.device.deviceListByOrganization(searchData);
  // }

  @action
  setData(json) {
    for (var k in json) {
      if (this.hasOwnProperty(k)) {
        this[k] = json[k];
      }
    }
  }


}

export default new ResourceManagementStore();
