var audioContext = null;
var app = getApp();
var myInfo = null;
// pages/index/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  attached() {
    myInfo = wx.getStorageSync("myInfo");
    //最近播放的歌曲的信息
    if ( myInfo.footprint ){
      var latelyPlayMusic = myInfo.footprint[myInfo.footprint.length-1];
      let src = latelyPlayMusic.musicImgUrl;
      this.setData({
        src
      })
      console.log("执行获得最近播放歌曲封面")
    }
    // if ( myInfo.iLikeMusicArr ){
    //   var iLikeMusicArr = myInfo.iLikeMusicArr[myInfo.iLikeMusicArr.length-1];
    //   let collectionImgSrc = iLikeMusicArr.musicImgUrl;
    //   this.setData({
    //     collectionImgSrc
    //   })
    // }
    
    //获得最近播放歌曲的url
    //获得封面图片

    //全局变量有的话就用全局变量的，全局变量没有的话就创建一个新的
    // if ( app.globalData.audioContext ){
    //   audioContext = app.globalData.audioContext;
    //   // audioContext = app.audioContext;
    //   console.log("用之前的变量")
    // }else{
    //   audioContext = wx.createInnerAudioContext();
    //   getApp().globalData.audioContext = audioContext;
    //   console.log("新建变量")
    // }
    // console.log(app.globalData.audioContext)
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    isHome: true,
    src: "https://i0.hdslb.com/bfs/album/13d4ce8b65a618f9efdf7557e530b2f585027063.gif",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    home(){
      this.setData({
        isHome:true
      })
    },
    me(){
      this.setData({
        isHome:false
      })
    }
  }
})
