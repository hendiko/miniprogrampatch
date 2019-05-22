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
class MiniprogrampatchError extends Error {
  constructor(...args) {
    super(...args);
    this.name = MiniprogrampatchError.name;
  }
}

export default MiniprogrampatchError;
