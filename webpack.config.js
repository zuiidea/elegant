const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTemplate = require('html-webpack-template')

module.exports = (webpackConfig, env) => {
  // FilenameHash
  webpackConfig.output.chunkFilename = '[name].[hash].js'

  if (env === 'production' && webpackConfig.module) {
    // ClassnameHash
    webpackConfig.module.rules.map((item) => {
      if (item.use && item.use[0] === 'style') {
        return item.use.map((iitem) => {
          if (iitem && iitem.loader === 'css') {
            iitem.options.localIdentName = '[hash:base64:5]'
          }
          return iitem
        })
      }
      return item
    })
  }

  webpackConfig.resolve.alias = {
    components: `${__dirname}/src/components`,
    utils: `${__dirname}/src/utils`,
    services: `${__dirname}/src/services`,
    models: `${__dirname}/src/models`,
    enums: `${__dirname}/src/utils/enums`,
  }

  webpackConfig.plugins = webpackConfig.plugins.concat([
    new HtmlWebpackPlugin({
      hash: true,
      mobile: true,
      title: 'sube',
      inject: false,
      appMountId: 'root',
      template: `!!ejs!${HtmlWebpackTemplate}`,
      filename: env === 'production' ? '../index.html' : 'index.html',
      minify: {
        collapseWhitespace: true,
      },
      links: [
        'https://cdn.bootcss.com/Swiper/3.4.2/css/swiper.min.css',
      ],
      meta: [
        {
          name: 'description',
          content: 'An article List.',
        },
      ],
    }),
  ])

  return webpackConfig
}
