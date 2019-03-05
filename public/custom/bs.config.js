window.BSConfig = {
  openMultipleTabs: true,
  addressCode: '360100,江西,南昌',
  wifiDevice: 0, // 0关闭 1开启
  videoExpire:  3600 * 1000 * 24 * 2 , // 毫秒
  db: {
    version: 1,
    schema: {
      parameter: {
        key: { keyPath: 'id', autoIncrement: true },
        indexes: {
          time: {},
          expireTime: {},
          userId: { unique: false }
        }
      }
    }
  }
};
