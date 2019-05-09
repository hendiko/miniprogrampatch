// miniprogrampatch v1.2.0 Thu May 09 2019  
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["miniprogrampatch"] = factory();
	else
		root["miniprogrampatch"] = factory();
})(typeof self !== "undefined" ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Page = __webpack_require__(1);

var _Component = __webpack_require__(9);

/*
 * @Author: Xavier
 * @Date: 2018-10-20 12:56:52
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-09 10:55:53
 */
module.exports = {
  patchComponent: _Component.patchComponent,
  patchPage: _Page.patchPage
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.patchPage = patchPage;

var _computed = __webpack_require__(2);

var _setDataApi = __webpack_require__(7);

var _setDataApi2 = _interopRequireDefault(_setDataApi);

var _utils = __webpack_require__(6);

var _watch = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 封装页面构造函数
 * @param {function} Page 页面构造函数
 * @param {object} options
 */
/*
 * @Author: laixi
 * @Date: 2018-10-21 21:27:48
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-08 15:41:58
 */
function patchPage(Page, options) {
  if (Page.__patchPage) return Page;
  var isSetDataReadOnly = false;

  var _ref = options || {},
      debug = _ref.debug;

  // 封装页面构造函数


  var constructor = function constructor(obj) {
    obj = Object.assign({}, obj);

    var _obj = obj,
        onLoad = _obj.onLoad,
        watch = _obj.watch,
        computed = _obj.computed;

    // 封装 onLoad 钩子

    obj.onLoad = function (queries) {
      if (!this.$setData) {
        // 保留原始 setData 引用
        this.__setData = this.setData;
        this.$setData = this.updateData = function (data, cb) {
          return (0, _setDataApi2.default)(data, cb, { ctx: this });
        };

        this.__setData((0, _computed.initiallyCompute)(this, computed || {}));

        // 初始化 watch 规则
        this.__watchers = (0, _watch.initializeWatchers)(this, watch || {});
        try {
          // 小程序 2.2.3 版本以后，覆写原始 setData 方法
          if (!isSetDataReadOnly) {
            this.setData = this.$setData;
          }
        } catch (e) {
          isSetDataReadOnly = true;
          if (debug) {
            console.log(e);
            console.log("using this.$setData instead of this.setData to support watch and computed features.");
          }
        }
      }
      if ((0, _utils.isFunction)(onLoad)) onLoad.call(this, queries);
    };

    return Page(obj);
  };

  constructor.__patchPage = true;
  return constructor;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parsePath = __webpack_require__(3);

var _parsePath2 = _interopRequireDefault(_parsePath);

var _evalPath = __webpack_require__(5);

var _utils = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Author: Xavier Yin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Date: 2019-04-30 09:46:15
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified by: Xavier Yin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified time: 2019-05-09 11:20:45
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// 观察者队列允许最多被消费次数
var MAX_TIMES_OF_CALLING_OBSERVER_IN_A_QUEUE = 100000;

var ComputeError = function (_Error) {
  _inherits(ComputeError, _Error);

  function ComputeError(message) {
    _classCallCheck(this, ComputeError);

    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, _Error.call.apply(_Error, [this, message].concat(params)));

    _this.name = "MiniprogrampatchComputeError";
    return _this;
  }

  return ComputeError;
}(Error);

/**
 * 封装属性使之具备观察能力
 */


var Observer = function () {
  /**
   * 构造函数
   * @param {object} owner Page/Component 实例
   * @param {string} name 属性名称
   * @param {array} [require] 依赖的属性名称数组
   * @param {function} [fn] 计算函数
   */
  function Observer(owner, name, require, fn) {
    _classCallCheck(this, Observer);

    this.name = name;
    this.require = require || [];
    this.fn = fn;

    this.owner = owner;

    this.oldValue = void 0; // 上一次 setData 结束后的值。
    this.tempValue = void 0; // 本次 setData 中保存的旧值。
    this.newValue = void 0; // 即将保存的新值。

    this.observers = []; // 依赖于当前属性的其他属性的 Observer 对象
    this.watchings = []; // 当前属性依赖其他的

    this.sections = (0, _parsePath2.default)(name); // 保存路径节点

    this._called = 0;
  }

  /**
   * 清除脏数据状态
   */
  Observer.prototype.clean = function clean() {
    this._called = 0;
    this.oldValue = this.newValue;
  };

  /**
   * 计算属性值
   */


  Observer.prototype.compute = function compute() {
    var _this2 = this;

    // 如果被观察属性有计算函数，则使用计算函数求值。
    if (this.fn) {
      var args = this.require.reduce(function (memo, name) {
        // 使用依赖属性的缓存值 `newValue`，避免循环/重复调用计算函数
        memo[name] = _this2.owner.__computedObservers[name].newValue;
        return memo;
      }, {});
      return this.fn.call(this.owner, args);
    } else {
      // 如果不需要计算，则直接从缓存计算结果中读取属性值
      return (0, _evalPath.getValueOfPath)(this.owner.__tempComputedResult || {}, this.name).value;
    }
  };

  /**
   * 对 Observer 所包装的属性进行求值运算。
   * 对 Observer 所包装的属性值赋值时可以使用其内部计算结果，或者从外部直接设置。
   * @param {any} [value] 从外部设置 Observer 的属性值
   */


  Observer.prototype.eval = function _eval(value) {
    this._called += 1;
    var _value = this.setValue(arguments.length ? value : this.compute());
    // [注]即使 `observer.fn` 非函数，这里也必需调用 `setValueOfPath` 重新赋值，
    // 因为 observer 所包装的属性如果是多节点路径，则必需保证该路径的存在。
    (0, _evalPath.setValueOfPath)(this.owner.__tempComputedResult, this.name, _value);
    return _value;
  };

  /**
   * 设置属性值
   * @private
   * @param {any} value 设置 Observer 包装的属性值。
   */


  Observer.prototype.setValue = function setValue(value) {
    var _this3 = this;

    this.newValue = value;
    if (this.tempValue !== this.newValue) {
      this.tempValue = this.newValue;
      this.observers.forEach(function (observer) {
        pushObserverIntoQueue(_this3.owner.__computedObserverQueue, observer);
      });
    } else {
      // todo: 这里仍需修改，单元测试未通过
      this.rootObserver.watchings.forEach(function (observer) {
        if (observer !== _this3 && observer.needToRecompute) {
          pushObserverIntoQueue(_this3.owner.__computedObserverQueue, observer);
        }
      });
    }

    // if (!this.isRootObserver) {
    //   // 直接更新根节点观察者属性值
    //   this.rootObserver.newValue = getValueOfPath(
    //     this.owner.__tempComputedResult,
    //     this.rootObserver.name
    //   ).value;
    //   // 通知根节点属性所有观察者更新状态（除了自己）
    //   this.rootObserver.observers.forEach(observer => {
    //     if (observer.needToRecompute && observer !== this) {
    //       pushObserverIntoQueue(this.owner.__computedObserverQueue, observer);
    //     }
    //   });
    // }

    // // 如果是根节点观察者，或者临时新值不等于新值，则需要通知所有 observer 重新求值。

    // if (this.isRootObserver || this.tempValue !== this.newValue) {
    //   this.observers.forEach(observer => {
    //     pushObserverIntoQueue(this.owner.__computedObserverQueue, observer);
    //   });
    // }
    // // 如果是非根节点属性新值发生变化了，则需要通知根节点所对应的所有 observer 更新状态
    // if (!this.isRootObserver && this.tempValue !== this.newValue) {
    //   // 直接更新根节点观察者属性值
    //   this.rootObserver.newValue = getValueOfPath(
    //     this.owner.__tempComputedResult,
    //     this.rootObserver.name
    //   ).value;
    //   // 通知根节点属性所有观察者更新状态（除了自己）
    //   this.rootObserver.observers.forEach(observer => {
    //     // todo: test
    //     if (observer.needToRecompute && observer !== this) {
    //       // if (observer !== this) {
    //       pushObserverIntoQueue(this.owner.__computedObserverQueue, observer);
    //     }
    //   });
    // }

    // this.tempValue = this.newValue;
    return value;
  };

  /**
   * 更新新值与临时缓存值
   */


  Observer.prototype.update = function update() {
    this.tempValue = this.newValue = (0, _evalPath.getValueOfPath)(this.owner.__tempComputedResult, this.name).value;
  };

  _createClass(Observer, [{
    key: "isDirty",
    get: function get() {
      return this.oldValue !== this.newValue;
    }
  }, {
    key: "needToRecompute",
    get: function get() {
      return this.newValue !== (0, _evalPath.getValueOfPath)(this.owner.__tempComputedResult, this.name).value;
    }

    /**
     * 是否是影子路径，是指该路径赋值已被其他路径赋值所覆盖，因此影子路径不应被 setData。
     */

  }, {
    key: "isShadowPath",
    get: function get() {
      return !(0, _evalPath.getValueOfPath)(this.owner.__tempComputedResult, this.name).key;
    }

    /**
     * 是否是根节点属性观察者
     */

  }, {
    key: "isRootObserver",
    get: function get() {
      return this.sections.length === 1;
    }

    /**
     * 获取当前属性根节点观察者
     */

  }, {
    key: "rootObserver",
    get: function get() {
      return this.owner.__computedObservers[this.sections[0].key];
    }
  }]);

  return Observer;
}();

/**
 * 将需要重新计算属性值的 Observer 对象推入计算队列。
 * 确保每个 Observer 同一时间只能在计算队列中被调用一次。
 */


function pushObserverIntoQueue(queue, observer) {
  if (queue.findIndex(function (item) {
    return item === observer;
  }) < 0) {
    queue.push(observer);
  }
}

/**
 * 将 Observer 对象推入到它所代表的属性所依赖的属性的 Observer 对象的 `observers` 属性中。
 */
var pushObserverIntoParentObservers = pushObserverIntoQueue;

/**
 * 消耗 Observer 队列
 * @param {array} queue Observer 队列
 */
function consumeObserverQueue(queue) {
  var observer = void 0;
  var i = 0;
  // todo: debug
  console.log("------------------\n\n\n");
  while (queue.length) {
    console.log("round:" + (i + 1) + ", length:" + queue.length, queue.map(function (i) {
      return "" + i.name + (i._called ? "[" + i._called + "]" : "");
    }).join("; "));
    observer = queue.shift();
    observer.eval();
    // 防止因观察者互相通知更新状态导致死循环或长时间无响应
    // 此处限制同一次队列消耗最多允许 Observer 的更新次数。
    if (++i > MAX_TIMES_OF_CALLING_OBSERVER_IN_A_QUEUE) {
      throw new ComputeError("Too many observers in a queue which have been called more than " + MAX_TIMES_OF_CALLING_OBSERVER_IN_A_QUEUE + " times.");
    }
  }
}

/**
 * 更新全部 Observers
 */
function updateOwnersObservers(observers) {
  for (var k in observers) {
    observers[k].update();
  }
}

/**
 * 清理 observer 状态
 */
function cleanOwnersObservers(observers) {
  for (var k in observers) {
    observers[k].clean();
  }
}

/**
 * 初始化计算属性值
 * @param {object} owner Page/Component 实例
 */
function initializeObserverValues(owner, data) {
  owner.__tempComputedResult = _extends({}, data);
  var queue = owner.__computedObserverQueue;
  var observer = void 0,
      o = void 0;
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
  var observer = void 0;
  var queue = owner.__computedObserverQueue;

  var sections = void 0,
      value = void 0,
      k = void 0;
  for (k in data) {
    sections = (0, _parsePath2.default)(k);
    value = data[k];
    k = (0, _parsePath.compactPath)((0, _parsePath.composePath)(sections)); // 统一使用简洁路径表达式

    // 获取当前路径或它的根节点观察者
    observer = owner.__computedObservers[k] || owner.__computedObservers[sections[0].key];

    if (observer) {
      // 如果当前路径拥有自己的 Observer 对象，则直接从外部设置 value 求值。
      if (observer.name === k) {
        observer.eval(value);
      } else {
        // 如果当前路径没有自己的 Observer 对象，则首先进行路径赋值，
        // 然后触发根节点状态检查。
        (0, _evalPath.setValueOfPath)(owner.__tempComputedResult, k, value);
        observer.eval();
      }
    } else {
      // 如果没有任何观察者，说明当前路径是非观察路径，它的赋值不会影响任何计算属性
      (0, _evalPath.setValueOfPath)(owner.__tempComputedResult, k, value);
    }
  }

  consumeObserverQueue(queue);
  updateOwnersObservers(owner.__computedObservers);

  return owner;
}

/**
 * 在完成计算属性求值后，比较出发生变化的属性值。
 *
 * @param {array} paths 用户通过 setData 设置的必需更新的字段
 */
function diffDataAfterComputing(owner, data, different) {
  var _data = {};

  var result = owner.__tempComputedResult,
      observers = owner.__computedObservers;


  var k = void 0,
      item = void 0;
  for (k in data) {
    var _getValueOfPath = (0, _evalPath.getValueOfPath)(result, k),
        key = _getValueOfPath.key,
        value = _getValueOfPath.value;

    if (key) {
      if (different) {
        if (value !== data[k]) _data[k] = value;
      } else {
        _data[k] = value;
      }
    }
  }

  for (k in observers) {
    item = observers[k];
    if (!data.hasOwnProperty(k)) {
      if (item.isDirty && !item.isShadowPath) {
        _data[k] = item.newValue;
      }
    }
  }

  return _data;
}

/**
 * 初始化 Page/Component 实例，使其计算属性具有观察变化能力
 */
function initializeComputed(owner, computed) {
  owner.__computedObserverQueue = [];
  owner.__computedObservers = {};
  owner.__tempComputedResult = {};

  computed = formatComputedConfig(computed);

  var k = void 0;
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
  var obj = owner.__computedObservers;
  var name = prop.name,
      req = prop.require,
      fn = prop.fn;


  name = (0, _parsePath.formatPath)(name);
  if (!req) req = [];
  req = req.map(function (path) {
    return (0, _parsePath.formatPath)(path);
  });

  var observer = obj[name];

  // 如果已经存在同名 Observer
  if (observer) {
    // 如果当前属性定义了计算函数，则使用新的计算属性替换同名 Observer 的计算函数，并尝试初始化当前属性的依赖属性。
    // 即一个路径只能有一个计算函数，如果同一个路径定义了两个或以上计算函数，后者覆盖前者。
    if (fn) {
      observer.fn = fn;
      observer.require = req;
      for (var i = 0; i < req.length; i++) {
        createComputedObserver(owner, { name: req[i] }, observer);
      }
    }
  } else {
    // 如果没有找到同名 Observer 对象，则新建一个并注册。
    observer = obj[name] = new Observer(owner, name, req, fn);
    // 如果当前观察者非根节点属性观察，则同时初始化一个它的根节点观察对象
    if (!observer.isRootObserver) {
      createComputedObserver(owner, { name: observer.sections[0].key }, observer);
    }
    for (var _i = 0; _i < req.length; _i++) {
      createComputedObserver(owner, { name: req[_i] }, observer);
    }
  }

  if (childObserver) {
    pushObserverIntoParentObservers(observer.observers, childObserver);
    pushObserverIntoParentObservers(childObserver.watchings, observer);
    if (observer.isRootObserver && (0, _parsePath.isSameRootOfPath)(observer.name, childObserver.name)) {
      pushObserverIntoParentObservers(childObserver.observers, observer);
      pushObserverIntoParentObservers(observer.watchings, childObserver);
    }
  }
}

/**
 * 格式化计算属性配置
 * @param {object} computed 计算属性规则配置
 */
function formatComputedConfig(computed) {
  var config = [];
  var k = void 0,
      v = void 0;
  for (k in computed) {
    k = (0, _parsePath.formatPath)(k);
    v = computed[k];
    if ((0, _utils.isFunction)(v)) {
      config.push({ name: k, require: [], fn: v });
    } else if ((0, _utils.isObject)(v)) {
      var _v = v,
          req = _v.require,
          fn = _v.fn;

      if ((0, _utils.isFunction)(fn)) {
        config.push({ name: k, require: req || [], fn: fn });
      }
    }
  }
  return config;
}

function initiallyCompute(owner, computed) {
  initializeComputed(owner, computed || {});
  initializeObserverValues(owner, owner.data);
  var data = diffDataAfterComputing(owner, Object.assign({}, owner.data, owner.__data), true);
  cleanOwnersObservers(owner.__computedObservers);
  owner.__data = null;
  return data;
}

module.exports = {
  cleanOwnersObservers: cleanOwnersObservers,
  diffDataAfterComputing: diffDataAfterComputing,
  evaluateComputed: evaluateComputed,
  initializeComputed: initializeComputed,
  initializeComputedValues: initializeObserverValues,
  initializeObserverValues: initializeObserverValues,
  initiallyCompute: initiallyCompute
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.compactPath = exports.composePath = undefined;
exports.default = parsePath;
exports.isSameRootOfPath = isSameRootOfPath;
exports.pathToArray = pathToArray;
exports.formatPath = formatPath;

var _error = __webpack_require__(4);

/** 解析路径异常 */
function ParseError(type, pathstr) {
  var msg = void 0;
  switch (type) {
    case 0:
      msg = "There should be digits inside [] in the path string";
      break;
    case 1:
      msg = "The path string should not start with []";
      break;
    default:
      msg = "Unknown error occurred when parsing path";
  }
  return new _error.MiniprogrampatchError(msg + ": " + pathstr);
}

/**
 * path 字符串中第一个 `]` 不能出现在第一个 `[` 之前。
 * 例如以下都是非法 path: `abc]`, `x.y].z`
 */
/*
 * @Author: Xavier Yin
 * @Date: 2019-04-28 15:43:34
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-07 14:39:22
 *
 * 解析小程序 data 以路径作为属性名
 */

var check1 = function check1(path) {
  return !/^[^\[]*\]/.test(path);
};

/**
 * path 根节点不能是数组，即不能以 `[` 开头。(预转换后检查项)
 */
var check2 = function check2(path) {
  return !path.startsWith("[");
};

/**
 * path 不能以未关闭的数组表达式加上对象表达式结尾，例如 `x.y[abc` 非法。
 */
var check3 = function check3(path) {
  return !/(.+)\[[^\]]+$/g.test(path);
};

/**
 * path 中不能存在空数组表达式，即不能包含 `[]` 字符串
 */
var check4 = function check4(path) {
  return !/\[\]/.test(path);
};

/**
 * 连续句号字符串转换为一个句号字符
 */
var transform1 = function transform1(path) {
  return path.replace(/\.+/g, ".");
};

/**
 * 去除首尾的句号
 */
var transform2 = function transform2(path) {
  return (/^\.*(.*?)\.*$/g.exec(path)[1]
  );
};

/**
 * 去除未关闭的数组表达式结尾，即 `x.y[11.22`, `x.y[[[[[` 是合法的，但等同于 `x.y`。
 */
var transform3 = function transform3(path) {
  return path.replace(/\[[\[\.\d]*$/g, "");
};

/**
 * 连续空字符串转换为一个空字符串
 */
var transform4 = function transform4(path) {
  return path.replace(/\s+/g, " ");
};

/**
 * 查看目标字符串包含多少个 `]` 字符
 * @param {string} str 被检查字符串
 */
var countRSB = function countRSB(str) {
  return (str.match(/\]/g) || []).length;
};

/**
 * 对 path 进行预处理，包括检查 path 合法性和字符串转换
 * @param {string} path 属性路径
 */
function preprocessPath(path) {
  path = [transform1, transform4, transform2, transform3].reduce(function (path, fn) {
    return fn(path);
  }, path);

  var checkers = [check1, check2, check3, check4];
  for (var i = 0; i < checkers.length; i++) {
    if (!checkers[i](path)) {
      throw ParseError(i === 1 ? 1 : 0, path);
    }
  }

  return path;
}

/**
 * @description
 * LSB means Left Square Bracket
 *
 * @param {string} path 不包含 `[` 符号的路径
 */
function parsePathWithoutLSB(path) {
  var parts = transform2(path).split(".");
  var sections = [];
  var str = void 0,
      count = void 0,
      i = void 0,
      ii = void 0;
  for (i = 0; i < parts.length; i++) {
    str = parts[i];
    count = countRSB(str);
    for (ii = 0; ii < count; ii++) {
      sections.push({ type: 1, key: 0 }); // type 值为 0 表示对象节点；1 表示数组节点。
    }
    // 去除路径中的 `]` 字符，同时将连续空字符串转换为一个空字符。
    str = transform4(str.replace(/\]/g, ""));
    if (str) {
      sections.push({ type: 0, key: str });
    }
  }
  return sections;
}

/**
 * 解析路径（可递归）
 * @param {string} path 路径
 */
function parsePathApi(path) {
  var sections = [];
  if (path) {
    var startsWithLSB = path.startsWith("[");
    var usingPath = /^(\[[^\]]*\])|([^\[]+)/g.exec(path)[startsWithLSB ? 1 : 2];
    var restSections = [];
    if (usingPath.length < path.length) {
      restSections = parsePathApi(path.slice(usingPath.length));
    }

    if (startsWithLSB) {
      var index = /^\[([\d\.\[]+)\]/g.exec(usingPath);
      if (index) {
        index = index[1];
        var position = index.length + 2;

        index = index.replace(/\.|\[/g, "");
        if (!index) throw ParseError(0, path);
        index *= 1;
        if (isNaN(index)) throw ParseError(0, path);
        sections.push({ type: 1, key: index });

        if (position < usingPath.length) {
          sections = sections.concat(parsePathWithoutLSB(usingPath.slice(position)));
        }
      } else {
        throw ParseError(0, path);
      }
    } else {
      sections = parsePathWithoutLSB(usingPath);
    }
    return sections.concat(restSections);
  } else {
    return sections;
  }
}

/**
 * 解析路径
 * @param {string} path 路径
 */
function parsePath(path) {
  return parsePathApi(preprocessPath(path));
}

/**
 * 将解析后的节点拼接成完成路径表达式
 * @param {array} sections 解析后的路径节点
 */
var composePath = exports.composePath = function composePath(sections) {
  return sections.map(function (item) {
    return item.type === 0 ? item.key : "[" + item.key + "]";
  }).join(".");
};

/**
 * 将路径表达式中多余的句号去掉。
 * @example
 * `x.y.[0].[1].z` 转换为 `x.y[0][1]z`
 * @param {string} path 路径表达式
 */
var compactPath = exports.compactPath = function compactPath(path) {
  return path.replace(/\.\[/g, "[").replace(/\]\./g, "]");
};

/**
 * 比较两个路径是否具有相同的根节点
 * @param {string} path1 参照路径
 * @param {string} path2 对比路径
 */
function isSameRootOfPath(path1, path2) {
  return parsePath(path1)[0].key === parsePath(path2)[0].key;
}

/**
 * 将路径分解为节点名称组成的数组
 *
 * @example
 * `pathToArray("x[1]y.z")` 返回 `["x", 1, "y", "z"]`
 * @param {string} path 路径
 */
function pathToArray(path) {
  return parsePath(path).map(function (section) {
    return section.key;
  });
}

/**
 * 格式化路径，转换为标准的简洁路径
 */
function formatPath(path) {
  return compactPath(composePath(parsePath(path)));
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * @Author: Xavier Yin
 * @Date: 2019-05-07 14:32:08
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-07 15:09:35
 */

/**
 * [注] 使用 Babel 编译后的代码可能出现实例判断错误的 BUG。
 *
 * ````
 * const e = new MiniprogrampatchError();
 * e instanceof MiniprogrampatchError // 返回 false
 * ```
 *
 * 具体原因参见 https://stackoverflow.com/questions/30402287/extended-errors-do-not-have-message-or-stack-trace
 */
var MiniprogrampatchError = function (_Error) {
  _inherits(MiniprogrampatchError, _Error);

  function MiniprogrampatchError() {
    _classCallCheck(this, MiniprogrampatchError);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, _Error.call.apply(_Error, [this].concat(args)));

    _this.name = MiniprogrampatchError.name;
    return _this;
  }

  return MiniprogrampatchError;
}(Error);

exports.MiniprogrampatchError = MiniprogrampatchError;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getValueOfPath = getValueOfPath;
exports.setValueOfPath = setValueOfPath;

var _parsePath = __webpack_require__(3);

var _parsePath2 = _interopRequireDefault(_parsePath);

var _utils = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 根据路径读取属性值
 * @param {object} obj 对象
 * @param {string} path 属性路径
 */
/*
 * @Author: Xavier Yin
 * @Date: 2019-04-28 21:51:57
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-29 09:55:46
 *
 * 使用路径表达式读写对象的属性值
 */

function getValueOfPath(obj, path) {
  path += "";
  if (obj.hasOwnProperty(path)) {
    return { key: true, value: obj[path], path: path };
  } else {
    var sections = (0, _parsePath2.default)(path);
    path = (0, _parsePath.compactPath)((0, _parsePath.composePath)(sections));
    var value = void 0,
        i = void 0,
        section = void 0;
    for (i = 0; i < sections.length; i++) {
      section = sections[i];
      if ((0, _utils.isObject)(obj) && obj.hasOwnProperty(section.key)) {
        value = obj[section.key];
        obj = value;
      } else {
        return { key: false, path: path };
      }
    }
    return { key: true, value: value, path: path };
  }
}

var whichType = function whichType(obj) {
  return (0, _utils.isArray)(obj) ? 1 : (0, _utils.isObject)(obj) ? 0 : -1;
};

/**
 * 根据路径设置对象的属性值。
 * @param {object} obj 根节点容器必需是一个对象。
 * @param {string} path 属性路径
 * @param {any} value 任何值
 */
function setValueOfPath(obj, path, value) {
  var sections = (0, _parsePath2.default)(path + "");
  var parent = void 0,
      lastKey = void 0;
  for (var i = 0; i < sections.length; i++) {
    var _sections$i = sections[i],
        key = _sections$i.key,
        type = _sections$i.type;
    // 首次 if 判断必然为假

    if (whichType(obj) !== type) {
      obj = parent[lastKey] = type === 1 ? [] : {};
    }
    parent = obj;
    obj = parent[key];
    lastKey = key;
  }
  parent[lastKey] = value;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.hasIntersection = hasIntersection;
/*
 * @Author: laixi
 * @Date: 2018-10-20 13:17:17
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-07 12:04:20
 */
var isObject = exports.isObject = function isObject(obj) {
  return obj !== null && "object" === (typeof obj === "undefined" ? "undefined" : _typeof(obj));
};
var isFunction = exports.isFunction = function isFunction(obj) {
  return "function" === typeof obj;
};
var isArray = exports.isArray = function isArray(x) {
  return x && x.constructor === Array;
};

// 判断两个嵌套路径之间是否具有交集
function hasIntersection(obj, target) {
  return obj[0] === target[0];
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   * @Author: Xavier Yin
                                                                                                                                                                                                                                                                   * @Date: 2019-05-07 15:49:50
                                                                                                                                                                                                                                                                   * @Last Modified by: Xavier Yin
                                                                                                                                                                                                                                                                   * @Last Modified time: 2019-05-08 15:00:41
                                                                                                                                                                                                                                                                   */

var _utils = __webpack_require__(6);

var _computed = __webpack_require__(2);

var _parsePath = __webpack_require__(3);

var _watch = __webpack_require__(8);

function formatData(data) {
  var _data = {};
  for (var k in data) {
    _data[(0, _parsePath.formatPath)(k)] = data[k];
  }
  return _data;
}

function setDataApi(data, cb, options) {
  if (!(0, _utils.isObject)(data)) return;

  var ctx = options.ctx,
      initial = options.initial;


  var changing = ctx.__changing;
  ctx.__changing = true;

  if (!changing) {
    ctx.__data = {};
    ctx.__tempComputedResult = _extends({}, ctx.data);
  }

  data = formatData(data);
  Object.assign(ctx.__data, data);

  (0, _computed.evaluateComputed)(ctx, data);

  if (changing) return;

  var _data = (0, _computed.diffDataAfterComputing)(ctx, ctx.__data, initial);

  (0, _computed.cleanOwnersObservers)(ctx.__computedObservers);

  ctx.__data = null;
  ctx.__changing = false;
  ctx.__setData(_data, cb);
  (0, _watch.checkWatchers)(ctx);
}

exports.default = setDataApi;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _evalPath = __webpack_require__(5);

var _parsePath = __webpack_require__(3);

var _utils = __webpack_require__(6);

/**
 * 初始化 watch 能力
 * @param {object} owner 当前Page/Component实例
 * @param {object} watch watch 配置
 */
function initializeWatchers(owner, watch) {
  var watchers = {};
  if ((0, _utils.isObject)(watch)) {
    var cb = void 0,
        name = void 0;
    for (name in watch) {
      cb = watch[name];
      name = (0, _parsePath.formatPath)(name);
      if ((0, _utils.isFunction)(cb)) {
        watchers[name] = {
          cb: cb,
          path: name,
          value: (0, _evalPath.getValueOfPath)(owner.data, name).value
        };
      }
    }
  }
  return watchers;
}

/**
 * 检查 watcher 状态，是否需要触发回调
 * @param {object} owner Page/Component 实例
 * @param {array} [paths] 指定检查的路径
 */
/*
 * @Author: Xavier Yin
 * @Date: 2019-05-07 09:39:29
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-08 15:11:02
 */

function checkWatchers(owner) {
  for (var _len = arguments.length, paths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    paths[_key - 1] = arguments[_key];
  }

  var watchers = owner.__watchers;
  if (!watchers) return;

  paths = paths.map(function (path) {
    return (0, _parsePath.formatPath)(path);
  });

  if (!paths.length) {
    paths = Object.keys(watchers);
  }

  var path = void 0,
      i = void 0;

  var _loop = function _loop() {
    path = paths[i];
    var watcher = watchers[path];
    var oldVal = watcher.value;

    var _getValueOfPath = (0, _evalPath.getValueOfPath)(owner.data, path),
        value = _getValueOfPath.value;

    if (value !== oldVal) {
      watcher.value = value;
      setTimeout(function () {
        return watcher.cb.call(owner, value, oldVal);
      });
    }
  };

  for (i = 0; i < paths.length; i++) {
    _loop();
  }
}

module.exports = {
  checkWatchers: checkWatchers,
  initializeWatchers: initializeWatchers
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.patchComponent = patchComponent;

var _computed = __webpack_require__(2);

var _setDataApi2 = __webpack_require__(7);

var _setDataApi3 = _interopRequireDefault(_setDataApi2);

var _utils = __webpack_require__(6);

var _watch = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 封装（重新定义）构造配置中的 properties 属性。
 * @param {object} props 构造配置中的 properties 属性值
 */
/*
 * @Author: laixi
 * @Date: 2018-10-21 21:49:26
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-08 15:42:27
 */
function initializeProperties(props) {
  var _loop = function _loop() {
    var prop = props[name];
    // 如果构造配置中使用 `{propName<string>: constructor<function>}` 格式来定义 prop，
    // 那么将它转换为 `{prop<string>: config<object>}` 格式
    if ((0, _utils.isFunction)(prop) || prop === null) prop = props[name] = { type: prop };

    // 获取原始配置中的 observer 值
    var _prop = prop,
        observer = _prop.observer;

    // 重新定义 prop 配置中的 observer 值

    prop.observer = function (newVal, oldVal, changedPath) {
      var _setDataApi;

      (0, _setDataApi3.default)((_setDataApi = {}, _setDataApi[name] = newVal, _setDataApi), null, { initial: true, ctx: this });
      // 如果 prop 中定义了 observer 函数，则触发该函数调用。
      if ((0, _utils.isFunction)(observer)) observer.call(this, newVal, oldVal, changedPath);
    };
  };

  for (var name in props) {
    _loop();
  }
  return props;
}

/**
 * 为小程序组件打补丁
 * @param {function} Component 小程序组件构造函数
 * @param {object} options 可选项
 */
function patchComponent(Component, options) {
  // 如果已经打过补丁，则直接返回组件构造函数
  if (Component.__patchComponent) return Component;

  // 检查组件方法 setData 是否是只读
  // (小程序v2.2.2以下版本 setData 方法是只读的)
  var isSetDataReadOnly = false;

  var _ref = options || {},
      debug = _ref.debug;

  // 创建一个新的高阶函数(High-Order Function)作为组件构造函数


  var constructor = function constructor(obj) {
    obj = Object.assign({}, obj);
    obj.properties = initializeProperties(obj.properties || {});

    var _obj = obj,
        attached = _obj.attached,
        created = _obj.created,
        watch = _obj.watch,
        lifetimes = _obj.lifetimes,
        computed = _obj.computed;

    // 小程序组件配置 lifetimes 中如果定义了生命钩子，将被优先使用。

    if ((0, _utils.isObject)(lifetimes)) {
      if (lifetimes.hasOwnProperty("attached")) {
        attached = lifetimes.attached;
      }
      if (lifetimes.hasOwnProperty("created")) {
        created = lifetimes.created;
      }
    }

    // 封装 created 钩子
    var _created = function _created() {
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
        this.$setData = this.updateData = function () {
          return this.setData.apply(this, arguments);
        };
      }

      // 如果定义了函数 created 钩子，才执行（小程序原生行为并未检查 created 钩子合法性，如果定义了非函数钩子，则直接报错）
      if ((0, _utils.isFunction)(created)) created.apply(this, arguments);
    };

    // 封装 attached 钩子
    var _attached = function _attached() {
      // 初始化 $setData 方法。
      if (!(this.$setData && this.$setData.__attached)) {
        // 保留原始 setData 的引用。
        this.__setData = this.setData;
        this.$setData = this.updateData = function (data, cb) {
          return (0, _setDataApi3.default)(data, cb, { ctx: this });
        };

        // 用来标识这个 $setData 不是 created 钩子中的临时方法。
        this.$setData.__attached = true;

        this.__setData((0, _computed.initiallyCompute)(this, computed || {}));

        // 初始化 watch 配置
        this.__watchers = (0, _watch.initializeWatchers)(this, watch || {});

        try {
          // 小程序 2.2.3 版本以后，覆写 `this.setData` 方法。
          if (!isSetDataReadOnly) {
            this.setData = this.$setData;
          }
        } catch (e) {
          isSetDataReadOnly = true;
          if (debug) {
            console.log(e);
            console.log("using this.$setData instead of this.setData to support watch and computed features.");
          }
        }
      }
      // 如果定义了函数 attached 钩子，才执行（小程序原生行为并未检查 attached 钩子合法性，如果定义了非函数钩子，则直接报错）
      if ((0, _utils.isFunction)(attached)) attached.apply(this, arguments);
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

/***/ })
/******/ ]);
});