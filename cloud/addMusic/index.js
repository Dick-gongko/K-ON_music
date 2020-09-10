// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'test-trh7m'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await db.collection('k-on')
        .where({
            _openid:wxContext.OPENID,
        })
        .update({
            data:{
                iLikeMusicArr: _.push({...event})
            },
        })
  // console.log(event)
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}