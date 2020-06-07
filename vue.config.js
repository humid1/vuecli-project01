
module.exports = {
  devServer: {
    port: 8888,
    open: true
  },
  chainWebpack: config => {
    // 打包为线上触发将资源引入为外部 CDN
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      // 通过external加载外部 CDN 资源，由于cdn无最新版的 vue-router 3.1.6 暂时注释
      config.set('externals', {
        vue: 'Vue',
        // 'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
