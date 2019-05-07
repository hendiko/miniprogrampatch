/*
 * @Author: Xavier Yin
 * @Date: 2019-04-30 09:46:15
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-07 17:23:08
 */

import parsePath, { composePath, compactPath, formatPath } from "./parsePath";
import { getValueOfPath, setValueOfPath } from "./evalPath";
import { isObject, isFunction } from "./utils";

// 观察者队列允许最多被消费次数
const MAX_TIMES_OF_CALLING_OBSERVER_IN_A_QUEUE = 100000;

class ComputeError extends Error {
  constructor(message, ...params) {
    super(message, ...params);
    this.name = "MiniprogrampatchComputeError";
  }
}

/**
 * 封装属性使之具备观察能力
 */
class Observer {
  /**
   * 构造函数
   * @param {object} owner Page/Component 实例
   * @param {string} name 属性名称
   * @param {array} [require] 依赖的属性名称数组
   * @param {function} [fn] 计算函数
   */
  constructor(owner, name, require, fn) {
    this.name = name;
    this.require = require || [];
    this.fn = fn;

    this.owner = owner;

    this.oldValue = void 0; // 上一次 setData 结束后的值。
    this.tempValue = void 0; // 本次 setData 中保存的旧值。
    this.newValue = void 0; // 即将保存的新值。

    this.observers = []; // 依赖于当前属性的其他属性的 Observer 对象

    this.sections = parsePath(name); // 保存路径节点
  }

  get isDirty() {
    return this.oldValue !== this.newValue;
  }

  /**
   * 是否是影子路径，是指该路径赋值已被其他路径赋值所覆盖，因此影子路径不应被 setData。
   */
  get isShadowPath() {
    return !getValueOfPath(this.owner.__tempComputedResult, this.name).key;
  }

  /**
   * 是否是根节点属性观察者
   */
  get isRootObserver() {
    return this.sections.length === 1;
  }

  /**
   * 获取当前属性根节点观察者
   */
  get rootObserver() {
    return this.owner.__computedObservers[this.sections[0].key];
  }

  /**
   * 清除脏数据状态
   */
  clean() {
    this.oldValue = this.newValue;
  }

  /**
   * 计算属性值
   */
  compute() {
    // 如果被观察属性有计算函数，则使用计算函数求值。
    if (this.fn) {
      let args = this.require.reduce((memo, name) => {
        // 使用依赖属性的缓存值 `newValue`，避免循环/重复调用计算函数
        memo[name] = this.owner.__computedObservers[name].newValue;
        return memo;
      }, {});
      return this.fn.call(this.owner, args);
    } else {
      // 如果不需要计算，则直接从缓存计算结果中读取属性值
      return getValueOfPath(this.owner.__tempComputedResult || {}, this.name)
        .value;
    }
  }

  /**
   * 对 Observer 所包装的属性进行求值运算。
   * 对 Observer 所包装的属性值赋值时可以使用其内部计算结果，或者从外部直接设置。
   * @param {any} [value] 从外部设置 Observer 的属性值
   */
  eval(value) {
    let _value = this.setValue(arguments.length ? value : this.compute());
    // [注]即使 `observer.fn` 非函数，这里也必需调用 `setValueOfPath` 重新赋值，
    // 因为 observer 所包装的属性如果是多节点路径，则必需保证该路径的存在。
    setValueOfPath(this.owner.__tempComputedResult, this.name, _value);
    return _value;
  }

  /**
   * 设置属性值
   * @private
   * @param {any} value 设置 Observer 包装的属性值。
   */
  setValue(value) {
    this.newValue = value;
    // 如果是根节点观察者，或者临时新值不等于新值，则需要通知所有 observer 重新求值。
    if (this.isRootObserver || this.tempValue !== this.newValue) {
      this.observers.forEach(observer =>
        pushObserverIntoQueue(this.owner.__computedObserverQueue, observer)
      );
    }
    // 如果是非根节点属性新值发生变化了，则需要通知根节点所对应的所有 observer 更新状态
    if (!this.isRootObserver && this.tempValue !== this.newValue) {
      // 直接更新根节点观察者属性值
      this.rootObserver.newValue = getValueOfPath(
        this.owner.__tempComputedResult,
        this.rootObserver.name
      ).value;
      // 通知根节点属性所有观察者更新状态（除了自己）
      this.rootObserver.observers.forEach(observer => {
        if (observer !== this) {
          pushObserverIntoQueue(this.owner.__computedObserverQueue, observer);
        }
      });
    }
    this.tempValue = this.newValue;
    return value;
  }

  /**
   * 更新新值与临时缓存值
   */
  update() {
    this.tempValue = this.newValue = getValueOfPath(
      this.owner.__tempComputedResult,
      this.name
    ).value;
  }
}

/**
 * 将需要重新计算属性值的 Observer 对象推入计算队列。
 * 确保每个 Observer 同一时间只能在计算队列中被调用一次。
 */
function pushObserverIntoQueue(queue, observer) {
  if (queue.findIndex(item => item === observer) < 0) {
    queue.push(observer);
  }
}

/**
 * 将 Observer 对象推入到它所代表的属性所依赖的属性的 Observer 对象的 `observers` 属性中。
 */
const pushObserverIntoParentObservers = pushObserverIntoQueue;

/**
 * 消耗 Observer 队列
 * @param {array} queue Observer 队列
 */
