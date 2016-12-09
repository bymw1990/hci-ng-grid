/*
 *  Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
/**
 * The webpack bundle configuration for the hci-ng2-input demo.
 *
 * @author brandony <brandon.youkstetter@hci.utah.edu>
 * @since 7/26/16
 */
(function () {
    "use strict";

    const webpack = require("webpack");
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const CopyWebpackPlugin = require("copy-webpack-plugin");
    const ExtractTextPlugin = require("extract-text-webpack-plugin");

    module.exports = {
        devtool: "cheap-module-eval-source-map",

        resolve: {
            extensions: ["", ".js", ".ts"]
        },

        entry: {
            "app": "./src/index.ts",
            "polyfills": "./src/polyfills.ts",
            "vendor": "./src/vendor.ts"
        },

        output: {
            path: __dirname + "/dist",
            publicPath: "/",
            filename: "[name].js",
            chunkFilename: "[id].chunk.js"
        },

        module: {
            preLoaders: [
                {
                    test: /\.ts$/,
                    loader: "tslint"
                }
            ],
            loaders: [
            /**
             * A loader to transpile our Typescript code to ES5, guided by the tsconfig.json file. Excludes transpiling unit
             * and integration test files.
             */
                {
                    test: /\.ts$/,
                    loader: "ts",
                    exclude: [/\.(spec|e2e)\.ts$/]
                },
                {
                    test: /\.html$/,
                    loader: "html"
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract("style", "css?sourceMap")
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=application/font-woff"
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=application/font-woff"
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=application/octet-stream"
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file"
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=image/svg+xml"
                }
            ]
        },
        bail:true,
        progress:true,
        profile:true,

        devServer: {
            historyApiFallback: true,
            stats: "minimal"
        },

        tslint: {
            emitErrors: true,
            failOnHint: false
        },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: ["app", "vendor", "polyfills"]
            }),
            // generating html
            new HtmlWebpackPlugin({
                template: "src/index.html"
            }),
            new ExtractTextPlugin('[name].css')
        ]
    };
}());