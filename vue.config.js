const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'

  ]
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    // if prod, add externals
    externals: {

    }
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    // if (isProd) {
    //   config.plugin('html').tap(args => {
    //     args[0].cdn = assetsCDN
    //     return args
    //   })
    // }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  // '/api/fileApi': {
  //   target: 'http://192.168.1.122:8071',
  //   logLevel: 'debug',
  //   ws: false,
  //   changeOrigin: true,
  //   pathRewrite: {
  //     '^/api/fileApi': '' // 需要rewrite的,
  //   }
  // },

  devServer: {
    port: 8089,
    proxy: {
      '/api/health-api': {
        target: 'http://192.168.1.121/health-api',
        logLevel: 'debug',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/health-api': '' // 需要rewrite的,
        }
      },

      '/api/uam-api': {
        target: 'http://192.168.1.121/uam-api',
        ws: false,
        logLevel: 'debug',
        changeOrigin: true,
        pathRewrite: {
          '^/api/uam-api': ''   //需要rewrite的,
        }
      },

      '/api/account-api': {
        target: 'http://192.168.1.121/account-api',
        ws: false,
        logLevel: 'debug',
        changeOrigin: true,
        pathRewrite: {
          '^/api/account-api': ''   //需要rewrite的,
        }
      },

      '/api/content-api': {
        target: 'http://192.168.1.121/content-api',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/content-api': ''   //需要rewrite的,
        }
      },

      '/api/push-api': {
        target: 'http://192.168.1.121/push-api',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/push-api': ''   //需要rewrite的,
        }
      },

      '/api/order-api': {
        target: 'http://192.168.1.121/order-api',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/order-api': ''   //需要rewrite的,
        }
      },

      //info-api的ip不一样  新增的服务
      '/api/info-api': {
        target: 'http://192.168.1.121/info-api',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/info-api': ''   //需要rewrite的,
        }
      },
      '/api/wx-api': {
        target: 'http://192.168.1.121/wx-api',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/wx-api': ''   //需要rewrite的,
        }
      },
      '/api/questionnaire-api': {
        target: 'http://192.168.1.121/questionnaire-api',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/questionnaire-api': '' 
        }
      },
      '/api/im-api': {
        target: 'http://192.168.1.121/im-api',
        ws: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api/im-api': ''   
        }
      },
      '/api/uam-api': {
        target: 'http://192.168.1.121/uam-api',
        ws: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api/uam-api': ''   
        }
      },
      '/api/follow-api': {
        target: 'http://192.168.1.121/follow-api',
        ws: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api/follow-api': ''   
        }
      },
      '/api/ehr-api': {
        target: 'http://192.168.1.121/ehr-api',
        ws: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api/ehr-api': ''   
        }
      },
      '/api/medical-api': {
        target: 'http://192.168.1.121/medical-api',
        ws: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api/medical-api': ''   
        }
      },

      '/api/manager-api': { 
        target: 'http://192.168.1.121/manager-api',
        ws: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api/manager-api': ''   
        }
      },

      '/api/medical-api': { 
        target: 'http://192.168.1.121/medical-api',
        ws: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api/medical-api': ''   
        }
      },
   
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  runtimeCompiler: true,
    // add `ThemeColorReplacer` plugin to webpack plugins
    vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
