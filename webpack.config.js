const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
        app: './src/index.js',
        data: './src/data.json',
        //designPsychrometricsPDF: './src/PdfReports/DesignPsychrometricsPDF2.js',
        //loadSummaryPDF: './src/PdfReports/LoadSummaryPDF.js',
    },
    devServer: {
      compress: true,
      port: 3000
    },
    optimization: {
      minimize: true,
      splitChunks: {
       chunks: 'all',
      }
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
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    //optimization: {
    //  splitChunks: {
    //    chunks: 'all',
    //  },
    //},
};