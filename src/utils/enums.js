const sspaiIcon = require('assets/sspai.com.png')

const platformList = [
  {
    name: 'sspai',
    title: '少数派',
    link: 'https://sspai.com',
    handleData: item => ({
      id: item.id,
      summary: item.summary,
      title: item.title,
      banner: item.banner ? `https://cdn.sspai.com/${item.banner}?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x260` : '',
    }),
    icon: sspaiIcon,
    tags: [
      '效率工具',
      '手机摄影',
      '生活方式',
      '游戏',
      '硬件',
      '人物',
    ],
  },
]

const EnumPlatform = {}
platformList.forEach((item) => {
  EnumPlatform[item.name] = item
})

module.exports = {
  EnumPlatform,
  platformList,
}
