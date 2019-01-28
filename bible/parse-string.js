const getHymn = require('./get-hymn')
const getScripture = require('./get-scripture')


function parseString(inp) {
  var res;
  // 统一处理同步的异常, 抛到异步进行处理
  try {
    res = getPromiseArr(inp)
  } catch (err) {
    return Promise.reject(err)
  }

  // 返回值是Promise封装过的 数组
  return Promise.all(res.promiseArr)
    .then(arr => {
      var result = res.worship.concat(arr)
      result.sort((a, b) => {
        return (a.seq - b.seq)
      })
      return Promise.resolve(result)
    })
}

function getPromiseArr(inp) {
  // 每次解析都需要取下预设的列表
  var preset = require('./config')

  // 去除中文标点并转数组
  var items = inp.replace(/：/g, ':')
    .replace(/；/g, ';')
    .replace(/，/g, ',')
    .replace(/~/g, '-')
    .replace(/、/g, ',')
    .split(/\n/)

  // worship 是最终解析的结果
  var worship = []

  // promiseArr 是查询的异步
  var promiseArr = []

  items.forEach((item, index) => {
    //item是preset每个条目
    item = item.trim().replace(/\s+/g, '')
    preset.forEach(pre => {
      // 用流程中的规则匹配名字 识别是哪条流程
      if (pre.regex.test(item)) {
        pre.seq = index
        // 识别序号
        if (item.match(/^[0-9A-Za-z]+./)) {
          pre.id = item.match(/^[0-9A-Za-z]+/)[0]
        }

        // 识别有：的情况把值取出来
        if (item.match(/:/)) {
          pre.value = item.slice(item.match(/:/).index + 1)
        }

        // 解析赞美诗
        if (pre.parseType == 'hymn') {
          promiseArr.push(getHymn(pre))
        // 解析经文
        } else if (pre.parseType == 'scripture') {
          promiseArr.push(getScripture(pre))
        // 其它无需解析
        } else {
          worship.push(pre)
        }
      }
    })
  })
  return {promiseArr, worship}
}

module.exports = parseString
