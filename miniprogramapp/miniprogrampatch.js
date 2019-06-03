// miniprogrampatch v1.2.2 Fri May 31 2019  
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
 * @Last Modified time: 2019-05-21 14:01:19
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

        // 赋予计算能力
        (0, _computed.constructComputedFeature)(this, computed);

        var values = (0, _computed.calculateInitialComputedValues)(this);
        if (values) this.__setData(values);

        // 初始化 watch 规则
        (0, _watch.constructWatchFeature)(this, watch || {}, this.data);

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


exports.__esModule = true;
exports.isPropPath = exports.evaluateComputedResult = exports.constructComputedFeature = exports.calculateInitialComputedValues = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Author: Xavier Yin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Date: 2019-05-09 14:08:48
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Last Modified by: Xavier Yin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Last Modified time: 2019-05-30 16:05:23
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _parsePath = __webpack_require__(3);

var _parsePath2 = _interopRequireDefault(_parsePath);

var _evalPath = __webpack_require__(5);

var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

var _utils = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MAX_ROUNDS_OF_CONSUMPTION = 100000;

var observerAddToQueue = function observerAddToQueue(observer) {
  return !observer._evaluating && observer.addToQueue();
};

/**
 * 路径观察者
 */

var Observer = function () {
  function Observer(owner, name, required, fn, keen) {
    _classCallCheck(this, Observer);

    this.owner = owner;
    this.name = name;
    this.required = required || [];
    this.fn = fn;
    this.keen = !!keen;

    this.oldVal = this.newVal = void 0;

    var sections = (0, _parsePath2.default)(name);

    this.rootPath = sections[0].key;
    this.isRootObserver = sections.length === 1;

    this.observers = []; // 所有观察了本实例的观察者集合
    this.watchings = []; // 正在被本实例观察的观察者集合
    this.children = []; // 只有根节点有效，包含根节点所有观察者

    this.keenObservers = []; // 脏状态检查敏感观察者集合

    this.evalTimes = 0;
  }

  Observer.prototype.addChildObserver = function addChildObserver(observer) {
    if (this.children.findIndex(function (item) {
      return item === observer;
    }) < 0) {
      this.children.push(observer);
    }
  };

  Observer.prototype.addDirtyObserver = function addDirtyObserver(observer) {
    if (this.keenObservers.findIndex(function (item) {
      return item === observer;
    }) < 0) {
      this.keenObservers.push(observer);
    }
  };

  Observer.prototype.addObserver = function addObserver(observer) {
    if (this.observers.findIndex(function (item) {
      return item === observer;
    }) < 0) {
      this.observers.push(observer);
    }
  };

  Observer.prototype.addToQueue = function addToQueue() {
    var _this = this;

    var queue = this.owner.__computingQueue;

    if (queue.findIndex(function (item) {
      return item === _this;
    }) < 0) {
      queue.push(this);
    }
  };

  Observer.prototype.addWatching = function addWatching(observer) {
    if (this.watchings.findIndex(function (item) {
      return item === observer;
    }) < 0) {
      this.watchings.push(observer);
    }
  };

  Observer.prototype.checkDirty = function checkDirty() {
    if (this.dirty) {
      this.newVal = this.getTempResult().value;
      this.observers.forEach(observerAddToQueue);
    } else {
      this.keenObservers.forEach(observerAddToQueue);
    }
  };

  Observer.prototype.clean = function clean() {
    this.evalTimes = 0;
    this.oldVal = this.newVal = this.getTempResult().value;
    if (this.once && !this.readonly) {
      this.fn = null;
    }
  };

  /** 计算出属性值 */


  Observer.prototype.compute = function compute() {
    if (this.readonly) {
      return this.getTempResult().value;
    } else {
      var args = {};
      var name = void 0;
      for (var i = 0; i < this.required.length; i++) {
        name = this.required[i];
        args[name] = this.owner.__computedObservers[name].newVal;
      }
      return this.fn.call(this.owner, args);
    }
  };

  /**
   * 如果给定 value 参数，表示从外部直接对本属性赋值
   */


  Observer.prototype.eval = function _eval(value) {
    this._evaluating = true;
    this.evalTimes++;

    // 是否是外部赋值
    var assigning = !!arguments.length;

    var _value = assigning ? value : this.compute();

    var dirtyCheck = void 0,
        updateValue = void 0;
    var isDiff = assigning || !(0, _utils.isEqual)(this.newVal, _value);
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
      (0, _evalPath.setValueOfPath)(this.owner.__tempComputedResult, this.name, _value);
    }

    if (dirtyCheck) {
      this.triggerRootObserverChildrenDirtyCheck();
    }

    if (isDiff) {
      this.observers.forEach(observerAddToQueue);
    }
    this._evaluating = false;
  };

  Observer.prototype.getTempResult = function getTempResult() {
    return (0, _evalPath.getValueOfPath)(this.owner.__tempComputedResult, this.name);
  };

  /** 触发同根观察者进行脏数据检查 */


  Observer.prototype.triggerRootObserverChildrenDirtyCheck = function triggerRootObserverChildrenDirtyCheck() {
    if (!this.isRootObserver) {
      this.rootObserver.checkDirty();
    }

    var observer = void 0;
    for (var i = 0; i < this.rootObserver.children.length; i++) {
      observer = this.rootObserver.children[i];
      if (observer !== this) {
        observer.checkDirty();
      }
    }
  };

  _createClass(Observer, [{
    key: "changed",
    get: function get() {
      return !(0, _utils.isEqual)(this.oldVal, this.newVal);
    }
  }, {
    key: "dirty",
    get: function get() {
      return !(0, _utils.isEqual)(this.newVal, this.getTempResult().value);
    }
  }, {
    key: "isAlive",
    get: function get() {
      return this.getTempResult().key;
    }
  }, {
    key: "once",
    get: function get() {
      return !this.required.length;
    }
  }, {
    key: "readonly",
    get: function get() {
      return !this.fn;
    }
  }, {
    key: "rootObserver",
    get: function get() {
      return this.isRootObserver ? this : this.owner.__computedObservers[this.rootPath];
    }
  }]);

  return Observer;
}();

