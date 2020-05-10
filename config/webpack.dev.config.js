const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    entry: ['react-hot-loader/patch', './src/main'],
    module: {
        rules: [
            {
                test: /\.tsx|ts$/,
                use: 'ts-loader',
                exclude: '/node_modules/',
                include: path.resolve(__dirname, '../src'),
            },
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
                include: path.resolve(__dirname, '../src')
            },
            {
                test: /\.(eot|ttf|svg|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'font/'
                    }
                }
            },
            {
                test: /\.(css|less)$/,
                exclude: path.resolve(__dirname, '../src'),
                use: [
                    {
                        loader:'style-loader',
                        options: { 
                            esModule: true 
                        }
                    },
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.(less|css)$/,
                include: path.resolve(__dirname, '../src'),
                use: [
                    {
                        loader:'style-loader',
                        options: { 
                            esModule: true 
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: { 
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]'
                            },
                        }
                    },
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                      name: '[name].[contentHash].[ext]'
                    },
                  },
                ],
              },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify('http://dev-xxx')
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/temp.html',
            inject: 'body',
            minify: {
                removeComments: false,
                collapseWhitespace: false,
            }
        })
    ],
    devtool: "source-map"
});