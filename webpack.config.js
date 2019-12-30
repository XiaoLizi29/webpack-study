const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',    // 模式,分为development和production模式
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')  //必须为绝对路径
    },
    // 优化项,webpack4新增
    optimization: {
        // 自己理解:minimizer覆盖默认的优化
        minimizer: [
            new TerserJSPlugin({
                // 是否缓存
                cache: true,
                // 是否并发打包
                parallel: true,
                // 是否源码映射,方便调试
                sourceMap: true
            }),
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                // 去掉多余空格,变成一行
                collapseWhitespace: true,
                // 去掉双引号
                removeAttributeQuotes: true
            },
            // 给引用的index.js加上hash戳,防止缓存
            hash: true
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            // loader的顺序：先下后上，先右后左
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            enforce: 'pre'
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                                ["@babel/plugin-transform-runtime"]
                            ]
                        }
                    }
                ],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
            }
        ]
    }
}