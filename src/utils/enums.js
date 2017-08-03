const EnumPlatform = {
  sspai: {
    handleData: item => ({
      id: item.id,
      summary: item.summary,
      title: item.title,
      banner: item.banner ? `https://cdn.sspai.com/${item.banner}?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x260` : '',
    }),
    tags: [
      '效率工具',
      '手机摄影',
      '生活方式',
      '游戏',
      '硬件',
      '人物',
    ],
  },
}

module.exports = {
  EnumPlatform,
}
