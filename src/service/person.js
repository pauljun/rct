import { httpRequest } from './http';
import person from './url/person';

@httpRequest
class PersonService {
  /**
   * @desc 新增实有人员
   * @param {Object} data
   */
  addPerson(data) {
    BaseStore.actionPanel.setAction(person.addPerson.actionName);
    return this.$httpRequest({
      url: person.addPerson.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.addPerson.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.addPerson.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 批量导入实有人员信息
   * @param {Object} data
   */
  importPersons(data) {
    BaseStore.actionPanel.setAction(person.importPersons.actionName);
    return this.$httpRequest({
      url: person.importPersons.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.importPersons.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.importPersons.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 删除单个实有人员
   * @param {Any} id
   */
  deletePerson(id) {
    BaseStore.actionPanel.setAction(person.deletePerson.actionName);
    return this.$httpRequest({
      url: person.deletePerson.value.replace('<id>', id),
      method: 'POST',
      data: { id }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.deletePerson.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.deletePerson.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 批量删除实有人员
   * @param {Object} data
   */
  deletePersons(data) {
    BaseStore.actionPanel.setAction(person.deletePersons.actionName);
    return this.$httpRequest({
      url: person.deletePersons.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.deletePersons.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.deletePersons.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 修改实有人员信息
   * @param {Object} data
   */
  updatePerson(data) {
    BaseStore.actionPanel.setAction(person.updatePerson.actionName);
    return this.$httpRequest({
      url: person.updatePerson.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.updatePerson.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.updatePerson.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 根据条件查询人员
   * @param {Object} data
   */
  queryPersons(data) {
    BaseStore.actionPanel.setAction(person.queryPersons.actionName);
    return this.$httpRequest({
      url: person.queryPersons.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.queryPersons.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.queryPersons.actionName);
        return Promise.reject(e);
      });
  }
    /**
   * @desc 获取人员相似的AID
   * @param {Object} data
   */
  querySimilarVids(data) {
    BaseStore.actionPanel.setAction(person.querySimilarVids.actionName);
    return this.$httpRequest({
      url: person.querySimilarVids.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.querySimilarVids.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.querySimilarVids.actionName);
        return Promise.reject(e);
      });
  }
    /**
   * @desc 根据关键字返回推荐信息
   * @param {Object} data
   */
  searchPersonByKeywords(data) {
    BaseStore.actionPanel.setAction(person.searchPersonByKeywords.actionName);
    return this.$httpRequest({
      url: person.searchPersonByKeywords.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.searchPersonByKeywords.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.searchPersonByKeywords.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 人员档案上传图片搜索
   * @param {Object} data
   */
  uploadPersonPicture(data) {
    BaseStore.actionPanel.setAction(person.uploadPersonPicture.actionName);
    return this.$httpMultiPart({
      url: person.uploadPersonPicture.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.uploadPersonPicture.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.uploadPersonPicture.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 根据id查询人员的基本信息
   * @param {Object} data
   */
  getPersonById(data) {
    BaseStore.actionPanel.setAction(person.getPersonById.actionName);
    return this.$httpRequest({
      // url: person.getPersonById.value,
      url: data.url,
      // data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.getPersonById.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.getPersonById.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询实有人员的证件号码
   * @param {Object} data
   */
  getPersonIdentityCardNumber(data) {
    BaseStore.actionPanel.setAction(
      person.getPersonIdentityCardNumber.actionName
    );
    return this.$httpRequest({
      url: person.getPersonIdentityCardNumber.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.getPersonIdentityCardNumber.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.getPersonIdentityCardNumber.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询实有人员的手机号码
   * @param {Object} data
   */
  getPersonMobile(data) {
    BaseStore.actionPanel.setAction(person.getPersonMobile.actionName);
    return this.$httpRequest({
      url: person.getPersonMobile.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.getPersonMobile.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.getPersonMobile.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询单个人员各种外观类型下具体的标签及出现次数
   * @param {Object} data
   */
  getPersonDetailAppearance(data) {
    BaseStore.actionPanel.setAction(
      person.getPersonDetailAppearance.actionName
    );
    return this.$httpRequest({
      // url: person.getPersonDetailAppearance.value,
      url: data,
      // data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.getPersonDetailAppearance.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.getPersonDetailAppearance.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取单个人员常去地及在常去地出现的次数
   * @param {Object} data
   */
  getPersonFrequentedPlaces(url,data) {
    BaseStore.actionPanel.setAction(
      person.getPersonFrequentedPlaces.actionName
    );
    return this.$httpRequest({
      // url: person.getPersonFrequentedPlaces.value,
      url,
      // data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.getPersonFrequentedPlaces.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.getPersonFrequentedPlaces.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取实有人员的门禁出入记录
   * @param {Object} data
   */
  getPersonAccessRecords(url, data) {
    BaseStore.actionPanel.setAction(person.getPersonAccessRecords.actionName);
    return this.$httpRequest({
      // url: person.getPersonAccessRecords.value,
      url,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.getPersonAccessRecords.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.getPersonAccessRecords.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取实有人员同屋关系
   * @param {Object} data
   */
  queryPersonRoommates(data) {
    BaseStore.actionPanel.setAction(person.getPersonRoommates.actionName);
    return this.$httpRequest({
      // url: person.getPersonRoommates.value,
      url: data,
      // data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.getPersonRoommates.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.getPersonRoommates.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取单个人员的同行关系
   * @param {Object} data
   */
  queryPersonAccompanies(data) {
    BaseStore.actionPanel.setAction(person.getPersonAccompanies.actionName);
    return this.$httpRequest({
      // url: person.getPersonAccompanies.value,
      url: data,
      // data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.getPersonAccompanies.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.getPersonAccompanies.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取两个人员的详细同行信息
   * @param {Object} data
   */
  queryDetailAccompany(url,data) {
    console.log(data, 406);
    BaseStore.actionPanel.setAction(person.getDetailAccompany.actionName);
    return this.$httpRequest({
      // url: person.getDetailAccompany.value,
      url,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.getDetailAccompany.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.getDetailAccompany.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取人员指定时间范围内一天各个时间段的出行规律以及平均一天出行规律
   * @param {Object} data
   */
  queryTravelRuleInOneDay(url, data) {
    BaseStore.actionPanel.setAction(person.queryTravelRuleInOneDay.actionName);
    return this.$httpRequest({
      // url: person.queryTravelRuleInOneDay.value,
      url,
      data,
      // data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.queryTravelRuleInOneDay.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.queryTravelRuleInOneDay.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取人员按天统计的出行规律
   * @param {Object} data
   */
  queryTravelRuleByDay(url, data) {
    BaseStore.actionPanel.setAction(person.queryTravelRuleByDay.actionName);
    return this.$httpRequest({
      // url: person.queryTravelRuleByDay.value,
      url,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.queryTravelRuleByDay.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.queryTravelRuleByDay.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取人员每星期或每月的平均出行规律
   * @param {Object} data
   */
  queryAverageTravelRule(url, data) {
    BaseStore.actionPanel.setAction(person.queryAverageTravelRule.actionName);
    return this.$httpRequest({
      // url: person.queryAverageTravelRule.value,
      url,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.queryAverageTravelRule.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.queryAverageTravelRule.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取人员的落脚点信息
   * @param {Object} data
   */
  queryFootholds(data) {
    BaseStore.actionPanel.setAction(person.queryFootholds.actionName);
    return this.$httpRequest({
      url: person.queryFootholds.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.queryFootholds.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.queryFootholds.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取人员最近出现时间/最近出现地点
   * @param {Object} data
   */
  queryRecentAppearance(data) {
    BaseStore.actionPanel.setAction(person.queryRecentAppearance.actionName);
    return this.$httpRequest({
      // url: person.queryRecentAppearance.value,
      url: data,
      // data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.queryRecentAppearance.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.queryRecentAppearance.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取人员首次出现时间/首次出现地点
   * @param {Object} data
   */
  queryFirstAppearance(data) {
    BaseStore.actionPanel.setAction(person.queryFirstAppearance.actionName);
    return this.$httpRequest({
      // url: person.queryFirstAppearance.value,
      url: data,
      // data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(
          person.queryFirstAppearance.actionName
        );
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(
          person.queryFirstAppearance.actionName
        );
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取多个AID人员的照片信息
   * @param {Object} data
   */
  queryAidsPicture(data) {
    BaseStore.actionPanel.setAction(person.getAidsPicture.actionName);
    return this.$httpRequest({
      url: person.getAidsPicture.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.getAidsPicture.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.getAidsPicture.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 给人员打标签
   * @param {Object} data
   */
  addTags(data) {
    BaseStore.actionPanel.setAction(person.addTags.actionName);
    return this.$httpRequest({
      url: person.addTags.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.addTags.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.addTags.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取人员标签
   * @param {Object} data
   */
  queryPersonTags(data) {
    BaseStore.actionPanel.setAction(person.queryPersonTags.actionName);
    return this.$httpRequest({
      url: person.queryPersonTags.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.queryPersonTags.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.queryPersonTags.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 设置/取消人员关注
   * @param {Object} data
   */
  setOrCancelFocus(data) {
    BaseStore.actionPanel.setAction(person.setOrCancelFocus.actionName);
    return this.$httpRequest({
      url: person.setOrCancelFocus.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.setOrCancelFocus.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.setOrCancelFocus.actionName);
        return Promise.reject(e);
      });
  }

    /**
   * @desc 获取人员关注状态
   * @param {Object} data
   */
  getFocusInfos(data) {
    BaseStore.actionPanel.setAction(person.getFocusInfos.actionName);
    return this.$httpRequest({
      url: person.getFocusInfos.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.getFocusInfos.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.getFocusInfos.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 查询人员已关联到的AID列表
   * @param {Object} data
   */
  queryRelationVids(data) {
    BaseStore.actionPanel.setAction(person.queryRelationVids.actionName);
    return this.$httpRequest({
      url: person.queryRelationVids.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.queryRelationVids.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.queryRelationVids.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 设置人员关联AID
   * @param {Object} data
   */
  addRelationVids(data) {
    BaseStore.actionPanel.setAction(person.addRelationVids.actionName);
    return this.$httpRequest({
      url: person.addRelationVids.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.addRelationVids.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.addRelationVids.actionName);
        return Promise.reject(e);
      });
  }

  // /**
  //  * @desc 查询aid轨迹聚合接口
  //  * @param {Object} data
  //  */
  // queryTrackCount(data) {
  //   return this.$httpRequest({
  //     url: person.queryTrackCount.value,
  //     data: data,
  //     method: 'POST'
  //   });
  // }
  
  /**
   * @desc 实有人员批量导入文件上传
   * @param {Object} file
   */
  uploadPersonsFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileSize', file.size)
    formData.append('fileName', file.name)
    BaseStore.actionPanel.setAction(person.uploadPersonsFile.actionName);
    return this.$httpMultiPart({
      url: person.uploadPersonsFile.value,
      data: formData,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.uploadPersonsFile.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.uploadPersonsFile.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 录入人员列表
   * @param {Object} data
   */
  listCommunityPersons(data) {
    BaseStore.actionPanel.setAction(person.listCommunityPersons.actionName);
    return this.$httpRequest({
      url: person.listCommunityPersons.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.listCommunityPersons.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.listCommunityPersons.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取用户权限下的人员档案中的人员数
   * @param {Object} data
   */
  getPersonCount(data) {
    BaseStore.actionPanel.setAction(person.getPersonCount.actionName);
    return this.$httpRequest({
      url: person.getPersonCount.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.getPersonCount.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.getPersonCount.actionName);
        return Promise.reject(e);
      });
  }

    /**
   * @desc 查询虚拟人员对应详情的参数
   * @param {Object} data
   */
  queryAidDetail(data) {
    BaseStore.actionPanel.setAction(person.queryAidDetail.actionName);
    return this.$httpRequest({
      url: person.queryAidDetail.value,
      data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.queryAidDetail.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.queryAidDetail.actionName);
        return Promise.reject(e);
      });
  }

      /**
   * @desc 通过aid查询是否有绑定personId
   * @param {Object} data
   */
  queryRecentAppearanceByAids(data) {
    BaseStore.actionPanel.setAction(person.queryRecentAppearanceByAids.actionName);
    return this.$httpRequest({
      // url: person.queryRecentAppearanceByAids.value,
      url: data,
      // data: data,
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(person.queryRecentAppearanceByAids.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(person.queryRecentAppearanceByAids.actionName);
        return Promise.reject(e);
      });
  }
}

export default new PersonService();
