const fs = require('fs')
const altName = require('./alt-name.json')
const jsonfile = require('jsonfile')

fs.readFile('./bible-ch.txt', 'utf-8', (err, data) => {
    if (err) {
        return err
    }
    var books = data.split(/\r\n\r\n/g)

    books.forEach((book,i)=>{
    	// 经文分成数组
    	books[i] = book.split(/\r\n/g)

    	// 每本书的第0个条目, 是别名
    	books[i][0] = altName[i]
    })
    jsonfile.writeFileSync("./bible-ch.json", books, {spaces: 2});
})