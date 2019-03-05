import { httpRequest } from './http';
import place from './url/place';

@httpRequest
class PlaceService {
  /**
   * @desc 查询场所内各场所类型人数统计
   * @param {Object} data
   */
  queryRelationVids(data) {
    BaseStore.actionPanel.setAction(place.countPersonByPlaceType.actionName);
    return this.$httpRequest({
      url: place.countPersonByPlaceType.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.countPersonByPlaceType.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.countPersonByPlaceType.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 根据场所ID查询详情
   * @param {Object} data
   */
  queryPlaceInfo(data) {
    BaseStore.actionPanel.setAction(place.placeInfo.actionName);
    return this.$httpRequest({
      url: `${place.placeInfo.value.replace('<id>', data.id)}?signature=${data.signature}`,
      method: 'POST',
      data: {
        id:data.id
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.placeInfo.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.placeInfo.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 小区绑定场所详情
   * @param {Object} data
   */
  placesExt(data) {
    BaseStore.actionPanel.setAction(place.placesExt.actionName);
    return this.$httpRequest({
      url: `${place.placesExt.value.replace('<id>', data.id)}`,
      method: 'POST',
      data: {
        id:data.id
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.placesExt.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.placesExt.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 根据场所ID查询下级场所列表
   * @param {Object} data
   */
  queryPlacesByParentId(data = {}) {
    BaseStore.actionPanel.setAction(place.queryPlacesByParentId.actionName);
    return this.$httpRequest({
      url: place.queryPlacesByParentId.value.replace('<parentId>', data.parentId),
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.queryPlacesByParentId.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.queryPlacesByParentId.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询行政区划信息
   * @param {Object} data
   */
  queryPlaces(data) {
    BaseStore.actionPanel.setAction(place.queryPlaces.actionName);
    return this.$httpRequest({
      url: place.queryPlaces.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.queryPlaces.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.queryPlaces.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 获取系统中所有省信息
   * @param {Object} data
   */
  queryProvinces(data) {
    BaseStore.actionPanel.setAction(place.queryProvinces.actionName);
    return this.$httpRequest({
      url: place.queryProvinces.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.queryProvinces.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.queryProvinces.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 获取系统中所有省信息
   * @param {Object} data
   */
  queryMinPlaces(data) {
    BaseStore.actionPanel.setAction(place.queryMinPlaces.actionName);

    return this.$httpRequest({
      url: place.queryMinPlaces.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.queryMinPlaces.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.queryMinPlaces.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询场所内的设备
   * @param {Object} data
   */
  queryDevices(data) {
    BaseStore.actionPanel.setAction(place.queryDevices.actionName);
    return this.$httpRequest({
      url: place.queryDevices.value.replace('<placeId>', data.placeId),
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.queryDevices.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.queryDevices.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询场所内的设备数量
   * @param {Object} data
   */
  countDevices(data) {
    BaseStore.actionPanel.setAction(place.countDevices.actionName);
    return this.$httpRequest({
      url: place.countDevices.value.replace('<placeId>', data.placeId),
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.countDevices.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.countDevices.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询场所出入人、 人脸人体资源
   * @param {Object} data
   */
  countResources(data) {
    BaseStore.actionPanel.setAction(place.countResources.actionName);
    return this.$httpRequest({
      url: place.countResources.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.countResources.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.countResources.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询场所机动车和非机动车资源
   * @param {Object} data
   */
  countVehiclesResources(data) {
    BaseStore.actionPanel.setAction(place.countVehiclesResources.actionName);
    return this.$httpRequest({
      url: place.countVehiclesResources.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.countVehiclesResources.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.countVehiclesResources.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询场所人次统计， 展示场所人员出入规律
   * @param {Object} data
   */
  countPersonFrequency(data) {
    BaseStore.actionPanel.setAction(place.countPersonFrequency.actionName);
    return this.$httpRequest({
      url: place.countPersonFrequency.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.countPersonFrequency.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.countPersonFrequency.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询场所人数统计， 展示场所人流量分布规律
   * @param {Object} data
   */
  countPersonNum(data) {
    BaseStore.actionPanel.setAction(place.countPersonNum.actionName);
    return this.$httpRequest({
      url: place.countPersonNum.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.countPersonNum.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.countPersonNum.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询不同类型（ 常出入， 临时出入， 长期未出现） 人员数量
   * @param {Object} data
   */
  countTypeByPid(data) {
    BaseStore.actionPanel.setAction(place.countTypeByPid.actionName);
    return this.$httpRequest({
      url: place.countTypeByPid.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.countTypeByPid.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.countTypeByPid.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询不同类型（ 常出入， 临时出入， 长期未出现） 人员数量
   * @param {Object} data
   */
  countMinPlaces(data) {
    BaseStore.actionPanel.setAction(place.countMinPlaces.actionName);

    return this.$httpRequest({
      url: place.countMinPlaces.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.countMinPlaces.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.countMinPlaces.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 根据设备id查询已有和新的场所列表
   * @param {Object} data
   */
  queryPOIByCenter(data) {
    BaseStore.actionPanel.setAction(place.queryPOIByCenter.actionName);

    return this.$httpRequest({
      url: place.queryPOIByCenter.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.queryPOIByCenter.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.queryPOIByCenter.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询场所人员数量
   * @param {} data
   */
  countPersonGroupByPid(data) {
    BaseStore.actionPanel.setAction(place.countPersonGroupByPid.actionName);

    return this.$httpRequest({
      url: place.countPersonGroupByPid.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.countPersonGroupByPid.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.countPersonGroupByPid.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询场所人员数量
   * @param {} data
   */
  getPlacesByHasDevice() {
    BaseStore.actionPanel.setAction(place.getPlacesByHasDevice.actionName);
    return this.$httpRequest({
      url: place.getPlacesByHasDevice.value,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(place.getPlacesByHasDevice.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(place.getPlacesByHasDevice.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询设备抓拍的人、 人脸、 人体资源
   * @param {} data
   */
  countDeviceResources(data) {
    BaseStore.actionPanel.setAction(place.countDeviceResources.actionName);

    return this.$httpRequest({
      url: place.countDeviceResources.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          place.countDeviceResources.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          place.countDeviceResources.actionName
        );
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询设备抓拍的车辆资源
   * @param {} data
   */
  countVehiclesByCids(data) {
    BaseStore.actionPanel.setAction(place.countVehiclesByCids.actionName);

    return this.$httpRequest({
      url: place.countVehiclesByCids.value,
      method: 'POST',
      data: data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          place.countVehiclesByCids.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          place.countVehiclesByCids.actionName
        );
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询设备抓拍的车辆资源
   * @param {} data
   */
  countDeviceCapPersons(data) {
    BaseStore.actionPanel.setAction(place.countDeviceCapPersons.actionName);

    return this.$httpRequest({
        url: place.countDeviceCapPersons.value,
        method: 'POST',
        data: data
      })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          place.countDeviceCapPersons.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          place.countDeviceCapPersons.actionName
        );
        return Promise.reject(e);
      });
  }
  /**
   * @desc 手动关联场所关系
   * @param {} data
   */
  activeAssociatedPlaces(data) {
    BaseStore.actionPanel.setAction(place.activeAssociatedPlaces.actionName);

    return this.$httpRequest({
        url: place.activeAssociatedPlaces.value,
        method: 'POST',
        data: data
      })
      .then(res => {
          BaseStore.actionPanel.removeAction(
            place.activeAssociatedPlaces.actionName
          );
          return res;
        })
        .catch(e => {
          BaseStore.actionPanel.removeAction(
            place.activeAssociatedPlaces.actionName
          );
          return Promise.reject(e);
        });
    }
   /**
    * @desc 查询场所人员数量
    * @param {} data
    */
   inputAssistant(data) {
     BaseStore.actionPanel.setAction(place.inputAssistant.actionName);

     return this.$httpRequest({
         url: place.inputAssistant.value,
         method: 'POST',
         data: data
       })
       .then(res => {
         BaseStore.actionPanel.removeAction(
           place.inputAssistant.actionName
         );
         return res;
       })
       .catch(e => {
         BaseStore.actionPanel.removeAction(

           place.inputAssistant.actionName
         );
         return Promise.reject(e);
       });
   }

 /**
    * @desc 手动关联设备场所关系
    * @param {} data
    */
   activeAssociatedDeviceToPlace = (data) => {
    BaseStore.actionPanel.setAction(place.activeAssociatedDeviceToPlace.actionName);

    return this.$httpRequest({
        url: place.activeAssociatedDeviceToPlace.value,
        method: 'POST',
        data: data
      })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          place.activeAssociatedDeviceToPlace.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(

          place.activeAssociatedDeviceToPlace.actionName
        );
        return Promise.reject(e);
      });
   }

   /**
    * @desc 根据条件批量查询场所
    * @param {} data
    */
   getPlacesByConditions(data) {
     BaseStore.actionPanel.setAction(place.getPlacesByConditions.actionName);

     return this.$httpRequest({
         url: place.getPlacesByConditions.value,
         method: 'POST',
         data: data
       })
       .then(res => {
         BaseStore.actionPanel.removeAction(
           place.getPlacesByConditions.actionName
         );
         return res;
       })
       .catch(e => {
         BaseStore.actionPanel.removeAction(

           place.getPlacesByConditions.actionName
         );
         return Promise.reject(e);
       });
   }

      /**
    * @desc 查询场所不同纬度的统计
    * @param {} data
    */
   countPerson(data) {
    BaseStore.actionPanel.setAction(place.countPerson.actionName);

    return this.$httpRequest({
        url: place.countPerson.value,
        method: 'POST',
        data: data
      })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          place.countPerson.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(

          place.countPerson.actionName
        );
        return Promise.reject(e);
      });
  }
   /**
    * @desc 根据条件批量查询场所
    * @param {} data
    */
   playPlaceTagsById(data) {
     BaseStore.actionPanel.setAction(place.playPlaceTagsById.actionName);
     return this.$httpRequest({
         url: place.playPlaceTagsById.value,
         method: 'POST',
         data: data
       })
       .then(res => {
         BaseStore.actionPanel.removeAction(
           place.playPlaceTagsById.actionName
         );
         return res;
       })
       .catch(e => {
         BaseStore.actionPanel.removeAction(

           place.playPlaceTagsById.actionName
         );
         return Promise.reject(e);
       });
   }
   /**
    * @desc 根据经纬度或cid查询周边指定距离内的设备
    * @param {} data
    */
   queryDeviceByCenter(data) {
     BaseStore.actionPanel.setAction(place.queryDeviceByCenter.actionName);
     return this.$httpRequest({
         url: place.queryDeviceByCenter.value,
         method: 'POST',
         data: data
       })
       .then(res => {
         BaseStore.actionPanel.removeAction(
           place.queryDeviceByCenter.actionName
         );
         return res;
       })
       .catch(e => {
         BaseStore.actionPanel.removeAction(

           place.queryDeviceByCenter.actionName
         );
         return Promise.reject(e);
       });
   }
   /**
    * @desc 查询不同类型（ 常出入， 临时出入， 长期未出现） 人员列表
    * @param {} data
    */
   getTypeByPid(data) {
     BaseStore.actionPanel.setAction(place.getTypeByPid.actionName);
     return this.$httpRequest({
         url: place.getTypeByPid.value,
         method: 'POST',
         data: data
       })
       .then(res => {
         BaseStore.actionPanel.removeAction(
           place.getTypeByPid.actionName
         );
         return res;
       })
       .catch(e => {
         BaseStore.actionPanel.removeAction(

           place.getTypeByPid.actionName
         );
         return Promise.reject(e);
       });
   }
}

export default new PlaceService();
