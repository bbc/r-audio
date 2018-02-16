const webpack = require('webpack');
const path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'reaudio.min.js',
    },
    entry: './index.jsx',
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$|.jsx$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['babel-loader?presets[]=react,env']
            }
        ]
    }
};
