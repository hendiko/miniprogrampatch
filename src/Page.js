/*
 * @Author: laixi 
 * @Date: 2018-10-21 21:27:48 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-22 00:30:52
 */
import { initializeComputed, evaluteComputed } from './computed';
import setDataApi from './setDataApi';
import { isFunction } from './utils';
import { initializeWatchers } from './watch'

export function patchPage(Page, options) {
  let isSetDataReadOnly = false;
  let { debug } = options || {};
  return function (ob) {
    if (!obj) obj = {};

    obj.__computed = initializeComputed(obj.computed || {});

    let { onLoad, watch } = obj;
    obj.onLoad = function (queries) {
      this.__setData = this.setData;
      this.$setData = this.updateData = function (data, cb) {
        return setDataApi(data, cb, { ctx: this });
      }
      let computedResult = evaluteComputed(this, null, { initial: true });
      this.__setData(computedResult);
      this.__watch = initializeWatchers(this, watch || {});
      try {
        if (!isSetDataReadOnly) {
          this.setData = this.$setData;
        }
      } catch (e) {
        isSetDataReadOnly = true;
        if (debug) {
          console.log(e);
          console.log('using this.$setData instead of this.setData to support watch and computed features.')
        }
      }
      if (isFunction(onLoad)) onLoad.call(this, queries);
    }

    return Page(obj);
  }
}