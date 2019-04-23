var webpack = require('webpack')
var exec = require('child_process').execSync

const publicPath = '/'

let optimization
if (process.env.NODE_ENV !== 'production') {
  // Enabling optimization when running unit testing confuses
  // mocha (it does not find any tests)
  optimization = {
    usedExports: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  }
}

module.exports = {
  publicPath,
  lintOnSave: true,
  configureWebpack: {
    // other webpack options to merge in ...
    plugins: [
      new webpack.DefinePlugin({
        CRUST_VERSION: JSON.stringify(('' + exec('git describe --always --tags')).trim()),
        CRUST_BUILD_TIME: JSON.stringify((new Date()).toISOString()),
      }),
    ],

    optimization,
  },

  // Do not copy config files (deployment procedure will do that)
  chainWebpack: config => {
    config.plugin('copy').tap(([cfg]) => {
      const { to, from } = cfg[0]

      cfg[0].force = true // so the original `/public` folder keeps priority
      cfg[0].ignore.push('config*js')

      cfg.unshift({ from: from + '/applications', to })

      return [cfg]
    })
  },

  // devServer Options don't belong into `configureWebpack`
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
  },
  runtimeCompiler: true,
  css: {
    sourceMap: process.env['NODE_ENV'] === 'development',
  },
}
