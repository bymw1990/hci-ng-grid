"use strict";

var webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const {BaseHrefWebpackPlugin} = require("base-href-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

module.exports = function(env) {
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
      publicPath: "/hci-ng-grid-demo/",
      filename: "[name].bundle.js",
      chunkFilename: "[id].chunk.js",
      sourceMapFilename: "[file].map"
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ["awesome-typescript-loader", "angular2-template-loader"]
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
        baseUrl: "/hci-ng-grid-demo/"
      }),

      new BaseHrefWebpackPlugin({ baseHref: "/hci-ng-grid-demo/" }),

      new CopyWebpackPlugin([
        {
          from: "favicon.ico",
          to: "favicon.ico"
        }
      ]),

      new webpack.DefinePlugin({
        "ENV": "'production'",
        "process.env": {
          "ENV": "'production'",
          "NODE_ENV": "'production'"
        },
        "CONTENT_PATH": "'/hci-ng-grid-demo/'"
      }),

      new ExtractTextPlugin("[name].css"),

      new webpack.ProvidePlugin({
        d3: "d3"
      })
    ]
  };
}
