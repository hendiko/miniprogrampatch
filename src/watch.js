/*
 * @Author: Xavier Yin
 * @Date: 2019-05-17 17:50:14
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-21 14:04:46
 */
import { getValueOfPath } from "./evalPath";
import { formatPath } from "./parsePath";
import { isObject, isFunction, isEqual } from "./utils";

/**
 * 构建观察能力
 * @param {object} owner page/componnent
 * @param {object} watchDefinition watch 配置
 * @param {object} initialData 初始值
 */
function constructWatchFeature(owner, watchDefinition, initialData) {
  let watchers = (owner.__watchers = {});
  if (isObject(watchDefinition)) {
    let cb, name;
    for (name in watchDefinition) {
      cb = watchDefinition[name];
      if (isFunction(cb)) {
        name = formatPath(name);
        watchers[name] = {
          cb,
          path: name,
          value: getValueOfPath(initialData, name).value
        };
      }
    }
  }
}

/**
 * 检查观察属性是否发生变化以便触发事件回调
 * @param {object} owner page/component
 * @param  {...any} paths 指定需要检查的路径
 */
function checkWatchers(owner, ...paths) {
  let watchers = owner.__watchers;
  if (watchers) {
    paths = paths.length
      ? paths.map(path => formatPath(path))
      : Object.keys(watchers);

    let path, i;
    for (i = 0; i < paths.length; i++) {
      path = paths[i];
      let watcher = watchers[path];
      let old = watcher.value;
      let { value } = getValueOfPath(owner.data, path);
      if (!isEqual(old, value)) {
        watcher.value = value;
        setTimeout(() => watcher.cb.call(owner, value, old));
      }
    }
  }
}

module.exports = {
  constructWatchFeature,
  checkWatchers
};
