const webpack = require('webpack');
const path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'r-audio.min.js',
    },
    entry: './examples/index.jsx',
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$|\.jsx$/,
                exclude: /node_modules/,
                loaders: ['babel-loader?presets[]=react,env']
            }
        ]
    },
    devServer: {
      contentBase: path.join(__dirname, 'examples'),
      compress: true,
      port: 8080
    }
};
