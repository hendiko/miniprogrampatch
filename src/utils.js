/*
 * @Author: laixi
 * @Date: 2018-10-20 13:17:17
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-03-07 11:41:09
 */

export const isObject = obj => obj !== null && "object" === typeof obj;
export const isFunction = obj => "function" === typeof obj;
export const isString = obj => "string" === typeof obj;
export const isArray = x => x && x.constructor === Array;
export const trim = str => str.replace(/(^\s+)|(\s+$)/g, "");

const trimDot = str => str.replace(/^\.|\.$/g, "");
const startsWithSquare = str => /^\[/.test(str);
const startsWithDot = str => /^\./.test(str);

/**
 * 解析路径式的属性名称
 * @param {string} path 属性名称（允许dot分隔）
 * @param {*} names
 */
function parsePath(path, names = []) {
  path = trim(path);
  if (startsWithDot(path)) {
    path = trimDot(path);
    return parsePath(path, names);
  } else if (startsWithSquare(path)) {
    let name = /^\[(\d+)\]/.exec(path);
    if (name) {
      names.push({ name: name[1], type: "array" });
      if (name[0] === path) {
        return names;
      } else {
        return parsePath(path.slice(name[0].length), names);
      }
    } else {
      throw Error("Only number 0-9 could inside []");
    }
  } else {
    let name = /^([^\[\.]+)/.exec(path);
    if (name) {
      names.push({ name: name[1], type: "object" });
      if (name[0] === path) {
        return names;
      } else {
        return parsePath(path.slice(name[0].length), names);
      }
    } else {
      return names;
    }
  }
}

export const pathToArray = path => parsePath(path).map(item => item.name);

// 调用场景中会保证 obj 为 object，path 为 string，
// 因此本函数不再检查数据类型。
export function result(obj, path) {
  if (!obj) return { key: false };
  if (obj.hasOwnProperty(path)) {
    return { key: true, value: obj[path], path: [path] };
  } else {
    path = pathToArray(path);
    let value;
    for (let i in path) {
      if (isObject(obj) && obj.hasOwnProperty(path[i])) {
        value = obj[path[i]];
        obj = value;
      } else {
        return { key: false };
      }
    }
    return { key: true, value, path };
  }
}

function _whichType(obj) {
  return isArray(obj) ? "array" : isObject(obj) ? "object" : "other";
}

export function setResult(obj, path, value) {
  let root = obj;
  path = parsePath(path);
  let parent, lastName;
  if (!path.length) throw Error("Path can not be empty");
  for (let i in path) {
    let { name, type } = path[i];

    if (i == 0) {
      if (type === "array") {
        throw Error("Path can not start with []");
      }
    } else {
      if (_whichType(obj) !== type) {
        obj = parent[lastName] = type === "array" ? [] : {};
      }
    }
    parent = obj;
    obj = parent[name];
    lastName = name;
  }
  parent[lastName] = value;
  return root;
}

// 判断两个嵌套路径之间是否具有交集
export function hasIntersection(obj, target) {
  return obj[0] === target[0];
}
