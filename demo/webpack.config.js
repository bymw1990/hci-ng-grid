/*
 *  Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
var webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ProvidePlugin = require("webpack/lib/ProvidePlugin");

/**
 * The webpack bundle configuration for the user demo.
 *
 * @author byoukstetter
 * @author mbyrne
 * @since 8/11/16
 */
module.exports = function (options) {
    return {
        devtool: "#inline-source-map",

        entry: {
            polyfills: "./src/polyfills.ts",
            twbs: "bootstrap-loader",
            vendor: "./src/vendor.ts",
            app: "./src/main.ts"
        },

        resolve: {
            extensions: [".js", ".ts"],
            modules: ["src", "node_modules"]
        },

        output: {
            path: __dirname + "/dist",
            publicPath: "/",
            filename: "[name].js",
            chunkFilename: "[id].chunk.js"
        },

        module: {
            rules: [
                /**
                 * A loader to transpile our Typescript code to ES5, guided by the tsconfig.json file. Excludes transpiling unit
                 * and integration test files.
                 */
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: "@angularclass/hmr-loader"
                        },
                        {
                            loader: "awesome-typescript-loader",
                            options: {
                                configFileName: "tsconfig.json"
                            }
                        },
                        {
                            loader: "angular2-template-loader"
                        }
                    ],
                    exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
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
                    test: /bootstrap\/dist\/js\/umd\//,
                    use: "imports-loader?jQuery=jquery"
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({ fallbackLoader: "style-loader", loader: "css-loader?sourceMap" }),
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

        devServer: {
            historyApiFallback: true,
            stats: "minimal"
        },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: ["app", "vendor", "twbs", "polyfills"]
            }),
            // generating html
            new HtmlWebpackPlugin({
                template: "src/index.html"
            }),
            // static assets
            new CopyWebpackPlugin([
                {
                    from: "src/favicon.ico",
                    to: "favicon.ico"
                }
            ]),
            new ExtractTextPlugin("[name].css"),

            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                Tether: "tether",
                "window.Tether": "tether",
                Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
                Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
                Button: "exports-loader?Button!bootstrap/js/dist/button",
                Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
                Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
                Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
                Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
                Util: "exports-loader?Util!bootstrap/js/dist/util"
            })
        ]
    };
}
