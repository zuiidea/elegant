const Mock = require('mockjs')

const config = {
  apiPrefix: '/api/v1',
}

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (const item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}


let articleId = 0
const articles = Mock.mock({
  'data|100': [
    {
      id() {
        articleId += 1
        return articleId + 10000
      },
      summary: '@cparagraph(1,3)',
      title: '@ctitle',
      createTime: '@datetime',
      banner: () => {
        return Mock.mock('@pick(["https://cdn.sspai.com/2017/05/25/3735786abc34a26a880e86a9918bfc94.jpg?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x220",'
          + '"https://cdn.sspai.com/article/9dd59e2f-3487-42ac-3cb6-738a91201475.jpg?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x220", '
          + '"https://cdn.sspai.com/2017/05/16/0e3471d555dffcf2638f2a41a53e4114.jpg?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x220", '
          + '"https://cdn.sspai.com/article/7016f0d5-676b-f167-a078-56235c9996f1.jpg?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x220", '
          + '"https://cdn.sspai.com/2017/04/26/17b535739e6db74a705047a24f160799.png?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x220"])')
      },
    },
  ],
}).data

module.exports = {
  queryArray,
  NOTFOUND,
  Mock,
  articles,
  config,
}
