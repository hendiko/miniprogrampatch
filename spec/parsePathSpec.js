/*
 * @Author: Xavier Yin
 * @Date: 2019-05-06 15:58:50
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-23 11:08:02
 */
import parsePath, { formatPath } from "../src/parsePath";

// 小程序调试基础库 v2.6.1 解析规则
describe("Test parsePath", () => {
  it("These are valid path expressions.", () => {
    // 以下路径都是合法的，以及它们被转换后的路径
    let paths = {
      "1.2": "1.2",
      x: "x",
      "x.y.z": "x.y.z",
      "x.y.[2][12]xy.z": "x.y[2][12]xy.z",
      "x.y[11.11]z": "x.y[1111]z",
      "x.y[.11.]z": "x.y[11]z",
      "x[1111": "x",
      "x[1[2]23": "x[12]23",
      "x[1][[[[2]]]]y": "x[1][2][0][0][0]y",
      "x[1][.[.[.[2]]]]y": "x[1][2][0][0][0]y",
      "x[1]23]4]5]6]y": "x[1][0][0][0][0]23456y",
      "x[1]23]4]5x ]6]": "x[1][0][0][0][0]2345x 6",
      "x[1]23]4]5]6].y": "x[1][0][0][0][0]23456.y",
      "b[1]2].a3].x": "b[1][0]2[0]a3.x"
    };

    for (let k in paths) {
      expect(formatPath(k)).toBe(paths[k]);
    }
  });

  it("These are invalid path expressions.", () => {
    // 这些路径都是非法的
    let paths = [
      "",
      "[1]x",
      "x]][0]",
      "x[a]",
      "x[abc",
      "x[]",
      "x[-1]",
      "x[  1]",
      "x[.]",
      "x[1 1]",
      "x[ ]",
      "x[1][. [.[.[2]]]]y" // 等效于 a[1][ 2][0][0][0]y，第二个数组中存在空白字符导致非法
    ];

    for (let item of paths) {
      expect(() => parsePath(item)).toThrowError();
    }
  });
});
