const sspaiIcon = require('assets/sspai.com.png')

const platformList = [
  {
    name: 'sspai',
    title: '少数派',
    link: 'https://sspai.com',
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
