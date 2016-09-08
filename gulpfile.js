/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
(function () {
  "use strict";

  const gulp = require("gulp");
  const del = require("del");
  const tslint = require("gulp-tslint");
  const tsc = require("gulp-tsc");
  const typings = require("gulp-typings");
  const Server = require('karma').Server;
  const paths = {
    ts: {
      src: [
        "typings/index.d.ts", "index.ts", "src/**/*.spec.ts"
      ],
      dest: ""
    }
  };

  /**
   * Cleans the current build
   */
  gulp.task("clean", () => {
    return del.sync([
      "index.+(js|d.ts|js.map)",
      "src/**/*.+(js|d.ts|js.map)"
    ]);
  });

  /**
   * Run the linter for Typescript static analysis.
   */
  gulp.task("tslint", function () {
    return gulp.src(["./index.ts", "./src/**/*.ts"]).pipe(tslint({
      formatter: "verbose"
    })).pipe(tslint.report());
  });

  /**
   * Schedule the typings processor to generate any missing third party API declarations.
   */
  gulp.task("typings", () => {
    return gulp.src("./typings.json").pipe(typings());
  });

  /**
   * Run unit tests through Karma test runner.
   */
  gulp.task("test", () => {
    new Server({
      configFile: __dirname + '/karma.conf.js'
    }).start();
  });

  /**
   * Schedule a task to push a new build to the demo applications node_modules
   */
  gulp.task("push", ["build"], () => {
      return gulp.src([
              "index.+(js|d.ts|js.map)",
              "src/**/!(*spec).+(js|d.ts|js.map)"
          ], {"base": "."})
          .pipe(gulp.dest("demo/node_modules/hci-ng2-grid"));
  });

  /**
   * Schedule Typescript transpiling.
   */
  gulp.task("build", ["clean", "tslint", "typings"], () => {
    return gulp.src(paths.ts.src)
        .pipe(tsc({
          target: "es5",
          module: "commonjs",
          moduleResolution: "node",
          sourceMap: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          noImplicitAny: false,
          noEmitHelpers: false,
          declaration: true
        }))
        .pipe(gulp.dest(paths.ts.dest));
  });
}());


