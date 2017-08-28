const sspaiIcon = require('assets/sspai.com.png')
const oneIcon = require('assets/wufazhuce.com.jpg')


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
  {
    name: 'one',
    title: '一个',
    link: 'http://wufazhuce.com/',
    icon: oneIcon,
    tags: [
      '首页',
      // '阅读',
      // '音乐',
      // '图片',
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
