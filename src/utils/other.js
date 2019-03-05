
import { cloneDeep } from 'lodash';
export function toMoney(num) {
  num = num.toFixed(2);
  num = parseFloat(num);
  num = num.toLocaleString();
  return num; //返回的是字符串23,245.12保留2位小数
}
/**
 * 文字超出中间省略号
 * @param {string} str
 */
export function getSubStr(str, number = 4) {
  if (str.length > number * 2) {
    let arr1 = str.substr(0, number);
    let arr2 = str.substr(str.length - number, number);
    return `${arr1}...${arr2}`;
  } else {
    return str;
  }
}


export function getMakerIndex() {
  let index = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(
    ','
  );
  let arr = cloneDeep(index);
  let a = cloneDeep(index);
  let b = cloneDeep(index);
  a.forEach(v1 => {
    b.forEach(v2 => {
      arr.push(`${v1}${v2}`);
    });
  });
  return arr;
}