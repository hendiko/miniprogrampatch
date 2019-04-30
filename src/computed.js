/*
 * @Author: laixi
 * @Date: 2018-10-20 20:50:50
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-30 09:35:35
 */

import { isObject, isFunction, hasIntersection } from "./utils";

import { getValueOfPath } from "./evalPath";

import { pathToArray, isSameRootOfPath } from "./parsePath";

// 判断 m 是否依赖于 n。
// 如果 m 依赖于 n，则返回 true，否则 false
function depends(m, n) {
  let { name } = n;
  for (var i = 0; i < m.require.length; i++) {
    // 在 m 的 require 列表中的依赖字段，其中任意一个包含了 n.name；
    // 则认为 m 依赖于 n。
    if (isSameRootOfPath(m.require[i], name)) return true;
  }
  return false;
}

/**
 * 计算依赖优先级
 * @param {array} list 数组成员格式 `{name:string, require:array, fn:function}`
 * @bug
 * 没有解决隐式依赖之间的关系
 */
function sortDeps(list) {
  let sorted = [];
  let item, isRequired, i, tmp, ii, index;
  while (list.length) {
    item = list.pop();
    isRequired = false;
    for (i in sorted) {
      // 检查已排序的属性，是否有隐式依赖于 item
      // 有的话，则从 sorted 中取出，使用 item 替代它的位置。
      if (depends(sorted[i], item)) {
        tmp = sorted.splice(i, sorted.length - i, item);
        for (ii in item.require) {
          // 检查剩余的暂存属性，是否有 item 的显式依赖。
          // 如果有，则取出放回到 list 中。
          index = tmp.findIndex(x => x.name === item.require[ii]);
          if (index > -1) {
            list.push(tmp.splice(index, 1)[0]);
          }
        }
        // 剩下的字段说明没有被 item 显式依赖，可以放回 sorted 并位于 item 之后
        sorted = sorted.concat(tmp);
        isRequired = true;

        // sorted 有变化，取消继续循环
        break;
      }
    }

    // sorted 中没有一个属性依赖于 item，可以安全放入 sorted 中。
    if (!isRequired) {
      sorted.push(item);
    }
  }
  return sorted;
}

/**
 * 初始化计算属性规则
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

/**
 * 演算计算属性值
 * @param {object} ctx Page/Component 实例
 * @param {object} changed 发生变化的属性键值对
 * @param {object} options 可选项
 */
export function evaluateComputed(ctx, changed, options) {
  let { initial } = options || {};
  let computedResult = {};
  let computed = ctx.__computed;

  let changedData;

  // 必需要先定义了计算规则
  if (computed && computed.length) {
    // 首次演算计算属性
    if (initial) {
      for (let i in computed) {
        let { fn, require: r, name } = computed[i];
        changedData = r.reduce((memo, item) => {
          // 首次演算是在实例初始化，此时未调用 $setData，ctx__data 属性中没有任何值。
          // 因此此时应该使用 ctx.data 求值
          let { key, value } = getValueOfPath(ctx.data, item);
          memo[item] = key ? value : getValueOfPath(computedResult, item).value;
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
                let { key, value } = getValueOfPath(computedResult, item);
                // 当 Component 的 prop 发生变化时，绕开了 $setData 方法触发数据更新
                // 此时的 ctx.__data 为 undefined 或者 null，需要使用 ctx.data 来推算新的 computed 结果
                memo[item] = key
                  ? value
                  : getValueOfPath(ctx.__data || ctx.data, item).value;
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
