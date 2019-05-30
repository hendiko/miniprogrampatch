/*
 * @Author: Xavier Yin
 * @Date: 2019-05-17 16:40:50
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-30 16:20:32
 */

import { evaluateComputedResult, isPropPath } from "./computed";
import { getValueOfPath } from "./evalPath";
import { formatPath } from "./parsePath";
import { isObject } from "./utils";
import { checkWatchers } from "./watch";

// 将计算结果和输入项合并，得出最后发生变化的值
function combineData(observers, result = {}, input = {}) {
  let data = Object.assign({}, input);

  let k;
  for (k in input) {
    let { key, value } = getValueOfPath(result, k);
    if (key) {
      data[k] = value;
    }
  }

  let observer;
  for (k in observers) {
    observer = observers[k];
    if (!observer.readonly && observer.isAlive && observer.changed) {
      data[k] = observer.newVal;
    }
  }

  return data;
}

function formatData(input) {
  let data = {};
  for (let k in input) {
    data[formatPath(k)] = input[k];
  }
  return data;
}

function filterProps(data, props) {
  if (!props) return data;
  let _data = {};
  for (let k in data) {
    if (!isPropPath(props, k)) {
      _data[k] = data[k];
    }
  }
  return _data;
}

function setDataApi(data, cb, options) {
  if (isObject(data)) {
    let { ctx, isPropChange } = options;

    let changing = ctx.__changing;
    ctx.__changing = true;

    if (!changing) {
      ctx.__data = {};
      ctx.__tempComputedResult = Object.assign({}, ctx.data);
    }

    data = formatData(data);

    if (!isPropChange) {
      data = filterProps(data, ctx.__props);
    }

    Object.assign(ctx.__data, data);

    evaluateComputedResult(ctx, data);

    if (changing) return;

    data = filterProps(
      combineData(
        ctx.__computedObservers,
        ctx.__tempComputedResult,
        ctx.__data
      ),
      ctx.__props
    );

    for (let k in ctx.__computedObservers) {
      ctx.__computedObservers[k].clean();
    }

    ctx.__data = null;
    ctx.__changing = false;
    ctx.__setData(data, cb);
    checkWatchers(ctx);
  }
}

export default setDataApi;
