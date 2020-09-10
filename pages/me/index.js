// pages/me/index.js
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    //听过的歌曲数目
    hearNum: 0,
    //收藏的歌曲数目
    collectionNum: 0,
    //评论过的歌曲数目
    commentNum: 0,
    //数据库是否存在用户数据
    Login: false,
    //头像地址
    headUrl: "",
    //姓名
    myName: ""
  },
  attached() {
    const my = wx.getStorageSync("userInfo");
    if(my){
      this.setData({
        headUrl:my.data.avatarUrl,
        myName:my.data.nickName,
        Login: true
      })
      this.getMusiNum();
      console.log(this.data.hearNum)
    }
  },
  methods:{
    getUserInfo(){
      console.log("点击");
      wx.getUserInfo({
        success:(res)=>{
          console.log(res.userInfo)
          console.log(this)
          wx.setStorageSync("userInfo", { data: res.userInfo })
          this.setData({
            headUrl:res.userInfo.avatarUrl,
            myName:res.userInfo.nickName,
            Login: true
          })
          this.getMusiNum();
        }
      })
    },
    getMusiNum () {
    //myInfo自己的历史记录，也包括上传到云端下载下来的信息
      const my = wx.getStorageSync("myInfo");
      if(my){
        //听过的歌曲
        let hearNum = my.footprint?my.footprint.length:0;
        //收藏的歌曲
        let collectionNum = my.iLikeMusicArr?my.iLikeMusicArr.length:0;
        //自己的评论
        let commentNum = my.comment?my.comment.length:0;
        this.setData({
          hearNum,
          collectionNum,
          commentNum
        })
      }
    },
    del(){
      wx.removeStorageSync('myInfo');
      wx.removeStorageSync('playMode');
      wx.removeStorageSync('userInfo');

    },
  },
  //获得用户听过的歌曲与预览过的歌曲数目
  
  

})
