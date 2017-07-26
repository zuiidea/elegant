const path = require('path');
const pxtorem = require('postcss-pxtorem');

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
];

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  "theme": "./theme.config.js",
  "proxy": {
    "/api": {
      "target": "https://sspai.com",
      "changeOrigin": true,
      "pathRewrite": { "^/api/v1" : "/api/v1" }
    },
  },
  env: {
    development: {
      extraBabelPlugins: [
        'dva-hmr',
        'transform-runtime',
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
