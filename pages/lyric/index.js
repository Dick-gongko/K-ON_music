var app = getApp();
var audioContext = null;
var i = 0;
var myInfo ={};
//判断是不是搜索页面来的
// var fromSearch = false;
// var playModeI = 

Page({
  // 页面数据
  data: {
    //歌曲是否在播放
    musicIsPlay: false,
    //歌曲图标的类名，根据是否在播放而改变
    musicPlay: "icon-icon_play",
    //现在在播放的歌曲的总时长
    musicAllTime: 100,
    //现在歌曲在播放的时间
    musicNowTime: 0,
    //当前播放音乐的名
    musicName: "",

    lyricValue: "",
    //放歌词的数组
    lyricArr:[],
    //放每句歌词时间的数组
    lyricTime:[],
    //现在放到了第几句歌词的变量。从零开始
    nowLyricNum: 0,
    //正在播放的歌词颜色
    discoloration:"color:#66ccff",
    //进度条的百分比
    sliderValue: 0,
    //播放模式图标，默认单曲循环
    playModeIcon: "icon-danquxunhuan",
    //现在在播放的歌曲的id
    playMusicId: 0,
    //当前歌曲是否是收藏的歌曲
    isCollection: false,
    //音乐地址
    musicSrc: "",
    test:2
  },
  // 页面载入时
  onLoad(e) {
    //获取上一首歌的方法
    //全局变量有的话就用全局变量的，全局变量没有的话就创建一个新的
    // console.log(app.globalData.test)
    // if ( app.globalData.audioContext ){
    //   audioContext = app.globalData.audioContext;
    //   // audioContext = app.audioContext;
    //   this.setData({
    //     musicAllTime:audioContext.duration,
    //     playMusicId:e.id
    //   })
    //   console.log("用之前的变量")
    // }else{
    //   audioContext = wx.createInnerAudioContext();
    //   getApp().globalData.audioContext = audioContext;
    //   console.log("新建变量")
    // }
    //获得全局变量的播放
    audioContext = app.globalData.audioContext;
    //写入时间
    if( audioContext.duration ){
      this.setData({
        musicAllTime:audioContext.duration,
        musicSrc: audioContext.src
      })
      // console.log("写入")
    }

    //写入当前播放歌曲的模式
    let musicPlayMode = wx.getStorageSync("playMode").playMode;
    if ( musicPlayMode == "d" ){
      this.setData({
        playModeIcon:"icon-danquxunhuan"
      })
    }else if ( musicPlayMode == "l" ){
      this.setData({
        playModeIcon:"icon-liebiaoxunhuan"
      })
    }else{
      this.setData({
        playModeIcon:"icon-suijibofang1"
      })
    }


    // console.log(audioContext.paused)
    // if ( !audioContext.paused ){
    //   this.setData({
    //     musicIsPlay:true
    //   })
    // }
    //   // audioContext = app.audioContext;
    // audioContext = app.globalData.audioContext;
    // console.log(app.globalData.test)


    myInfo = wx.getStorageSync("myInfo");
    //最近播放的歌曲信息
    var latelyPlayMusic = myInfo.footprint[myInfo.footprint.length-1];
    //写人当前歌曲的id
    this.setData({
      playMusicId:latelyPlayMusic.id,
      musicName: latelyPlayMusic.name
    })

    //查看当前歌曲是否是已经收藏了
    if (myInfo.iLikeMusicArr){
      for(let i = 0; i < myInfo.iLikeMusicArr.length; i++){
        if( this.data.playMusicId == myInfo.iLikeMusicArr[i].id){
          this.setData({
            isCollection:true
          })
          break;
        }
      }
    }
    // console.log(!123)
    // console.log(Number(e.id))
    //获取上一首歌是否还在播放
    if ( e.id ){
      this.setData({
        musicIsPlay:Boolean(e.musicIsPlay),
      })
    }
    if(this.data.musicIsPlay){
      this.setData({
        musicPlay:"icon-zanting",
      })
    }


    //获取歌词
    wx.request({
      // url:'https://music.163.com/api/song/media?',
      url:'https://autumnfish.cn/lyric?',
      data:{id:Number(latelyPlayMusic.id)},
      // data:{id:1345872140},
      success:(result) => {
        // console.log(result)
        console.log(result.data.lrc)
        if ( result.data.lrc ){
          let lyric = result.data.lrc.lyric.split("\n");
          let lyricArr = [];
          let lyricTime = [];
          // console.log(lyric);
          for (let i = 0; i < lyric.length; i++){
            let MTime = lyric[i].substring( 7, 9) * 10 + lyric[i].substring( 4, 6) * 1000 + lyric[i].substring( 1, 3) * 60000;
            lyricArr.push(lyric[i].substring( 11, lyric[i].length));
            lyricTime.push(MTime);
          }
          this.setData({
            lyricArr,
            lyricTime,
          })
        }else{
          this.setData({
            lyricArr:["闭上眼睛好好享受"],
            lyricTime: [99999999]
          })
        }
        

        // console.log(this.data.lyricTime)
        // console.log(result.data.result.songs)
      }
    })

    //音频播放就在触发的事件
    audioContext.onTimeUpdate(()=>{
      // console.log(audioContext.paused)
      if ( this.data.musicAllTime === 100 ){
        this.setData({
            musicAllTime:audioContext.duration,
          })
          // console.log("写入总时长")

          audioContext.onPlay(()=>{
            this.setData({
              musicPlay:"icon-zanting",
              musicIsPlay: true
            })
          })
      }
      // console.log("执行播放事件" + this.data.musicIsPlay )
      //一开始的时候在播放，其他事件不触发。所以修改播放值
      if (!this.data.musicIsPlay ){
        this.setData({
          musicIsPlay:true,
          musicPlay:"icon-zanting",
        })
        console.log("执行修改事件" + this.data.musicIsPlay )
      }
      let nowPlayTime = parseInt(audioContext.currentTime * 1000);
      // console.log(audioContext.currentTime)
      let nowLyricNum = this.data.lyricTime.findIndex((item, index) =>{
        // console.log( item+ "||"  + nowPlayTime)
        return item > nowPlayTime
      })
      //，没有找到合适的就是最后一个
      if (nowLyricNum == -1){
        nowLyricNum = this.data.lyricTime.length-1;
      }else{
        nowLyricNum = nowLyricNum-1;
      }
      //数字有给变后才写入内容
      if (nowLyricNum != this.data.nowLyricNum){
        this.setData({
          nowLyricNum
        })
      }

      i++;
      if( 0 == i%4){
        // console.log(i);
        let num = audioContext.currentTime / this.data.musicAllTime;
        this.setData({
          sliderValue:num * 100
        })
        // console.log("总时间" + this.data.musicAllTime);
        // console.log("当前时间" + audioContext.currentTime)
        // console.log(num)
      }
    })
    //音频播放暂停改变图标样式
    audioContext.onPlay(()=>{
      this.setData({
        musicPlay:"icon-zanting",
        musicIsPlay: true
      })
      if ( this.data.musicSrc != audioContext.src ){
        myInfo = wx.getStorageSync("myInfo");
        console.log(myInfo)
        console.log("长度" + myInfo.footprint.length)
        console.log("最近播放" + myInfo.footprint[myInfo.footprint.length-1].id);
        this.setData({
          musicName: myInfo.footprint[myInfo.footprint.length-1].name
        })
        //获取歌词
        wx.request({
          url:'https://autumnfish.cn/lyric?',
          data:{id:Number(myInfo.footprint[myInfo.footprint.length-1].id)},
          success:(result) => {
            if ( result.data.lrc ){
              let lyric = result.data.lrc.lyric.split("\n");
              let lyricArr = [];
              let lyricTime = [];
              for (let i = 0; i < lyric.length; i++){
                let MTime = lyric[i].substring( 7, 9) * 10 + lyric[i].substring( 4, 6) * 1000 + lyric[i].substring( 1, 3) * 60000;
                lyricArr.push(lyric[i].substring( 11, lyric[i].length));
                lyricTime.push(MTime);
              }
              this.setData({
                lyricArr,
                lyricTime,
                musicSrc:audioContext.src,
              })
            }else{
              this.setData({
                lyricArr:["闭上眼睛好好享受"]
              })
            }
          }
        })
      }
    })
    audioContext.onPause(() =>{
      // console.log("停止播放了")
      this.setData({
        musicPlay:"icon-icon_play",
        musicIsPlay: false
      })
    })
    // audioContext.pause();
    // console.log(e)
  },
  //点击播放按键
  tapPlayKey(){
    // console.log(audioContext.src)
    
    if ( audioContext.src ){
      //查看当前是否在播放
      if ( audioContext.paused ){
        audioContext.play();
        // console.log("暂停")
      }else{
        audioContext.pause();
        // console.log("播放")
      }
      // this.data.musicIsPlay?audioContext.pause():audioContext.play();
      // console.log(this.data.musicIsPlay)
    }else{
      var latelyPlayMusic = myInfo.footprint[myInfo.footprint.length-1];
      //获得歌曲音频链接
      wx.request({
        url:'https://autumnfish.cn/song/url?',
        data:{id:latelyPlayMusic.id},
        success:(result) => {
          // console.log(result);
          // this.setData({
          //   musicUrl:result.data.data[0].url,
          // })
          // audioMusic.play()
          // console.log(result.data.data[0].url)
          // getApp().globalData.audioContext.src = result.data.data[0].url;
          audioContext.src = result.data.data[0].url;
          audioContext.play();
          this.setData({
            musicSrc: audioContext.src
          })
          // getApp().globalData.audioContext = audioContext;

          // audioContext.onPlay(() => {
          //   console.log('开始播放')
          // })
          //写入总长度
          // this.setData({
          //   musicAllTime:100
          // })
          // console.log("内容" + audioContext.duration)
          console.log(audioContext)
        }
      })
    }
    
  },
  //点击收藏按键
  tapCollection(){
    if (this.data.isCollection){
      myInfo = wx.getStorageSync("myInfo");
      let rmIndex = myInfo.iLikeMusicArr.findIndex((e)=>{return e.id==this.data.playMusicId})
      myInfo.iLikeMusicArr.splice(rmIndex,1)
      wx.setStorageSync("myInfo", {...myInfo});
      this.setData({
        isCollection:false
      })

      //删除数据库内容
      wx.cloud.callFunction({
        name: "delMusic",	//云函数的文件夹名
        data:{
          "id":this.data.playMusicId
        },
        success(res){
          console.log("成功删除数据库");
        },
        fail(err){
          console.log("删除数据库失败")
        }
      })
      // wx.request({
      //   url:'https://autumnfish.cn/song/detail?',
      //   data:{ids:this.data.playMusicId},
      //   success:(result) => {
      //   //删除数据库内容
        
      //   }
      // })
      console.log(myInfo.iLikeMusicArr)
    }else{
      myInfo = wx.getStorageSync("myInfo");
      if(!myInfo.iLikeMusicArr){
        myInfo.iLikeMusicArr = [];
        console.log("新建数组")
      }
      //获取当前歌曲的信息然后写入本地存储中和云端
      wx.request({
        url:'https://autumnfish.cn/song/detail?',
        data:{ids:this.data.playMusicId},
        success:(result) => {
          myInfo.iLikeMusicArr.push({
            "id":result.data.songs[0].id,
            "musicImgUrl":result.data.songs[0].al.picUrl,
            "name":result.data.songs[0].name,
            "author":result.data.songs[0].ar
        })

        //写入数据库
        wx.cloud.callFunction({
          name: "addMusic",	//云函数的文件夹名
          data:{
            "id":result.data.songs[0].id,
            "musicImgUrl":result.data.songs[0].al.picUrl,
            "name":result.data.songs[0].name,
            "author":result.data.songs[0].ar
          },
          success(res){
            console.log("成功写入数据库");
          },
          fail(err){
            console.log("写入数据库失败")
          }
        })
          wx.setStorageSync("myInfo", {...myInfo})
          this.setData({
            isCollection:true
          })
        }
      })
    }
  },
  nextMusic(){
    //下一首歌
    app.backNextMusic(1);
  },
  backMusic(){
    //上一首歌
    app.backNextMusic(-1);
  },
  //进度条改变触发的事件
  sliderchange(e){
    let time = this.data.musicAllTime * e.detail.value /100;
    audioContext.seek(time)
    this.setData({
      sliderValue:e.detail.value
    })
    // console.log( e.detail.value)
  },
  //点击播放模式触发的事件
  tapPlayMode(){
    if ( this.data.playModeIcon == "icon-danquxunhuan"){
      this.setData({
        playModeIcon:"icon-liebiaoxunhuan"
      })
      getApp().globalData.playMode = "l";
      wx.setStorageSync("playMode", {"playMode":"l"})
    }else if ( this.data.playModeIcon == "icon-liebiaoxunhuan"){
      this.setData({
        playModeIcon:"icon-suijibofang1"
      })
      getApp().globalData.playMode = "s";
      wx.setStorageSync("playMode", {"playMode":"s"})
    }else{
      this.setData({
        playModeIcon:"icon-danquxunhuan"
      })
      getApp().globalData.playMode = "d";
      wx.setStorageSync("playMode", {"playMode":"d"})
    }
  }

})
