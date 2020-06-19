const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
        app: './src/index.js',
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            },
          },
          {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader'],
          },
          {
            test: require.resolve('./lib/psychrolib.js'),
            loader: 'imports-loader',
            options: {
              imports: 'default psychrolib Psychrometrics',
            },
          },
        ],
    },
    plugins: [
        // The plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using script tags
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            //filename: "index.html",
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    }
};