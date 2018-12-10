var part1 = require('./hymn-part-1.json')
var part2 = require('./hymn-part-2.json')
var part3 = require('./hymn-part-3.json')
var part4 = require('./hymn-part-4.json')
const jsonfile = require('jsonfile')

var result = ['^[新赞|新编赞美诗]']
for (var i = 1; i < 101; i++) {
    result[i] = part1[i]
}
for (var i = 101; i < 201; i++) {
    result[i] = part2[i]
}
for (var i = 201; i < 301; i++) {
    result[i] = part3[i]
}
for (var i = 301; i < 401; i++) {
    result[i] = part4[i]
}

jsonfile.writeFileSync("./hymn-ch.json", result, { spaces: 2 });
