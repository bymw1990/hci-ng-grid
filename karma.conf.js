/*
 *  Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */

/**
 * @author brandony <brandon.youkstetter@hci.utah.edu>
 * @since 08/03/16
 */
(function () {
  "use strict";

  module.exports = function (config) {
    config.set({
      basePath: "",

      frameworks: ["jasmine"],
      browsers: ["PhantomJS"],
      reporters: ["mocha", "coverage"],

      // Source files that you wanna generate coverage for.
      preprocessors: {"src/**/!(*spec).js": ["coverage", "sourcemap"]},

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
        "node_modules/systemjs/dist/system-polyfills.js",
        "node_modules/systemjs/dist/system.src.js",
        "node_modules/zone.js/dist/zone.js",
        "node_modules/zone.js/dist/jasmine-patch.js",
        "node_modules/zone.js/dist/async-test.js",
        "node_modules/zone.js/dist/fake-async-test.js",

        {pattern: "node_modules/rxjs/**/*.js", included: false, watched: false},
        {pattern: "node_modules/rxjs/**/*.js.map", included: false, watched: false},
        {pattern: "karma-test-shim.js", included: true, watched: true},
        {pattern: "node_modules/@angular/**/*.js", included: false, watched: true},
        {pattern: "node_modules/@angular/**/*.js.map", included: false, watched: true},
        {pattern: "src/**/*.js", included: false, watched: true},

        // paths to support debugging with source maps in dev tools
        {pattern: "src/**/*.ts", included: false, watched: false},
        {pattern: "src/**/*.js.map", included: false, watched: false}
      ],

      proxies: {
        // required for component assets fetched by Angular"s compiler
        "/src/": "/base/src/"
      },

      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      singleRun: true,
    });
  };
}());