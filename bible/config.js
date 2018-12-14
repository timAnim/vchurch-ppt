module.exports = [{
    key: "name",
    regex: /^威盛/,
    name: '威盛职场团契周六信息分享',
  },
  {
    key: "prolusion",
    regex: /序乐:|序乐/g,
    name: '序乐',
  },
  {
    key: "call",
    regex: /宣召:|宣召/g,
    name: '宣召',
    parseType: "scripture",
  },
  {
    key: "pHymn",
    regex: /颂赞诗歌:|颂赞诗歌/g,
    name: '颂赞诗歌',
    parseType: "hymn",
  },
  {
    key: "pPray",
    regex: /颂赞祷告:|颂赞祷告/g,
    name: '颂赞祷告',
  },
  {
    key: "lection",
    regex: /启应经文:|启应经文/g,
    name: '启应经文',
    parseType: "scripture",
  },
  {
    key: "hCommunication",
    regex: /\.圣餐$/,
    name: '圣餐',
  },
  {
    key: "hCommunicationHymn",
    regex: /圣餐诗歌/,
    name: '圣餐诗歌',
    parseType: "hymn",
  },
  {
    key: "hCommunicationScripture",
    regex: /圣餐经文/g,
    name: '圣餐经文',
    parseType: "scripture",
  },
  {
    key: "supper",
    regex: /领受圣餐$/,
    name: '领受圣餐',
  },
  {
    key: "choir",
    regex: /诗班献诗:|诗班献诗/g,
    name: '诗班献诗',
  },
  {
    key: "pScripture",
    regex: /信息经文:|信息经文/g,
    name: '信息经文',
    parseType: "scripture",
  },
  {
    key: "pTitle",
    regex: /信息主题:|信息主题/g,
    name: '信息主题',
  },
  {
    key: "rHymn",
    regex: /回应诗歌:|回应诗歌/g,
    name: '回应诗歌',
    parseType: "hymn",
  },
  {
    key: "blessing",
    regex: /祝祷:|祝祷/g,
    name: '祝祷',
  },
  {
    key: "song",
    regex: /三一颂:|三一颂/g,
    name: '三一颂',
    parseType: "hymn",
  },
  {
    key: "report",
    regex: /會務報告:|會務報告|会务报告:|会务报告/g,
    name: '會務報告',
  },
  {
    key: "time",
    regex: /时间:|时间/g,
    name: '时间',
  },
  {
    key: "place",
    regex: /地点:|地点/g,
    name: '地点',
  }
]
