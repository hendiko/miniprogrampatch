// index/components/Title/index.js
Component({
  watch: {
    total(value, old) {
      let text = `组件 Title 的 total 值: ${value}`;
      this.$setData({ text });
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    total: {
      type: Number,
      observer() {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    text: "no found"
  },

  /**
   * 组件的方法列表
   */
  methods: {}
});
