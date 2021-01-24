const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: {
        app: './src/client/index.js',
    },
    output: {
        libraryTarget: 'var',
        library: 'Client',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    module: {
        rules: [
            {
                test: /\.twig$/,
                use: [
                    {
                        loader: 'twig-loader',
                        options: {
                            // See options section below
                        },
                    }]
            },
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(png|jp(e*)g|svg|gif|ico)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'media/[name].[ext]'
                    }
                }]
            }
        ]
    },

    plugins: [
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin({
            title: 'development',
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
        new HtmlWebpackPlugin({
            title: 'development',
            template: './src/client/html/views/index.html.twig',
            filename: './index.html'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/client/html/views'),
                    to: path.resolve(__dirname, 'dist/templates'),


                    globOptions: {
                        dot: true,
                        ignore: ['**/index.*']
                    },

                }
            ]
        }),
        new WorkboxPlugin.GenerateSW()
    ],
    node: {
        fs: "empty" // avoids error messages
    }

};