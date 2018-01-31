const pxtorem = require('postcss-pxtorem')

export default {
  publicPath: '/',
  hash: true,
  theme: './theme.config.js',
  html: {
    template: './src/index.ejs'
  },
  proxy: {
    '/api': {
      target: 'http://journal.zuiidea.com/api/v1',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      }
    }
  },
  extraPostCSSPlugins: [pxtorem({rootValue: 75, propWhiteList: []})],
  alias: {
    components: `${__dirname}/src/components`,
    utils: `${__dirname}/src/utils`,
    services: `${__dirname}/src/services`,
    models: `${__dirname}/src/models`,
    enums: `${__dirname}/src/utils/enums`,
    routes: `${__dirname}/src/routes`,
    assets: `${__dirname}/src/assets`
  }
}
