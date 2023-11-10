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
    js: ['https://fastly.jsdelivr.net/npm/vue@3.3.4', 'https://unpkg.com/vue-router@4.0.15/dist/vue-router.global.js', 'https://cdn.bootcss.com/axios/0.18.0/axios.min.js', 'https://unpkg.com/vuex@4.0.0/dist/vuex.global.js', 'https://cdn.bootcss.com/echarts/4.2.1/echarts.simple.min.js', 'https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js', 'https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.3/index.full.js', 'https://cdn.bootcss.com/qs/6.5.2/qs.min.js'],
    css: ['https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.3/index.css',]
}

const WebpackObfuscator = require('webpack-obfuscator')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')

module.exports = {
    publicPath: './', lintOnSave: false, // 将vue文件的css代码提取出来放到static下的css文件目录中
    css: {
        extract: true
    }, productionSourceMap: false,  //若代码运行出错，不输出具体的错误信息行数列数等，同时减小打包体积
    assetsDir: 'static',   //静态文件保存位置，如js和css文件等
    outputDir: process.env.outputDir,
    configureWebpack: (config) => {
        config.name = '货代'
        config.externals = assetsCDN.externals
        config.resolve.alias = {
            '@': path.resolve(__dirname, './src'),
            'assets': path.resolve(__dirname, './src/assets'),
            'common': path.resolve(__dirname, './src/common'),
            'components': path.resolve(__dirname, './src/components'),
            'network': path.resolve(__dirname, './src/network'),
            'configs': path.resolve(__dirname, './src/configs'),
            'views': path.resolve(__dirname, './src/views'),
            'plugins': path.resolve(__dirname, './src/plugins'),
            'store/': path.resolve(__dirname, './src/store')
        }
        /*Object.assign(config.resolve, {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    'assets': path.resolve(__dirname, './src/assets'),
                    'common': path.resolve(__dirname, './src/common'),
                    'components': path.resolve(__dirname, './src/components'),
                    'network': path.resolve(__dirname, './src/network'),
                    'configs': path.resolve(__dirname, './src/configs'),
                    'views': path.resolve(__dirname, './src/views'),
                    'plugins': path.resolve(__dirname, './src/plugins'),
                    'store/': path.resolve(__dirname, './src/store')
                }
            })*/
        if (process.env.NODE_ENV === 'production') {
            config.devtool = false
            config.mode = 'production'
            config.optimization.minimizer[0].options.terserOptions.compress = {
                drop_console: true, // 移除所有的console.log语句
                drop_debugger: true,  //移除所有的debugger语句
            }
            config.plugins.push(new WebpackObfuscator({
                // 解决网页出现的/x20
                reservedStrings: ['\s*'],
                // 压缩代码
                compact: true,
                // 是否启用控制流扁平化(降低1.5倍的运行速度)
                controlFlowFlattening: false,
                // 随机的死代码块(增加了混淆代码的大小)
                deadCodeInjection: false,
                // 此选项几乎不可能使用开发者工具的控制台选项卡
                debugProtection: false,
                // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
                debugProtectionInterval: false,
                // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
                disableConsoleOutput: true,
                // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                // 是否启用全局变量和函数名称的混淆
                renameGlobals: false,
                // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
                rotateStringArray: true,
                // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
                selfDefending: true,
                // 删除字符串文字并将它们放在一个特殊的数组中
                stringArray: true,
                // stringArrayEncoding: false,
                stringArrayThreshold: 0.75,
                // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
                unicodeEscapeSequence: false
            }, []),)

            config.optimization.minimizer.push(new TerserPlugin({
                terserOptions: {
                    mangle: true, // 开启变量名混淆
                    compress: true
                }
            }))
        } else {
            config.devtool = '#eval-source-map'
            config.mode = 'development'
            /*config.optimization.minimizer[0].options.terserOptions.compress = {
                drop_console: false, // 移除所有的console.log语句
                drop_debugger: true,
            }
            config.plugins.push(
                new WebpackObfuscator({
                    // 解决网页出现的/x20
                    reservedStrings: ['\s*'],
                    // 压缩代码
                    compact: true,
                    // 是否启用控制流扁平化(降低1.5倍的运行速度)
                    controlFlowFlattening: false,
                    // 随机的死代码块(增加了混淆代码的大小)
                    deadCodeInjection: false,
                    // 此选项几乎不可能使用开发者工具的控制台选项卡
                    debugProtection: false,
                    // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
                    debugProtectionInterval: false,
                    // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
                    disableConsoleOutput: true,
                    // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
                    identifierNamesGenerator: 'hexadecimal',
                    log: false,
                    // 是否启用全局变量和函数名称的混淆
                    renameGlobals: false,
                    // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
                    rotateStringArray: true,
                    // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
                    selfDefending: true,
                    // 删除字符串文字并将它们放在一个特殊的数组中
                    stringArray: true,
                    // stringArrayEncoding: false,
                    stringArrayThreshold: 0.75,
                    // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
                    unicodeEscapeSequence: false,
                }, []),
            )
            config.optimization.minimizer.push(
                new TerserPlugin({
                    terserOptions: {
                        mangle: true, // 开启变量名混淆
                        compress: true,
                    }
                })
            )
            const productionGZipExtensions = ['js', 'css']
            // 将代码进行gzip压缩
            config.plugins.push(new CompressionPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGZipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8,
                    deleteOriginalAssets: true
             })
            )*/

            /*resolve: {
                alias: {
                    'assets': '@/assets',
                    'components': '@/components',
                    'network': '@/network',
                    'utils': '@/utils',
                    'views': '@/views',
                    'store': '@/store',
                    'config': '@/config',
                }
            externals: assetsCDN.externals,*/
        }

    }, chainWebpack: (config) => {
        config.plugin('html').tap(args => {
            args[0].cdn = assetsCDN
            args[0].title = '货代报价'
            return args
        })
        if (process.env.NODE_ENV === 'production') {
            const productionGZipExtensions = ['js', 'css']
            // 将代码进行gzip压缩
            config.plugin('CompressionPlugin').use(
                new CompressionPlugin({
                    // filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGZipExtensions.join('|') + ')$'),
                    threshold: 1024,
                    minRatio: 0.8,
                    deleteOriginalAssets: false
                })
            )
        }
    },
}