// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env:'test-trh7m'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID;
  let userInfo = await cloud.database().collection("k-on")
  .where({
    _openid:openid
  }).get();
  if ( userInfo.data.length == 0 ){ 
    let id = await cloud.database().collection("k-on")
    .add({
      data:{
        _openid:openid,
        iLikeMusicArr:[{ id:26201959,
          musicImgUrl: "https://p2.music.126.net/B_sCLXthAHgoVEMIRNU1hw==/109951163559682176.jpg",
          name: "天使にふれたよ!",
          author: [{
            id: 161104,
            name: "桜高軽音部"}]
          }],
      }
    })
    return {
      _id:id._id,
      _openid:openid
    }
  }
  return userInfo.data[0]
}