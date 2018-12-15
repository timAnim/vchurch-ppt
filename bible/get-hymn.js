var Hymn = require('../model/hymn')

function getHymn(inp) {
	var num = parseInt(inp.value.match(/\d+/)[0])

  var _promise = new Promise((resolve, reject) => {
    var whereStr = {
      sn: num
    }
    Hymn.findOne(whereStr, function(err, data) {
      if (err||!data) {
        reject(new Error("没有找到赞美诗"))
      } else {
      	inp.sn = data.sn
      	// inp.name = data.name
        inp.parseType = 'hymn'
        inp.parsed = data.content.split('<br> \n')
        resolve(inp)
      }
    });
  })
  return _promise;
}

// 此处是 测试 
function test(){
	getHymn({
		value:'新赞399《三一颂》',
	})
	.then(res=>{
		console.log(res)
	})
}

// test()

module.exports = getHymn