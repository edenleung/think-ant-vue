const path = require('path')
const webpack = require('webpack')
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const zopfli = require("@gfx/zopfli")
const BrotliPlugin = require("brotli-webpack-plugin")
const createThemeColorReplacerPlugin = require('./config/plugin.config')
function resolve (dir) {
  return path.join(__dirname, dir)
}

const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    'ant-design-vue': 'Antd',
    'wangeditor': 'wangEditor',
    'viser-vue': 'ViserVue',
    '@antv/data-set': 'DataSet'
  },
  css: [
    '//cdn.jsdelivr.net/npm/ant-design-vue@1.6.4/dist/antd.min.css'
  ],
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js',
    '//cdn.jsdelivr.net/npm/ant-design-vue@1.6.4/dist/antd.min.js',
    '//cdn.jsdelivr.net/npm/wangeditor@3.1.1/release/wangEditor.min.js',
    '//cdn.jsdelivr.net/npm/viser-vue/umd/viser-vue.min.js',
    '//gw.alipayobjects.com/os/antv/pkg/_antv.g2-3.3.2/dist/g2.min.js',
    '//gw.alipayobjects.com/os/antv/pkg/_antv.data-set-0.9.6/dist/data-set.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // Gzip
      new CompressionWebpackPlugin({
        algorithm(input, compressionOptions, callback) {
          return zopfli.gzip(input, compressionOptions, callback);
        },
        compressionOptions: {
          numiterations: 15
        },
        minRatio: 0.99,
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
      }),
      new BrotliPlugin({
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        minRatio: 0.99
      })
    ],
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': resolve('./src/core/antd/icons.js')
      }
    },
    // if prod, add externals
    externals: IS_PROD ? assetsCDN.externals : {}
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
    if (IS_PROD) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })

      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end()
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          // 'border-radius-base': '4px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    // proxy: {
    //   '/api': {
    //     target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
    //     ws: false,
    //     changeOrigin: true
    //   }
    // }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
