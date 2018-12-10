const hymn = require('../../../resources/hymn-ch.json')

module.exports = function(item) {
    var num = parseInt(item.value.match(/\d+/)[0])
    item.parsed = hymn[num][1].split('<br> \n')
    item.parseType = 'hymn'
}