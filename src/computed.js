/*
 * @Author: Xavier Yin
 * @Date: 2019-05-09 14:08:48
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2020-05-24 16:43:24
 */

import parsePath, { compactPath, composePath, formatPath } from "./parsePath";
import { getValueOfPath, setValueOfPath } from "./evalPath";
import MiniprogrampatchError from "./error";
import { isObject, isFunction, isEqual, isString, isArray } from "./utils";

const MAX_ROUNDS_OF_CONSUMPTION = 100000;

const observerAddToQueue = (observer) =>
  !observer._evaluating && observer.addToQueue();

/**
 * 路径观察者
 */
class Observer {
  constructor(owner, name, required, fn, keen) {
    this.owner = owner;
    this.name = name;
    this.required = required || [];
    this.fn = fn;
    this.keen = !!keen;

    this.oldVal = this.newVal = void 0;

    let sections = parsePath(name);

    this.rootPath = sections[0].key;
    this.isRootObserver = sections.length === 1;

    this.observers = []; // 所有观察了本实例的观察者集合
    this.watchings = []; // 正在被本实例观察的观察者集合
    this.children = []; // 只有根节点有效，包含根节点所有观察者

    this.keenObservers = []; // 脏状态检查敏感观察者集合

    this.evalTimes = 0;
    this.everEvaluated = false; // 是否从未被计算过
  }

  get changed() {
    return !isEqual(this.oldVal, this.newVal);
  }

  get dirty() {
    return !isEqual(this.newVal, this.getTempResult().value);
  }

  get isAlive() {
    return this.getTempResult().key;
  }

  /**
   * 如果在 computed 配置中定义了无依赖的属性，这类属性视为只须求值一次便不再更新属性值。
   */
  get once() {
    return !this.required.length;
  }

  /**
   * 如果在 computed 配置中定义了无依赖的计算属性，这些属性只会初始化时计算一次属性值。
   * 首次求值结束后，该属性的计算函数被置为 null，属性值不再更新，此后该属性被视为只读(readonly)。
   */
  get readonly() {
    return !this.fn;
  }

  get rootObserver() {
    return this.isRootObserver
      ? this
      : this.owner.__computedObservers[this.rootPath];
  }

  addChildObserver(observer) {
    if (this.children.findIndex((item) => item === observer) < 0) {
      this.children.push(observer);
    }
  }

  addDirtyObserver(observer) {
    if (this.keenObservers.findIndex((item) => item === observer) < 0) {
      this.keenObservers.push(observer);
    }
  }

  addObserver(observer) {
    if (this.observers.findIndex((item) => item === observer) < 0) {
      this.observers.push(observer);
    }
  }

  addToQueue() {
    let { __computingQueue: queue } = this.owner;
    if (queue.findIndex((item) => item === this) < 0) {
      queue.push(this);
    }
  }

  addWatching(observer) {
    if (this.watchings.findIndex((item) => item === observer) < 0) {
      this.watchings.push(observer);
    }
  }

  checkDirty() {
    if (this.dirty) {
      this.newVal = this.getTempResult().value;
      this.observers.forEach(observerAddToQueue);
    } else {
      this.keenObservers.forEach(observerAddToQueue);
    }
  }

  clean() {
    this.evalTimes = 0;
    this.oldVal = this.newVal = this.getTempResult().value;
    if (this.once && !this.readonly) {
      this.fn = null;
    }
  }

  /** (内部求值函数）计算出属性值 */
  compute() {
    if (this.readonly) {
      return this.getTempResult().value;
    } else {
      let args = {};
      let name;
      for (let i = 0; i < this.required.length; i++) {
        name = this.required[i];
        let requiredObserver = this.owner.__computedObservers[name];
        if (!requiredObserver.everEvaluated) {
          requiredObserver.eval();
        }
        args[name] = requiredObserver.newVal;
      }
      return this.fn.call(this.owner, args);
    }
  }

  /**
   * (公开求值函数)
   * 如果给定 value 参数，表示从外部直接对本属性赋值
   */
  eval(value) {
    this.everEvaluated = true;
    this._evaluating = true;
    this.evalTimes++;

    // 是否是外部赋值
    let assigning = !!arguments.length;

    let _value = assigning ? value : this.compute();

    let dirtyCheck, updateValue;
    let isDiff = assigning || !isEqual(this.newVal, _value);
    this.newVal = _value;

    if (assigning) {
      dirtyCheck = true;
      updateValue = true;
    } else if (isDiff) {
      dirtyCheck = true;
      if (!this.readonly) updateValue = true;
    } else if (!this.readonly) {
      dirtyCheck = true;
    }

    if (updateValue) {
      setValueOfPath(this.owner.__tempComputedResult, this.name, _value);
    }

    if (dirtyCheck) {
      this.triggerRootObserverChildrenDirtyCheck();
    }

    if (isDiff) {
      this.observers.forEach(observerAddToQueue);
    }
    this._evaluating = false;
  }

  getTempResult() {
    return getValueOfPath(this.owner.__tempComputedResult, this.name);
  }

  /** 触发同根观察者进行脏数据检查 */
  triggerRootObserverChildrenDirtyCheck() {
    if (!this.isRootObserver) {
      this.rootObserver.checkDirty();
    }

    let observer;
    for (let i = 0; i < this.rootObserver.children.length; i++) {
      observer = this.rootObserver.children[i];
      if (observer !== this) {
        observer.checkDirty();
      }
    }
  }
}

function consumeObserverQueue(queue) {
  let i = 0;
  while (queue.length) {
    queue.shift().eval();
    if (++i > MAX_ROUNDS_OF_CONSUMPTION) {
      throw new MiniprogrampatchError(
        `The computing calls exceed ${MAX_ROUNDS_OF_CONSUMPTION}.`
      );
    }
  }
}

