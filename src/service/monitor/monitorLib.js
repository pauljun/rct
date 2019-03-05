import { httpRequest } from '../http';
import monitorLib from '../url/monitorLib';

@httpRequest
class MonitorLib {
  /**
   * @desc 布控库列表搜索
   * @param {object} data 
   */
  queryMonitorLibs(data = {}) {
    BaseStore.actionPanel.setAction(monitorLib.queryMonitorLibs.actionName);
    return this.$httpRequest({
      url: monitorLib.queryMonitorLibs.value,
      method: 'post',
      data
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.queryMonitorLibs.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.queryMonitorLibs.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 根据id获取布控库详情
   * @param {string} id 
   */
  queryMonitorLibDetail(id){
    BaseStore.actionPanel.setAction(monitorLib.queryMonitorLibDetail.actionName);
    return this.$httpRequest({
      url: monitorLib.queryMonitorLibDetail.value.replace('<id>', id),
      method: 'post',
      data:{
        id
      }
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.queryMonitorLibDetail.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.queryMonitorLibDetail.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 根据id删除布控库
   * @param {object} data
   */
  deleteMonitorLib({id, libType, libName}){
    BaseStore.actionPanel.setAction(monitorLib.deleteMonitorLib.actionName);
    return this.$httpRequest({
      url: monitorLib.deleteMonitorLib.value.replace('<id>', id),
      method: 'post',
      data:{
        id
      },
      logInfo: {
        description: `删除${libType===1 ?'重点':'合规'}人员库【${libName}】`,
        ...monitorLib.deleteMonitorLib.logInfo.find(v => v.type === libType),
      }
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.deleteMonitorLib.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.deleteMonitorLib.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 新增布控库
   * @param {object} data
   */
  addMonitorLib(data = {}){
    BaseStore.actionPanel.setAction(monitorLib.addMonitorLib.actionName);
    return this.$httpRequest({
      url: monitorLib.addMonitorLib.value,
      method: 'post',
      data,
      logInfo: {
        description: `新增${data.libType===1 ?'重点':'合规'}人员库【${data.name}】`,
        ...monitorLib.addMonitorLib.logInfo.find(v => v.type === data.libType),
      }
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.addMonitorLib.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.addMonitorLib.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 修改布控库
   * @param {object} data
   */
  updateMonitorLib(data = {}){
    BaseStore.actionPanel.setAction(monitorLib.updateMonitorLib.actionName);
    let libLabel = {
      1: '重点人员',
      2: '合规人员',
      4:  '专网'
    }
    return this.$httpRequest({
      url: monitorLib.updateMonitorLib.value,
      method: 'post',
      data,
      logInfo: {
        description: `编辑${libLabel[data.libType]}库【${data.name}】`,
        ...monitorLib.updateMonitorLib.logInfo.find(v => v.type === data.libType),
      }
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.updateMonitorLib.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.updateMonitorLib.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 导入布控库（一体机）
   * @param {object} data
   */
  importMachineMonitorLibs(data = {}){
    BaseStore.actionPanel.setAction(monitorLib.importMachineMonitorLibs.actionName);
    return this.$httpRequest({
      url: monitorLib.importMachineMonitorLibs.value,
      method: 'post',
      data,
      logInfo: monitorLib.importMachineMonitorLibs.logInfo[0]
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.importMachineMonitorLibs.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.importMachineMonitorLibs.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 修改布控人员信息
   * @param {object} data
   */
  updateMonitorLibPerson(data, libInfo) {
    BaseStore.actionPanel.setAction(monitorLib.updateMonitorLibPerson.actionName);
    const logInfo = {
      description: `编辑${libInfo.libType === 1 ? '重点' : '合规'}人员库【${libInfo.name}】 人员【${data.selfAttr.name}】`,
      ...monitorLib.updateMonitorLibPerson.logInfo.find(v => v.type === libInfo.libType),
    }
    return this.$httpRequest({
      url: monitorLib.updateMonitorLibPerson.value,
      method: 'post',
      data,
      logInfo
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.updateMonitorLibPerson.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.updateMonitorLibPerson.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 向已存在的布控库中添加多个布控对象，包括布控对象图片信息
   * @param {object} data
   */
  addMonitorLibPersons(data,libInfo){
    BaseStore.actionPanel.setAction(monitorLib.addMonitorLibPersons.actionName);
    const peopleNames = data.monitorLibPersons.map(v => v.selfAttr.name);
    const logInfo = {
      description: `添加人员【${peopleNames}】到${libInfo.libType===1?'重点':'合规'}人员库【${libInfo.name}】`,
      ...monitorLib.addMonitorLibPersons.logInfo.find(v => v.type === libInfo.libType),
    }
    return this.$httpRequest({
      url: monitorLib.addMonitorLibPersons.value,
      method: 'post',
      data,
      logInfo
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.addMonitorLibPersons.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.addMonitorLibPersons.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 批量删除布控对象
   * @param {array} personIds 要删除的id集合
   */
  deleteMonitorLibPersons(personIds, libDetail) {
    BaseStore.actionPanel.setAction(monitorLib.deleteMonitorLibPersons.actionName);
    let peopleNames = []
    personIds.map(id => {
      const item = libDetail.objectMainList.find(v => v.id === id);
      item && peopleNames.push(item.selfAttr.name)
    })
    const logInfo = {
      description: `移除${libDetail.libType===1?'重点':'合规'}人员库【${libDetail.name}】的人员【${peopleNames}】`,
      ...monitorLib.deleteMonitorLibPersons.logInfo.find(v => v.type === libDetail.libType),
    }
    return this.$httpRequest({
      url: monitorLib.deleteMonitorLibPersons.value,
      method: 'post',
      data: { ids: personIds },
      logInfo
    })
    .then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.deleteMonitorLibPersons.actionName);
      return res;
    })
    .catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.deleteMonitorLibPersons.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 删除单个布控人员的单个图片
   * @param {string} id 
   */
  deleteMonitorLibPersonPicture(id) {
    BaseStore.actionPanel.setAction(monitorLib.deleteMonitorLibPersonPicture.actionName);
    return this.$httpRequest({
      url: monitorLib.deleteMonitorLibPersonPicture.value.replace('<id>', id),
      method: 'post',
      data: {
        id
      }
    }).then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.deleteMonitorLibPersonPicture.actionName);
      return res;
    }).catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.deleteMonitorLibPersonPicture.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 上传单张布控对象图片到服务
   * @param {object} file 
   */
  uploadMonitorPersonPic(file) {
    BaseStore.actionPanel.setAction(monitorLib.uploadMonitorPersonPic.actionName);
    const formData = new FormData()
    formData.append('file', file);
    formData.append('fileSize', file.size);
    formData.append('fileName', file.name);
    return this.$httpMultiPart({
      url: monitorLib.uploadMonitorPersonPic.value,
      method: 'post',
      data: formData
    }).then(res => {
      let url = res.data.url || ''
      file.url = url ? BaseStore.user.systemConfig.domainAddress + url : ''
      BaseStore.actionPanel.removeAction(monitorLib.uploadMonitorPersonPic.actionName);
      return file;
    }).catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.uploadMonitorPersonPic.actionName);
      return Promise.reject({ file: false, e });
    });
  }

  /**
   * @desc 删除布控对象图片-羚羊云删除
   * @param {Array[string]} pictureUrls url
   */
  deleteMonitorPersonPic(pictureUrls) {
    BaseStore.actionPanel.setAction(monitorLib.deleteMonitorPersonPic.actionName);
    return this.$httpRequest({
      url: monitorLib.deleteMonitorPersonPic.value,
      method: 'post',
      data: {
        pictureUrls
      }
    }).then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.deleteMonitorPersonPic.actionName);
      return res;
    }).catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.deleteMonitorPersonPic.actionName);
      return Promise.reject(e);
    });
  }

  /**
   * @desc 上传一体机布控库到服务器
   * @param {object} file 
   */
  uploadMachnieMonitorLibFile(file) {
    BaseStore.actionPanel.setAction(monitorLib.uploadMachnieMonitorLibFile.actionName);
    return this.$httpMultiPart({
      url: monitorLib.uploadMachnieMonitorLibFile.value,
      method: 'post',
      data: file
    }).then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.uploadMachnieMonitorLibFile.actionName);
      return res;
    }).catch(e => {
      BaseStore.actionPanel.removeAction(monitorLib.uploadMachnieMonitorLibFile.actionName);
      return Promise.reject({ file: false, e });
    });
  }

  /**
   * @desc 获取一体机布控库导入变化详情
   * @param {object} data 
   */
  getMachineMonitorLibsChanges(data) {
    BaseStore.actionPanel.setAction(monitorLib.getMachineMonitorLibsChanges.actionName);
    return this.$httpRequest({
      url: monitorLib.getMachineMonitorLibsChanges.value,
      method: 'post',
      data
    }).then(res => {
      BaseStore.actionPanel.removeAction(monitorLib.getMachineMonitorLibsChanges.actionName);
      return res;
    }).catch(err => {
      BaseStore.actionPanel.removeAction(monitorLib.getMachineMonitorLibsChanges.actionName);
      return Promise.reject(err);
    });
  }
}
export default new MonitorLib();
