/*
 * @Author: laixi
 * @Date: 2018-10-21 21:50:40
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-29 18:17:44
 */
import { hasIntersection, isFunction } from "./utils";
import { getValueOfPath } from "./evalPath";
import { pathToArray } from "./parsePath";

/** 初始化属性观察者 */
export function initializeWatchers(ctx, watch) {
  let watchers = {};
  let cb, k;
  for (k in watch) {
    cb = watch[k];
    // 在构造配置中，只有定义了观察响应函数，才算有效观察。
    if (isFunction(cb)) {
      watchers[k] = {
        cb,
        value: getValueOfPath(ctx.data, k).value, // 缓存被观察属性的旧值
        path: pathToArray(k)
      };
    }
  }
  return watchers;
}

/**
 * @param {object} ctx Page/Component 实例
 * @param {*} changed
 */
export default function checkWatchers(ctx, changed) {
  let watchers = ctx.__watch;
  let watchKeys = watchers ? Object.keys(watchers) : [];
  let changedKeys = Object.keys(changed);
  let pathCache = {};
  let watcher;
  if (watchKeys.length && changedKeys.length) {
    for (let k in watchers) {
      watcher = watchers[k];
      let { cb, value, path } = watcher;
      for (let name in changed) {
        if (
          hasIntersection(
            path,
            pathCache[name] || (pathCache[name] = pathToArray(name))
          )
        ) {
          let newVal = getValueOfPath(ctx.data, k).value;
          if (newVal !== value) {
            watcher.value = newVal;
            setTimeout(() => cb.call(ctx, newVal, value));
          }
        }
      }
    }
  }
}
