const app = getApp()

// 局部增强
Page({

  watch: {

    'x.y.z': function (value, old) {
      console.log('x.y.z', value === old, value, old); // x.y.z false
    },

    'x.y': function (value, old) {
      console.log('x.y', value === old);  // x.y true
    },

    'x': function (value, old) {
      console.log('x', value === old); // x true
    },

    /** 观察日志变化 */
    logs(value, old) {
      // 因为此处通过 this.$setData({"logs[n]": value}) 来更新数据
      // 因此 logs 属性数组内数据发生变化，但数组本身没有被变更。
      console.log('logs', value === old);  // print: logs true
    },

    /** 观察 total 属性 */
    total(value, old) {
      let log = `total: new ${value} vs old ${old}`;
      let { logs } = this.data;
      let name = `logs[${logs.length}]`;
      this.$setData({ [name]: log });
      if (value > 2500) {
        this.stop();
      }
    }
  },

  computed: {
    /** 页面加载的时间戳（不依赖其他属性） */
    timestamp() {
      return Date.now();
    },

    /** count 乘以 10 */
    countByTen: {
      require: ['count'],
      fn({ count }) {
        return count * 10
      }
    },

    /** count 乘以 100 */
    countByHundred: {
      require: ['countByTen'],
      fn({ countByTen }) {
        return countByTen * 10;
      }
    },

    /** 总数 */
    total: {
      require: ['count', 'countByTen', 'countByHundred'],
      fn({ count, countByTen, countByHundred }) {
        return count + countByTen + countByHundred;
      }
    },

    /** 返回 total 的第三条更新日志 */
    thirdLog: {
      require: ['logs[2]'],
      fn({ "logs[2]": x }) {
        return x;
      }
    },

    'x.y.z': {
      require: ['total'],
      fn({ total }) {
        return total;
      }
    }
  },


  data: {
    count: 10,
    logs: []   // total 属性的更新日志
  },

  /** 开启定时器 */
  onLoad: function () {
    app.home = this;
    this.start();
  },

  /** 每秒钟 count 属性加 1 */
  start() {
    this.timer = setInterval(() => {
      let { count } = this.data;
      this.$setData({ count: count + 1 })
    }, 1000)
  },

  /** 停止 count 属性自增 */
  stop() {
    clearInterval(this.timer);
  },

  /** 销毁定时器 */
  onUnload() {
    this.stop();
  }
})
