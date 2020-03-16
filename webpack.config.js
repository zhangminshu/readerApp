
const path = require('path');            //引入node的path模块
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: ["babel-polyfill",'./src/main.jsx'],//配置入口文件的地址
    output: {//配置出口文件的地址
        path: path.resolve(__dirname, './dist'),
        filename: 'main.[hash:7].js'//打包后输出的文件名，后面跟7位随机hash值
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
//                         presets: ['es2017', 'react'],// env --> es6, stage-0 --> es7, react --> react
//                          plugins: [//修改这里的

//                                      ["import", {libraryName: "antd","libraryDirectory": "es", style: "css"}]//修改这里的

//                            ] //修改这里的
                    }
                },
                include: [
                    path.resolve(__dirname, './src'),
                    path.resolve('node_modules/browser-md5-file/dist')
                ],
                // exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            modifyVars: {
                                'font-size-base': '12px',
                                'primary-color': '#0EA679'
                            },
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },//配置模块,主要用来配置不同文件的加载器
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',   // 指定产出的模板
            filename: 'index.html',          // 产出的文件名
            // chunks: ['common', 'base'],     // 在产出的HTML文件里引入哪些代码块
            hash: true,                     // 名称是否哈希值
            // title: 'base',                  // 可以给模板设置变量名，在html模板中调用 htmlWebpackPlugin.options.title 可以使用
            favicon: path.resolve('./src/img/favicon.ico'), 
            minify: {                       // 对html文件进行压缩
                removeAttributeQuotes: true // 移除双引号
            }
        }),
        new CleanWebpackPlugin([path.join(__dirname, 'dist')]),//打包前先清空输出目录
        //new UglifyjsWebpackPlugin(),//压缩js
    ],//配置插件
    devServer: {//配置开发服务器
        contentBase: path.resolve(__dirname, 'dist'),// 配置开发服务运行时的文件根目录
        host: 'localhost',// 开发服务器监听的主机地址
        compress: true,   // 开发服务器是否启动gzip等压缩
        port: 8080,        // 开发服务器监听的端口
        proxy: {
            '/user': {
              target: 'https://api.yuedu.pro',
              changeOrigin: true,
              secure: false
            },
            '/book': {
                target: 'https://api.yuedu.pro',
                changeOrigin: true,
                secure: false
            },
            '/file': {
                target: 'https://api.yuedu.pro',
                changeOrigin: true,
                secure: false
            },
            '/category': {
                target: 'https://api.yuedu.pro',
                changeOrigin: true,
                secure: false
            },
            '/bookmark': {
                target: 'https://api.yuedu.pro',
                changeOrigin: true,
                secure: false
            },
            '/file': {
                target: 'https://api.yuedu.pro',
                changeOrigin: true,
                secure: false
            }
            
        }
    },
    // devtool:'source-map',
}