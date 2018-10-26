/*
 * @Author: laixi 
 * @Date: 2018-10-21 21:49:26 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-26 18:47:11
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
    obj = Object.assign({}, obj);
    obj.properties = initializeProperties(obj.properties || {});
    let { attached, created, watch } = obj.lifetimes || obj;

    let beforeCreated = true;
    let _created = function () {
      if (beforeCreated) {
        beforeCreated = false;
        // 小程序在初始化 prop 时，如果初始参数和定义的缺省值不同，会触发一次 observer
        // 但此时 $setData 还未挂载，因此在 created 中先做一个 setData 快捷调用方式
        // 此处不能 this.$setData = this.setData，因为此时的 this.setData 也不是 created 之后的 setData
        // 不在此时使用 setDataApi 可以避免触发 watcher 检查
        this.$setData = function () {
          return this.setData.call(this, arguments);
        }
      }
      if (isFunction(created)) created.apply(this, arguments);
    };

    let beforeAttached = true;
    let _attached = function () {
      if (beforeAttached) {
        beforeAttached = false;
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
      }
      if (isFunction(attached)) attached.apply(this, arguments);
    }

    if (obj.lifetimes) {
      obj.lifetimes.attached = _attached;
      obj.lifetimes.created = _created;
    } else {
      obj.attached = _attached;
      obj.created = _created;
    }

    return Component(obj);
  }

  constructor.__patchComponent = true;
  return constructor;
}