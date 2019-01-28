var Volume = require('../model/volume')
var Lection = require('../model/lection')


function getScripture(inp, worship) {
  console.log('开始获取经文了:' + inp.value)
  var bookName,
    chapterSn,
    scope;
  inp.parsed = [];

  var scriptureArr;
  try {
    scriptureArr = initData(inp.value)
  } catch (err) {
    throw err
  }
  // 通过中文简写获取书卷的Sn
  var promiseArr = []
  scriptureArr.forEach(result => {
    promiseArr.push(getLection(result))
  })
  return Promise.all(promiseArr)
    .then(res => {
      // 最终要返回一个Promise 包装的 inp对象
      return Promise.resolve(inp)
    })

  function initData(condition) {
    var result = []
    var bookName = condition.match(/^\W+/)[0] //开头的非英数就是书名
    if (!bookName) {
      throw new Error('解析经文书卷名失败')
    }
    // 处理多处经文的情况
    var scriptureArr = condition.split(',')
    console.log('scriptureArr: ' + scriptureArr)
    scriptureArr.forEach(item => {
      var chapterSn,
        scope;
      try {
        console.log('scriptureArr: ' + scriptureArr)
        scope = item.split(':')
        console.log('scope: ' + scope)
        chapterSn = parseInt(scope[0].replace(bookName, ''))
        console.log('scope: ' + chapterSn)
      } catch (err) {
        throw new Error('解析经文章节号失败')
      }

      if (scope[1]) {
        // 处理范围的情况
        scope = scope[1].split('-')
      } else {
        // 处理整章的情况
        scope = [-1, -1]
      }

      // 处理只有一节的情况
      if (scope.length === 1) {
        scope.push(scope[0])
      }

      scope[0] = parseInt(scope[0])
      scope[1] = parseInt(scope[1])
      console.log('bookName, chapterSn, scope: ' + bookName, chapterSn, scope)
      result.push([bookName, chapterSn, scope])
    })
    return result
  }


  function getLection(getString) {
    // 通过卷的名称获取卷SN
    return getVolumeSnAsync(getString[0])
      .then(volumeSN => {
        // inp的 parsed 里压入 经卷的查询条件
        var whereStr = {
          volumeSN,
          chapterSN: getString[1]
        }

        if (getString[2][0] != -1) {
          // 如果不是整章
          whereStr.verseSN = {
            $gte: getString[2][0],
            $lte: getString[2][1]
          }
        }
        return Lection.find(whereStr)
          .exec()
      })
      .then(rows => {
        inp.parsed.push(`${getString[0]}${getString[1]}:${getString[2].join('-')}`)
        rows.forEach(row => {
          inp.parsed.push(row.verseSN + ' ' + row.lection)
        })
        return Promise.resolve(true)
      })
  }

  function getVolumeSnAsync(name) {
    var whereStr = {
      $or: [{
        shortName: name
      }, {
        fullName: name
      }]
    }

    return Volume.findOne(whereStr)
      .exec()
      .then(rows => {
        console.log('rows.sn: ' + rows.sn)
        return Promise.resolve(parseInt(rows.sn))
      })
  }
}

module.exports = getScripture
