module.exports = (book, chapter, verses) => {
  if (/-1/.test(verses[0])) { // 处理整章的情况
    var regex = new RegExp(chapter + ':')
    verses = []
    book.forEach(item => {
      if (regex.test(item)) {
        verses.push(item.replace((chapter + ':'), ''))
      }
    })
  } else {
    verses.forEach((verse, i) => {
      var regex = new RegExp(verse + ' ')
      book.forEach(item => {
        if (regex.test(item)) {
          verses[i] = item.replace((chapter + ':'), '')
        }
      })
    })
  }
  return verses
}
