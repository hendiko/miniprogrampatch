/*
 * @Author: laixi 
 * @Date: 2018-10-21 21:50:40 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-22 13:06:59
 */
import { isUpstream, pathToArray, result, isFunction } from './utils'

export function initializeWatchers(ctx, watch) {
  let watchers = {};
  let cb;
  for (let k in watch) {
    cb = watch[k];
    if (isFunction(cb)) {
      watchers[k] = { cb, value: result(ctx.data, k), path: pathToArray(k) }
    }
  }
  return watchers;
}


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
        if (isUpstream(path, pathCache[name] || (pathCache[name] = pathToArray(name)))) {
          let newVal = result(ctx.data, k);
          watcher.value = newVal;
          setTimeout(() => cb.call(ctx, newVal, value));
        }
      }
    }
  }
}