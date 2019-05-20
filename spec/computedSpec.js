/*
 * @Author: Xavier Yin
 * @Date: 2019-05-06 14:46:23
 * @Last Modified by: Xavier Yin
 * @Last Modified time: 2019-05-20 11:15:54
 */
import {
  evaluateComputed,
  initializeObserverValues,
  initializeComputed as initializeObservers,
  initiallyCompute
} from "../src/v120/computed";

import {
  constructComputedFeature,
  calculateInitialComputedValues,
  evaluateComputedResult
} from "../src/v120/alpha/computed";

// describe("Test computed", () => {
//   let page;

//   beforeEach(() => {
//     let computed = {
//       "once.foo": {
//         fn() {
//           return 10;
//         }
//       },
//       b: {
//         require: ["a.b"],
//         fn({ "a.b": ab }) {
//           return ab;
//         }
//       },
//       "c.name": {
//         require: ["name"],
//         fn({ name }) {
//           return name || "";
//         }
//       },
//       "c.nameLength": {
//         require: ["c"],
//         fn({ c }) {
//           let { name = "" } = c || {};
//           return name.length;
//         }
//       },
//       "c.nameLength2": {
//         require: ["c.name."],
//         fn({ "c.name": name }) {
//           return name.length;
//         }
//       },
//       "d.num[0]": {
//         require: ["c.nameLength"],
//         fn({ "c.nameLength": len }) {
//           return len;
//         }
//       },
//       "d.numLength": {
//         require: ["d"],
//         fn({ d }) {
//           let { num = [] } = d || {};
//           return num.length;
//         }
//       },
//       z: {
//         require: ["x", "y"],
//         fn({ x, y }) {
//           return (x || 0) + (y || 0);
//         }
//       }
//     };

//     page = { data: { x: 1, y: 2 } };
//     initiallyCompute(page, computed);
//     // page = initializeObservers({ data: { x: 1, y: 2 } }, computed);
//     // initializeObserverValues(page, page.data);
//   });

//   it("computed", () => {
//     let data = page.__tempComputedResult;
//     expect(data.once.foo).toBe(10);
//     expect(data.a).toBeUndefined();
//     expect(data.b).toBeUndefined();
//     expect(data.z).toBe(0);
//     expect(data.c.name).toBe("");
//     expect(data.c.nameLength).toBe(0);
//     expect(data.c.nameLength2).toBe(0);
//     expect(data.d.num[0]).toBe(0);
//     expect(data.d.numLength).toBe(1);

//     evaluateComputed(page, { x: 100, y: 200, "a.b.c": 300, name: "Green" });

//     expect(data.x).toBe(100);
//     expect(data.y).toBe(200);
//     expect(data.b).toEqual({ c: 300 });
//     expect(data.z).toBe(300);
//     expect(data.c.name).toBe("Green");
//     expect(data.c.nameLength).toBe(5);
//     expect(data.c.nameLength2).toBe(5);
//     expect(data.d.num[0]).toBe(5);
//     expect(data.d.numLength).toBe(1);
//   });
// });

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
      "c.nameLength": {
        require: ["c"],
        fn({ c }) {
          let { name = "" } = c || {};
          return name.length;
        }
      },
      "c.nameLength2": {
        require: ["c.name."],
        fn({ "c.name": name }) {
          return name.length;
        }
      },
      "d.num[0]": {
        require: ["c.nameLength"],
        fn({ "c.nameLength": len }) {
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
    expect(data.z).toBe(0);
    expect(data.c.name).toBe("");
    expect(data.c.nameLength).toBe(0);
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
    expect(data.c.nameLength).toBe(5);
    expect(data.c.nameLength2).toBe(5);
    expect(data.d.num[0]).toBe(5);
    expect(data.d.numLength).toBe(1);
  });
});
