/*
 *  Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */

/**
 * The karma test runner configuration for this component library.
 *
 * @since 2.0.0
 */

(function () {
  "use strict";

  module.exports = function (config) {
    config.set({
      basePath: ".",

      frameworks: ["jasmine"],
      browsers: ["Chrome"],
      reporters: ["mocha", "coverage", "progress"],

      // Source files that you wanna generate coverage for.
      preprocessors: {
        "src/**/!(*spec).js": ["coverage", "sourcemap"],
        "tests.bundle.js": ["webpack"]
      },
      webpack: {
        module: {
          rules: [{
            test: /\.js$/,
            exclude: "/node_modules/",
            loader: "babel-loader"
          }]
        }
      },
      coverageReporter: {
        dir: "code-coverage/",
        reporters: [
          {type: "text-summary"},
          {type: "json"},
          {type: "html"}
        ]
      },

      files: [
        "node_modules/es6-shim/es6-shim.js",
        "node_modules/reflect-metadata/Reflect.js",
        "node_modules/zone.js/dist/zone.js",
        "node_modules/zone.js/dist/long-stack-trace-zone.js",
        "node_modules/zone.js/dist/async-test.js",
        "node_modules/zone.js/dist/fake-async-test.js",
        "node_modules/zone.js/dist/sync-test.js",
        "node_modules/zone.js/dist/proxy.js",
        "node_modules/zone.js/dist/jasmine-patch.js",
        "tests.bundle.js",
        {pattern: "node_modules/rxjs/**/*.js", included: false, watched: false},
        {pattern: "node_modules/rxjs/**/*.js.map", included: false, watched: false},
        {pattern: "node_modules/angular-2-local-storage/**/*.js", included: false, watched: false},
        {pattern: "node_modules/@angular/**/*.js", included: false, watched: true},
        {pattern: "node_modules/@angular/**/*.js.map", included: false, watched: true},
        // paths to support debugging with source maps in dev tools
        {pattern: "src/**/*.ts", included: true, watched: true, nocache: true},
        {pattern: "dist/**/*.ts", included: false, watched: true, nocache: true},
        {pattern: "dist/**/*.js.map", included: false, watched: true, nocache: true}
      ],

      exclude: ["karma.conf.js"],

      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      browserConsoleLogOptions: {
        level: "log",
        format: "%b %T: %m",
        terminal: true
      },
      autoWatch: true,
      singleRun: true,
      browserDisconnectTimeout: 4000,
      autoWatchBatchDelay: 1000,
      concurrency: 1,
      failOnEmptyTestSuite: false
    });
  };
}());
