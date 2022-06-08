const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
        app: './src/index.js',
    },
    devServer: {
      compress: true,
      port: 3000
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: [/node_modules/, path.resolve(__dirname, 'src/lib/psychrolib.js')],
            use: {
              loader: 'babel-loader'
            },
          },
          {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader'],
          },
          { 
            test: /\.(woff|woff2|eot|ttf|jpe?g|png|gif|svg)$/,
            loader: 'url-loader?limit=100000'
          }
        ],
    },
    plugins: [
        // The plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using script tags
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ],
    externals: {
      // only define the dependencies you are NOT using as externals!
      canvg: "canvg",
      html2canvas: "html2canvas",
      dompurify: "dompurify"
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    }
};