import moment from 'moment';

window.db
  .open({
    server: 'lingmou',
    version: BSConfig.db.version,
    schema: BSConfig.db.schema
  })
  .then(function(s) {
    window.LM_DB_SERVER = s;
  });

export default {
  get(schemaName, id) {
    if (!id) {
      return Promise.reject({ message: '主键id不存在' });
    }
    return this.removeExpireData(schemaName).then(() => window.LM_DB_SERVER[schemaName].get(id));
  },
  add(schemaName, value, expireTime) {
    if (!expireTime) {
      expireTime = moment()
        .add(30, 'days')
        .valueOf();
    }
    if (!value.id) {
      return Promise.reject({
        message: '主键id不存在'
      });
    }
    value.userId = BaseStore.user.userInfo.id;
    value.expireTime = expireTime;
    return this.removeExpireData(schemaName).then(() => window.LM_DB_SERVER[schemaName].put(value));
  },
  remove(schemaName, ids) {
    return Promise.all(ids.map(id => window.LM_DB_SERVER[schemaName].remove(id)));
  },
  removeExpireData(schemaName) {
    return window.LM_DB_SERVER[schemaName]
      .query()
      .filter(item => item.expireTime < Date.now())
      .execute()
      .then(result => this.remove(schemaName, result.map(v => v.id)));
  },
  clear(schemaName) {
    return window.LM_DB_SERVER[schemaName].clear();
  },
  count(schemaName) {
    return window.LM_DB_SERVER[schemaName].count();
  },
  update(schemaName, ...args) {
    return this.removeExpireData(schemaName).then(() => window.LM_DB_SERVER[schemaName].update(...args));
  },
  query(schemaName) {
    return window.LM_DB_SERVER[schemaName]
      .query()
      .filter(v => v.userId === BaseStore.user.userInfo.id && v.expireTime < Date.now())
      .execute();
  },
  getServer() {
    return window.LM_DB_SERVER;
  }
};
