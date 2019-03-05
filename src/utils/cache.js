import Cookie from 'js-cookie';
import moment from 'moment';
import { orderBy } from 'lodash';
/**
 * 获取缓存数据
 * @param {string} key
 * @param {string} type: 缓存类型 'local'(默认) / cookie / session;
 */
export function getCache(key, type = 'local') {
  let data;
  switch (type) {
    case 'cookie':
      data = Cookie.get(key);
      break;
    case 'session':
      let strS = sessionStorage.getItem(key);
      try {
        data = JSON.parse(strS);
      } catch (e) {
        data = strS;
      }
      break;
    default:
      let strL = localStorage.getItem(key);
      try {
        data = JSON.parse(strL);
      } catch (e) {
        data = strL;
      }
      break;
  }
  return data;
}

/**
 * 获取缓存数据
 * @param {string} key
 * @param {any} value
 * @param {string} type: 缓存类型 'local'(默认) / cookie / session;
 */
export function setCache(key, value, type = 'local') {
  switch (type) {
    case 'cookie':
      Cookie.set(key, value, { expires: 7 });
      break;
    case 'session':
      sessionStorage.setItem(key, JSON.stringify(value));
      break;
    default:
      localStorage.setItem(key, JSON.stringify(value));
      break;
  }
}

/**
 * 获取用户缓存
 * @param {*} key
 * @param {*} type
 */
export function getUserCache(key, type = 'local') {
  const id = BaseStore.user.userInfo.id;
  if (!id) {
    console.error('无法获取用户信息！');
    return;
  }
  return getCache(`${id}-${key}`, type);
}

/**
 * 设置用户缓存
 * @param {*} key
 * @param {*} value
 * @param {*} type
 */
export function setUserCache(key, value, type = 'local') {
  const id = BaseStore.user.userInfo.id;
  if (!id) {
    console.error('无法获取用户信息！');
    return;
  }
  return setCache(`${id}-${key}`, value, type);
}

const VALID_CACHE_KEY = 'VALID_CACHE';

export function setValidCache(key, value, expireTime) {
  if (!expireTime) {
    expireTime = moment()
      .add(7, 'days')
      .valueOf();
  }
  let data = getCache(VALID_CACHE_KEY) || {};
  data[key] = {
    value,
    expireTime,
    time: moment().valueOf()
  };

  setStorage(key, JSON.stringify(data), () => {
    let arr = Object.keys(data).map(key => {
      return {
        ...data[key],
        key
      };
    });
    let key = orderBy(arr, ['time'], ['asc'])[0].key;
    if (key) {
      delete data[key];
      setValidCache(key, value, expireTime);
    } else {
      localStorage.clear();
    }
  });
}

export function getValidCache(key) {
  let data = getCache(VALID_CACHE_KEY) || {};
  let result = data[key];
  return result ? result.value : null;
}

/**
 * 缓存设置，做限制处理
 * @param {string} key
 * @param {string} value
 * @param {function} limitErrorAction
 */
function setStorage(key, value, limitErrorAction) {
  try {
    localStorage.setItem(key, value);
  } catch (oException) {
    console.error(oException);
    if (oException.name == 'QuotaExceededError') {
      console.log('超出本地存储限额！');
      //如果历史信息不重要了，可清空后再设置
      // const keys = Object.getOwnPropertyNames(localStorage);
      // keys.map(key => {
      //   if (key.indexOf('_AMap') > -1) {
      //     localStorage.removeItem(key);
      //   }
      // });
      limitErrorAction();
    }
  }
}

