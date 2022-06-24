const path = require('path');
const webpack = require('webpack');

const config = {
  mode: 'production',
  target: 'node',
  externals: [
    'long', // optional dependency fast-json-stringify
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /re2\.node$/i,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.node'],
    descriptionFiles: ['package.json'],
    modules: ['node_modules'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  output: {
    filename: '[name]/index.js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
  },
  performance: {
    hints: false,
  },
  optimization: {
    minimize: false,
  },
};

module.exports = config;
