const path = require('path');
const pxtorem = require('postcss-pxtorem');
const { version } = require('./package.json')

const svgSpriteDirs = [path.resolve(__dirname, 'src/svg/')];

export default {
  entry : 'src/index.js',
  svgSpriteLoaderDirs : svgSpriteDirs,
  publicPath : `/${version}/`,
  outputPath : `./dist/${version}`,
  theme : './theme.config.js',
  extraBabelPlugins:['add-module-exports'],
  externals: {
    "react": "window.React",
    "react-dom": "window.ReactDOM"
  },
  proxy : {
    "/api": {
      "target": "http://journal.zuiidea.com/api/v1",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/"
      }
    }
  },

  env : {
    development: {
      extraBabelPlugins: [
        'dva-hmr',
        'transform-runtime',
        'add-module-exports'
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
