//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    musicName:[],
    searchValue:"",
    inputFocus: false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  searchMusic(e){
    let value = e.detail.value;
    if (value){
      wx.request({
        url:'https://autumnfish.cn/search?=',
        data:{keywords:value},
        success:(result) => {
          this.setData({
            musicName:result.data.result.songs
          })
        }
      });
    }
    this.setData({
      searchValue:value
    })
    console.log(this.data.musicName)
  },
  inputFocustrue(){
    this.setData({
      inputFocus:true
    })
  },
  inputFocusfalse(){
    this.setData({
      inputFocus:false
    })
  }
})
