/*
 * @Author: Xavier Yin
 * @Date: 2019-05-07 09:39:29
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-08 15:11:02
 */

import { getValueOfPath } from "./evalPath";
import { formatPath } from "./parsePath";
import { isObject, isFunction } from "./utils";

/**
 * 初始化 watch 能力
 * @param {object} owner 当前Page/Component实例
 * @param {object} watch watch 配置
 */
function initializeWatchers(owner, watch) {
  let watchers = {};
  if (isObject(watch)) {
    let cb, name;
    for (name in watch) {
      cb = watch[name];
      name = formatPath(name);
      if (isFunction(cb)) {
        watchers[name] = {
          cb,
          path: name,
          value: getValueOfPath(owner.data, name).value
        };
      }
    }
  }
  return watchers;
}

/**
 * 检查 watcher 状态，是否需要触发回调
 * @param {object} owner Page/Component 实例
 * @param {array} [paths] 指定检查的路径
 */
function checkWatchers(owner, ...paths) {
  let watchers = owner.__watchers;
  if (!watchers) return;

  paths = paths.map(path => formatPath(path));

  if (!paths.length) {
    paths = Object.keys(watchers);
  }

  let path, i;
  for (i = 0; i < paths.length; i++) {
    path = paths[i];
    let watcher = watchers[path];
    let { value: oldVal } = watcher;
    let { value } = getValueOfPath(owner.data, path);
    if (value !== oldVal) {
      watcher.value = value;
      setTimeout(() => watcher.cb.call(owner, value, oldVal));
    }
  }
}

module.exports = {
  checkWatchers,
  initializeWatchers
};
