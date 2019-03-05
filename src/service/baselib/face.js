import { httpRequest } from "../http"
import face from "../url/baselib/face"
import * as _ from "lodash"

@httpRequest
class FaceService {
  /**
   * @desc 获取人脸列表数据
   * @param {Object} data
   */
  queryFaces(data) {
    BaseStore.actionPanel.setAction(face.queryFaces.value);
    return this.$httpRequest({
      url: face.queryFaces.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(face.queryFaces.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(face.queryFaces.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取人脸列表的总total值
   * @param {Object} data
   */
  countFaces(data) {
    BaseStore.actionPanel.setAction(face.countFaces.value);
    return this.$httpRequest({
      url: face.countFaces.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(face.countFaces.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(face.countFaces.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 通过人脸 id 查询人脸特征 新增一个字段
   * @param {Object} data
   */
  faces(data) {
    BaseStore.actionPanel.setAction(face.faces.value);
    return this.$httpRequest({
      url: face.faces.value.replace('<id>', data.id),
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(face.faces.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(face.faces.actionName);
        return Promise.reject(e);
      });
  }

    /**
   * @desc Url人脸特征值提取
   * @param {Object} data
   */
  getFeature(data) {
    BaseStore.actionPanel.setAction(face.getFeature.value);
    return this.$httpRequest({
      url: face.getFeature.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(face.getFeature.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(face.getFeature.actionName);
        return Promise.reject(e);
      });
  }

    /**
   * @desc 上传图片供以图搜图使用
   * @param {Object} data
   */
  uploadImg(data) {
    BaseStore.actionPanel.setAction(face.uploadImg.value);
    return this.$httpMultiPart({
      url: face.uploadImg.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(face.uploadImg.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(face.uploadImg.actionName);
        return Promise.reject(e);
      });
  }  

    /**
   * @desc 根据人脸特征查询人脸列表
   * @param {Object} data
   */
  queryFacesByFeature(data) {
    BaseStore.actionPanel.setAction(face.queryFacesByFeature.value);
    return this.$httpRequest({
      url: face.queryFacesByFeature.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(face.queryFacesByFeature.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(face.queryFacesByFeature.actionName);
        return Promise.reject(e);
      });
  }  
  
    /**
   * @desc 人脸暴力比对查询
   * @param {Object} data
   */
  queryFacesViolence(data) {
    BaseStore.actionPanel.setAction(face.queryFacesViolence.value);
    return this.$httpRequest({
      url: face.queryFacesViolence.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(face.queryFacesViolence.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(face.queryFacesViolence.actionName);
        return Promise.reject(e);
      });
  }    

      /**
   * @desc 根据抓拍图片ID查询图片详情
   * @param {Object} id
   */
  queryPersons(id) {
    BaseStore.actionPanel.setAction(face.persons.value);
    return this.$httpRequest({
      url: face.persons.value.replace('<id>', id),
      method: 'post',
      data: { id }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(face.persons.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(face.persons.actionName);
        return Promise.reject(e);
      });
  }    
}

export default new FaceService()
