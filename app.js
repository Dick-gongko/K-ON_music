//app.js
App({
  onLaunch: function() {
    // var audioContext = wx.createInnerAudioContext()
    if (wx.getStorageSync("playMode").playMode){
      this.globalData.playMode = "l";
    }
    this.musicList();

    console.log("内容"+Math.floor(Math.random()*10))
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
        	this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    //云函数
    wx.cloud.init({
      env:'test-trh7m',
      traceUser: true,
    })
    //使用云函数，获取内容
    if( wx.getStorageSync("myInfo")._openid ){

    }else{
      wx.cloud.callFunction({
        name: "getOpenId",	//云函数的文件夹名
        success(res){
          console.log("请求成功", res.result);
          res.result.footprint = wx.getStorageSync("myInfo").footprint;
          wx.setStorageSync("myInfo", { ...res.result })
        },
        fail(err){
          console.log("请求成功", err)
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    //当前播放歌曲API
    audioContext: wx.createInnerAudioContext(),
    //准备播放的歌曲的列表
    musicList: wx.getStorageSync("myInfo").footprint || wx.setStorageSync("myInfo",{ 
    footprint: [{ id:26201959,
      musicImgUrl: "https://p1.music.126.net/l11rCDiuqpRkurWDbzcL-A==/109951163598270163.jpg",
      name: "天使にふれたよ!",
      author: [{
        id: 161104,
        name: "桜高軽音部"}]
      }]
    }),
    
    //当前播放歌曲的id
    nowPlayMusicId: wx.getStorageSync("myInfo").footprint[wx.getStorageSync("myInfo").footprint.length-1].id,
    //播放模式
    playMode: wx.getStorageSync("playMode").playMode || wx.setStorageSync("playMode", { 'playMode': "l"}),

  },

  
  //写要播放的歌曲写入列表。播放自然结束后自动播放列表的下一首歌曲.默认值是本地存储的足迹列表
  musicList(musicList = wx.getStorageSync("myInfo").footprint, id = wx.getStorageSync("myInfo").footprint[wx.getStorageSync("myInfo").footprint.length-1].id){
    this.globalData.musicList = musicList;
    console.log(musicList.length)
    let nowPlayMusicIndex = musicList.findIndex((item, index) =>{
      // console.log( item+ "||"  + nowPlayTime)
      return item.id == id
    })
    console.log(nowPlayMusicIndex);
    this.globalData.nowPlayMusicId = id;
      //监听自然播放结束事件
      this.globalData.audioContext.onEnded(() => {
        this.globalData.playMode = wx.getStorageSync("playMode").playMode;
        if ( this.globalData.playMode == 'd' ){
          this.globalData.audioContext.seek(0);
          this.globalData.audioContext.play();
        }else{

        
          //检查是否是随机播放
          if ( this.globalData.playMode == 's' ){
            nowPlayMusicIndex = Math.floor(Math.random()*musicList.length)
          }else{
            //列表循环.最后一个歌曲播放完后回归第一首歌曲
            if ( nowPlayMusicIndex == musicList.length-1 ){
              nowPlayMusicIndex = 0;
              console.log("执行归零操作")
            }else{
              nowPlayMusicIndex++;
            }
          }

          this.globalData.nowPlayMusicId = musicList[nowPlayMusicIndex].id;
          console.log(this.globalData.nowPlayMusicId)
          //写入本地存储
          wx.request({
            url:'https://autumnfish.cn/song/detail?',
            data:{ids:musicList[nowPlayMusicIndex].id},
            success:(result) => {
              //myInfo自己的历史记录，也包括上传到云端下载下来的信息
              //查看有什么信息。有的话就获取，没有的话就新建
              var myInfo = wx.getStorageSync("myInfo");
              if ( !myInfo.footprint){
                myInfo.footprint = [];
              }
              myInfo.footprint.push({
                "id":result.data.songs[0].id,
                "musicImgUrl":result.data.songs[0].al.picUrl,
                "name":result.data.songs[0].name,
                "author":result.data.songs[0].ar
            })
              wx.setStorageSync("myInfo", {...myInfo})
              //获得歌曲音频链接
              wx.request({
                url:'https://autumnfish.cn/song/url?',
                data:{id:musicList[nowPlayMusicIndex].id},
                success:(result) => {
                  // console.log(result);
                  // this.setData({
                  //   musicUrl:result.data.data[0].url
                  // })
                  // audioMusic.play()
                  // console.log(result.data.data[0].url)
                  this.globalData.audioContext.src = result.data.data[0].url;
                  console.log("音乐地址写入")
                  this.globalData.audioContext.play();
                  // audioContext.onPlay(() => {
                  //   console.log('开始播放')
                  // })
                  // console.log(this.data.musicUrl)
                }
              })
            }
          })
        }
      });
  },
  backNextMusic(value){
    let musicList = this.globalData.musicList;
    //当前播放歌曲的id
    let id = this.globalData.nowPlayMusicId;
    let nowPlayMusicIndex = musicList.findIndex((item, index) =>{
      return item.id == id
    })
    if ( value > 0 ){
      //处理下一首播放
      //列表循环.最后一个歌曲播放完后回归第一首歌曲
      // if ( nowPlayMusicIndex == musicList.length-1 ){
      //   nowPlayMusicIndex = 0;
      //   console.log("执行归零操作")
      // }else{
      //   nowPlayMusicIndex++;
      // }
      this.globalData.playMode = wx.getStorageSync("playMode").playMode;
      if ( this.globalData.playMode == 's' ){
        nowPlayMusicIndex = Math.floor(Math.random()*musicList.length)
      }else{
        //列表循环.最后一个歌曲播放完后回归第一首歌曲
        if ( nowPlayMusicIndex == musicList.length-1 ){
          nowPlayMusicIndex = 0;
          console.log("执行归零操作")
        }else{
          nowPlayMusicIndex++;
        }
      }
    }else{
      //处理播放上一首
      //如果是第一首歌就回到最后一首歌
      if ( nowPlayMusicIndex == 0 ){
        nowPlayMusicIndex = musicList.length-1;
        console.log("执行回到最后一首歌")
      }else{
        nowPlayMusicIndex--;
      }
    }
    this.globalData.nowPlayMusicId = musicList[nowPlayMusicIndex].id;
    //写入本地存储
    wx.request({
      url:'https://autumnfish.cn/song/detail?',
      data:{ids:musicList[nowPlayMusicIndex].id},
      success:(result) => {
        //myInfo自己的历史记录，也包括上传到云端下载下来的信息
        //查看有什么信息。有的话就获取，没有的话就新建
        let myInfo = wx.getStorageSync("myInfo");
        if ( !myInfo.footprint){
          myInfo.footprint = [];
        }
        myInfo.footprint.push({
          "id":result.data.songs[0].id,
          "musicImgUrl":result.data.songs[0].al.picUrl,
          "name":result.data.songs[0].name,
          "author":result.data.songs[0].ar
        })
      wx.setStorageSync("myInfo", {...myInfo})
      //获得歌曲音频链接
      wx.request({
        url:'https://autumnfish.cn/song/url?',
        data:{id:musicList[nowPlayMusicIndex].id},
        success:(result) => {
          this.globalData.audioContext.src = result.data.data[0].url;
          console.log("音乐地址写入")
          this.globalData.audioContext.play();
        }
      })

      }
    })

  }


})