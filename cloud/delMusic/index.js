// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'test-trh7m'
})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let value = await db.collection('k-on')
              .where({
                  _openid:wxContext.OPENID
              }).get()
        let muiscValue = value.data[0].iLikeMusicArr;
        let rmIndex = muiscValue.findIndex((e)=>{return e.id==event.id})
        muiscValue.splice(rmIndex,1)
        console.log(event)
        await db.collection('k-on')
        .where({
            _openid:wxContext.OPENID
        })
        .update({
            data:{
              iLikeMusicArr: muiscValue
            }
        })
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}