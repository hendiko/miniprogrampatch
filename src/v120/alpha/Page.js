/*
 * @Author: laixi
 * @Date: 2018-10-21 21:27:48
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-21 09:37:41
 */
import {
  constructComputedFeature,
  calculateInitialComputedValues
} from "./computed";
import setDataApi from "./setDataApi";
import { isFunction } from "./utils";
import { constructWatchFeature } from "./watch";

/**
 * 封装页面构造函数
 * @param {function} Page 页面构造函数
 * @param {object} options
 */
export function patchPage(Page, options) {
  if (Page.__patchPage) return Page;
  let isSetDataReadOnly = false;
  let { debug } = options || {};

  // 封装页面构造函数
  let constructor = function(obj) {
    obj = Object.assign({}, obj);

    let { onLoad, watch, computed } = obj;

    // 封装 onLoad 钩子
    obj.onLoad = function(queries) {
      if (!this.$setData) {
        // 保留原始 setData 引用
        this.__setData = this.setData;
        this.$setData = this.updateData = function(data, cb) {
          return setDataApi(data, cb, { ctx: this });
        };

        constructComputedFeature(this, computed);

        let values = calculateInitialComputedValues(this);
        if (values) this.__setData(values);

        // 初始化 watch 规则
        constructWatchFeature(this, watch || {}, this.data);

        try {
          // 小程序 2.2.3 版本以后，覆写原始 setData 方法
          if (!isSetDataReadOnly) {
            this.setData = this.$setData;
          }
        } catch (e) {
          isSetDataReadOnly = true;
          if (debug) {
            console.log(e);
            console.log(
              "using this.$setData instead of this.setData to support watch and computed features."
            );
          }
        }
      }
      if (isFunction(onLoad)) onLoad.call(this, queries);
    };

    return Page(obj);
  };

  constructor.__patchPage = true;
  return constructor;
}
