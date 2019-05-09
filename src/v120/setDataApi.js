/*
 * @Author: Xavier Yin
 * @Date: 2019-05-07 15:49:50
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-08 15:00:41
 */

import { isObject } from "./utils";
import {
  evaluateComputed,
  cleanOwnersObservers,
  diffDataAfterComputing
} from "./computed";
import { formatPath } from "./parsePath";
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

  let { ctx, initial } = options;

  let changing = ctx.__changing;
  ctx.__changing = true;

  if (!changing) {
    ctx.__data = {};
    ctx.__tempComputedResult = { ...ctx.data };
  }

  data = formatData(data);
  Object.assign(ctx.__data, data);

  evaluateComputed(ctx, data);

  if (changing) return;

  let _data = diffDataAfterComputing(ctx, ctx.__data, initial);

  cleanOwnersObservers(ctx.__computedObservers);

  ctx.__data = null;
  ctx.__changing = false;
  ctx.__setData(_data, cb);
  checkWatchers(ctx);
}

export default setDataApi;
