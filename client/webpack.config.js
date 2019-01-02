const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const viewsDir = path.resolve(process.cwd(), 'views');
const views = fs.readdirSync(viewsDir);

module.exports = {
  entry: function() {
    const entries = {};

    for (const view of views) {
      entries[view] = path.resolve(viewsDir, view, 'app.js');
    }

    return entries;
  }(),

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['@babel/plugin-transform-react-jsx', { pragma: 'm' }]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test:  /\.(png|jpg|gif|svg|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]'
          }
        }
      }
    ]
  },

  output: {
    filename: '[name].js',
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '',
    libraryTarget: 'window'
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    ...views.map(view => {
      let templatePath = path.resolve(viewsDir, view, 'app.html');
      if (!fs.existsSync(templatePath))
        templatePath = path.resolve(__dirname, 'common', 'App.html');

      return new HtmlWebpackPlugin({
        filename: view + '.html',
        template: templatePath,
        excludeChunks: views.filter(excludedView => excludedView !== view),
        inject: false
      })
    })
  ]
};
