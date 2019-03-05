/**
 * 处理location.search的方法,将字符串转换成json
 * @param {string} search
 */
export function queryFormat(search = '') {
  let params = {};
  if (search && search.length) {
    search = search.indexOf('?') < 0 ? search : search.substr(1);
    let a = search.split('&');
    let b = a.map(v => v.split('='));
    b.map(v => (params[v[0]] = v[1]));
  }
  return params;
}

// 编码解码url地址（地址若包含'&'符，会导致参数解析出错）
export function escapeUrl(url, isEscape = true) {
  return (url = isEscape ? escape(url) : unescape(url));
}

/**
 * @desc 对象转化为&连接符拼接
 */
export function objectToUrl(params){
  let url = ''
  for(var i in params){
    if(params[i]){
      url += `${i}=${params[i]}&`
    }
  }
  return url.substr(0, url.length-1)
}

const regCros = new RegExp(`^${window.location.origin}`);
export function isCrosUrl(path) {
  return regCros.test(path);
}