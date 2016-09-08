/*
 *  Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */

/**
 * @author brandony <brandon.youkstetter@hci.utah.edu>
 * @since 08/03/16
 */
(function () {
  "use strict";

  // Turn on full stack traces in errors to help debugging
  Error.stackTraceLimit = Infinity;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

  // Cancel Karma"s synchronous start,
  // we will call `__karma__.start()` later, once all the specs are loaded.
  __karma__.loaded = function () {
  };

  System.config({
    baseURL: "/base/",
    defaultJSExtensions: true,
    map: {
      "@angular": "node_modules/@angular",
      "rxjs": "node_modules/rxjs"
    },
    packages: {
      "@angular/common": {
        main: "index.js",
        defaultExtension: "js"
      },
      "@angular/compiler": {
        main: "index.js",
        defaultExtension: "js"
      },
      "@angular/core": {
        main: "index.js",
        defaultExtension: "js"
      },
      "@angular/platform-browser": {
        main: "index.js",
        defaultExtension: "js"
      },
      "@angular/platform-browser-dynamic": {
        main: "index.js",
        defaultExtension: "js"
      },
      "rxjs": {
        defaultExtension: "js"
      }
    },
    meta: {
      "src/*": {
        format: "cjs"
      }
    }
  });

  Promise.all([
    System.import("@angular/core/testing"),
    System.import("@angular/platform-browser-dynamic/testing")
  ])
  .then(function (providers) {
    var TestBed = providers[0].TestBed;
    var BrowserDynamicTestingModule = providers[1].BrowserDynamicTestingModule;
    var platformBrowserDynamicTesting = providers[1].platformBrowserDynamicTesting;

    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  })
  .then(function () {
    return Promise.all(
      Object.keys(window.__karma__.files)
        .filter(onlySpecFiles)
        .map(file2moduleName)
        .map(importModules)
    );
  })
  .then(function () {
    __karma__.start();
  }, function (error) {
    __karma__.error(error.stack || error);
  });

  // Filter spec files
  function onlySpecFiles(path) {
    return /\.spec\.js$/.test(path);
  }

  // Normalize paths to module names.
  function file2moduleName(filePath) {
    return filePath.replace(/\\/g, "/")
        .replace(/^\/base\//, "")
        .replace(/\.js/, "");
  }

  // Import module path
  function importModules(path) {
    return System.import(path);
  }
}());