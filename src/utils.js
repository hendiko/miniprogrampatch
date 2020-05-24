/*
 * @Author: laixi
 * @Date: 2018-10-20 13:17:17
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2020-05-24 16:12:22
 */
export const isObject = (obj) => obj !== null && "object" === typeof obj;
export const isFunction = (obj) => "function" === typeof obj;
export const isArray = (x) => x && x.constructor === Array;
export const isString = (x) => "string" === typeof x;

const _isNaN = (x) => typeof x === "number" && isNaN(x);

export const isEqual = (x, y) => {
  if (x === y) {
    return true;
  } else {
    return _isNaN(x) && _isNaN(y);
  }
};

export let nextTick = (fn) => setTimeout(fn, 10);

if (typeof wx !== "undefined") {
  if (wx.nextTick) {
    nextTick = (fn) => wx.nextTick(fn);
  }
}
