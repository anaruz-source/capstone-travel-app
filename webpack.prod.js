const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    module: {
        rules: [{
            test: /\.(scss)$/,
            use: [{
              
                loader: MiniCssExtractPlugin.loader
            }, {
                // translates CSS into CommonJS modules
                loader: 'css-loader'
            },
             {
                // compiles Sass to CSS
                loader: 'sass-loader'
            }]
        }]
      
    }
,

plugins: [
    new MiniCssExtractPlugin({ filename: "[name].bundle.css" })
],

    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    }
    
});

