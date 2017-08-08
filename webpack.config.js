const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTemplate = require('html-webpack-template')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
    routes: `${__dirname}/src/routes`,
    assets: `${__dirname}/src/assets`,
  }

  const htmlProps = {
    hash: true,
    mobile: true,
    title: 'sube',
    inject: false,
    appMountId: 'root',
    template: `!!ejs-loader!${HtmlWebpackTemplate}`,
    minify: {
      collapseWhitespace: true,
    },
    scripts: env === 'production' ? null : [
      '/roadhog.dll.js',
    ],
    links: [
      'https://cdn.bootcss.com/Swiper/3.4.2/css/swiper.min.css',
    ],
    meta: [
      {
        name: 'description',
        content: 'An article List.',
      },
    ],
  }

  webpackConfig.plugins = webpackConfig.plugins.concat([
    new CopyWebpackPlugin([{
      from: 'src/public',
      to: env === 'production' ? '../' : webpackConfig.output.outputPath,
    }]),
    new HtmlWebpackPlugin({
      ...htmlProps,
      filename: env === 'production' ? '../index.html' : 'index.html',
    }),
  ])

  if (env === 'production') {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        ...htmlProps,
        filename: 'index.html',
      })
    )
  }

  return webpackConfig
}
