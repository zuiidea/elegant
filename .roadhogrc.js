const path = require('path');
const pxtorem = require('postcss-pxtorem');
const { version } = require('./package.json')

const svgSpriteDirs = [path.resolve(__dirname, 'src/svg/')];

export default {
  entry : 'src/index.js',
  svgSpriteLoaderDirs : svgSpriteDirs,
  publicPath : `/${version}/`,
  outputPath : `./dist/${version}`,
  theme : "./theme.config.js",
  proxy : {
    "/api/sspai": {
      "target": "https://sspai.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api/sspai": "/api/v1"
      }
    }
  },

  env : {
    development: {
      extraBabelPlugins: [
        'dva-hmr', 'transform-runtime'
      ],
      extraPostCSSPlugins: [pxtorem({rootValue: 75, propWhiteList: []})]
    },
    production: {
      extraBabelPlugins: ['transform-runtime'],
      extraPostCSSPlugins: [pxtorem({rootValue: 75, propWhiteList: []})]
    }
  },
  dllPlugin : {
    exclude: ["babel-runtime"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
  }
}
