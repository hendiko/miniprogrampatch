// index/components/Title/index.js
Component({

  watch: {
    total(value, old) {
      console.log('title: ', value, old, this, this.attached);
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

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
