"use strict";

var webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const {BaseHrefWebpackPlugin} = require("base-href-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = function(env) {
  var environment = "'development'";
  if (env.production) {
      environment = "'production'";
  }

  return {
    stats: "errors-only",
    devtool: "source-map",
    mode: (environment == "'production'") ? "production" : "development",

    entry: {
      "polyfills": "./polyfills.ts",
      "vendor": "./vendor.ts",
      "main": "./main.ts",
      "styles": "./styles.ts"
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
      filename: "[name].[chunkhash].bundle.js",
      chunkFilename: "[id].[chunkhash].chunk.js"
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
          use: ["style-loader", "css-loader"]
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
        },
        {
            from: "assets",
            to: "assets"
        },
        {
          from: "../../docs",
          to: "compodoc"
        }
      ]),

      new webpack.DefinePlugin({
        "ENV": environment,
        "process.env": {
          "ENV": environment,
          "NODE_ENV": environment
        },
        "CONTENT_PATH": "'/hci-ng-grid-demo/'",
        "VERSION": JSON.stringify(require("../../package.json").version)
      })
    ]
  };
}
