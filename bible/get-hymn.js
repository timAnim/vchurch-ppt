var Hymn = require('../model/hymn')

/**
 * 1. 解析赞美诗编号
 * 2. 查询赞美诗文本
 * 3. 去换行, 空格
 * 4. 根据<br>分成数组
 * 5. 错误抛到最外层
 * 
 * @Author Timothy  CHEN
 * @param  {Srting} inpHymn       输入的赞美诗对象
 * @return {Promise<Hymn>}        赞美诗的详情
 * ToDo 提醒用户编号和标题是否一致
 */
function getHymn(inpHymn) {
  // 赞美诗的编号
  var sn;

  // 同步异常转化为异步异常
  try {
    sn = parseInt(inpHymn.value.match(/\d+/)[0])
  } catch (err) {
    err.message += '\n赞美诗没有编号'
    return Promise.reject(err)
  }

  // 返回一个Promise封装的 input对象
  return Hymn.findOne({
      sn
    })
    .exec()
    .then(data => {
      if(!data){
        var err = new Error('无效的赞美诗编号' + sn)
        return Promise.reject(err)
      }
      inpHymn.sn = data.sn
      inpHymn.title = data.name
      // 去掉回车, 空格, 通过<br>换行
      inpHymn.parsed = data.content
        .replace('\n', '')
        .trim()
        .replace(/\s+/g, '')
        .split('<br>')

      return Promise.resolve(inpHymn)
    })
}

module.exports = getHymn
