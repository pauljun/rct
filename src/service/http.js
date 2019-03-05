import fetchAxios from '@huangjingjing/axios-fetch';
// import { message } from 'antd';
import user from './url/user';

const config = {
  // baseURL: '/',
  timeout: 60 * 1000,
  xhrMode: 'fetch',
  headers: {
    Accept: 'application/json; charset=utf-8',
    'Content-Type': 'application/json; charset=utf-8'
  }
};

const $http = fetchAxios.create(config);
/**
 * 请求之前拦截动作
 */
$http.interceptors.request.use(
  response => {
    return response;
  },
  error => {
    console.error(error);
  }
);

/**
 * 请求之后拦截动作
 */
$http.interceptors.response.use(
  response => {
    const { data, config } = response;
    // 对响应数据做点什么
    if (data.code === 200000 || data.code === 200) {
      //状态200.304
      return data;
    } else {
      // TODO 身份验证失败
      if (data.code === 401000 || data.code === 401) {
        // message.error('登录状态已过期，请重新登录！');
        //window.BaseStore.user.logout();
        return Promise.reject(response);
      }

      //TODO 屏蔽手机号码验证的错误
      if (!(config.url === user.login.value && data.code === 50100)) {
        // message.error(data.message);
      }
      return Promise.reject(response);
    }
  },
  function httpUtilErrorRequest(error) {
    // 对响应错误做点什么
    // message.error('系统异常');
    return Promise.reject(error);
  }
);

const $httpMultiPartInstance = fetchAxios.create({
  xhrMode: 'fetch',
  timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

$httpMultiPartInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 对响应错误做点什么
    // message.error('系统异常');
    return Promise.reject(error);
  }
);

const $httpMultiPart = function(options = {}) {
  options.headers = Object.assign({}, { Authorization: Utils.getCache('token', 'session') }, options.headers);
  return $httpMultiPartInstance(options);
};

const $httpInstance = fetchAxios.create(config);
const $httpXMLInstance = function xhrRequest({ url, method = 'GET', data, headers, logInfo }) {
  // 保存日志
  if (logInfo && Object.keys(logInfo).length) {
    Service.logger && Service.logger.save(logInfo);
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    headers &&
      Object.keys(headers).map(key => {
        xhr.setRequestHeader(key, headers[key]);
      });
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        resolve(JSON.parse(xhr.response));
      }
      if (xhr.readyState === 4 && (xhr.status !== 200 || xhr.status !== 304)) {
        reject(xhr);
      }
    };
    xhr.send(data ? JSON.stringify(data) : null);
  });
};

export const $httpRequest = function({ url, type, data, method, headers, logInfo }) {
  let options = {};
  options.url = url;
  options.method = method || 'get';
  options.headers = Object.assign(
    {
      Authorization: Utils.getCache('token', 'session')
    },
    headers
  );

  if (type === 'query') {
    options.params = data || {};
  } else {
    options.data = data || {};
  }

  // 保存日志
  if (logInfo && Object.keys(logInfo).length) {
    // saveLog(logInfo)
    Service.logger && Service.logger.save(logInfo);
  }
  return $http(options);
};

export function httpRequest(component) {
  component.prototype.$http = $http;
  component.prototype.$httpRequest = $httpRequest;
  component.prototype.$httpMultiPart = $httpMultiPart;
  component.prototype.$httpInstance = $httpInstance;
  component.prototype.$httpXMLInstance = $httpXMLInstance;
  return component;
}
