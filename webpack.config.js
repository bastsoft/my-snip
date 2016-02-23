const NODE_ENV = process.env.NODE_ENV || 'development';
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BowerWebpackPlugin = require("bower-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    entry: {
        './btr': './src/app.js'
    },

    output: {
        path: __dirname,
        filename: '[name].js',
        library: 'btr'
    },

    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx']
    },

    resolveLoader: {root: path.join(__dirname, "node_modules")},

    watch: NODE_ENV == 'development',

    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: NODE_ENV == 'development' ? 'cheap-inline-source-map' : null,

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel']
            },
            {
                test: /jquery\.js$/,
                loader: 'expose?jQuery'
            },
            {
                test: /jquery\.js$/,
                loader: 'expose?$'
            },
            {
                test: /jquery\..*\.js/,
                loader: "imports?$=jquery,jQuery=jquery,this=>window"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader?browsers=last 2 version')
            },
            {test: /\.(ttf|eot|svg|woff|png|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=500000'}
        ]
    },
    plugins: [
        new BowerWebpackPlugin({
            modulesDirectories: ['bower_components'],
            manifestFiles: ['bower.json', '.bower.json'],
            includes: /.*/,
            excludes: /.*\.less$/
        }),
        new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /ru|en-gb/),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new webpack.ProvidePlugin({
            'Promise': 'bluebird'
        })
    ]
};

if (NODE_ENV == 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    )
}