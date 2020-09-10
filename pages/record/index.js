//Page Object
var audioMusic = {};
var app = getApp();
var audioContext = null;
var myInfo ={};
Page({
  data: {
    //音乐列表遍历的数组
    musicValue:[],
    //音频的地址
    musicUrl:"",
    //播放图标
    musicPlay: "icon-icon_play",
    //控制音搜索提示框显示与隐藏
    inputFocus: false,
    //存放当前播放音频的歌名和作者名
    musicNameArtists:{},
    //音频封面
    musicImgUrl:"",
    //音乐是否在播放
    musicIsPlay: false,
    //现在正在播放的歌曲。
    previousMusicId:0,
    //当前播放歌曲的id
    nowPlayMusicId: 0,
    // audioContext:audioContext
  },
  //options(Object)
  onLoad: function(options){
    // console.log(app.globalData.test)

    //获得歌曲信息
    myInfo = wx.getStorageSync("myInfo");
    audioContext = app.globalData.audioContext;
    //写入歌曲信息
    this.setData({
      musicValue:myInfo.footprint
    })
    // audioContext.src = myInfo.footprint[myInfo.footprint.length-1].musicImgUrl;
    //获得最近一次播放歌曲的封面图片
    this.setData({
      musicImgUrl:myInfo.footprint[myInfo.footprint.length-1].musicImgUrl
    })


    //给控制播放栏下面要渲染的内容
    this.setData({
      musicUrl: audioContext.src,
      //更新最近播放的歌曲的封面
      musicImgUrl: wx.getStorageSync("myInfo").footprint[wx.getStorageSync("myInfo").footprint.length-1].musicImgUrl,
      //更新现在正在播放歌曲的id
      previousMusicId: wx.getStorageSync("myInfo").footprint[wx.getStorageSync("myInfo").footprint.length-1].id,
      //更新现在正在播放的歌曲作者信息和作者名
      musicNameArtists: wx.getStorageSync("myInfo").footprint[wx.getStorageSync("myInfo").footprint.length-1]

    })
    //初始化播放按键和图标
    if ( !audioContext.paused ){
      this.setData({
        musicPlay:"icon-zanting",
        musicIsPlay: true
      })
    }


    //获得最近播放歌曲音频链接
    wx.request({
      url:'https://autumnfish.cn/song/url?',
      data:{id:myInfo.footprint[myInfo.footprint.length-1].id},
      success:(result) => {
        // console.log(result);
        // this.setData({
        //   musicUrl:result.data.data[0].url
        // })
        // audioMusic.play()
        // console.log(result.data.data[0].url)
        audioContext.src = result.data.data[0].url;
        console.log("音乐地址写入")
        // audioContext.play();
        // audioContext.onPlay(() => {
        //   console.log('开始播放')
        // })
        // console.log(this.data.musicUrl)
      }
    })

    

    // if ( app.globalData.audioContext ){
    //   audioContext = app.globalData.audioContext;
    //   // audioContext = app.audioContext;
    //   console.log("访问全局变量")
    //   console.log(app.globalData.audioContext)
    // }else{
    //   audioContext = wx.createInnerAudioContext();
    //   getApp().globalData.audioContext = audioContext;
    //   console.log("未访问全局变量")
    // }

    // console.log(app.globalData.test)

    // audioContext = wx.createInnerAudioContext();

    // console.log(audioContext)
    // console.log(audioContext)
    // console.log(this.data.audioContext)
    // getApp().globalData.audioContext = audioContext;
    // console.log(app.globalData.audioContext);
    // this.setData({
    //   searchValue:options.value
    // })
    // audioMusic = wx.createAudioContext('music')
    //获得歌曲信息
    // wx.request({
    //   url:'https://autumnfish.cn/search?',
    //   data:{keywords:options.value},
    //   success:(result) => {
    //     this.setData({
    //       musicValue:result.data.result.songs
    //     })
    //     // console.log(result.data.result.songs)
    //   }
    // })
    //音频播放暂停改变图标样式
    audioContext.onPlay(()=>{
      this.setData({
        musicPlay:"icon-zanting",
        musicIsPlay: true
      })
      if ( this.data.musicUrl != audioContext.src ){
        this.setData({
          musicUrl: audioContext.src,
          //更新最近播放的歌曲的封面
          musicImgUrl: wx.getStorageSync("myInfo").footprint[wx.getStorageSync("myInfo").footprint.length-1].musicImgUrl,
          //更新现在正在播放歌曲的id
          previousMusicId: wx.getStorageSync("myInfo").footprint[wx.getStorageSync("myInfo").footprint.length-1].id,
          //更新现在正在播放的歌曲作者信息和作者名
          musicNameArtists: wx.getStorageSync("myInfo").footprint[wx.getStorageSync("myInfo").footprint.length-1]

        })
        console.log("播放事件中打印" + this.data.nowPlayMusicId)
      }
    })
    audioContext.onPause(() =>{
      this.setData({
        musicPlay:"icon-icon_play",
        musicIsPlay: false
      })
    })
  },
   tapMusic(e){
    //this.data.musicIsPlay?audioContext.pause():audioContext.play();
    console.log(e)
    let musicId = e.currentTarget.dataset.id;
    // let musicNameArtists = e.currentTarget.dataset;
    let musicIndex = e.currentTarget.dataset.index;
    //判断这首歌是不是刚刚在播放的那首歌
    if ( this.data.previousMusicId == musicId){
      this.data.musicIsPlay?audioContext.pause():audioContext.play();
    }else{
      app.musicList(this.data.musicValue,musicId);

      //获得歌曲音频链接
      wx.request({
        url:'https://autumnfish.cn/song/url?',
        data:{id:musicId},
        success:(result) => {
          // console.log(result);
          // this.setData({
          //   musicUrl:result.data.data[0].url
          // })
          // audioMusic.play()
          // console.log(result.data.data[0].url)

          //写入音频内容
          this.setData({
            musicUrl: result.data.data[0].url
          })



          audioContext.src = result.data.data[0].url;
          console.log("音乐地址写入")
          audioContext.play();
          // audioContext.onPlay(() => {
          //   console.log('开始播放')
          // })
          // console.log(this.data.musicUrl)
        }
      })
      console.log(musicIndex)
      //获得封面图片
      myInfo.footprint.push(myInfo.footprint[musicIndex])
      wx.setStorageSync("myInfo", {...myInfo})
      this.setData({
        musicImgUrl:myInfo.footprint[musicIndex].musicImgUrl,
        //写入歌曲信息
        musicNameArtists:myInfo.footprint[musicIndex]
      })
      // audi
      // wx.request({
      //   url:'https://autumnfish.cn/song/detail?',
      //   data:{ids:musicId},
      //   success:(result) => {
      //     // console.log(result.data.songs[0]);
      //     //myInfo自己的历史记录，也包括上传到云端下载下来的信息
      //     //查看有什么信息。有的话就获取，没有的话就新建
      //     var myInfo = wx.getStorageSync("myInfo");
      //     // console.log(myInfo)
      //     if ( !myInfo.footprint){
      //       // var footprint = myInfo.footprint;
      //       myInfo.footprint = [];
      //     }else{
      //       // var footprint = [];
      //       // console.log("执行")
      //     }
      //     myInfo.footprint.push({
      //       "id":result.data.songs[0].id,
      //       "musicImgUrl":result.data.songs[0].al.picUrl,
      //       "name":result.data.songs[0].name,
      //       "author":result.data.songs[0].ar
      //   })
      //     wx.setStorageSync("myInfo", {...myInfo})
      //     this.setData({
      //       musicImgUrl:result.data.songs[0].al.picUrl
      //     })
      //     // audioMusic.play()
      //     // console.log(result.data.result.songs)
      //   }
      // })
      this.setData({
        //musicNameArtists,
        previousMusicId:musicId
      })
    }
    // this.setData({
    //   musicNameArtists,
    //   //previousMusicId:musicId
    // })
  },
  tapPlayKey(){
    if (this.data.musicIsPlay){
      audioContext.pause();
    }else{
      audioContext.play();
    }
  },
  //点击搜索按键
  // tapSearch(){
  //   let value = this.data.searchValue;
  //   wx.request({
  //     url:'https://autumnfish.cn/search?=',
  //     data:{keywords:value},
  //     success:(result) => {
  //       this.setData({
  //         musicValue:result.data.result.songs
  //       })
  //     }
  //   })
  // },
  //点击提示框的音乐
  // tapPrompt(e){
  //   let searchValue = e.currentTarget.dataset.name + " " + e.currentTarget.dataset.artists;
  //   this.setData({
  //     searchValue
  //   })
  //   // console.log(this.data.searchValue)
  // },
  
  //输入框返回值
  // searchMusic(e){
  //   let value = e.detail.value;
  //   // console.log(value)
  //   if (value){
  //     this.setData({
  //       searchValue:value
  //     })
  //     wx.request({
  //       url:'https://autumnfish.cn/search?=',
  //       data:{
  //         keywords:value
  //       },
  //       success:(result) => {
  //         this.setData({
  //           musicName:result.data.result.songs
  //         })
  //         console.log(this.data.musicName)
  //       }
  //     });
  //   }
  //   // console.log(this.data.musicName)
  // },
  // searchMusicMessage(value){
  //   let mValue = value?value:this.data.musicName;
  //   // console.log(this.data.musicName)
  //   // wx.request({
  //   //   url:'https://autumnfish.cn/search?',
  //   //   data:{keywords:mValue},
  //   //   success:(result) => {
  //   //     this.setData({
  //   //       musicValue:result.data.result.songs
  //   //     })
  //   //     console.log(result.data.result.songs)
  //   //   }
  //   // })
  // },
  nextMusic(){
    app.backNextMusic(1);
  },
  musicPlay(){
    this.setData({
      musicPlay:"icon-zanting"
    })
  },
  musicPause(){
    this.setData({
      musicPlay:"icon-icon_play"
    })
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
  },
  // //item(index,pagePath,text)
  // onTabItemTap:function(item){

  // }
});
