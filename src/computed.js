/*
 * @Author: laixi 
 * @Date: 2018-10-20 20:50:50 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-24 11:18:13
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
  if (computed && computed.length) {
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
                // 当 Component 的 prop 发生变化时，绕开了 $setData 方法触发数据更新
                // 此时的 ctx.__data 为 undefined 或者 null，需要使用 ctx.data 来推算新的 computed 结果
                memo[item] = key ? value : result(ctx.__data || ctx.data, item).value;
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