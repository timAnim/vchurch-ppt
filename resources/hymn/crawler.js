const cheerio = require('cheerio')
const http = require('http');
var iconv = require('iconv-lite');
const base = 'http://www.jonahome.net/files/zmsg/zmsgc/zhanmeishi/Hymn'
const jsonfile = require('jsonfile')

var num = 301
arr = []
pArr = []

function getPromise(num, resolve, reject) {

    var id
    var html
    if (num < 10) {
        id = '00' + num
    } else if (num < 100) {
        id = '0' + num
    } else {
        id = num
    }

    http.get(`${base}${id}.htm`, function(result) {
        var body = [];
        result.on('data', function(chunk) {
            body.push(chunk);
        });
        result.on('end', function() {
            var html = iconv.decode(Buffer.concat(body), 'gb2312')

            var $ = cheerio.load(html, { decodeEntities: false })
            var txt = $('.TitleLinks').html().split(/<!--\/?HTMLBUILERPART0-->/)[1]
            arr[num] = txt.split(/<br><br>/)
            resolve()
        });
    });
}

for (var i = num; i < 401; i++) {
    var p = new Promise((resolve, reject) => {
        getPromise(i, resolve, reject)
    })
    pArr.push(p)
}

Promise.all(pArr).
then(res => {
    jsonfile.writeFileSync("./hymn-part-4.json", arr, { spaces: 2 });
})