/*
 * @Author: Xavier Yin
 * @Date: 2019-04-28 21:51:57
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-29 09:55:46
 *
 * 使用路径表达式读写对象的属性值
 */

import parsePath, { composePath, compactPath } from "./parsePath";
import { isObject, isArray } from "./utils";

/**
 * 根据路径读取属性值
 * @param {object} obj 对象
 * @param {string} path 属性路径
 */
export function getValueOfPath(obj, path) {
  path += "";
  if (obj.hasOwnProperty(path)) {
    return { key: true, value: obj[path], path };
  } else {
    let sections = parsePath(path);
    path = compactPath(composePath(sections));
    let value, i, section;
    for (i = 0; i < sections.length; i++) {
      section = sections[i];
      if (isObject(obj) && obj.hasOwnProperty(section.key)) {
        value = obj[section.key];
        obj = value;
      } else {
        return { key: false, path };
      }
    }
    return { key: true, value, path };
  }
}

const whichType = obj => (isArray(obj) ? 1 : isObject(obj) ? 0 : -1);

/**
 * 根据路径设置对象的属性值。
 * @param {object} obj 根节点容器必需是一个对象。
 * @param {string} path 属性路径
 * @param {any} value 任何值
 */
export function setValueOfPath(obj, path, value) {
  let sections = parsePath(path + "");
  let parent, lastKey;
  for (let i = 0; i < sections.length; i++) {
    let { key, type } = sections[i];
    // 首次 if 判断必然为假
    if (whichType(obj) !== type) {
      obj = parent[lastKey] = type === 1 ? [] : {};
    }
    parent = obj;
    obj = parent[key];
    lastKey = key;
  }
  parent[lastKey] = value;
}
