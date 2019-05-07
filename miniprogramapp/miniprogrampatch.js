// miniprogrampatch v1.1.11 Tue May 07 2019  
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

var _Component = __webpack_require__(8);

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

var _setDataApi = __webpack_require__(6);

var _setDataApi2 = _interopRequireDefault(_setDataApi);

var _utils = __webpack_require__(3);

var _watch = __webpack_require__(7);

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
 * @Last Modified time: 2019-04-24 14:40:02
 */
function patchPage(Page, options) {
  if (Page.__patchPage) return Page;
  var isSetDataReadOnly = false;

  var _ref = options || {},
      debug = _ref.debug;

  // 封装页面构造函数


  var constructor = function constructor(obj) {
    obj = Object.assign({}, obj);
    // 初始化计算属性规则
    obj.__computed = (0, _computed.initializeComputed)(obj.computed || {});

    var _obj = obj,
        onLoad = _obj.onLoad,
        watch = _obj.watch;

    // 封装 onLoad 钩子

    obj.onLoad = function (queries) {
      if (!this.$setData) {
        // 保留原始 setData 引用
        this.__setData = this.setData;
        this.$setData = this.updateData = function (data, cb) {
          return (0, _setDataApi2.default)(data, cb, { ctx: this });
        };
        // 初始化 computed 值
        var computedResult = (0, _computed.evaluateComputed)(this, null, { initial: true });
        this.__setData(computedResult);
        // 初始化 watch 规则
        this.__watch = (0, _watch.initializeWatchers)(this, watch || {});
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
exports.initializeComputed = initializeComputed;
exports.evaluateComputed = evaluateComputed;

var _utils = __webpack_require__(3);

var _evalPath = __webpack_require__(4);

var _parsePath = __webpack_require__(5);

// 判断 m 是否依赖于 n。
// 如果 m 依赖于 n，则返回 true，否则 false
function depends(m, n) {
  var name = n.name;

  for (var i = 0; i < m.require.length; i++) {
    // 在 m 的 require 列表中的依赖字段，其中任意一个包含了 n.name；
    // 则认为 m 依赖于 n。
    if ((0, _parsePath.isSameRootOfPath)(m.require[i], name)) return true;
  }
  return false;
}

/**
 * 计算依赖优先级
 * @param {array} list 数组成员格式 `{name:string, require:array, fn:function}`
 * @bug
 * 没有解决隐式依赖之间的关系
 */
/*
 * @Author: laixi
 * @Date: 2018-10-20 20:50:50
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-30 09:35:35
 */

function sortDeps(list) {
  var sorted = [];
  var item = void 0,
      isRequired = void 0,
      i = void 0,
      tmp = void 0,
      ii = void 0,
      index = void 0;
  while (list.length) {
    item = list.pop();
    isRequired = false;
    for (i in sorted) {
      // 检查已排序的属性，是否有隐式依赖于 item
      // 有的话，则从 sorted 中取出，使用 item 替代它的位置。
      if (depends(sorted[i], item)) {
        tmp = sorted.splice(i, sorted.length - i, item);
        for (ii in item.require) {
          // 检查剩余的暂存属性，是否有 item 的显式依赖。
          // 如果有，则取出放回到 list 中。
          index = tmp.findIndex(function (x) {
            return x.name === item.require[ii];
          });
          if (index > -1) {
            list.push(tmp.splice(index, 1)[0]);
          }
        }
        // 剩下的字段说明没有被 item 显式依赖，可以放回 sorted 并位于 item 之后
        sorted = sorted.concat(tmp);
        isRequired = true;

        // sorted 有变化，取消继续循环
        break;
      }
    }

    // sorted 中没有一个属性依赖于 item，可以安全放入 sorted 中。
    if (!isRequired) {
      sorted.push(item);
    }
  }
  return sorted;
}

/**
 * 初始化计算属性规则
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

/**
 * 演算计算属性值
 * @param {object} ctx Page/Component 实例
 * @param {object} changed 发生变化的属性键值对
 * @param {object} options 可选项
 */
function evaluateComputed(ctx, changed, options) {
  var _ref = options || {},
      initial = _ref.initial;

  var computedResult = {};
  var computed = ctx.__computed;

  var changedData = void 0;

  // 必需要先定义了计算规则
  if (computed && computed.length) {
    // 首次演算计算属性
    if (initial) {
      for (var i in computed) {
        var _computed$i = computed[i],
            fn = _computed$i.fn,
            r = _computed$i.require,
            name = _computed$i.name;

        changedData = r.reduce(function (memo, item) {
          // 首次演算是在实例初始化，此时未调用 $setData，ctx__data 属性中没有任何值。
          // 因此此时应该使用 ctx.data 求值
          var _getValueOfPath = (0, _evalPath.getValueOfPath)(ctx.data, item),
              key = _getValueOfPath.key,
              value = _getValueOfPath.value;

          memo[item] = key ? value : (0, _evalPath.getValueOfPath)(computedResult, item).value;
          return memo;
        }, {});
        computedResult[name] = fn.call(ctx, changedData);
      }
    } else {
      var changedKeys = Object.keys(changed);
      if (changedKeys.length) {
        var pathCache = {};
        var changedPaths = changedKeys.map(function (item) {
          return pathCache[item] = (0, _parsePath.pathToArray)(item);
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
                requirePath = pathCache[requiredName] || (pathCache[requiredName] = (0, _parsePath.pathToArray)(requiredName));
                if (~changedPaths.findIndex(function (path) {
                  return (0, _utils.hasIntersection)(requirePath, path);
                })) {
                  changedPaths.push(pathCache[name] || (pathCache[name] = (0, _parsePath.pathToArray)(name)));
                  needUpdate = true;
                  break;
                }
              }
              if (needUpdate) {
                changedData = r.reduce(function (memo, item) {
                  var _getValueOfPath2 = (0, _evalPath.getValueOfPath)(computedResult, item),
                      key = _getValueOfPath2.key,
                      value = _getValueOfPath2.value;
                  // 当 Component 的 prop 发生变化时，绕开了 $setData 方法触发数据更新
                  // 此时的 ctx.__data 为 undefined 或者 null，需要使用 ctx.data 来推算新的 computed 结果


                  memo[item] = key ? value : (0, _evalPath.getValueOfPath)(ctx.__data || ctx.data, item).value;
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

exports.hasIntersection = hasIntersection;
/*
 * @Author: laixi
 * @Date: 2018-10-20 13:17:17
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-29 18:25:07
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

// export const isString = obj => "string" === typeof obj;
// export const trim = str => str.replace(/(^\s+)|(\s+$)/g, "");

// 判断两个嵌套路径之间是否具有交集
function hasIntersection(obj, target) {
  return obj[0] === target[0];
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getValueOfPath = getValueOfPath;
exports.setValueOfPath = setValueOfPath;

var _parsePath = __webpack_require__(5);

var _parsePath2 = _interopRequireDefault(_parsePath);

var _utils = __webpack_require__(3);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = parsePath;
exports.isSameRootOfPath = isSameRootOfPath;
exports.pathToArray = pathToArray;
exports.formatPath = formatPath;
/*
 * @Author: Xavier Yin
 * @Date: 2019-04-28 15:43:34
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-06 16:24:35
 *
 * 解析小程序 data 以路径作为属性名
 */

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
  return new Error("[miniprogrampatch] " + msg + ": " + pathstr);
}

/**
 * path 字符串中第一个 `]` 不能出现在第一个 `[` 之前。
 * 例如以下都是非法 path: `abc]`, `x.y].z`
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
      throw new ParseError(i === 1 ? 1 : 0, path);
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
        if (!index) throw new ParseError(0, path);
        index *= 1;
        if (isNaN(index)) throw new ParseError(0, path);
        sections.push({ type: 1, key: index });

        if (position < usingPath.length) {
          sections = sections.concat(parsePathWithoutLSB(usingPath.slice(position)));
        }
      } else {
        throw new ParseError(0, path);
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   * @Author: laixi
                                                                                                                                                                                                                                                                   * @Date: 2018-10-20 20:48:40
                                                                                                                                                                                                                                                                   * @Last Modified by: Xavier Yin
                                                                                                                                                                                                                                                                   * @Last Modified time: 2019-04-29 10:05:27
                                                                                                                                                                                                                                                                   */

exports.default = setDataApi;

var _utils = __webpack_require__(3);

var _computed = __webpack_require__(2);

var _watch = __webpack_require__(7);

var _watch2 = _interopRequireDefault(_watch);

var _evalPath = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 快速设置 `key:value` 形式传参的属性
 * @param {object} obj
 * @param {object} data
 */
function assignResult(obj, data) {
  for (var key in data) {
    (0, _evalPath.setValueOfPath)(obj, key, data[key]);
  }
}

/**
 * `miniprogrampatch` 提供的 `setData` 方法的内部实现
 * @param {object} obj key-value 格式的待设置属性值
 * @param {function} cb 设置属性之后的回调
 * @param {object} options 可选项
 */
function setDataApi(obj, cb, options) {
  if (!(0, _utils.isObject)(obj)) return;

  // ctx: Page/Component 实例
  // initial: 是否是首次设置
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
    oldVal = (0, _evalPath.getValueOfPath)(ctx.__data, name).value;
    newVal = obj[name];
    if (oldVal !== newVal) {
      changed[name] = newVal;
    } else {
      ctx.__unchanged[name] = newVal;
    }
  }

  // 暂存所有发生变化的属性
  Object.assign(ctx.__changed, changed);
  // 暂存所有新设置的属性
  assignResult(ctx.__data, obj);
  // 演算计算属性
  var computedResult = (0, _computed.evaluateComputed)(ctx, changed, { initial: initial });
  // 缓存所有可能发生变化的计算属性
  Object.assign(ctx.__changed, computedResult);
  // 暂存所有新计算出来的属性
  assignResult(ctx.__data, computedResult);

  if (changing) return ctx.__data;

  // 判断键值是否仍然有效（可能被覆写了）
  var data = {};
  for (var k in ctx.__changed) {
    var _getValueOfPath = (0, _evalPath.getValueOfPath)(ctx.__data, k),
        key = _getValueOfPath.key,
        value = _getValueOfPath.value;

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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.initializeWatchers = initializeWatchers;
exports.default = checkWatchers;

var _utils = __webpack_require__(3);

var _evalPath = __webpack_require__(4);

var _parsePath = __webpack_require__(5);

/** 初始化属性观察者 */
function initializeWatchers(ctx, watch) {
  var watchers = {};
  var cb = void 0,
      k = void 0;
  for (k in watch) {
    cb = watch[k];
    // 在构造配置中，只有定义了观察响应函数，才算有效观察。
    if ((0, _utils.isFunction)(cb)) {
      watchers[k] = {
        cb: cb,
        value: (0, _evalPath.getValueOfPath)(ctx.data, k).value, // 缓存被观察属性的旧值
        path: (0, _parsePath.pathToArray)(k)
      };
    }
  }
  return watchers;
}

/**
 * @param {object} ctx Page/Component 实例
 * @param {*} changed
 */
/*
 * @Author: laixi
 * @Date: 2018-10-21 21:50:40
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-29 18:17:44
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
        if ((0, _utils.hasIntersection)(path, pathCache[name] || (pathCache[name] = (0, _parsePath.pathToArray)(name)))) {
          (function () {
            var newVal = (0, _evalPath.getValueOfPath)(ctx.data, k).value;
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.patchComponent = patchComponent;

var _computed = __webpack_require__(2);

var _setDataApi = __webpack_require__(6);

var _setDataApi2 = _interopRequireDefault(_setDataApi);

var _utils = __webpack_require__(3);

var _watch = __webpack_require__(7);

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 封装（重新定义）构造配置中的 properties 属性。
 * @param {object} props 构造配置中的 properties 属性值
 */
/*
 * @Author: laixi
 * @Date: 2018-10-21 21:49:26
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-24 14:34:07
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
      var _evaluateComputed, _checkWatchers;

      // 计算当前组件/页面的 prop 的变化是否引起了 computed 值变化
      var computed = (0, _computed.evaluateComputed)(this, (_evaluateComputed = {}, _evaluateComputed[name] = newVal, _evaluateComputed));
      if (Object.keys(computed).length) {
        // 如果 computed 属性发生变化，则重新设置相关属性值。
        this.$setData(computed);
      }
      // 触发观察函数调用(the handler will be called in asynchronous way)
      (0, _watch2.default)(this, (_checkWatchers = {}, _checkWatchers[name] = newVal, _checkWatchers));
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
        lifetimes = _obj.lifetimes;

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
          return (0, _setDataApi2.default)(data, cb, { ctx: this });
        };

        // 用来标识这个 $setData 不是 created 钩子中的临时方法。
        this.$setData.__attached = true;

        // 初始化计算属性的配置
        this.__computed = (0, _computed.initializeComputed)(obj.computed || {});
        // 初始化 computed 各个属性值
        var computedResult = (0, _computed.evaluateComputed)(this, null, { initial: true });
        this.__setData(computedResult);
        // 初始化 watch 配置
        this.__watch = (0, _watch.initializeWatchers)(this, watch || {});

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