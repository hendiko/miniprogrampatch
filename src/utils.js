/*
 * @Author: laixi
 * @Date: 2018-10-20 13:17:17
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-21 13:58:53
 */
export const isObject = obj => obj !== null && "object" === typeof obj;
export const isFunction = obj => "function" === typeof obj;
export const isArray = x => x && x.constructor === Array;

const _isNaN = x => typeof x === "number" && isNaN(x);

export const isEqual = (x, y) => {
  if (x === y) {
    return true;
  } else {
    return _isNaN(x) && _isNaN(y);
  }
};
