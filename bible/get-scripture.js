const Volume = require('../model/volume')
const Lection = require('../model/lection')

/**
 * 1. 流程文本转化为经文文本     e.g. 约3:16-17
 * 2. 经文文本转化为经句查询条件
 * 2. 查询经句(Verse)
 * 3. 根据输入排序
 * 4. 返回Promise后的对象 流程->经文->经句
 *
 * 流程
 *   Procedure {
 *     name,        流程名字
 *     value,       流程值String
 *     parsed       解析后的结果--经文数组
 *   }
 *   
 * 经文的结构
 *   Scripture {
 *     sequence,    排序权重
 *     volumnName,  卷名
 *     chapterSN,   卷编号
 *     scope,       节范围
 *     verses       经句数组
 *   }
 *   
 * 经句的结构
 *   verse {
 *     verseSN,     经句编号
 *     lection      经句文字
 *   }
 * 
 * @Author Timothy  CHEN
 * @param  {Procedure} 流程的对象
 * @return {Procedure} 将流程装饰后返回回去
 */
function getScripture(procedure) {
  // 经文的数组
  var scriptureArrPromise;
  // 解析后的结果
  procedure.parsed = [];

  // 同步异常 异步处理
  try {
    scriptureArrPromise = getScriptureArr(procedure.value)
  } catch (err) {
    err.message += '经文文本解析错误'
    return Promise.reject(err)
  }

  return Promise.all(scriptureArrPromise)
    .then(scriptureArr => {

      // 经文对象按 原来的顺序 排序
      scriptureArr.sort((a, b) => {
        return a.sequence - b.sequence
      })

      procedure.parsed = scriptureArr
      // 最终要返回一个Promise 包装的 procedure对象
      return Promise.resolve(procedure)
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
    promiseArr = [],
    scriptureArr = [];

  // 组装 顺序, 卷名
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

  // 组装 经句范围scope
  scriptureArr = getChapterSnAndScope(scriptureArr)

  // 查询经句 verses
  scriptureArr.forEach(scripture => {
    promiseArr.push(getVersesByScripture(scripture))
  })

  return promiseArr
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
    .then(data => {
      if (!data) {
        var err = new Error('无效的书卷名:' + scripture.volumnName)
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
      if(!data.length){
        var err = new Error('无效的章节号:'+ scripture.scopeStr)
        return Promise.reject(err)
      }else{
        scripture.verses = data
        return Promise.resolve(scripture)
      }
    })
}

/**
 * 根据中文简写 或 全名获取书卷的Sn
 * @return {Number}   卷的Sn
 * @Author Timothy  CHEN
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
