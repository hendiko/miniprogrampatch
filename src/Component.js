/*
 * @Author: laixi 
 * @Date: 2018-10-21 21:49:26 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-23 14:50:45
 */
import { initializeComputed, evaluateComputed } from './computed';
import setDataApi from './setDataApi';
import { isFunction } from './utils';
import checkWatchers, { initializeWatchers } from './watch'


function initializeProperties(props) {
  for (let name in props) {
    let prop = props[name];
    if (isFunction(prop) || prop === null) prop = props[name] = { type: prop };

    let { observer } = prop;

    prop.observer = function (newVal, oldVal, changedPath) {
      let computed = evaluateComputed(this, { [name]: newVal });
      if (Object.keys(computed).length) {
        this.$setData(computed);
      }
      checkWatchers(this, { [name]: newVal });
      if (isFunction(observer)) observer.call(this, newVal, oldVal, changedPath);
    }
  }
  return props;
}


export function patchComponent(Component, options) {
  if (Component.__patchComponent) return Component;
  let isSetDataReadOnly = false;
  let { debug } = options || {};
  let constructor = function (obj) {
    if (!obj) obj = {};
    obj.properties = initializeProperties(obj.properties || {});
    let { attached, watch } = obj.lifetimes || obj;


    let _attached = function () {
      this.__setData = this.setData;
      this.$setData = this.updateData = function (data, cb) {
        return setDataApi(data, cb, { ctx: this });
      }
      this.__computed = initializeComputed(obj.computed || {});
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
      if (isFunction(attached)) attached.apply(this, arguments);
    }

    if (obj.lifetimes) {
      obj.lifetimes.attached = _attached;
    } else {
      obj.attached = _attached;
    }

    return Component(obj);
  }

  constructor.__patchComponent = true;
  return constructor;
}