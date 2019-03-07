// miniprogrampatch v1.1.10 Thu Mar 07 2019  
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

var _Component = __webpack_require__(6);

/*
 * @Author: laixi 
 * @Date: 2018-10-20 12:56:52 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-22 17:43:54
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

var _setDataApi = __webpack_require__(4);

var _setDataApi2 = _interopRequireDefault(_setDataApi);

var _utils = __webpack_require__(3);

var _watch = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @Author: laixi 
 * @Date: 2018-10-21 21:27:48 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-27 19:46:03
 */
function patchPage(Page, options) {
  if (Page.__patchPage) return Page;
  var isSetDataReadOnly = false;

  var _ref = options || {},
      debug = _ref.debug;

  var constructor = function constructor(obj) {
    obj = Object.assign({}, obj);
    obj.__computed = (0, _computed.initializeComputed)(obj.computed || {});

    var _obj = obj,
        onLoad = _obj.onLoad,
        watch = _obj.watch;

    obj.onLoad = function (queries) {
      if (!this.$setData) {
        this.__setData = this.setData;
        this.$setData = this.updateData = function (data, cb) {
          return (0, _setDataApi2.default)(data, cb, { ctx: this });
        };
        var computedResult = (0, _computed.evaluateComputed)(this, null, { initial: true });
        this.__setData(computedResult);
        this.__watch = (0, _watch.initializeWatchers)(this, watch || {});
        try {
          if (!isSetDataReadOnly) {
            this.setData = this.$setData;
          }
        } catch (e) {
          isSetDataReadOnly = true;
          if (debug) {
            console.log(e);
            console.log('using this.$setData instead of this.setData to support watch and computed features.');
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
exports.initializeComputed = initializeComputed;
exports.evaluateComputed = evaluateComputed;

var _utils = __webpack_require__(3);

// 如果 m 依赖于 n，则返回 true，否则 false
function depends(m, n) {
  return !!~m.require.indexOf(n.name);
}

// 计算依赖优先级
/*
 * @Author: laixi
 * @Date: 2018-10-20 20:50:50
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-03-01 09:53:15
 */

function sortDeps(list) {
  var tmp = [];
  var item = void 0,
      broken = void 0,
      i = void 0,
      tmp2 = void 0,
      ii = void 0,
      index = void 0;
  while (list.length) {
    item = list.pop();
    broken = false;
    for (i in tmp) {
      if (depends(tmp[i], item)) {
        tmp2 = tmp.splice(i, tmp.length - i, item);
        for (ii in item.require) {
          index = tmp2.findIndex(function (x) {
            return x.name === item.require[ii];
          });
          if (index > -1) {
            list.push(tmp2.splice(index, 1)[0]);
          }
        }
        tmp = tmp.concat(tmp2);
        broken = true;
        break;
      }
    }
    if (!broken) {
      tmp.push(item);
    }
  }
  return tmp;
}

/**
 * 初始化计算属性配置
 */
function initializeComputed(computed) {
  var data = [];
  var key = void 0,
      value = void 0;
  for (key in computed) {
    value = computed[key];
    if ((0, _utils.isFunction)(value)) {
      data.push({ name: key, require: [], fn: value });
    } else if ((0, _utils.isObject)(value)) {
      var _value = value,
          _value$require = _value.require,
          require = _value$require === undefined ? [] : _value$require,
          fn = _value.fn;

      if ((0, _utils.isFunction)(fn)) {
        data.push({ name: key, require: require, fn: fn });
      }
    }
  }
  if (data.length > 1) {
    data = sortDeps(data);
  }
  return data;
}

function evaluateComputed(ctx, changed, options) {
  var _ref = options || {},
      initial = _ref.initial;

  var computedResult = {};
  var computed = ctx.__computed;

  var changedData = void 0;
  if (computed && computed.length) {
    if (initial) {
      for (var i in computed) {
        var _computed$i = computed[i],
            fn = _computed$i.fn,
            r = _computed$i.require,
            name = _computed$i.name;

        changedData = r.reduce(function (memo, item) {
          var _result = (0, _utils.result)(ctx.data, item),
              key = _result.key,
              value = _result.value;

          memo[item] = key ? value : (0, _utils.result)(computedResult, item).value;
          return memo;
        }, {});
        computedResult[name] = fn.call(ctx, changedData);
      }
    } else {
      var changedKeys = Object.keys(changed);
      if (changedKeys.length) {
        var pathCache = {};
        var changedPaths = changedKeys.map(function (item) {
          return pathCache[item] = (0, _utils.pathToArray)(item);
        });
        for (var _i in computed) {
          var _computed$_i = computed[_i],
              fn = _computed$_i.fn,
              r = _computed$_i.require,
              name = _computed$_i.name;

          if (r.length) {
            (function () {
              var needUpdate = false;
              var requiredName = void 0,
                  requirePath = void 0;
              for (var m in r) {
                requiredName = r[m];
                requirePath = pathCache[requiredName] || (pathCache[requiredName] = (0, _utils.pathToArray)(requiredName));
                if (~changedPaths.findIndex(function (path) {
                  return (0, _utils.hasIntersection)(requirePath, path);
                })) {
                  changedPaths.push(pathCache[name] || (pathCache[name] = (0, _utils.pathToArray)(name)));
                  needUpdate = true;
                  break;
                }
              }
              if (needUpdate) {
                changedData = r.reduce(function (memo, item) {
                  var _result2 = (0, _utils.result)(computedResult, item),
                      key = _result2.key,
                      value = _result2.value;
                  // 当 Component 的 prop 发生变化时，绕开了 $setData 方法触发数据更新
                  // 此时的 ctx.__data 为 undefined 或者 null，需要使用 ctx.data 来推算新的 computed 结果


                  memo[item] = key ? value : (0, _utils.result)(ctx.__data || ctx.data, item).value;
                  return memo;
                }, {});
                computedResult[name] = fn.call(ctx, changedData);
              }
            })();
          }
        }
      }
    }
  }
  return computedResult;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.result = result;
exports.setResult = setResult;
exports.hasIntersection = hasIntersection;
/*
 * @Author: laixi
 * @Date: 2018-10-20 13:17:17
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-03-07 11:41:09
 */

var isObject = exports.isObject = function isObject(obj) {
  return obj !== null && "object" === (typeof obj === "undefined" ? "undefined" : _typeof(obj));
};
var isFunction = exports.isFunction = function isFunction(obj) {
  return "function" === typeof obj;
};
var isString = exports.isString = function isString(obj) {
  return "string" === typeof obj;
};
var isArray = exports.isArray = function isArray(x) {
  return x && x.constructor === Array;
};
var trim = exports.trim = function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, "");
};

var trimDot = function trimDot(str) {
  return str.replace(/^\.|\.$/g, "");
};
var startsWithSquare = function startsWithSquare(str) {
  return (/^\[/.test(str)
  );
};
var startsWithDot = function startsWithDot(str) {
  return (/^\./.test(str)
  );
};

/**
 * 解析路径式的属性名称
 * @param {string} path 属性名称（允许dot分隔）
 * @param {*} names
 */
function parsePath(path) {
  var names = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  path = trim(path);
  if (startsWithDot(path)) {
    path = trimDot(path);
    return parsePath(path, names);
  } else if (startsWithSquare(path)) {
    var name = /^\[(\d+)\]/.exec(path);
    if (name) {
      names.push({ name: name[1], type: "array" });
      if (name[0] === path) {
        return names;
      } else {
        return parsePath(path.slice(name[0].length), names);
      }
    } else {
      throw Error("Only number 0-9 could inside []");
    }
  } else {
    var _name = /^([^\[\.]+)/.exec(path);
    if (_name) {
      names.push({ name: _name[1], type: "object" });
      if (_name[0] === path) {
        return names;
      } else {
        return parsePath(path.slice(_name[0].length), names);
      }
    } else {
      return names;
    }
  }
}

var pathToArray = exports.pathToArray = function pathToArray(path) {
  return parsePath(path).map(function (item) {
    return item.name;
  });
};

// 调用场景中会保证 obj 为 object，path 为 string，
// 因此本函数不再检查数据类型。
function result(obj, path) {
  if (!obj) return { key: false };
  if (obj.hasOwnProperty(path)) {
    return { key: true, value: obj[path], path: [path] };
  } else {
    path = pathToArray(path);
    var value = void 0;
    for (var i in path) {
      if (isObject(obj) && obj.hasOwnProperty(path[i])) {
        value = obj[path[i]];
        obj = value;
      } else {
        return { key: false };
      }
    }
    return { key: true, value: value, path: path };
  }
}

function _whichType(obj) {
  return isArray(obj) ? "array" : isObject(obj) ? "object" : "other";
}

function setResult(obj, path, value) {
  var root = obj;
  path = parsePath(path);
  var parent = void 0,
      lastName = void 0;
  if (!path.length) throw Error("Path can not be empty");
  for (var i in path) {
    var _path$i = path[i],
        name = _path$i.name,
        type = _path$i.type;


    if (i == 0) {
      if (type === "array") {
        throw Error("Path can not start with []");
      }
    } else {
      if (_whichType(obj) !== type) {
        obj = parent[lastName] = type === "array" ? [] : {};
      }
    }
    parent = obj;
    obj = parent[name];
    lastName = name;
  }
  parent[lastName] = value;
  return root;
}

// 判断两个嵌套路径之间是否具有交集
function hasIntersection(obj, target) {
  return obj[0] === target[0];
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   * @Author: laixi
                                                                                                                                                                                                                                                                   * @Date: 2018-10-20 20:48:40
                                                                                                                                                                                                                                                                   * @Last Modified by: Xavier Yin
                                                                                                                                                                                                                                                                   * @Last Modified time: 2019-02-28 17:26:19
                                                                                                                                                                                                                                                                   */

exports.default = setDataApi;

var _utils = __webpack_require__(3);

var _computed = __webpack_require__(2);

var _watch = __webpack_require__(5);

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function assignResult(obj, data) {
  for (var key in data) {
    (0, _utils.setResult)(obj, key, data[key]);
  }
}

function setDataApi(obj, cb, options) {
  if (!(0, _utils.isObject)(obj)) return;

  var ctx = options.ctx,
      initial = options.initial;

  var changing = ctx.__changing;
  ctx.__changing = true;

  if (!changing) {
    ctx.__data = _extends({}, ctx.data);
    ctx.__changed = {};
    ctx.__unchanged = {};
  }

  var keys = Object.keys(obj);
  var changed = {};
  var oldVal = void 0,
      newVal = void 0,
      name = void 0;
  for (var i = 0; i < keys.length; i++) {
    name = keys[i];
    oldVal = (0, _utils.result)(ctx.__data, name).value;
    newVal = obj[name];
    if (oldVal !== newVal) {
      changed[name] = newVal;
    } else {
      ctx.__unchanged[name] = newVal;
    }
  }

  // save changed data
  Object.assign(ctx.__changed, changed);
  // save all data
  assignResult(ctx.__data, obj);
  // evaluate the computed data
  var computedResult = (0, _computed.evaluateComputed)(ctx, changed, { initial: initial });
  // save changed computed data
  Object.assign(ctx.__changed, computedResult);
  // save all computed data
  assignResult(ctx.__data, computedResult);

  if (changing) return ctx.__data;

  // 判断键值是否仍然有效（可能被覆写了）
  var data = {};
  for (var k in ctx.__changed) {
    var _result = (0, _utils.result)(ctx.__data, k),
        key = _result.key,
        value = _result.value;

    if (key) {
      data[k] = value;
    }
  }

  var all = Object.assign(ctx.__unchanged, data);

  ctx.__changing = false;
  ctx.__data = null;
  ctx.__changed = null;
  ctx.__unchanged = null;

  ctx.__setData(all, cb);
  (0, _watch2.default)(ctx, data);
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.initializeWatchers = initializeWatchers;
exports.default = checkWatchers;

var _utils = __webpack_require__(3);

function initializeWatchers(ctx, watch) {
  var watchers = {};
  var cb = void 0;
  for (var k in watch) {
    cb = watch[k];
    if ((0, _utils.isFunction)(cb)) {
      watchers[k] = {
        cb: cb,
        value: (0, _utils.result)(ctx.data, k).value,
        path: (0, _utils.pathToArray)(k)
      };
    }
  }
  return watchers;
} /*
   * @Author: laixi
   * @Date: 2018-10-21 21:50:40
   * @Last Modified by: Xavier Yin
   * @Last Modified time: 2019-03-01 09:53:39
   */
function checkWatchers(ctx, changed) {
  var watchers = ctx.__watch;
  var watchKeys = watchers ? Object.keys(watchers) : [];
  var changedKeys = Object.keys(changed);
  var pathCache = {};
  var watcher = void 0;
  if (watchKeys.length && changedKeys.length) {
    var _loop = function _loop(k) {
      watcher = watchers[k];
      var _watcher = watcher,
          cb = _watcher.cb,
          value = _watcher.value,
          path = _watcher.path;

      for (var name in changed) {
        if ((0, _utils.hasIntersection)(path, pathCache[name] || (pathCache[name] = (0, _utils.pathToArray)(name)))) {
          (function () {
            var newVal = (0, _utils.result)(ctx.data, k).value;
            if (newVal !== value) {
              watcher.value = newVal;
              setTimeout(function () {
                return cb.call(ctx, newVal, value);
              });
            }
          })();
        }
      }
    };

    for (var k in watchers) {
      _loop(k);
    }
  }
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.patchComponent = patchComponent;

var _computed = __webpack_require__(2);

var _setDataApi = __webpack_require__(4);

var _setDataApi2 = _interopRequireDefault(_setDataApi);

var _utils = __webpack_require__(3);

var _watch = __webpack_require__(5);

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @Author: laixi 
 * @Date: 2018-10-21 21:49:26 
 * @Last Modified by: laixi
 * @Last Modified time: 2018-10-27 19:57:48
 */
function initializeProperties(props) {
  var _loop = function _loop(name) {
    var prop = props[name];
    if ((0, _utils.isFunction)(prop) || prop === null) prop = props[name] = { type: prop };

    var _prop = prop,
        observer = _prop.observer;


    prop.observer = function (newVal, oldVal, changedPath) {
      var _evaluateComputed, _checkWatchers;

      var computed = (0, _computed.evaluateComputed)(this, (_evaluateComputed = {}, _evaluateComputed[name] = newVal, _evaluateComputed));
      if (Object.keys(computed).length) {
        this.$setData(computed);
      }
      (0, _watch2.default)(this, (_checkWatchers = {}, _checkWatchers[name] = newVal, _checkWatchers));
      if ((0, _utils.isFunction)(observer)) observer.call(this, newVal, oldVal, changedPath);
    };
  };

  for (var name in props) {
    _loop(name);
  }
  return props;
}

function patchComponent(Component, options) {
  if (Component.__patchComponent) return Component;
  var isSetDataReadOnly = false;

  var _ref = options || {},
      debug = _ref.debug;

  var constructor = function constructor(obj) {
    obj = Object.assign({}, obj);
    obj.properties = initializeProperties(obj.properties || {});

    var _ref2 = obj.lifetimes || obj,
        attached = _ref2.attached,
        created = _ref2.created,
        watch = _ref2.watch;

    var _created = function _created() {
      if (!this.$setData) {
        // 小程序在初始化 prop 时，如果初始参数和定义的缺省值不同，会触发一次 observer
        // 但此时 $setData 还未挂载，因此在 created 中先做一个 setData 快捷调用方式
        // 此处不能 this.$setData = this.setData，因为此时的 this.setData 也不是 created 之后的 setData
        // 不在此时使用 setDataApi 可以避免触发 watcher 检查
        this.$setData = function () {
          return this.setData.call(this, arguments);
        };
      }
      if ((0, _utils.isFunction)(created)) created.apply(this, arguments);
    };

    var _attached = function _attached() {
      if (!(this.$setData && this.$setData.__attached)) {
        this.__setData = this.setData;
        this.$setData = this.updateData = function (data, cb) {
          return (0, _setDataApi2.default)(data, cb, { ctx: this });
        };
        this.$setData.__attached = true;

        this.__computed = (0, _computed.initializeComputed)(obj.computed || {});
        var computedResult = (0, _computed.evaluateComputed)(this, null, { initial: true });
        this.__setData(computedResult);
        this.__watch = (0, _watch.initializeWatchers)(this, watch || {});
        try {
          if (!isSetDataReadOnly) {
            this.setData = this.$setData;
          }
        } catch (e) {
          isSetDataReadOnly = true;
          if (debug) {
            console.log(e);
            console.log('using this.$setData instead of this.setData to support watch and computed features.');
          }
        }
      }
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