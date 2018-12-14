var express = require('express');
var router = express.Router();
var parseStr = require('../bible/parse-string')
var genPPT = require('../bible/gen-ppt')
// var Volume = require('../model/volume')
// var Lection = require('../model/lection')
var fs = require('fs')
var path = require('path')


router.get('/api/file/*', function(req, res, next) {
  var reg = /.*?api\/file\//
  var filename = req.url.replace(reg,'')
  res.download(path.resolve(__dirname,'../public/file' , decodeURI(filename)))
});

router.get('/', function(req, res, next) {
  res.render('/index')
});

router.post('/api/parse-string', function(req, res, next) {
  var inp = req.body.inp;
  parseStr(inp, (worship, err) => {
    var msg;
    if (!worship) {
      return next(new Error('解析出错'))
    }
    if (err) {
      return next(err)
    }
    res.send({
      code: 0,
      msg: "操作成功",
      data: worship
    })
  })
});

router.post('/api/gen-ppt', function(req, res, next) {
  var worship = req.body.worship;
  genPPT(worship, (distPath, err) => {
    if (err) return next(err)
    res.send({
      code: 0,
      msg: "操作成功",
      data: {
        distPath,
        err
      }
    })
  })
});

// router.post('volume', (req, res, next) => {
//   Volume.find({}, (err, data) => {
//     if (err) return next(new Error("书卷名不存在"))
//     res.send({
//       code: 0,
//       msg: "操作成功",
//       data
//     })
//   })
// })

// router.post('lection', (req, res, next) => {
//   var volumeSN = req.body.volumeSN
//   Lection.find({ volumeSN }, (err, data) => {
//     if (err) return next(new Error("查询失败"))
//     res.send({
//       code: 0,
//       msg: "操作成功",
//       data
//     })
//   })
// })

module.exports = router;
