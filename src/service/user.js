import { httpRequest } from './http';
import user from './url/user';
import _ from 'lodash';
import { message } from 'antd';

@httpRequest
class UserService {
  /**
   * 用户登录
   * @param {*} options
   */
  login(options) {
    BaseStore.actionPanel.setAction(user.login.actionName);
    return this.$httpRequest({
      url: user.login.value,
      method: 'post',
      data: options
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.login.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.login.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 用户登出
   */
  loginOut() {
    BaseStore.actionPanel.setAction(user.loginOut.actionName);
    return this.$httpRequest({
      url: user.loginOut.value,
      method: 'post'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.loginOut.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.loginOut.actionName);
        return e;
      });
  }

  /**
   * @desc 修改密码
   * @param {*} options
   */
  changePassword(options) {
    BaseStore.actionPanel.setAction(user.changePassword.actionName);
    return this.$httpRequest({
      url: user.changePassword.value,
      method: 'post',
      data: options
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.changePassword.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.changePassword.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 发送验证码
   * @param {*} options
   */
  sendVerifyCode(options) {
    BaseStore.actionPanel.setAction(user.sendVerifyCode.actionName);
    return this.$httpRequest({
      url: user.sendVerifyCode.value,
      method: 'post',
      data: options
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.sendVerifyCode.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.sendVerifyCode.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * 根据id查询用户信息
   * @param {*} id
   */
  queryUserInfo({ id, name }) {
    BaseStore.actionPanel.setAction(user.userInfo.actionName);
    const options = {
      method: 'post',
      url: user.userInfo.value.replace('<id>', id),
      data: { id },
      logInfo: {
        description: `查看用户【${name}】`,
        ...user.userInfo.logInfo[0]
      }
    };
    if (!name) {
      delete options.logInfo;
    }
    return this.$httpRequest(options)
      .then(res => {
        BaseStore.actionPanel.removeAction(user.userInfo.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.userInfo.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 查询用户列表
   * @param {} options
   */
  queryUsers(options) {
    BaseStore.actionPanel.setAction(user.queryUsers.actionName);
    return this.$httpRequest({
      method: 'post',
      url: user.queryUsers.value,
      data: options
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.queryUsers.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.queryUsers.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取用户系统信息 地图配置
   */
  getSystemInfo(id) {
    BaseStore.actionPanel.setAction(user.getSystemInfo.actionName);
    return this.$httpRequest({
      url: user.getSystemInfo.value.replace('<id>', id),
      method: 'POST'
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.getSystemInfo.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.getSystemInfo.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 根据组织id、权限id查询当前组织下拥有某一权限的所有用户信息
   * @param {*} options
   */
  queryPrivilegeUsers(options) {
    BaseStore.actionPanel.setAction(user.queryPrivilegeUsers.actionName);
    return this.$httpRequest({
      method: 'post',
      url: user.queryPrivilegeUsers.value,
      data: options
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.queryPrivilegeUsers.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.queryPrivilegeUsers.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 添加用户
   * @param {*} options
   */
  addUser(options) {
    BaseStore.actionPanel.setAction(user.addUser.actionName);
    return this.$httpRequest({
      method: 'post',
      url: user.addUser.value,
      data: options,
      logInfo: {
        description: `新增用户【${options.loginName}】`,
        ...user.addUser.logInfo[0]
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.addUser.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.addUser.actionName);
        message.error(e.data.message)
        return Promise.reject(e);
      });
  }

  /**
   * @desc 用户修改
   * @param {*} options
   */
  changeUser(options) {
    BaseStore.actionPanel.setAction(user.changeUser.actionName);
    return this.$httpRequest({
      method: 'post',
      url: user.changeUser.value,
      data: options,
      logInfo: {
        description: `编辑用户【${options.loginName}】`,
        ...user.changeUser.logInfo[0]
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.changeUser.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.changeUser.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 删除用户
   * @param {*} options
   */
  deleteUser(options) {
    BaseStore.actionPanel.setAction(user.deleteUser.actionName);
    return this.$httpRequest({
      // type: 'query',
      method: 'POST',
      url: `${user.deleteUser.value}/${options.id}`,
      data: {
        id: options.id
      },
      logInfo: {
        description: `移除用户【${options.realName}】`,
        ...user.deleteUser.logInfo[0]
      }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.deleteUser.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.deleteUser.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 重置密码
   * @param {*} id
   */
  resetPassword(id) {
    BaseStore.actionPanel.setAction(user.resetPassword.actionName);
    return this.$httpRequest({
      method: 'POST',
      url: user.resetPassword.value.replace('<id>', id),
      data: { id }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.resetPassword.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.resetPassword.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 修改用户的状态
   * @param {*} id
   * @param {*} status
   * @param {*} loginName
   */
  changeUserStatus(id, status, loginName) {
    let logInfo = {
      description: `${status === 104405 ? '停用' : '启用'}用户【${loginName}】`,
      ...user.changeStatus.logInfo[0]
    };
    BaseStore.actionPanel.setAction(user.changeStatus.actionName);
    return this.$httpRequest({
      url: user.changeStatus.value,
      method: 'POST',
      data: {
        id,
        validState: status
      },
      logInfo
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.changeStatus.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.changeStatus.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 修改用户的手机号码
   * @param {*} data
   */
  changeMobile(data) {
    BaseStore.actionPanel.setAction(user.changeMobile.actionName);
    return this.$httpRequest({
      method: 'POST',
      url: user.changeMobile.value,
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.changeMobile.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.changeMobile.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 获取用户手机号
   * @param {*} data
   */
  getMobile(ids) {
    BaseStore.actionPanel.setAction(user.getMobile.actionName);
    return this.$httpRequest({
      method: 'POST',
      url: user.getMobile.value,
      data: { ids }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.getMobile.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.getMobile.actionName);
        return Promise.reject(e);
      });
  }
  /**
   * @desc 获取用户角色信息
   * @param {*} data
   */
  queryUserRoles(data) {
    BaseStore.actionPanel.setAction(user.queryUserRoles.actionName);
    return this.$httpRequest({
      method: 'POST',
      url: `${user.queryUserRoles.value}/${data.userId}`
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.queryUserRoles.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.queryUserRoles.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * 修改用户的头像
   * @param {*} data
   */
  changeUserAvatar(data) {
    BaseStore.actionPanel.setAction(user.changeUserAvatar.actionName);
    return this.$httpRequest({
      method: 'POST',
      url: user.changeUserAvatar.value,
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.changeUserAvatar.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.changeUserAvatar.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * 修改用户的地图配置
   * @param {*} data
   */
  changeZoomLevelCenter(data) {
    BaseStore.actionPanel.setAction(user.changeZoomLevelCenter.actionName);
    return this.$httpRequest({
      method: 'POST',
      url: user.changeZoomLevelCenter.value,
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.changeZoomLevelCenter.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.changeZoomLevelCenter.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * 获取用户的身份证
   * @param {*} id
   */
  getIdentityCard(ids) {
    BaseStore.actionPanel.setAction(user.getIdentityCard.actionName);
    return this.$httpRequest({
      method: 'POST',
      url: user.getIdentityCard.value,
      data: { ids }
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.getIdentityCard.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.getIdentityCard.actionName);
        return Promise.reject(e);
      });
  }

  getServerTimeStamp() {
    BaseStore.actionPanel.setAction(user.getServerTimeStamp.actionName);
    return this.$httpRequest({
      method: 'POST',
      url: user.getServerTimeStamp.value
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.getServerTimeStamp.actionName);
        return res.data;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.getServerTimeStamp.actionName);
        return Promise.reject(e);
      });
  }

  /**
   * @desc 上传 (运营中心和用户用)
   */
  uploadImg = (data) => {
    BaseStore.actionPanel.setAction(user.uploadImg.actionName);
    return this.$httpMultiPart({
      method: 'POST',
      url: user.uploadImg.value,
      data
    })
      .then(res => {
        BaseStore.actionPanel.removeAction(user.uploadImg.actionName);
        return res;
      })
      .catch(e => {
        BaseStore.actionPanel.removeAction(user.uploadImg.actionName);
        return Promise.reject(e);
      });
  }
}
export default new UserService();
