/*
 * @Author: laixi
 * @Date: 2018-10-20 20:50:50
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-03-01 09:53:15
 */

import {
  isObject,
  isFunction,
  result,
  hasIntersection,
  pathToArray
} from "./utils";

// 如果 m 依赖于 n，则返回 true，否则 false
function depends(m, n) {
  return !!~m.require.indexOf(n.name);
}

// 计算依赖优先级
function sortDeps(list) {
  let tmp = [];
  let item, broken, i, tmp2, ii, index;
  while (list.length) {
    item = list.pop();
    broken = false;
    for (i in tmp) {
      if (depends(tmp[i], item)) {
        tmp2 = tmp.splice(i, tmp.length - i, item);
        for (ii in item.require) {
          index = tmp2.findIndex(x => x.name === item.require[ii]);
          if (index > -1) {
            list.push(tmp2.splice(index, 1)[0]);
          }
        }
        tmp = tmp.concat(tmp2);
        broken = true;
        break;
      }
    }
    if (!broken) {
      tmp.push(item);
    }
  }
  return tmp;
}

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
    data = sortDeps(data);
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
        let changedPaths = changedKeys.map(
          item => (pathCache[item] = pathToArray(item))
        );
        for (let i in computed) {
          let { fn, require: r, name } = computed[i];
          if (r.length) {
            let needUpdate = false;
            let requiredName, requirePath;
            for (let m in r) {
              requiredName = r[m];
              requirePath =
                pathCache[requiredName] ||
                (pathCache[requiredName] = pathToArray(requiredName));
              if (
                ~changedPaths.findIndex(path =>
                  hasIntersection(requirePath, path)
                )
              ) {
                changedPaths.push(
                  pathCache[name] || (pathCache[name] = pathToArray(name))
                );
                needUpdate = true;
                break;
              }
            }
            if (needUpdate) {
              changedData = r.reduce((memo, item) => {
                let { key, value } = result(computedResult, item);
                // 当 Component 的 prop 发生变化时，绕开了 $setData 方法触发数据更新
                // 此时的 ctx.__data 为 undefined 或者 null，需要使用 ctx.data 来推算新的 computed 结果
                memo[item] = key
                  ? value
                  : result(ctx.__data || ctx.data, item).value;
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
