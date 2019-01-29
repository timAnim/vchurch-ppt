const Volume = require('../model/volume')
const Lection = require('../model/lection')


/**
 * 1. 将经文文本转化为查询条件 eg 约3:16-17
 * 2. 查询经文(Verse)
 * 3. 根据输入排序
 * 4. 返回Promise后的对象 inpScripture { name, value, parsed<Array Scripture>}
 *
 * scripture 经文的结构 {sequence, volumnName, chapterSN, scope, verses}
 * verse 经句的结构 {verseSN, lection}
 * 
 * @Author Timothy  CHEN
 * @param  {Scripture} inpScripture  经文的对象
 * @return {[type]}      [description]
 */
function getScripture(inpScripture) {
  // 经文的数组
  var scriptureArr,
    // 查询语句
    promiseArr = [];
  // 解析后的结果
  inpScripture.parsed = [];

  // 同步异常 异步处理
  try {
    scriptureArr = getScriptureArr(inpScripture.value)
  } catch (err) {
    err.message += '请检查经文文本的格式'
    return Promise.reject(err)
  }
  scriptureArr.forEach(scripture => {
    promiseArr.push(getVersesByScripture(scripture))
  })

  return Promise.all(promiseArr)
    .then(scriptures => {

      // 经文对象按 原来的顺序 排序
      scriptures.sort((a, b) => {
        return a.sequence - b.sequence
      })

      inpScripture.parsed = scriptures
      // 最终要返回一个Promise 包装的 inp对象
      return Promise.resolve(inpScripture)
    })

}

/**
 * 将经文出处的文本转为对象数组
 * @Author Timothy  CHEN
 * @param  {String} scriptureStr 将经文出处的文本
 * @return {Array<Scripture>}    经文的数组
 */
function getScriptureArr(scriptureStr) {
  var arr = scriptureStr.split(','),
    volumnName,
    scriptureArr = [];

  arr.forEach((scopeStr, index) => {
    // 开头的非英数就是书名
    var _volumnName = scopeStr.match(/^\W+/);

    // 如果没有就存到全局, 如果有就覆盖全局
    volumnName = _volumnName ? _volumnName[0] : volumnName
    scriptureArr.push({
      sequence: index,
      volumnName,
      scope: scopeStr
    })
  })

  return getChapterSnAndScope(scriptureArr)
}


/**
 * 将经文分解成查询的指令
 * 1. 填充卷的名称
 * 2. 处理多处经文(1处也要转化成数组)
 * 3. 处理每处经文的范围
 * 4. 返回查询条件的数组
 * 
 * @Author Timothy  CHEN
 * @param  {String} scriptureArr 查询条件的文本
 * @return {Array<Scripture>}    经文的数组
 */
function getChapterSnAndScope(scriptureArr) {

  scriptureArr.forEach(scripture => {
    var scopeStr,
      scope = scripture.scope
      .replace(scripture.volumnName, '')
      .split(':');

    scripture.chapterSN = parseInt(scope[0]);
    if (!scripture.chapterSN) {
      throw new Error('解析经文书编号失败')
    }

    if (scope[1]) {
      // 处理范围的情况
      scopeStr = `${scripture.volumnName}${scripture.chapterSN}:${scope[1]}`
      scope = scope[1].split('-')
    } else {
      // 处理整章的情况
      scope = [-1, -1]
      scopeStr = `${scripture.volumnName}${scripture.chapterSN}章`
    }

    // 处理只有一节的情况
    if (scope.length === 1) {
      scope.push(scope[0])
      scopeStr = `${scripture.volumnName}${scripture.chapterSN}:${scope[0]}`
    }

    scripture.scope = [parseInt(scope[0]), parseInt(scope[1])]
    scripture.scopeStr = scopeStr
  })
  return scriptureArr
}

/**
 * 通过Scripture对象解析经句(Verse)
 * 1. 根据卷名查卷Sn
 * 2. 如果经文的范围是 -1 说明查整章
 * 3. 根据经句的范围查经句
 * @Author Timothy  CHEN
 */
function getVersesByScripture(scripture) {

  return getVolumnSnByVolumnName(scripture.volumnName)
    .then(data=>{
      if(!data){
        var err = new Error('书卷名错误: ' + scripture.volumnName)
        return Promise.reject(err)
      }
      return Promise.resolve(data.sn)
    })
    .then(volumeSN => {
      var whereStr = {
        volumeSN, 
        chapterSN: scripture.chapterSN
      }
      // 如果经文的范围是 -1 说明查整章
      if (scripture.scope[0] != -1) {
        whereStr.verseSN = {
          $gte: scripture.scope[0],
          $lte: scripture.scope[1]
        }
      }
      return Lection.find(whereStr)
        .exec()
    })
    .then(data => {
      scripture.verses = data
      return Promise.resolve(scripture)
    })
}

/**
 * 根据中文简写 或 全名获取书卷的Sn
 * @return {Number}   卷的Sn
 * @Author Timothy  CHEN
 * 
 */
function getVolumnSnByVolumnName(name) {
  var whereStr = {
    $or: [{
      shortName: name
    }, {
      fullName: name
    }]
  }

  return Volume.findOne(whereStr)
    .exec()
}

module.exports = getScripture
