module.exports = {
    publicPath: '/',
    lintOnSave: false,   //禁用eslint
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
                'store': '@/store'
            }
        }
    }
}