/**
 * 创建 Observer
 */
function createComputedObserver(owner, prop, observer) {
  let obj = owner.__computedObservers;
  let { name, require: req = [], fn, keen } = prop;

  let _observer = obj[name];

  if (_observer) {
    if (fn) {
      _observer.fn = fn;
      _observer.required = req;
      _observer.keen = keen;
      // 同一个 observer 不应该在 computed 配置中定义多次
      // 如果定义多次，那后者将覆盖前者的依赖关系（但并没有从 observer.observers 将之前已添加的观察删除。）
      for (let i = 0; i < req.length; i++) {
        createComputedObserver(owner, { name: req[i] }, _observer);
      }
    }
  } else {
    _observer = obj[name] = new Observer(owner, name, req, fn, keen);
    if (!_observer.isRootObserver) {
      let rootObserver = createComputedObserver(owner, {
        name: _observer.rootPath,
      });
      rootObserver.addChildObserver(_observer);
    }
    for (let i = 0; i < req.length; i++) {
      createComputedObserver(owner, { name: req[i] }, _observer);
    }
  }

  if (observer) {
    _observer.addObserver(observer);
    observer.addWatching(_observer);
    if (observer.keen) {
      _observer.addDirtyObserver(observer);
    }
  }

  return _observer;
}

function isPropPath(props, name) {
  return props ? props.hasOwnProperty(parsePath(name)[0].key) : false;
}

/** 格式化定义的 computed 字段 */
function formatComputedDefinition(computed, props) {
  let config = [];
  let k, v;
  for (k in computed) {
    v = computed[k];
    k = formatPath(k);
    // 不可定义 props 的属性作为 computed 属性。
    if (isPropPath(props, k)) continue;

    // 使用数组方式定义依赖关系。
    if (isArray(v)) {
      // 数组可包含3个成员
      let [req, fn, keen] = v;
      if (isString(req)) {
        req = [req];
      }
      if (!isArray(req)) {
        req = [];
      }
      // 调用开发者对 req 的数据类型负责，期待为 Array<string>
      req = req.map((n) => formatPath(n));
      let isFnFunc = isFunction(fn);
      let _fn = function (data) {
        let val = req.map((n) => data[n]);
        if (isFnFunc) {
          return fn.apply(this, val);
        } else {
          // 如果没有定义计算函数，则单依赖计算属性直接返回依赖属性值，多依赖计算属性返回依赖属性值构成的数组。
          // 如果定义的依赖字段个数为1，则直接返回该依赖字段的更新值。
          // 如果定义的依赖字段个数为0，则直接返回 undefined。
          return val.length > 1 ? val : val[0];
        }
      };
      config.push({ name: k, require: req, fn: _fn, keen });

      // 一个 computed 属性的完整定义格式应该是一个Object。
    } else if (isObject(v)) {
      let { require: req, fn, keen } = v;
      if (isFunction(fn)) {
        config.push({
          name: k,
          require: (req || []).map((n) => formatPath(n)),
          fn,
          keen: keen,
        });
      }

      // 一个只读computed属性（无任何依赖）
    } else if (isFunction(v)) {
      config.push({ name: k, require: [], fn: v });

      // 定义计算属性等于另一个路径的属性值。
    } else if (isString(v)) {
      let req = formatPath(v);
      config.push({ name: k, require: [req], fn: (data) => data[req] });
    }
  }
  return config;
}

function constructComputedFeature(owner, computedDefinition) {
  owner.__computedObservers = {};
  owner.__computingQueue = [];
  owner.__tempComputedResult = {};

  let config = formatComputedDefinition(computedDefinition, owner.__props);

  for (let i = 0; i < config.length; i++) {
    createComputedObserver(owner, config[i]);
  }

  return owner;
}

// 根据输入项 input 推演计算属性结果
function evaluateComputedResult(owner, input) {
  let {
    __computedObservers: observers,
    __computingQueue: queue,
    __tempComputedResult: result,
  } = owner;

  for (let k in input) {
    let sections = parsePath(k);
    let value = input[k];
    k = compactPath(composePath(sections));

    let observer = observers[k] || observers[sections[0].key];

    if (observer) {
      if (observer.name === k) {
        observer.eval(value);
      } else {
        setValueOfPath(result, k, value);
        observer.checkDirty();
        observer.triggerRootObserverChildrenDirtyCheck();
      }
    } else {
      setValueOfPath(result, k, value);
    }
  }

  consumeObserverQueue(queue);
}

function calculateAliveChanges(observers) {
  let data = {};
  let observer, k;
  for (k in observers) {
    observer = observers[k];
    if (!observer.readonly && observer.isAlive && observer.changed) {
      data[k] = observer.newVal;
    }
    observer.clean();
  }
  return Object.keys(data).length ? data : null;
}

/** 计算初始的计算属性值 */
function calculateInitialComputedValues(owner) {
  let {
    __computedObservers: observers,
    __computingQueue: queue,
    __tempComputedResult: result,
  } = owner;

  Object.assign(result, owner.data);

  let k, observer;
  for (k in observers) {
    observer = observers[k];
    if (observer.readonly) {
      observer.eval();
    } else {
      observer.watchings.forEach(observerAddToQueue);
      observer.addToQueue();
    }
  }

  if (queue.length) {
    consumeObserverQueue(queue);
    return calculateAliveChanges(observers);
  }
}

export {
  calculateInitialComputedValues,
  constructComputedFeature,
  evaluateComputedResult,
  isPropPath,
};
