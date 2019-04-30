/*
 * @Author: laixi
 * @Date: 2018-10-20 20:48:40
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-29 10:05:27
 */

import { isObject } from "./utils";
import { evaluateComputed } from "./computed";
import checkWatchers from "./watch";
import { getValueOfPath, setValueOfPath } from "./evalPath";

/**
 * 快速设置 `key:value` 形式传参的属性
 * @param {object} obj
 * @param {object} data
 */
function assignResult(obj, data) {
  for (var key in data) {
    setValueOfPath(obj, key, data[key]);
  }
}

/**
 * `miniprogrampatch` 提供的 `setData` 方法的内部实现
 * @param {object} obj key-value 格式的待设置属性值
 * @param {function} cb 设置属性之后的回调
 * @param {object} options 可选项
 */
export default function setDataApi(obj, cb, options) {
  if (!isObject(obj)) return;

  // ctx: Page/Component 实例
  // initial: 是否是首次设置
  let { ctx, initial } = options;
  let changing = ctx.__changing;
  ctx.__changing = true;

  if (!changing) {
    ctx.__data = { ...ctx.data };
    ctx.__changed = {};
    ctx.__unchanged = {};
  }

  let keys = Object.keys(obj);
  let changed = {};
  let oldVal, newVal, name;
  for (let i = 0; i < keys.length; i++) {
    name = keys[i];
    oldVal = getValueOfPath(ctx.__data, name).value;
    newVal = obj[name];
    if (oldVal !== newVal) {
      changed[name] = newVal;
    } else {
      ctx.__unchanged[name] = newVal;
    }
  }

  // 暂存所有发生变化的属性
  Object.assign(ctx.__changed, changed);
  // 暂存所有新设置的属性
  assignResult(ctx.__data, obj);
  // 演算计算属性
  let computedResult = evaluateComputed(ctx, changed, { initial });
  // 缓存所有可能发生变化的计算属性
  Object.assign(ctx.__changed, computedResult);
  // 暂存所有新计算出来的属性
  assignResult(ctx.__data, computedResult);

  if (changing) return ctx.__data;

  // 判断键值是否仍然有效（可能被覆写了）
  let data = {};
  for (let k in ctx.__changed) {
    let { key, value } = getValueOfPath(ctx.__data, k);
    if (key) {
      data[k] = value;
    }
  }

  let all = Object.assign(ctx.__unchanged, data);

  ctx.__changing = false;
  ctx.__data = null;
  ctx.__changed = null;
  ctx.__unchanged = null;

  ctx.__setData(all, cb);
  checkWatchers(ctx, data);
}
