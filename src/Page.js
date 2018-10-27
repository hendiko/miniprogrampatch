/*
 * @Author: laixi 
 * @Date: 2018-10-21 21:27:48 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-27 19:46:03
 */
import { initializeComputed, evaluateComputed } from './computed';
import setDataApi from './setDataApi';
import { isFunction } from './utils';
import { initializeWatchers } from './watch'

export function patchPage(Page, options) {
  if (Page.__patchPage) return Page;
  let isSetDataReadOnly = false;
  let { debug } = options || {};

  let constructor = function (obj) {
    obj = Object.assign({}, obj);
    obj.__computed = initializeComputed(obj.computed || {});

    let { onLoad, watch } = obj;
    obj.onLoad = function (queries) {
      if (!this.$setData) {
        this.__setData = this.setData;
        this.$setData = this.updateData = function (data, cb) {
          return setDataApi(data, cb, { ctx: this });
        }
        let computedResult = evaluateComputed(this, null, { initial: true });
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
      }
      if (isFunction(onLoad)) onLoad.call(this, queries);
    }

    return Page(obj);
  }

  constructor.__patchPage = true;
  return constructor;
}