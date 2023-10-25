const assetsCDN = {
    // 忽略打包的第三方库
    externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        vuex: 'Vuex',
        'echarts': 'echarts',
        'moment': 'moment',
        'element-plus': 'ElementPlus',
        'qs': 'Qs'
    },
    js: [
        // 'https://cdn.jsdelivr.net/npm/vue@3.3.4',
        'https://fastly.jsdelivr.net/npm/vue@3.3.4',
        'https://unpkg.com/vue-router@4.0.15/dist/vue-router.global.js',
        'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
        'https://unpkg.com/vuex@4.0.0/dist/vuex.global.js',
        'https://cdn.bootcss.com/echarts/4.2.1/echarts.simple.min.js',
        'https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js',
        'https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.3/index.full.js',
        'https://cdn.bootcss.com/qs/6.5.2/qs.min.js'
    ],
    css: [
        'https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.3/index.css',
    ]
}

module.exports = {
    publicPath: './',
    lintOnSave: false,
    productionSourceMap: false,  //若代码运行出错，不输出具体的错误信息行数列数等，同时减小打包体积
    assetsDir: 'static',   //静态文件保存位置，如js和css文件等
    configureWebpack: {
        name: '货代',
        devtool: '#eval-source-map',
        resolve: {
            alias: {
                'assets': '@/assets',
                'components': '@/components',
                'network': '@/network',
                'utils': '@/utils',
                'views': '@/views',
                'store': '@/store',
                'config': '@/config',
            }
        },
        externals: assetsCDN.externals,
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].cdn = assetsCDN
            args[0].title = '货代报价'
            return args
        })
    },
}