function consumeObserverQueue(queue) {
  var i = 0;
  while (queue.length) {
    queue.shift().eval();
    if (++i > MAX_ROUNDS_OF_CONSUMPTION) {
      throw new _error2.default("The computing calls exceed " + MAX_ROUNDS_OF_CONSUMPTION + ".");
    }
  }
}

/**
 * 创建 Observer
 */
function createComputedObserver(owner, prop, observer) {
  var obj = owner.__computedObservers;
  var name = prop.name,
      _prop$require = prop.require,
      req = _prop$require === undefined ? [] : _prop$require,
      fn = prop.fn,
      keen = prop.keen;


  var _observer = obj[name];

  if (_observer) {
    if (fn) {
      _observer.fn = fn;
      _observer.required = req;
      _observer.keen = keen;
      // 同一个 observer 不应该在 computed 配置中定义多次
      // 如果定义多次，那后者将覆盖前者的依赖关系（但并没有从 observer.observers 将之前已添加的观察删除。）
      for (var i = 0; i < req.length; i++) {
        createComputedObserver(owner, { name: req[i] }, _observer);
      }
    }
  } else {
    _observer = obj[name] = new Observer(owner, name, req, fn, keen);
    if (!_observer.isRootObserver) {
      var rootObserver = createComputedObserver(owner, {
        name: _observer.rootPath
      });
      rootObserver.addChildObserver(_observer);
    }
    for (var _i = 0; _i < req.length; _i++) {
      createComputedObserver(owner, { name: req[_i] }, _observer);
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
  return props ? props.hasOwnProperty((0, _parsePath2.default)(name)[0].key) : false;
}

function formatComputedDefinition(computed, props) {
  var config = [];
  var k = void 0,
      v = void 0;
  for (k in computed) {
    v = computed[k];
    k = (0, _parsePath.formatPath)(k);
    if (isPropPath(props, k)) continue;
    if ((0, _utils.isFunction)(v)) {
      config.push({ name: k, require: [], fn: v });
    } else if ((0, _utils.isObject)(v)) {
      var _v = v,
          req = _v.require,
          fn = _v.fn,
          keen = _v.keen;

      if ((0, _utils.isFunction)(fn)) {
        config.push({
          name: k,
          require: (req || []).map(function (n) {
            return (0, _parsePath.formatPath)(n);
          }),
          fn: fn,
          keen: keen
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

  var config = formatComputedDefinition(computedDefinition, owner.__props);

  for (var i = 0; i < config.length; i++) {
    createComputedObserver(owner, config[i]);
  }

  return owner;
}

// 根据输入项 input 推演计算属性结果
function evaluateComputedResult(owner, input) {
  var observers = owner.__computedObservers,
      queue = owner.__computingQueue,
      result = owner.__tempComputedResult;


  for (var k in input) {
    var sections = (0, _parsePath2.default)(k);
    var value = input[k];
    k = (0, _parsePath.compactPath)((0, _parsePath.composePath)(sections));

    var observer = observers[k] || observers[sections[0].key];

    if (observer) {
      if (observer.name === k) {
        observer.eval(value);
      } else {
        (0, _evalPath.setValueOfPath)(result, k, value);
        observer.checkDirty();
        observer.triggerRootObserverChildrenDirtyCheck();
      }
    } else {
      (0, _evalPath.setValueOfPath)(result, k, value);
    }
  }

  consumeObserverQueue(queue);
}

function calculateAliveChanges(observers) {
  var data = {};
  var observer = void 0,
      k = void 0;
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
  var observers = owner.__computedObservers,
      queue = owner.__computingQueue,
      result = owner.__tempComputedResult;


  Object.assign(result, owner.data);

  var k = void 0,
      observer = void 0;
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

exports.calculateInitialComputedValues = calculateInitialComputedValues;
exports.constructComputedFeature = constructComputedFeature;
exports.evaluateComputedResult = evaluateComputedResult;
exports.isPropPath = isPropPath;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.compactPath = exports.composePath = undefined;
exports.default = parsePath;
exports.formatPath = formatPath;

var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    case 2:
      msg = "The path string should not be empty";
      break;
    default:
      msg = "Unknown error occurred when parsing path";
  }
  return new _error2.default(msg + ": " + pathstr);
}

/**
 * path 字符串中第一个 `]` 不能出现在第一个 `[` 之前。
 * 例如以下都是非法 path: `abc]`, `x.y].z`
 */
/*
 * @Author: Xavier Yin
 * @Date: 2019-04-28 15:43:34
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-21 16:49:07
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
 * path 不能为空字符串
 */
var check5 = function check5(path) {
  return path !== "";
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

  var checkers = [check1, check2, check3, check4, check5];
  for (var i = 0; i < checkers.length; i++) {
    if (!checkers[i](path)) {
      throw ParseError(i === 4 ? 2 : i === 1 ? 1 : 0, path);
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
 * @Last Modified time: 2019-05-21 13:53:53
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

exports.default = MiniprogrampatchError;

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

/*
 * @Author: laixi
 * @Date: 2018-10-20 13:17:17
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-21 13:58:53
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

var _isNaN = function _isNaN(x) {
  return typeof x === "number" && isNaN(x);
};

var isEqual = exports.isEqual = function isEqual(x, y) {
  if (x === y) {
    return true;
  } else {
    return _isNaN(x) && _isNaN(y);
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _computed = __webpack_require__(2);

var _evalPath = __webpack_require__(5);

var _parsePath = __webpack_require__(3);

var _utils = __webpack_require__(6);

var _watch = __webpack_require__(8);

// 将计算结果和输入项合并，得出最后发生变化的值
function combineData(observers) {
  var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var input = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var data = Object.assign({}, input);

  var k = void 0;
  for (k in input) {
    var _getValueOfPath = (0, _evalPath.getValueOfPath)(result, k),
        key = _getValueOfPath.key,
        value = _getValueOfPath.value;

    if (key) {
      data[k] = value;
    }
  }

  var observer = void 0;
  for (k in observers) {
    observer = observers[k];
    if (!observer.readonly && observer.isAlive && observer.changed) {
      data[k] = observer.newVal;
    }
  }

  return data;
} /*
   * @Author: Xavier Yin
   * @Date: 2019-05-17 16:40:50
   * @Last Modified by: Xavier Yin
   * @Last Modified time: 2019-05-30 16:20:32
   */

function formatData(input) {
  var data = {};
  for (var k in input) {
    data[(0, _parsePath.formatPath)(k)] = input[k];
  }
  return data;
}

function filterProps(data, props) {
  if (!props) return data;
  var _data = {};
  for (var k in data) {
    if (!(0, _computed.isPropPath)(props, k)) {
      _data[k] = data[k];
    }
  }
  return _data;
}

function setDataApi(data, cb, options) {
  if ((0, _utils.isObject)(data)) {
    var ctx = options.ctx,
        isPropChange = options.isPropChange;


    var changing = ctx.__changing;
    ctx.__changing = true;

    if (!changing) {
      ctx.__data = {};
      ctx.__tempComputedResult = Object.assign({}, ctx.data);
    }

    data = formatData(data);

    if (!isPropChange) {
      data = filterProps(data, ctx.__props);
    }

    Object.assign(ctx.__data, data);

    (0, _computed.evaluateComputedResult)(ctx, data);

    if (changing) return;

    data = filterProps(combineData(ctx.__computedObservers, ctx.__tempComputedResult, ctx.__data), ctx.__props);

    for (var k in ctx.__computedObservers) {
      ctx.__computedObservers[k].clean();
    }

    ctx.__data = null;
    ctx.__changing = false;
    ctx.__setData(data, cb);
    (0, _watch.checkWatchers)(ctx);
  }
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
 * 构建观察能力
 * @param {object} owner page/componnent
 * @param {object} watchDefinition watch 配置
 * @param {object} initialData 初始值
 */
function constructWatchFeature(owner, watchDefinition, initialData) {
  var watchers = owner.__watchers = {};
  if ((0, _utils.isObject)(watchDefinition)) {
    var cb = void 0,
        name = void 0;
    for (name in watchDefinition) {
      cb = watchDefinition[name];
      if ((0, _utils.isFunction)(cb)) {
        name = (0, _parsePath.formatPath)(name);
        watchers[name] = {
          cb: cb,
          path: name,
          value: (0, _evalPath.getValueOfPath)(initialData, name).value
        };
      }
    }
  }
}

/**
 * 检查观察属性是否发生变化以便触发事件回调
 * @param {object} owner page/component
 * @param  {...any} paths 指定需要检查的路径
 */
/*
 * @Author: Xavier Yin
 * @Date: 2019-05-17 17:50:14
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-21 14:04:46
 */
function checkWatchers(owner) {
  for (var _len = arguments.length, paths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    paths[_key - 1] = arguments[_key];
  }

  var watchers = owner.__watchers;
  if (watchers) {
    paths = paths.length ? paths.map(function (path) {
      return (0, _parsePath.formatPath)(path);
    }) : Object.keys(watchers);

    var path = void 0,
        i = void 0;

    var _loop = function _loop() {
      path = paths[i];
      var watcher = watchers[path];
      var old = watcher.value;

      var _getValueOfPath = (0, _evalPath.getValueOfPath)(owner.data, path),
          value = _getValueOfPath.value;

      if (!(0, _utils.isEqual)(old, value)) {
        watcher.value = value;
        setTimeout(function () {
          return watcher.cb.call(owner, value, old);
        });
      }
    };

    for (i = 0; i < paths.length; i++) {
      _loop();
    }
  }
}

module.exports = {
  constructWatchFeature: constructWatchFeature,
  checkWatchers: checkWatchers
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.patchComponent = patchComponent;

var _computed = __webpack_require__(2);

var _setDataApi = __webpack_require__(7);

var _setDataApi2 = _interopRequireDefault(_setDataApi);

var _utils = __webpack_require__(6);

var _watch = __webpack_require__(8);

var _parsePath = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 封装（重新定义）构造配置中的 properties 属性。
 * @param {object} props 构造配置中的 properties 属性值
 */
function initializeProperties(props) {
  var _loop = function _loop(_name) {
    var prop = props[_name];
    _name = (0, _parsePath.formatPath)(_name);
    // 如果构造配置中使用 `{propName<string>: constructor<function>}` 格式来定义 prop，
    // 那么将它转换为 `{prop<string>: config<object>}` 格式
    if ((0, _utils.isFunction)(prop) || prop === null) prop = props[_name] = { type: prop };

    // 获取原始配置中的 observer 值
    var _prop = prop,
        observer = _prop.observer;

    if (!(0, _utils.isFunction)(observer)) observer = null;

    // 重新定义 prop 配置中的 observer 值
    prop.observer = function (newVal, oldVal, changedPath) {
      var _this = this;

      // 如果未初始化计算能力，则不调用
      // 此处表示非初始化，开始异步调用
      if (prop.observer.__hasCalled && this.$setData && this.$setData.__attached) {
        if (!this.__changedProps) this.__changedProps = {};
        this.__changedProps[_name] = newVal;
        setTimeout(function () {
          if (_this.__changedProps) {
            (0, _setDataApi2.default)(_this.__changedProps, null, {
              ctx: _this,
              isPropChange: true
            });
            _this.__changedProps = null;
          }
          if (observer) {
            observer.call(_this, newVal, oldVal, changedPath);
          }
        });
      } else {
        // 这里是 Page/Component 初始化时，Observer 会被调用一次
        prop.observer.__hasCalled = true;
        if (observer) {
          // 如果 prop 中定义了 observer 函数，则触发该函数调用。
          observer.call(this, newVal, oldVal, changedPath);
        }
      }
    };
    name = _name;
  };

  for (var name in props) {
    _loop(name);
  }
  return props;
}

/**
 * 为小程序组件打补丁
 * @param {function} Component 小程序组件构造函数
 * @param {object} options 可选项
 */
/*
 * @Author: laixi
 * @Date: 2018-10-21 21:49:26
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-31 23:11:38
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
      this.__props = obj.properties;
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

      // 赋予计算能力
      (0, _computed.constructComputedFeature)(this, computed);

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
          return (0, _setDataApi2.default)(data, cb, { ctx: this });
        };

        // 用来标识这个 $setData 不是 created 钩子中的临时方法。
        this.$setData.__attached = true;

        var values = (0, _computed.calculateInitialComputedValues)(this);
        if (values) this.__setData(values);

        // 初始化 watch 配置
        (0, _watch.constructWatchFeature)(this, watch || {}, this.data);

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