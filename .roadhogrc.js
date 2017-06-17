const path = require('path');
const pxtorem = require('postcss-pxtorem');

const svgSpriteDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),
  path.resolve(__dirname, 'src/svg/'),
];

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  "theme": "./theme.config.js",
  "proxy": {
    // "/api": {
    //   // "target": "http://distribution.l.kkguan.com",
    //   "target": "http://distribution-api.t.kkguan.com",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/api" : "/api" }
    // },
  },
  env: {
    development: {
      extraBabelPlugins: [
        'dva-hmr',
        'transform-runtime',
        ['import', { 'libraryName': 'antd-mobile', 'libraryDirectory': 'lib', 'style': true }]
      ],
      extraPostCSSPlugins: [
        pxtorem({
          rootValue: 75,
          propWhiteList: [],
        }),
      ],
    },
    production: {
      extraBabelPlugins: [
        'transform-runtime',
        ['import', { 'libraryName': 'antd-mobile', 'libraryDirectory': 'lib', 'style': true }]
      ],
      extraPostCSSPlugins: [
        pxtorem({
          rootValue: 75,
          propWhiteList: [],
        }),
      ],
    }
  }
}
