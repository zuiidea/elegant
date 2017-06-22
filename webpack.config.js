module.exports = (webpackConfig) => {
  // FilenameHash
  webpackConfig.output.chunkFilename = '[name].[hash].js' // http://webpack.github.io/docs/configuration.html#output-chunkfilename

  // ClassnameHash
  const cssLoaderOption = {
    importLoaders: 1,
    modules: true,
    localIdentName: '[hash:base64:5]',
  }
  const cssLoaders = webpackConfig.module.loaders[3].loader.split('!')
  webpackConfig.module.loaders[3].loader = cssLoaders.map((item) => {
    if (item.startsWith('css')) {
      return `css?${JSON.stringify(cssLoaderOption)}`
    }
    return item
  }).join('!')

  // webpackConfig.module.rules[3].use[1].options.localIdentName = '[hash:base64:5]'

  webpackConfig.resolve.alias = {
    components: `${__dirname}/src/components`,
    utils: `${__dirname}/src/utils`,
    services: `${__dirname}/src/services`,
    models: `${__dirname}/src/models`,
  }

  return webpackConfig
}
