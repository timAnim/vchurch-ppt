var Volume = require('../model/volume')
var Lection = require('../model/lection')


function getScripture(con, worship) {
  var bookName,
    chapterSn,
    scope;

  var _promise = new Promise((resolve, reject) => {
    try {
      initData(con.value)
    } catch (err) {
      return reject(err)
    }

    getVolumeSnAsync(bookName)
      .then(volumeSn => {
        return getLectionsByVolumeSnAndScope(volumeSn, chapterSn, scope)
      })
      .then(rows => {
        con.parsed = []
        rows.forEach(row => {
          con.parsed.push(row.verseSN + ' ' + row.lection)
        })
        resolve(con)
      })
      .catch(err => {
        reject(err)
      })
  })

  return _promise;

  function initData(condition) {

    bookName = condition.match(/^\W+/)[0] //开头的非英数就是书名
    if (!bookName) {
      throw new Error('解析经文书卷名失败')
    }

    try {
      scope = condition.split(':')
      chapterSn = scope[0].replace(bookName, '')
      chapterSn = parseInt(chapterSn)
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
  }


  function getVolumeSnAsync(name) {
    var whereStr = {
      $or: [{
        shortName: name
      }, {
        fullName: name
      }]
    }

    var promise = new Promise((resolve, reject) => {
      Volume.findOne(whereStr, function(err, rows) {
        if (err) {
          reject(err)
        } else if (!rows.sn) {
          reject(new Error('经文的缩写不对'))
        } else {
          resolve(rows.sn)
        }
      });
    })
    return promise
  }


  function getLectionsByVolumeSnAndScope(volumeSn, chapterSn, scope) {
    var whereStr = {
      volumeSN: volumeSn,
      chapterSN: chapterSn
    }

    if (scope[0] != -1) {
      // 如果不是整章
      whereStr.verseSN = {
        $gte: scope[0],
        $lte: scope[1]
      }
    }
    var promise = new Promise((resolve, reject) => {

      Lection.find(whereStr)
        .sort({ verseSN: 1 })
        .exec(function(err, rows) {
          if (err || !rows[0]) {
            reject(new Error("没有查到经文"))
          } else {
            resolve(rows)
          }
        });
    })

    return promise
  }
}

module.exports = getScripture
