/*
 * @Author: Xavier Yin
 * @Date: 2019-05-06 14:46:23
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-21 13:49:23
 */

import {
  constructComputedFeature,
  calculateInitialComputedValues,
  evaluateComputedResult
} from "../src/computed";

describe("Test computed alpha", () => {
  let page;

  beforeEach(() => {
    let computed = {
      "once.foo": {
        fn() {
          return 10;
        }
      },
      b: {
        require: ["a.b"],
        fn({ "a.b": ab }) {
          return ab;
        }
      },
      "c.name": {
        require: ["name"],
        fn({ name }) {
          return name || "";
        }
      },
      "c.nameLength3": {
        require: ["c"],
        fn({ c }) {
          let { name = "" } = c || {};
          return name.length;
        },
        keen: true
      },
      "c.nameLength2": {
        require: ["c.name."],
        fn({ "c.name": name }) {
          return name.length;
        }
      },
      "d.num[0]": {
        require: ["c.nameLength3"],
        fn({ "c.nameLength3": len }) {
          return len;
        }
      },
      "d.numLength": {
        require: ["d"],
        fn({ d }) {
          let { num = [] } = d || {};
          return num.length;
        }
      },
      z: {
        require: ["x", "y"],
        fn({ x, y }) {
          return (x || 0) + (y || 0);
        }
      }
    };

    page = { data: { x: 1, y: 2 } };

    constructComputedFeature(page, computed);

    Object.assign(page.data, calculateInitialComputedValues(page));
  });

  it("computed", () => {
    let data = page.__tempComputedResult;
    expect(data.once.foo).toBe(10);
    expect(data.a).toBeUndefined();
    expect(data.b).toBeUndefined();
    expect(data.z).toBe(3);
    expect(data.c.name).toBe("");
    expect(data.c.nameLength3).toBe(0);
    expect(data.c.nameLength2).toBe(0);
    expect(data.d.num[0]).toBe(0);
    expect(data.d.numLength).toBe(1);

    evaluateComputedResult(page, {
      x: 100,
      y: 200,
      "a.b.c": 300,
      name: "Green"
    });

    expect(data.x).toBe(100);
    expect(data.y).toBe(200);
    expect(data.b).toEqual({ c: 300 });
    expect(data.z).toBe(300);
    expect(data.c.name).toBe("Green");
    expect(data.c.nameLength3).toBe(5);
    expect(data.c.nameLength2).toBe(5);
    expect(data.d.num[0]).toBe(5);
    expect(data.d.numLength).toBe(1);
  });
});
