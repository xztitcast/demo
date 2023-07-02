const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
  },
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave:false, //  关闭语法检查 
  devServer: {
    open: true,
    port: 23456,
    proxy: {
      '/sys': {
         target: 'http://localhost:8080'
         //target: 'http://localhost:8080/v1' 开发环境不走网关
      }
    },
  }
})
