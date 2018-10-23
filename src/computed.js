/*
 * @Author: laixi 
 * @Date: 2018-10-20 20:50:50 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-22 18:37:09
 */


import { isObject, isFunction, result, isUpstream, pathToArray } from './utils'


/**
 * 初始化计算属性配置
 */
export function initializeComputed(computed) {
  let data = [];
  let key, value;
  for (key in computed) {
    value = computed[key];
    if (isFunction(value)) {
      data.push({ name: key, require: [], fn: value });
    } else if (isObject(value)) {
      let { require = [], fn } = value;
      if (isFunction(fn)) {
        data.push({ name: key, require, fn });
      }
    }
  }
  if (data.length > 1) {
    data.sort((m, n) => {
      if (~n.require.indexOf(m.name)) {
        return -1;
      } else if (~m.require.indexOf(n.name)) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  return data;
}

export function evaluateComputed(ctx, changed, options) {
  let { initial } = options || {};
  let computedResult = {};
  let computed = ctx.__computed;

  let changedData;
  if (computed.length) {
    if (initial) {
      for (let i in computed) {
        let { fn, require: r, name } = computed[i];
        changedData = r.reduce((memo, item) => {
          let { key, value } = result(ctx.data, item);
          memo[item] = key ? value : result(computedResult, item).value;
          return memo;
        }, {});
        computedResult[name] = fn.call(ctx, changedData);
      }
    } else {
      let changedKeys = Object.keys(changed);
      if (changedKeys.length) {
        let pathCache = {};
        let changedPaths = changedKeys.map(item => pathCache[item] = pathToArray(item));
        for (let i in computed) {
          let { fn, require: r, name } = computed[i];
          if (r.length) {
            let needUpdate = false;
            let requiredName, requirePath;
            for (let m in r) {
              requiredName = r[m];
              requirePath = pathCache[requiredName] || (pathCache[requiredName] = pathToArray(requiredName));
              if (~changedPaths.findIndex(path => isUpstream(requirePath, path))) {
                changedPaths.push(pathCache[name] || (pathCache[name] = pathToArray(name)));
                needUpdate = true;
                break;
              }
            }
            if (needUpdate) {
              changedData = r.reduce((memo, item) => {
                let { key, value } = result(computedResult, item);
                memo[item] = key ? value : result(ctx.__data, item).value;
                return memo;
              }, {});
              computedResult[name] = fn.call(ctx, changedData);
            }
          }
        }
      }
    }
  }
  return computedResult;
}