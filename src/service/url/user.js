import config from '../config';
const { api, version } = config;
export default {
  userModule: {
    text: '用户管理',
    code: 104400
  },
  enterUserModule: {
    text: '进入用户管理界面',
    code: 104499,
    parent: 104400,
    moduleName: 'UserView'
  },
  login: {
    value: `${api}user/${version}/login`,
    label: '用户登录',
    actionName: 'login',
    logInfo: [
      {
        code: 103801,
        parent: 103800,
        text: '登录系统'
      }
    ]
  },
  sendVerifyCode: {
    value: `${api}user/${version}/sendVerifyCode`,
    actionName: 'sendVerifyCode',
    label: '发送验证码'
  },
  loginOut: {
    value: `${api}user/${version}/loginOut`,
    label: '登出',
    actionName: 'loginOut'
  },
  userInfo: {
    value: `${api}user/${version}/users/<id>`,
    label: '用户信息',
    actionName: 'userInfo',
    logInfo: [
      {
        code: 104401,
        parent: 104400,
        text: '查看用户信息'
      }
    ]
  },
  queryUsers: {
    value: `${api}user/${version}/queryUsers`,
    actionName: 'queryUsers',
    label: '用户列表'
  },
  addUser: {
    value: `${api}user/${version}/addUser`,
    actionName: 'addUser',
    label: '新增用户',
    logInfo: [
      {
        code: 104402,
        parent: 104400,
        text: '新增用户'
      }
    ]
  },
  changeUser: {
    value: `${api}user/${version}/changeUser`,
    actionName: 'changeUser',
    label: '编辑用户',
    logInfo: [
      {
        code: 104403,
        parent: 104400,
        text: '编辑用户'
      }
    ]
  },
  deleteUser: {
    value: `${api}user/${version}/deleteUser`,
    actionName: 'deleteUser',
    label: '删除用户',
    logInfo: [
      {
        code: 104404,
        parent: 104400,
        text: '移除用户'
      }
    ]
  },
  changePassword: {
    value: `${api}user/${version}/changePassword`,
    label: '修改密码',
    actionName: 'changePassword'
  },
  resetPassword: {
    value: `${api}user/${version}/resetPassword/<id>`,
    label: '密码重置',
    actionName: 'resetPassword'
  },
  changeStatus: {
    value: `${api}user/${version}/changeStatus`,
    actionName: 'changeUserStatus',
    label: '停用/启用用户',
    logInfo: [
      {
        code: 104405,
        parent: 104400,
        text: '停用/启用用户'
      }
    ]
  },
  changeUserAvatar: {
    value: `${api}user/${version}/changeUserAvatar`,
    actionName: 'changeUserAvatar',
    label: '用户头像修改'
  },
  getIdentityCard: {
    value: `${api}user/${version}/getIdentityCard`,
    actionName: 'getIdentityCard',
    label: '根据用户ID查询用户身份证'
  },
  changeZoomLevelCenter: {
    value: `${api}user/${version}/changeZoomLevelCenter`,
    actionName: 'changeZoomLevelCenter',
    label: '修改用户地图放大级别中心点'
  },
  getSystemInfo: {
    value: `${api}user/${version}/systemInfo/<id>`,
    actionName: 'getSystemInfo',
    label: '获得用户地图放大级别中心点'
  },
  getMobile: {
    value: `${api}user/${version}/getMobile`,
    actionName: 'getMobile',
    label: '根据用户ID查询用户电话号码'
  },
  changeMobile:{
    value: `${api}user/${version}/changeMobile`,
    actionName: 'changeMobile',
    label: '用户手机号码修改'
  },
  queryPrivilegeUsers: {
    value: `${api}user/${version}/queryPrivilegeUsers`,
    actionName: 'queryPrivilegeUsers',
    label: '查询具有某权限的所有用户'
  },
  getServerTimeStamp: {
    value: `${api}user/${version}/getServerTimeStamp`,
    actionName: 'getServerTimeStamp',
    label: '获取系统当前时间'
  },
  uploadImg: {
    value: `${api}user/${version}/img/uploadImg`,
    actionName: 'userUploadImg',
    label: '用户模块图片上传'
  },
  queryUserRoles: {
    value: `${api}user/role/${version}/queryUserRoles`,
    actionName: 'queryUserRoles',
    label: '用户角色信息'
  },
  panelSetting: {
    code: 107101,
    parent: 107100,
    text: '设置展示面板'
  },
  mediaLibModule: {
    text: '我的视图',
    code: 107300
  },
  addMediaLibImg: {
    text: '添加图片',
    code: 107301,
    parent: 107300
  },
  addMediaLibVideo: {
    text: '添加视频',
    code: 107302,
    parent: 107300
  },
  deleteMediaLibImg: {
    text: '删除图片',
    code: 107303,
    parent: 107300
  },
  deleteMediaLibVideo: {
    text: '删除视频',
    code: 107304,
    parent: 107300
  },
};
