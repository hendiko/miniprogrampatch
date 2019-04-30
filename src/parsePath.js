/*
 * @Author: Xavier Yin
 * @Date: 2019-04-28 15:43:34
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-04-29 18:16:37
 *
 * 解析小程序 data 以路径作为属性名
 */

/** 解析路径异常 */
function ParseError(type, pathstr) {
  let msg;
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
  return new Error(`[miniprogrampatch] ${msg}: ${pathstr}`);
}

/**
 * path 字符串中第一个 `]` 不能出现在第一个 `[` 之前。
 * 例如以下都是非法 path: `abc]`, `x.y].z`
 */
const check1 = path => !/^[^\[]*\]/.test(path);

/**
 * path 根节点不能是数组，即不能以 `[` 开头。(预转换后检查项)
 */
const check2 = path => !path.startsWith("[");

/**
 * path 不能以未关闭的数组表达式加上对象表达式结尾，例如 `x.y[abc` 非法。
 */
const check3 = path => !/(.+)\[[^\]]+$/g.test(path);

/**
 * path 中不能存在空数组表达式，即不能包含 `[]` 字符串
 */
const check4 = path => !/\[\]/.test(path);

/**
 * 连续句号字符串转换为一个句号字符
 */
const transform1 = path => path.replace(/\.+/g, ".");

/**
 * 去除首尾的句号
 */
const transform2 = path => /^\.*(.*?)\.*$/g.exec(path)[1];

/**
 * 去除未关闭的数组表达式结尾，即 `x.y[11.22`, `x.y[[[[[` 是合法的，但等同于 `x.y`。
 */
const transform3 = path => path.replace(/\[[\[\.\d]*$/g, "");

/**
 * 连续空字符串转换为一个空字符串
 */
const transform4 = path => path.replace(/\s+/g, " ");

/**
 * 查看目标字符串包含多少个 `]` 字符
 * @param {string} str 被检查字符串
 */
const countRSB = str => (str.match(/\]/g) || []).length;

/**
 * 对 path 进行预处理，包括检查 path 合法性和字符串转换
 * @param {string} path 属性路径
 */
function preprocessPath(path) {
  path = [transform1, transform4, transform2, transform3].reduce(
    (path, fn) => fn(path),
    path
  );

  let checkers = [check1, check2, check3, check4];
  for (let i = 0; i < checkers.length; i++) {
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
  let parts = transform2(path).split(".");
  let sections = [];
  let str, count, i, ii;
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
  let sections = [];
  if (path) {
    let startsWithLSB = path.startsWith("[");
    let usingPath = /^(\[[^\]]*\])|([^\[]+)/g.exec(path)[startsWithLSB ? 1 : 2];
    let restSections = [];
    if (usingPath.length < path.length) {
      restSections = parsePathApi(path.slice(usingPath.length));
    }

    if (startsWithLSB) {
      let index = /^\[([\d\.\[]+)\]/g.exec(usingPath);
      if (index) {
        index = index[1];
        let position = index.length + 2;

        index = index.replace(/\.|\[]/g, "");
        if (!index) throw new ParseError(0, path);
        index *= 1;
        if (isNaN(index)) throw new ParseError(0, path);
        sections.push({ type: 1, key: index });

        if (position < usingPath.length) {
          sections = sections.concat(
            parsePathWithoutLSB(usingPath.slice(position))
          );
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
export default function parsePath(path) {
  return parsePathApi(preprocessPath(path));
}

/**
 * 将解析后的节点拼接成完成路径表达式
 * @param {array} sections 解析后的路径节点
 */
export const composePath = sections => {
  return sections
    .map(item => (item.type === 0 ? item.key : `[${item.key}]`))
    .join(".");
};

/**
 * 将路径表达式中多余的句号去掉。
 * @example
 * `x.y.[0].[1].z` 转换为 `x.y[0][1]z`
 * @param {string} path 路径表达式
 */
export const compactPath = path =>
  path.replace(/\.\[/g, "[").replace(/\]\./g, "]");

/**
 * 比较两个路径是否具有相同的根节点
 * @param {string} path1 参照路径
 * @param {string} path2 对比路径
 */
export function isSameRootOfPath(path1, path2) {
  return parsePath(path1)[0].key === parsePath(path2)[0].key;
}

/**
 * 将路径分解为节点名称组成的数组
 *
 * @example
 * `pathToArray("x[1]y.z")` 返回 `["x", 1, "y", "z"]`
 * @param {string} path 路径
 */
export function pathToArray(path) {
  return parsePath(path).map(section => section.key);
}
