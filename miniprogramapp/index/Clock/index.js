// timefly/Clock/index.js

const doubleDigits = number => (number < 10 ? "0" + number : number);

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object
  },

  computed: {
    time: {
      require: ["data.time"],
      fn({ "data.time": time }) {
        return time;
      }
    },

    city: {
      require: ["data.city"],
      fn({ "data.city": city }) {
        return city;
      }
    },

    hms: {
      require: ["time"],
      fn({ time }) {
        let date = new Date(time);

        return {
          year: date.getFullYear(),
          month: doubleDigits(date.getMonth() + 1),
          date: doubleDigits(date.getDate()),
          hours: doubleDigits(date.getHours()),
          minutes: doubleDigits(date.getMinutes()),
          seconds: doubleDigits(date.getSeconds())
        };
      }
    }
  }
});
