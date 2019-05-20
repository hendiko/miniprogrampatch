/*
 * @Author: laixi
 * @Date: 2018-10-20 13:17:17
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-20 14:03:00
 */
export const isObject = obj => obj !== null && "object" === typeof obj;
export const isFunction = obj => "function" === typeof obj;
export const isArray = x => x && x.constructor === Array;

export const _isNaN = x => typeof x === "number" && isNaN(x);

export const isEqual = (x, y) => {
  if (x === y) {
    return true;
  } else {
    return _isNaN(x) && _isNaN(y);
  }
};

// 判断两个嵌套路径之间是否具有交集
export function hasIntersection(obj, target) {
  return obj[0] === target[0];
}
