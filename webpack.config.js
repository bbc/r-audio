const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const Config = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'r-audio.min.js',
  },
  entry: './examples/index.js',
  mode: process.env['NODE_ENV'] || 'production',
  devtool: process.env['NODE_ENV'] === 'development' ? 'source-map' : false,
  resolve: {
    modules: [
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        use: ['babel-loader?presets[]=react,env', 'eslint-loader?fix=true&emitWarning=true']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'examples'),
    compress: true,
    port: 8080
  }
};

if (!(process.env['NODE_ENV'] === 'development')) {
  Config.output.library = 'r-audio';
  Config.output.libraryTarget = 'umd';
  Config.entry = './index.js';
  Config.optimization = { minimizer: [ new UglifyJsPlugin() ] };
  Config.externals = ['react', 'react-dom', 'prop-types'];
}

module.exports = Config;
