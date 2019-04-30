/*
 * @Author: laixi
 * @Date: 2018-10-21 21:49:26
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-24 14:34:07
 */
import { initializeComputed, evaluateComputed } from "./computed";
import setDataApi from "./setDataApi";
import { isFunction, isObject } from "./utils";
import checkWatchers, { initializeWatchers } from "./watch";

/**
 * 封装（重新定义）构造配置中的 properties 属性。
 * @param {object} props 构造配置中的 properties 属性值
 */
function initializeProperties(props) {
  for (var name in props) {
    let prop = props[name];
    // 如果构造配置中使用 `{propName<string>: constructor<function>}` 格式来定义 prop，
    // 那么将它转换为 `{prop<string>: config<object>}` 格式
    if (isFunction(prop) || prop === null) prop = props[name] = { type: prop };

    // 获取原始配置中的 observer 值
    let { observer } = prop;

    // 重新定义 prop 配置中的 observer 值
    prop.observer = function(newVal, oldVal, changedPath) {
      // 计算当前组件/页面的 prop 的变化是否引起了 computed 值变化
      let computed = evaluateComputed(this, { [name]: newVal });
      if (Object.keys(computed).length) {
        // 如果 computed 属性发生变化，则重新设置相关属性值。
        this.$setData(computed);
      }
      // 触发观察函数调用(the handler will be called in asynchronous way)
      checkWatchers(this, { [name]: newVal });
      // 如果 prop 中定义了 observer 函数，则触发该函数调用。
      if (isFunction(observer))
        observer.call(this, newVal, oldVal, changedPath);
    };
  }
  return props;
}

/**
 * 为小程序组件打补丁
 * @param {function} Component 小程序组件构造函数
 * @param {object} options 可选项
 */
export function patchComponent(Component, options) {
  // 如果已经打过补丁，则直接返回组件构造函数
  if (Component.__patchComponent) return Component;

  // 检查组件方法 setData 是否是只读
  // (小程序v2.2.2以下版本 setData 方法是只读的)
  let isSetDataReadOnly = false;
  let { debug } = options || {};

  // 创建一个新的高阶函数(High-Order Function)作为组件构造函数
  let constructor = function(obj) {
    obj = Object.assign({}, obj);
    obj.properties = initializeProperties(obj.properties || {});

    let { attached, created, watch, lifetimes } = obj;

    // 小程序组件配置 lifetimes 中如果定义了生命钩子，将被优先使用。
    if (isObject(lifetimes)) {
      if (lifetimes.hasOwnProperty("attached")) {
        attached = lifetimes.attached;
      }
      if (lifetimes.hasOwnProperty("created")) {
        created = lifetimes.created;
      }
    }

    // 封装 created 钩子
    let _created = function() {
      /**
       * 按照官方文档的说明，在组件的 `created` 钩子中组件实例刚刚被创建，是不能在此生命周期中调用 `setData` 方法的。
       * (经测试，在 created 生命周期内存在 `this.setData` 方法，但该方法并不是 `attached` 之后的 `this.setData`。)
       * 但是 properties 的 observer 函数可能会在 `created` 之后，`attached` 之前被调用。
       * (如果 property 的缺省值和接收值不同，小程序初始化 property 时就会触发一次 observer）
       * 而小程序并未暴露该时刻的生命钩子，如果此时在 `observer` 中调用了 `this.$setData` 方法，会因为该方法不存在而报错。
       * 因此此时需要做一个临时的 `this.$setData` 方法，而该方法等效于小程序原装的 `this.setData` 方法。
       *
       * 为什么不在此时开始初始化 `miniprogrampatch` 提供的 `$setData` 方法（或者直接调用 setDataApi）？
       *
       * 因为此时的 computed 属性尚未开始初始化，且我认为小程序不应该在此时触发 property 的 `observer` 回调。
       * 如果此时初始化 `$setData` 或调用 `setDataApi` 会导致 `watchers` 检查，因此此处只做一个容错的临时 `this.$setData` 方法。
       *
       * 关于`自定义组件初始化时因为默认值不同导致 prop 的 observer 被调用`的质疑，参见 https://developers.weixin.qq.com/community/develop/doc/0006cc062dc7e032e48791c825b800
       *
       * 注：小程序 2.6.1 版本之后在 Component 构造函数的配置中提供了 `observers` 字段用来监测数据变化，建议不要再使用 property 中的 `observer` 字段。
       */
      if (!this.$setData) {
        // 临时性的 `$setData` 和 `updateData`。
        this.$setData = this.updateData = function() {
          return this.setData.apply(this, arguments);
        };
      }

      // 如果定义了函数 created 钩子，才执行（小程序原生行为并未检查 created 钩子合法性，如果定义了非函数钩子，则直接报错）
      if (isFunction(created)) created.apply(this, arguments);
    };

    // 封装 attached 钩子
    let _attached = function() {
      // 初始化 $setData 方法。
      if (!(this.$setData && this.$setData.__attached)) {
        // 保留原始 setData 的引用。
        this.__setData = this.setData;
        this.$setData = this.updateData = function(data, cb) {
          return setDataApi(data, cb, { ctx: this });
        };

        // 用来标识这个 $setData 不是 created 钩子中的临时方法。
        this.$setData.__attached = true;

        // 初始化计算属性的配置
        this.__computed = initializeComputed(obj.computed || {});
        // 初始化 computed 各个属性值
        let computedResult = evaluateComputed(this, null, { initial: true });
        this.__setData(computedResult);
        // 初始化 watch 配置
        this.__watch = initializeWatchers(this, watch || {});

        try {
          // 小程序 2.2.3 版本以后，覆写 `this.setData` 方法。
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
      // 如果定义了函数 attached 钩子，才执行（小程序原生行为并未检查 attached 钩子合法性，如果定义了非函数钩子，则直接报错）
      if (isFunction(attached)) attached.apply(this, arguments);
    };

    if (obj.lifetimes) {
      obj.lifetimes.attached = _attached;
      obj.lifetimes.created = _created;
    } else {
      obj.attached = _attached;
      obj.created = _created;
    }

    return Component(obj);
  };

  constructor.__patchComponent = true;

  return constructor;
}
