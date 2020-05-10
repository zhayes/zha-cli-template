const config = require('./webpack.test.config.js');
const webpack = require('webpack');

config.plugins[1] = new webpack.DefinePlugin({
    BASE_URL: JSON.stringify('http://prod-xxx')
});

module.exports = config;