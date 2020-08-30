//Page Object
Page({
  data: {
    searchValue:"",
    musicValue:[],
    musicUrl:""
  },
  //options(Object)
  onLoad: function(options){
    this.setData({
      searchValue:options.value
    })
    wx.request({
      url:'https://autumnfish.cn/search?',
      data:{keywords:options.value},
      success:(result) => {
        this.setData({
          musicValue:result.data.result.songs
        })
        console.log(result.data.result.songs)
      }
    })
  },
   tapMusic(mId){
    let musicId = mId.currentTarget.dataset.id;
    wx.request({
      url:'https://autumnfish.cn/song/url?',
      data:{id:musicId},
      success:(result) => {
        console.log(result.data.data[0].url);
        this.setData({
          musicUrl:result.data.data[0].url
        })
        // console.log(result.data.result.songs)
      }
    })
    console.log(this.musicUrl)
  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});
