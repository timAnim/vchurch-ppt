module.exports = (chapter, verses) => {
    var start = verses[0]
    var end = verses[1]
    var res = []
    for (var i = start; i <= end; i++) {
        res.push(chapter + ':' + i)
    }
    return res
}