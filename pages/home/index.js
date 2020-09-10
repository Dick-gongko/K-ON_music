//index.js
//获取应用实例
const app = getApp();
var myInfo = null;
var TimeId = -1;
// var test = "https://i0.hdslb.com/bfs/album/47f3b6b1485c2619dda1ae9e3c340b4fab9c15b3.gif";
// wx.get
// Page({
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    musicName:[],
    searchValue:"",
    inputFocus: false,
    src: "https://i0.hdslb.com/bfs/album/47f3b6b1485c2619dda1ae9e3c340b4fab9c15b3.gif",
    collectionImgSrc: "https://i0.hdslb.com/bfs/album/13d4ce8b65a618f9efdf7557e530b2f585027063.gif"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  attached() {
    myInfo = wx.getStorageSync("myInfo");
    //获得最近播放的歌曲的封面
    if ( myInfo.footprint ){
      var latelyPlayMusic = myInfo.footprint[myInfo.footprint.length-1];
      let src = latelyPlayMusic.musicImgUrl;
      this.setData({
        src
      })
      // console.log("执行获得最近播放歌曲封面")
    }
    //获得收藏的歌曲的封面
    if ( myInfo.iLikeMusicArr ){
      var iLikeMusicArr = myInfo.iLikeMusicArr[myInfo.iLikeMusicArr.length-1];
      let collectionImgSrc = iLikeMusicArr.musicImgUrl;
      this.setData({
        collectionImgSrc
      })
    }
  },

  methods: {
    onLoad: function () {
      console.log("打印");
      this.setData({
        src:"https://i0.hdslb.com/bfs/album/47f3b6b1485c2619dda1ae9e3c340b4fab9c15b3.gif"
      })
    },
    searchMusic(e){
      this.setData({
        inputFocus:true
      })
      clearTimeout(TimeId);
      TimeId = setTimeout(()=>{
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
      },1300);
      
      console.log(this.data.musicName)
    },
    //获得焦点
    inputFocustrue(){
      if(this.data.searchValue){
        this.setData({
          inputFocus:true
        })
      }
    },
    //失去焦点
    inputFocusfalse(){
      this.setData({
        inputFocus:false
      })
    }
  },


  // searchMusic(e){
  //   this.setData({
  //     inputFocus:true
  //   })
  //   let value = e.detail.value;
  //   if (value){
  //     wx.request({
  //       url:'https://autumnfish.cn/search?=',
  //       data:{keywords:value},
  //       success:(result) => {
  //         this.setData({
  //           musicName:result.data.result.songs
  //         })
  //       }
  //     });
  //   }
  //   this.setData({
  //     searchValue:value
  //   })
  //   console.log(this.data.musicName)
  // },
  // //获得焦点
  // inputFocustrue(){
  //   if(this.data.searchValue){
  //     this.setData({
  //       inputFocus:true
  //     })
  //   }
  // },
  // //失去焦点
  // inputFocusfalse(){
  //   this.setData({
  //     inputFocus:false
  //   })
  // }
})