function consumeObserverQueue(queue) {
  let observer;
  let i = 0;
  while (queue.length) {
    observer = queue.shift();
    observer.eval();
    // 防止因观察者互相通知更新状态导致死循环或长时间无响应
    // 此处限制同一次队列消耗最多允许 Observer 的更新次数。
    if (++i > MAX_TIMES_OF_CALLING_OBSERVER_IN_A_QUEUE) {
      throw new ComputeError(
        `Too many observers in a queue which have been called more than ${MAX_TIMES_OF_CALLING_OBSERVER_IN_A_QUEUE} times.`
      );
    }
  }
}

/**
 * 更新全部 Observers
 */
function updateOwnersObservers(observers) {
  for (let k in observers) {
    observers[k].update();
  }
}

/**
 * 初始化计算属性值
 * @param {object} owner Page/Component 实例
 */
function initializeObserverValues(owner) {
  owner.__tempComputedResult = { ...owner.data };
  let queue = owner.__computedObserverQueue;
  let observer, o;
  for (o in owner.__computedObservers) {
    observer = owner.__computedObservers[o];
    if (observer.fn) {
      pushObserverIntoQueue(queue, observer);
    }
  }

  consumeObserverQueue(queue);
  updateOwnersObservers(owner.__computedObservers);

  return owner;
}

/**
 * 设置属性值
 * @param {object} owner Page/Component 实例
 * @param {object} data 需要设置的属性键值对
 */
function evaluateComputed(owner, data) {
  // 这行可以不存在，因为本方法必需在初始化之后调用
  if (!owner.__tempComputedResult) owner.__tempComputedResult = {};
  let observer;
  let queue = owner.__computedObserverQueue;

  let sections, value, k;
  for (k in data) {
    sections = parsePath(k);
    value = data[k];
    k = compactPath(composePath(sections)); // 统一使用简洁路径表达式

    // 获取当前路径或它的根节点观察者
    observer =
      owner.__computedObservers[k] ||
      owner.__computedObservers[sections[0].key];

    if (observer) {
      // 如果当前路径拥有自己的 Observer 对象，则直接从外部设置 value 求值。
      if (observer.name === k) {
        observer.eval(value);
      } else {
        // 如果当前路径没有自己的 Observer 对象，则首先进行路径赋值，
        // 然后触发根节点状态检查。
        setValueOfPath(owner.__tempComputedResult, k, value);
        observer.eval();
      }
    } else {
      // 如果没有任何观察者，说明当前路径是非观察路径，它的赋值不会影响任何计算属性
      setValueOfPath(owner.__tempComputedResult, k, value);
    }
  }

  consumeObserverQueue(queue);
  updateOwnersObservers(owner.__computedObservers);

  return owner;
}

/**
 * 初始化 Page/Component 实例，使其计算属性具有观察变化能力
 */
function initializeComputed(owner, computed) {
  owner.__computedObserverQueue = [];
  owner.__computedObservers = {};

  computed = formatComputedConfig(computed);

  let k;
  for (k = 0; k < computed.length; k++) {
    createComputedObserver(owner, computed[k]);
  }

  return owner;
}

/**
 * 初始化单项计算属性
 * @param {object} owner Page/Component 实例
 * @param {object} prop 计算属性的配置
 * @param {object} childObserver Observer 对象，被推入到父级属性的 observers 数组中。
 */
function createComputedObserver(owner, prop, childObserver) {
  let obj = owner.__computedObservers;
  let { name, require: req, fn } = prop;

  name = formatPath(name);
  if (!req) req = [];
  req = req.map(path => formatPath(path));

  let observer = obj[name];

  // 如果已经存在同名 Observer
  if (observer) {
    // 如果当前属性定义了计算函数，则使用新的计算属性替换同名 Observer 的计算函数，并尝试初始化当前属性的依赖属性。
    // 即一个路径只能有一个计算函数，如果同一个路径定义了两个或以上计算函数，后者覆盖前者。
    if (fn) {
      observer.fn = fn;
      observer.require = req;
      for (let i = 0; i < req.length; i++) {
        createComputedObserver(owner, { name: req[i] }, observer);
      }
    }
  } else {
    // 如果没有找到同名 Observer 对象，则新建一个并注册。
    observer = obj[name] = new Observer(owner, name, req, fn);
    // 如果当前观察者非根节点属性观察，则同时初始化一个它的根节点观察对象
    if (!observer.isRootObserver) {
      createComputedObserver(
        owner,
        { name: observer.sections[0].key },
        observer
      );
    }
    for (let i = 0; i < req.length; i++) {
      createComputedObserver(owner, { name: req[i] }, observer);
    }
  }

  if (childObserver) {
    pushObserverIntoParentObservers(observer.observers, childObserver);
  }
}

/**
 * 格式化计算属性配置
 * @param {object} computed 计算属性规则配置
 */
function formatComputedConfig(computed) {
  let config = [];
  let k, v;
  for (k in computed) {
    k = formatPath(k);
    v = computed[k];
    if (isFunction(v)) {
      config.push({ name: k, require: [], fn: v });
    } else if (isObject(v)) {
      let { require: req, fn } = v;
      if (isFunction(fn)) {
        config.push({ name: k, require: req || [], fn });
      }
    }
  }
  return config;
}

module.exports = {
  evaluateComputed,
  initializeComputed,
  initializeObserverValues
};
