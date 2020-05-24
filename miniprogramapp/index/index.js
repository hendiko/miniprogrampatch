// timefly/index.js

const doubleDigits = (number) => (number < 10 ? "0" + number : number);

Page({
  computed: {
    // [require] 定义依赖属性 hello。
    // [fn] 定义计算函数缺省。
    // foo 的值为 'hello'。
    foo: ["hello"],

    // [require] 定义依赖属性 hello 和 world。
    // [fn] 定义计算函数缺省。
    // foo 的值为 ['hello', 'world']
    bar: [["hello", "world"]],

    // [require] 定义依赖属性 hello 和 world。
    // [fn] 定义一个箭头函数作为计算函数。
    // foo 的值为 'hello world!'
    gee: [["hello", "world"], (x, y) => `${x} ${y}!`],

    // 测试等同依赖计算属性
    clockBangkokTime: "clock.Bangkok.time",

    clockBeijing: ["clock.Beijing", (x) => JSON.stringify(x), true],

    clockAsia: [["clockBeijing", "clockBangkokTime"]],

    clockWorld: [
      ["clockBeijing", "clock"],
      (clockBeijing, clock) => {
        let { Paris } = clock;
        return [clockBeijing, Paris];
      },
    ],

    "clock.Bangkok": {
      require: ["clock.Tokyo.time"],
      fn({ "clock.Tokyo.time": clock }) {
        let ms = (clock || 0) - 3600 * 1000 * 2;
        return {
          city: "曼谷",
          time: ms,
        };
      },
    },

    "clock.Beijing": {
      require: ["currentTime"],
      fn({ currentTime }) {
        return {
          city: "北京",
          time: currentTime,
        };
      },
    },

    "clock.Paris": {
      require: ["clock"],
      fn({ clock }) {
        let { Bangkok } = clock || {};
        let { time = 0 } = Bangkok || {};
        return {
          city: "巴黎",
          time: time - 3600 * 1000 * 5,
        };
      },
      keen: true, // 这里需要 keen 为 true，因为 clock 始终没有都是同一个 Object。
    },

    "clock.Tokyo": {
      require: ["clock.Beijing.time"],
      fn({ "clock.Beijing.time": clock }) {
        let ms = (clock || 0) + 3600 * 1000;
        return {
          city: "东京",
          time: ms,
        };
      },
    },

    /** 按时区排序的时钟 */
    clocks: {
      require: ["clock"],
      fn({ clock }) {
        let values = [];
        for (var k in clock) {
          values.push(clock[k]);
        }
        values.sort((x, y) => (x.time > y.time ? 1 : -1));
        return values;
      },
      keen: true, // 这里需要 keen 为 true，因为 clock 始终没有都是同一个 Object。
    },

    // 日志数量
    logNumber: {
      require: ["logs"],
      fn({ logs }) {
        return logs.length;
      },
      keen: true, // 如果为 false，则 logNumber 一直为 0。
    },

    normalDate: {
      require: ["normalTime"],
      fn({ normalTime }) {
        let date = new Date(normalTime);
        return {
          year: date.getFullYear(),
          month: doubleDigits(date.getMonth() + 1),
          date: doubleDigits(date.getDate()),
          hours: doubleDigits(date.getHours()),
          minutes: doubleDigits(date.getMinutes()),
          seconds: doubleDigits(date.getSeconds()),
        };
      },
    },

    pageTitle: {
      require: ["speed"],
      fn({ speed }) {
        if (speed > 1) {
          return "时间加速中";
        } else {
          return "正常时间";
        }
      },
    },

    speedPiece: {
      require: ["speed"],
      fn({ speed }) {
        return ~~(1000 / speed);
      },
    },
  },

  /**
   * 页面的初始数据
   */
  data: {
    clock: {},
    currentTime: Date.now(),
    logs: [],
    showLogs: 5, // 显示多少条日志
    normalTime: Date.now(),
    speed: 1,
    startTime: Date.now(),

    hello: "hello",
    world: "world",
  },

  watch: {
    pageTitle(val) {
      wx.setNavigationBarTitle({ title: val });
    },

    speed(val) {
      this.writeLog(val);
    },
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let { pageTitle } = this.data;
    wx.setNavigationBarTitle({ title: pageTitle });
    this.startTiktok();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.stopTiktok();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.reset();
    wx.stopPullDownRefresh();
  },

  onSliderChange(e) {
    let { value } = e.detail;
    this.$setData({ speed: value });
    this.startTiktok();
  },

  elapse() {
    let { currentTime } = this.data;
    this.$setData({
      currentTime: currentTime + 1000,
      normalTime: Date.now(),
    });
  },

  reset() {
    let now = Date.now();
    this.$setData({ speed: 1, currentTime: now, normalTime: now });
    this.startTiktok();
    this.writeLog(this.data.speed, true);
  },

  startTiktok() {
    this.stopTiktok();
    let { speedPiece } = this.data;
    this._timer = setInterval(this.elapse.bind(this), speedPiece);
  },

  stopTiktok() {
    clearTimeout(this._timer);
  },

  writeLog(speed, reset = false) {
    let { logNumber, normalDate: d } = this.data;
    let log = reset ? "恢复正常速度。" : `调整时间流逝速度为 ${speed}x。`;
    this.$setData({
      [`logs[${logNumber}]`]: `${d.hours}:${d.minutes}:${d.seconds} ${log}`,
    });
  },
});
