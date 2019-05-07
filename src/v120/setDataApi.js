/*
 * @Author: Xavier Yin
 * @Date: 2019-05-07 15:49:50
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-07 16:32:02
 */

import { isObject } from "./utils";
import { evaluateComputed } from "./computed";
import { formatPath } from "./parsePath";
import { getValueOfPath } from "./evalPath";
import { checkWatchers } from "./watch";

function formatData(data) {
  let _data = {};
  for (var k in data) {
    _data[formatPath(k)] = data[k];
  }
  return _data;
}

function setDataApi(data, cb, options) {
  if (!isObject(data)) return;

  let { ctx } = options;
  let changing = ctx.__changing;
  ctx.__changing = true;

  if (!changing) {
    data = formatData(data);
    ctx.__tempComputedResult = { ...ctx.data };
  }

  evaluateComputed(ctx, data);

  if (changing) return;

  let _data = {};

  let k, observer;
  for (k in data) {
    let { key, value } = getValueOfPath(ctx.__tempComputedResult, k);
    if (key) {
      _data[k] = value;
    }
  }

  for (k in ctx.__computedObservers) {
    observer = ctx.__computedObservers[k];
    if (!data.hasOwnProperty(k)) {
      if (!observer.isShadowPath && observer.isDirty) {
        _data[k] = observer.newValue;
      }
    }
    observer.clean();
  }

  ctx.__setData(_data, cb);
  checkWatchers(ctx);
}

export default setDataApi;
