export default [
  {
    id: 1,
    title: '应用系统信息',
    component: require('./components/info').default,
    editComponent: require('./components/infoEdit').default
  },
  {
    id: 2,
    title: '配置系统模块',
    component: require('./components/roleMgr').default,
    editComponent: require('./components/roleMgr').default
  },
  {
    id: 3,
    title: '分配资源',
    component: require('./components/device').default,
    editComponent: require('./components/deviceEdit').default
  }
]