import { cloneDeep } from 'lodash';
export function arrayFill(length, fill) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(typeof fill === 'object' ? cloneDeep(fill) : fill);
  }
  return arr;
}

export function arraySlice(list, current, size = 1) {
  return list.slice((current - 1) * size, current * size);
}

// 切割数组 1维变2维
export function arraySliceForX(arr, x = 3) {
  let newArr = [];
  for (let i = 0, l = arr.length; i < l; i++) {
    if (newArr.length === 0) {
      newArr.push([]);
    }
    if (newArr[newArr.length - 1].length > x - 1) {
      newArr.push([]);
    }
    newArr[newArr.length - 1].push(arr[i]);
  }
  return newArr;
}