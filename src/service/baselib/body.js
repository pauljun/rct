import { httpRequest } from "../http";
import body from "../url/baselib/body";
import * as _ from "lodash";

@httpRequest
class BodyService {
  /**
   * @desc 根据抓拍图片记录id查询人体详情
   * @param {Object} data
   */
  bodies(data) {
    BaseStore.actionPanel.setAction(body.bodies.value);
    return this.$httpRequest({
      url: body.bodies.value.replace('<id>', data.id),
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(body.bodies.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(body.bodies.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 人体总数查询
   * @param {Object} data
   */
  countBodies(data) {
    BaseStore.actionPanel.setAction(body.countBodies.value);
    return this.$httpRequest({
      url: body.countBodies.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(body.countBodies.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(body.countBodies.actionName);
        return Promise.reject(e);
      });
  }

    /**
   * @desc 人体特征值提取
   * @param {Object} data
   */
  getFeature(data) {
    BaseStore.actionPanel.setAction(body.getFeature.value);
    return this.$httpRequest({
      url: body.getFeature.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(body.getFeature.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(body.getFeature.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 人体列表查询
   * @param {Object} data
   */
  queryBodies(data) {
    BaseStore.actionPanel.setAction(body.queryBodies.value);
    return this.$httpRequest({
      url: body.queryBodies.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(body.queryBodies.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(body.queryBodies.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 根据人体特征查询人体列表
   * @param {Object} data
   */
  queryBodiesByFeature(data) {
    BaseStore.actionPanel.setAction(body.queryBodiesByFeature.value);
    return this.$httpRequest({
      url: body.queryBodiesByFeature.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(body.queryBodiesByFeature.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(body.queryBodiesByFeature.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 人体暴力比对查询
   * @param {Object} data
   */
  queryBodiesViolence(data) {
    BaseStore.actionPanel.setAction(body.queryBodiesViolence.value);
    return this.$httpRequest({
      url: body.queryBodiesViolence.value,
      method: 'post',
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(body.queryBodiesViolence.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(body.queryBodiesViolence.actionName);
        return Promise.reject(e);
      });
  }  
}

export default new BodyService();
