const getHymn = require('../get-hymn')
const getScripture = require('../get-scripture')

module.exports = function(inp) {
	// 每次解析都需要取下预设的列表
	var preset = require('../../../static/config/index.js')

  // 去除中文标点并转数组
  var items = inp.replace(/：/g, ':')
    .replace(/；/g, ';')
    .replace(/，/g, ',')
    .replace(/~/g, '-')
    .replace(/、/g, ',')
    .split(/\n/)

  // worship 是最终解析的结果
  var worship = []

  items.forEach(item => {
    //item是preset每个条目
    item = item.trim().replace(/\s+/g, '')
    preset.forEach(pre => {
      // 用流程中的规则匹配名字 识别是哪条流程
      if (pre.regex.test(item)) {
        // 识别序号
        if (item.match(/^[0-9A-Za-z]+./)) {
          pre.id = item.match(/^[0-9A-Za-z]+/)[0]
        }

        // 识别有：的情况把值取出来
        if (item.match(/:/)) {
          pre.value = item.slice(item.match(/:/).index + 1)
        }

        // 解析经文
        if (pre.parseType == 'scripture') {
          getScripture(pre)
        }

        // 解析赞美诗
        if (pre.parseType == 'hymn') {
          getHymn(pre)
        }

        worship.push(pre)
      }
    })
  })
  return worship
}
