var fs = require('fs')
var Officegen = require('pptxgenjs')
var path = require('path')

var thStyle = {
  x: 0,
  y: 0,
  fontFace: 'SimSun',
  fontSize: 60,
  h: '100%',
  w: '100%',
  align: 'center',
  valign: 'middle',
  inset: 0.2,
  bold: true
}

var h1Style = {
  x: 0,
  y: 0,
  fontFace: 'SimSun',
  fontSize: 60,
  h: '50%',
  w: '100%',
  align: 'center',
  valign: 'bottom',
  inset: 0.2,
  bold: true
}

var subStyle = {
  x: 0,
  y: '50%',
  h: '50%',
  w: '100%',
  fontFace: 'SimSun',
  inset: 0.2,
  fontSize: 52,
  align: 'center',
  valign: 'top',
  bold: true,
  color: 'e0e0e0'
}

var h2Style = {
  x: 0,
  y: 0,
  h: 0.8,
  w: '100%',
  fontFace: 'SimSun',
  inset: 0.2,
  fontSize: 32,
  bold: true,
  color: 'e0e0e0'
}

var pStyle = {
  x: 0,
  y: 0.8,
  h: 4.8,
  w: '100%',
  fontFace: 'SimSun',
  lineSpacing: 56,
  valign: 'top',
  inset: 0.2,
  bold: true
}

var hymnStyle = {
  x: 0,
  y: 0.8,
  h: 4.8,
  w: '100%',
  fontFace: 'SimSun',
  fontSize: 48,
  lineSpacing: 64,
  align: 'center',
  valign: 'top',
  inset: 0.2,
  bold: true
}

var markStyle = {
  x: 0,
  y: 0.8,
  h: 4.8,
  w: '100%',
  fontFace: 'SimSun',
  fontSize: 32,
  lineSpacing: 48,
  valign: 'top',
  inset: 0.2,
  bold: true,
  color: 'ffff00'
}

module.exports = function(arr, cb) {
  var pptx = new Officegen()
  pptx.setLayout('LAYOUT_4x3');
  // 生成ppt
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].parseType === 'scripture') {
      // 信息经文的插页
      var slide = addSlide()
      slide.addText(arr[i].name, h1Style);
      slide.addText(arr[i].value, subStyle);

      arr[i].parsed.forEach(scripture => {
        // 有一处经文就要加一个page
        for (var j = 0; j < scripture.verses.length; j++) {
          // 只处理双数节
          if (j % 2 === 0) {
            // 如果是双数节, 加一个page
            var _slide = addSlide()

            // scripture 的结构 {volumnName, chapterSN, scope, sequence, verses}
            _slide.addText(arr[i].name + '    ' +scripture.scopeStr, h2Style)

            // 如果有下一个, 则两个一起放到页面里
            if (scripture.verses[j + 1]) {
              var txtArr1 = splitNumAndScripture(scripture.verses[j])
              var txtArr2 = splitNumAndScripture(scripture.verses[j + 1])
              txtArr1[1].text += '\r' //需要有一个换行符
              //如果是启应, 则偶数id要变成黄色
              if (new RegExp('启应').test(arr[i].name)) changeColor(txtArr2)
              _slide.addText(txtArr1.concat(txtArr2), pStyle)
            } else {
              //如果没有下一个, 则单独放
              var txtArr = splitNumAndScripture(scripture.verses[j])

              // 如果是启应，最后一句无论如何都变色
              if (new RegExp('启应').test(arr[i].name)) changeColor(txtArr)
              _slide.addText(txtArr, pStyle)
            }
          }
        }
      })
    } else if (arr[i].parseType === 'hymn') {
      for (var j = 0; j < arr[i].parsed.length; j++) {
        // 每4句话放在一个页面
        // 如果最后一页只有一句话, 那追加到前一页
        if (j % 4 === 0 && j !== arr[i].parsed.length - 1) {
          var slide = addSlide()
          var txt
          slide.addText(arr[i].name + '    ' + arr[i].value, h2Style)
          if ((j + 4) === arr[i].parsed.length - 1) {
            txt = [arr[i].parsed[j], arr[i].parsed[j + 1], arr[i].parsed[j + 2], arr[i].parsed[j + 3], arr[i].parsed[j + 4]].join('\n')
          } else if (arr[i].parsed[j + 3]) {
            txt = [arr[i].parsed[j], arr[i].parsed[j + 1], arr[i].parsed[j + 2], arr[i].parsed[j + 3]].join('\n')
          } else if (arr[i].parsed[j + 2]) {
            txt = [arr[i].parsed[j], arr[i].parsed[j + 1], arr[i].parsed[j + 2]].join('\n')
          } else {
            txt = [arr[i].parsed[j], arr[i].parsed[j + 1]].join('\n')
          }
          slide.addText(txt, hymnStyle);
        }
      }
    } else if (arr[i].name && arr[i].value && arr[i].id) {
      var slide = addSlide()
      slide.addText(arr[i].name, h1Style);
      slide.addText(arr[i].value, subStyle);
    } else if (arr[i].id) {
      var slide = addSlide()
      slide.addText(arr[i].name, thStyle);
    }

  }

  var cur = new Date()


  var time = [cur.getFullYear(), cur.getMonth(), cur.getDay()].join('-')
  var timeFilter = arr.filter(t => {
    return t.key == 'time'
  })

  if (timeFilter.length) {
    time = timeFilter[0].value.split(/[(|（]/)[0]
  }

  var _title = '未命名'
  var titleFilter = arr.filter(t => {
    return t.key == 'pTitle'
  })

  if (titleFilter.length) {
    _title = titleFilter[0].value
  }


  var filename = time + _title + '.pptx'
  var distPath = path.resolve(__dirname, '../public/file')

  var savePath = distPath + '/' + filename
  pptx.save(savePath)
  return cb('api/file/' + filename, null)

  function addSlide() {
    var slide = pptx.addNewSlide()
    slide.back = '323f4f'
    slide.color = 'ffffff'
    return slide
  }
}

function splitNumAndScripture(verse) {
  // verse的结构 {verseSN, lection}
  return [{
    text: verse.verseSN,
    options: {
      fontSize: 32,
    }
  }, {
    text: verse.lection,
    options: {
      fontSize: 48,
    }
  }]

}

function changeColor(txtArr){
  txtArr[0].options.color = 'ffff00'
  txtArr[1].options.color = 'ffff00'
}
