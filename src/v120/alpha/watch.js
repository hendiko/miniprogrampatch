/*
 * @Author: Xavier Yin
 * @Date: 2019-05-17 17:50:14
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-20 14:03:26
 */
import { getValueOfPath } from "./evalPath";
import { formatPath } from "./parsePath";
import { isObject, isFunction, isEqual } from "./utils";

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
