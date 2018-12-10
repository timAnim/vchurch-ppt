var express = require('express');
var router = express.Router();
var parseStr  = require('../static/js/parse-string')
var genPPT = require('../static/js/gen-ppt')

router.get('/', function(req, res, next) {
  res.render('/index')
});

router.post('/parse-string', function(req, res, next) {
  var inp = req.body.inp;
  var worship = parseStr(inp)
  res.send(worship)
});

router.post('/gen-ppt', function(req, res, next) {
  var worship = req.body.worship;
  genPPT(worship, disPath => {
    res.send(disPath)
  })
});

module.exports = router;