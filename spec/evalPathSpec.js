/*
 * @Author: Xavier Yin
 * @Date: 2019-05-06 16:49:31
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-21 13:49:52
 */
import { getValueOfPath, setValueOfPath } from "../src/evalPath";

describe("Test evalPath", () => {
  let foo;

  let map = {
    "x[1]]1]2": 100,
    y: 200,
    "x[0]y.z": 300
  };

  beforeEach(() => {
    foo = {};
  });

  it("test evalPath.", () => {
    for (let k in map) {
      setValueOfPath(foo, k, map[k]);
      expect(getValueOfPath(foo, k).value).toBe(map[k]);
    }
  });
});
