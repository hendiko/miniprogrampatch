/*
 * @Author: laixi
 * @Date: 2018-10-20 13:17:17
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-29 18:25:07
 */
export const isObject = obj => obj !== null && "object" === typeof obj;
export const isFunction = obj => "function" === typeof obj;
export const isArray = x => x && x.constructor === Array;

// export const isString = obj => "string" === typeof obj;
// export const trim = str => str.replace(/(^\s+)|(\s+$)/g, "");

// 判断两个嵌套路径之间是否具有交集
export function hasIntersection(obj, target) {
  return obj[0] === target[0];
}
