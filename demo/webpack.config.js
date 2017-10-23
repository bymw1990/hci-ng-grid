"use strict";

var webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

module.exports = function (options) {
    return {
        stats: "errors-only",

        devtool: "source-map",

        entry: {
            "main": "./main.ts",
            "polyfills": "./polyfills.ts",
            "vendor": "./vendor.ts"
        },

        resolve: {
            modules: [
                "node_modules",
                path.resolve(process.cwd(), "src")
            ],
            extensions: [".ts", ".js"]
        },

        context: path.join(process.cwd(), "./src"),

        output: {
            path: path.join(process.cwd(), "dist"),
            filename: "[name].bundle.js"
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ["awesome-typescript-loader", "angular2-template-loader", "angular-router-loader?aot=true&genDir=."]
                },
                {
                    test: /\.html$/,
                    loader: "html-loader"
                },
                {
                    test: /\.less$/,
                    loader: "raw-loader!less-loader"
                },
                {
                    test: /\.scss$/,
                    use: ["raw-loader", "sass-loader"]
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: "css-loader?sourceMap"
                            }
                        ]
                    })
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=application/font-woff"
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=application/font-woff"
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=application/octet-stream"
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader"
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=image/svg+xml"
                }
            ]
        },

        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": "'production'"
            }),

            new webpack.optimize.CommonsChunkPlugin({
                name: ["app", "vendor", "polyfills"]
            }),

            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    mangle: false
                }
            }),

            new webpack.ProgressPlugin(),

            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)@angular/,
                path.join(process.cwd(), "src")
            ),

            new HtmlWebpackPlugin({
                template: "index.html",
            }),

            new CopyWebpackPlugin([
                {
                    from: "favicon.ico"
                }
            ]),

            new ExtractTextPlugin("[name].css")
        ],

        devServer: {
            contentBase: "./src",
            port: 3000,
            inline: true,
            historyApiFallback: true,
            stats: "errors-only",
            watchOptions: {
                aggregateTimeout: 300,
                poll: 500
            }
        }
    };
}
