import { httpRequest } from "../http";
import vehicle from "../url/baselib/vehicle";
import * as _ from "lodash";

@httpRequest
class VehicleService {
  /**
   * @desc 获取机动车列表数据
   * @param {Object} data
   */
  queryPassRecords(data) {
    BaseStore.actionPanel.setAction(vehicle.queryPassRecords.value);
    return this.$httpRequest({
      url: vehicle.queryPassRecords.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(vehicle.queryPassRecords.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(vehicle.queryPassRecords.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 根据图片搜索机动车图片列表
   * @param {Object} data
   */
  queryVehiclePictures(data) {
    BaseStore.actionPanel.setAction(vehicle.queryVehiclePictures.value);
    return this.$httpRequest({
      url: vehicle.queryVehiclePictures.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(vehicle.queryVehiclePictures.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(vehicle.queryVehiclePictures.actionName);
        return Promise.reject(e);
      });
  }  

  /**
   * @desc 上传机动车以图搜图图片
   * @param {Object} data
   */
  uploadImg(data) {
    BaseStore.actionPanel.setAction(vehicle.uploadImg.value);
    return this.$httpMultiPart({
      url: vehicle.uploadImg.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(vehicle.uploadImg.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(vehicle.uploadImg.actionName);
        return Promise.reject(e);
      });
  }    
}

export default new VehicleService();
