const app = getApp();

// 局部增强
Page({
  watch: {
    /** 观察 total 属性 */
    total(value, old) {
      let { logs } = this.data;
      this.$setData({
        [`logs[${logs.length}]`]: `total: new ${value} vs old ${old}`
      });
    },

    count(val) {
      if (val >= this.data.rounds) {
        this.stop();
      }
    }
  },

  computed: {
    /** 页面加载的时间戳（不依赖其他属性） */
    startTime() {
      return Date.now();
    },

    startTimeText: {
      require: ["startTime"],
      fn({ startTime }) {
        return new Date(startTime).toLocaleString();
      }
    },

    /** count 乘以 10 */
    countByTen: {
      require: ["count"],
      fn({ count }) {
        return count * 10;
      }
    },

    /** count 乘以 100 */
    countByHundred: {
      require: ["countByTen"],
      fn({ countByTen }) {
        return countByTen * 10;
      }
    },

    /** 已流逝的秒数 */
    seconds: {
      require: ["count"],
      fn({ count }) {
        return count;
      }
    },

    milliseconds: {
      require: ["seconds"],
      fn({ seconds }) {
        return seconds * 1000;
      }
    },

    /** 总数 */
    total: {
      require: ["count", "countByTen", "countByHundred"],
      fn({ count, countByTen, countByHundred }) {
        return count + countByTen + countByHundred;
      }
    },

    /** 按时区排序的时钟 */
    clocks: {
      require: ["clock"],
      fn({ clock }) {
        let values = [];
        for (var k in clock) {
          values.push(clock[k]);
        }
        values.sort((x, y) => (x.time > y.time ? -1 : 1));
        return values;
      }
    },

    /**
     * 曼谷时间
     */
    "clock.Bangkok": {
      require: ["clock.Tokyo.time"],
      fn({ "clock.Tokyo.time": clock }) {
        let ms = (clock || 0) - 3600 * 1000 * 2;
        return {
          city: "曼谷",
          time: ms,
          locale: new Date(ms).toLocaleString()
        };
      }
    },

    /**
     * 东京时间
     */
    "clock.Tokyo": {
      require: ["clock.Beijing.time"],
      fn({ "clock.Beijing.time": clock }) {
        let ms = (clock || 0) + 3600 * 1000;
        return {
          city: "东京",
          time: ms,
          locale: new Date(ms).toLocaleString()
        };
      }
    },

    /**
     * 北京时间
     */
    "clock.Beijing": {
      require: ["milliseconds", "startTime"],
      fn({ milliseconds, startTime }) {
        let ms = milliseconds + startTime;
        return {
          city: "北京",
          time: ms,
          locale: new Date(ms).toLocaleString()
        };
      }
    }
  },

  data: {
    clock: {}, // 时钟
    rounds: 5, // 计时次数
    count: 0, //
    numberOfLogs: 5, // 显示的日志条数
    logs: [] // total 属性的更新日志
  },

  /** 开启定时器 */
  onLoad() {
    this.start();
  },

  /** 每秒钟 count 属性加 1 */
  start() {
    this.stop();
    this.timer = setInterval(() => {
      let { count } = this.data;
      this.$setData({ count: count + 1 });
    }, 1000);
  },

  /** 停止 count 属性自增 */
  stop() {
    clearInterval(this.timer);
  },

  /** 销毁定时器 */
  onUnload() {
    this.stop();
  }
});
