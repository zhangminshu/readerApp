const webpack = require("webpack");
const srcDir = __dirname + "/src";
const distDir = __dirname + "/dist";
const HtmlWebpackPlugin = require("html-webpack-plugin");//生成新的html文件
// const HtmlWebpackPlugin = require("html-webpack-plugin");//生成新的html文件
module.exports = {
    entry: [
        srcDir + "/index.jsx" //入口
    ],
    output: {
        path: distDir,//打包后的文件存放地方，会自动新建
        filename: 'index.[hash:7].js'//打包后输出的文件名，后面跟7位随机hash值
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './public',//本地服务器所加载的页面的目录
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        port: 8090, //端口号
        hot: true
    },
    module:{
        rules:[
            {
                test:/(\.js|\.jsx)$/,
                use:{
                    loader:'babel-loader'
                },
                exclude:'/node_module/'
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({//根据模板引入css,js最终生成的html文件
            filename: 'index.html',//生成文件存放路径
            template: './public/index.html'//html模板路径
        }),
        new webpack.HotModuleReplacementPlugin(),//热加载插件
    ],
    mode: 'development'
};