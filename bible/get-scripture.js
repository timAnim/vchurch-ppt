const Volume = require('../model/volume')
const Lection = require('../model/lection')

function getScripture(inp) {
  var inp;
  var lectionArr;
  try {
    inp.parsed = [];
    lectionArr = getLectionArray(inp.value)
  } catch (err) {
    err.message = '请检查经文的格式'
    return Promise.reject(err)
  }
  var promiseArr = []
  lectionArr.forEach(lection => {
    promiseArr.push(getVerses(lection))
  })

  return Promise.all(promiseArr)
    .then(lections => {
      // lection 的结构 {volumnName, chapterSN, scope, sequence, verses}

      // 经文对象按 原来的顺序 排序
      lections.sort((a, b) => {
        return a.sequence - b.sequence
      })
      
      inp.parsed = lections
      // 最终要返回一个Promise 包装的 inp对象
      return Promise.resolve(inp)
    })

  function getVerses(lection) {
    return getVolumnSnByVolumnName(lection.volumnName)
      .then(volumeSN => {
        var whereStr = {
          volumeSN,
          chapterSN: lection.chapterSN
        }

        // 处理非整章情况
        if (lection.scope[0] != -1) {
          whereStr.verseSN = {
            $gte: lection.scope[0],
            $lte: lection.scope[1]
          }
        }
        return Lection.find(whereStr)
          .exec()
      })
      .then(verses => {
        lection.verses = verses
        return Promise.resolve(lection)
      })
  }
}

// 通过中文简写/全名获取书卷的Sn
function getVolumnSnByVolumnName(name) {
  var whereStr = {
    $or: [{
      shortName: name
    }, {
      fullName: name
    }]
  }

  return Volume.findOne(whereStr)
    .exec()
    .then(rows => rows.sn)
}

function getLectionArray(condition) {
  var lectionArr = [],
    //开头的非英数就是书名
    volumnName = condition.match(/^\W+/)[0];

  if (!volumnName) {
    throw new Error('解析经文书卷名失败')
  }
  // 处理多处经文的情况
  var scriptureArr = condition.split(',')
  scriptureArr.forEach((item, index) => {
    var scope = item.split(':'),
      chapterSN = parseInt(scope[0].replace(volumnName, ''));
    if (!chapterSN) {
      throw new Error('解析经文书卷名失败')
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
    lectionArr.push({
      sequence: index,
      volumnName,
      chapterSN,
      scope
    })
  })
  return lectionArr
}

module.exports = getScripture
