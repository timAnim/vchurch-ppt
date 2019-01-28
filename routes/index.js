var express = require('express');
var router = express.Router();
var parseStr = require('../bible/parse-string')
var genPPT = require('../bible/gen-ppt')
var genHTML = require('../bible/gen-html')
var fs = require('fs')
var path = require('path')


router.get('/api/file/*', function(req, res, next) {
  var reg = /.*?api\/file\//
  var filename = req.url.replace(reg, '')
  res.download(path.resolve(__dirname, '../public/file', decodeURI(filename)))
});

router.get('/', function(req, res, next) {
  res.render('/index')
});

router.post('/api/parse-string', function(req, res, next) {
  parseStr(req.body.inp)
    .then(worship => {
      if (!worship) {
        return next(new Error('解析出错'))
      }
      res.send({
        code: 0,
        msg: "操作成功",
        data: worship
      })
    })
    .catch(err=>{
      next(err)
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

router.post('/api/gen-html', function(req, res, next) {
  var worship = req.body.worship;
  genHTML(worship, (content, err) => {
    if (err) return next(err)
    res.send({
      code: 0,
      msg: "操作成功",
      data: {
        content,
        err
      }
    })
  })
});

module.exports = router;
