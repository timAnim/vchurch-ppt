const bible = require('../../../resources/bible-ch.json')
const scopeToArray = require('./scopeToArray')
const getFullText = require('./getFullText')

module.exports = function(item) {
  // 处理有多处经文的情况 
  var scriptsArr = item.value.split(/,|;/g);
  item.parsed = []

  var bookName
  scriptsArr.forEach(scripts => {
    if (scripts.match(/^\W+/)) {
      bookName = scripts.match(/^\W+/)[0] //开头的非英数就是书名
    } else {
      //  可能并没有bookName 那么使用之前的bookname eg 书1:1-20; 2:5-10的情况
      scripts = bookName + scripts
    }
    bible.forEach(book => {
      // book[0] 是一个匹配书名的正则

      if (new RegExp(book[0]).test(bookName)) {
        console.log(bookName)
        console.log(book[0])
        var chapter = scripts.split(':')[0]
        var scope
        if (scripts.split(':')[1]) { // 处理范围的情况
          scope = scripts.split(':')[1].split('-')
        } else { // 处理整章的情况
          scope = [-1, -1]
        }

        // 处理只有一节的情况
        if (scope.length === 1) {
          scope.push(scope[0])
        }
        scope[0] = parseInt(scope[0])
        scope[1] = parseInt(scope[1])

        var verses = scopeToArray(chapter, scope)
        var arr = getFullText(book, chapter, verses)
        item.parsed.push(arr)
        item.parseType = 'scripture'
      }
    })
  })
}
