/*
 * @Author: laixi
 * @Date: 2018-10-20 20:48:40
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-02-28 17:26:19
 */

import { isObject, result, setResult } from "./utils";
import { evaluateComputed } from "./computed";
import checkWatchers from "./watch";

function assignResult(obj, data) {
  for (let key in data) {
    setResult(obj, key, data[key]);
  }
}

export default function setDataApi(obj, cb, options) {
  if (!isObject(obj)) return;

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
    oldVal = result(ctx.__data, name).value;
    newVal = obj[name];
    if (oldVal !== newVal) {
      changed[name] = newVal;
    } else {
      ctx.__unchanged[name] = newVal;
    }
  }

  // save changed data
  Object.assign(ctx.__changed, changed);
  // save all data
  assignResult(ctx.__data, obj);
  // evaluate the computed data
  let computedResult = evaluateComputed(ctx, changed, { initial });
  // save changed computed data
  Object.assign(ctx.__changed, computedResult);
  // save all computed data
  assignResult(ctx.__data, computedResult);

  if (changing) return ctx.__data;

  // 判断键值是否仍然有效（可能被覆写了）
  let data = {};
  for (let k in ctx.__changed) {
    let { key, value } = result(ctx.__data, k);
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
