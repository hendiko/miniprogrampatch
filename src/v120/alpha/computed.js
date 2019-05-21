/*
 * @Author: Xavier Yin
 * @Date: 2019-05-09 14:08:48
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-21 11:07:55
 */

import parsePath, { compactPath, composePath, formatPath } from "./parsePath";
import { getValueOfPath, setValueOfPath } from "./evalPath";
import { MiniprogrampatchError } from "./error";
import { isObject, isFunction, isEqual } from "./utils";

const MAX_ROUNDS_OF_CONSUMPTION = 100000;

const observerAddToQueue = observer =>
  !observer._evaluating && observer.addToQueue();

class Observer {
  constructor(owner, name, required, fn, caution) {
    this.owner = owner;
    this.name = name;
    this.required = required || [];
    this.fn = fn;
    this.caution = !!caution;

    this.oldVal = this.newVal = void 0;

    let sections = parsePath(name);

    this.rootPath = sections[0].key;
    this.isRootObserver = sections.length === 1;

    this.observers = [];
    this.watchings = [];
    this.children = [];

    this.cautionObservers = [];

    this.evalTimes = 0;
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

  get once() {
    return !this.required.length;
  }

  get readonly() {
    return !this.fn;
  }

  get rootObserver() {
    return this.isRootObserver
      ? this
      : this.owner.__computedObservers[this.rootPath];
  }

  addChildObserver(observer) {
    if (this.children.findIndex(item => item === observer) < 0) {
      this.children.push(observer);
    }
  }

  addDirtyObserver(observer) {
    if (this.cautionObservers.findIndex(item => item === observer) < 0) {
      this.cautionObservers.push(observer);
    }
  }

  addObserver(observer) {
    if (this.observers.findIndex(item => item === observer) < 0) {
      this.observers.push(observer);
    }
  }

  addToQueue() {
    let { __computingQueue: queue } = this.owner;
    if (queue.findIndex(item => item === this) < 0) {
      queue.push(this);
    }
  }

  addWatching(observer) {
    if (this.watchings.findIndex(item => item === observer) < 0) {
      this.watchings.push(observer);
    }
  }

  checkDirty() {
    if (this.dirty) {
      this.newVal = this.getTempResult().value;
      this.observers.forEach(observerAddToQueue);
    } else {
      this.cautionObservers.forEach(observerAddToQueue);
    }
  }

  clean() {
    this.evalTimes = 0;
    this.oldVal = this.newVal = this.getTempResult().value;
    if (this.once && !this.readonly) {
      this.fn = null;
    }
  }

  compute() {
    if (this.readonly) {
      return this.getTempResult().value;
    } else {
      let args = {};
      let name;
      for (let i = 0; i < this.required.length; i++) {
        name = this.required[i];
        args[name] = this.owner.__computedObservers[name].newVal;
      }
      return this.fn.call(this.owner, args);
    }
  }

  eval(value) {
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
  let { name, require: req = [], fn, caution } = prop;

  let _observer = obj[name];

  if (_observer) {
    if (fn) {
      _observer.fn = fn;
      _observer.required = req;
      _observer.caution = caution;
      // 同一个 observer 不应该在 computed 配置中定义多次
      // 如果定义多次，那后者将覆盖前者的依赖关系（但并没有从 observer.observers 将之前已添加的观察删除。）
      for (let i = 0; i < req.length; i++) {
        createComputedObserver(owner, { name: req[i] }, _observer);
      }
    }
  } else {
    _observer = obj[name] = new Observer(owner, name, req, fn, caution);
    if (!_observer.isRootObserver) {
      let rootObserver = createComputedObserver(owner, {
        name: _observer.rootPath
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
    if (observer.caution) {
      _observer.addDirtyObserver(observer);
    }
  }

  return _observer;
}

function formatComputedDefinition(computed) {
  let config = [];
  let k, v;
  for (k in computed) {
    v = computed[k];
    k = formatPath(k);
    if (isFunction(v)) {
      config.push({ name: k, require: [], fn: v });
    } else if (isObject(v)) {
      let { require: req, fn, keen } = v;
      if (isFunction(fn)) {
        config.push({
          name: k,
          require: (req || []).map(n => formatPath(n)),
          fn,
          caution: keen
        });
      }
    }
  }
  return config;
}

function constructComputedFeature(owner, computedDefinition) {
  owner.__computedObservers = {};
  owner.__computingQueue = [];
  owner.__tempComputedResult = {};

  let config = formatComputedDefinition(computedDefinition);

  for (let i = 0; i < config.length; i++) {
    createComputedObserver(owner, config[i]);
  }

  return owner;
}

function evaluateComputedResult(owner, input) {
  let {
    __computedObservers: observers,
    __computingQueue: queue,
    __tempComputedResult: result
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
    if (observer.isAlive && observer.changed) {
      data[k] = observer.newVal;
    }
    observer.clean();
  }
  return Object.keys(data).length ? data : null;
}

function calculateInitialComputedValues(owner) {
  let {
    __computedObservers: observers,
    __computingQueue: queue,
    __tempComputedResult: result
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
  evaluateComputedResult
};
