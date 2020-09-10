// pages/await/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  attached() {
    this.setData({
      randomNum: Math.floor(Math.random()*6)
    })

  },
  /**
   * 组件的初始数据
   */
  data: {
    randomNum: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
