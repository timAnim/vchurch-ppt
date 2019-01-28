var Hymn = require('../model/hymn')

function getHymn(inp) {
  var sn;

  // 同步异常转化为异步异常
  try {
    sn = parseInt(inp.value.match(/\d+/)[0])
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
      inp.sn = data.sn
      inp.parseType = 'hymn'
      inp.parsed = data.content.split('<br> \n')
      return Promise.resolve(inp)
    })
}

module.exports = getHymn