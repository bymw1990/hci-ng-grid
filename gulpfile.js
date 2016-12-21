/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
(function () {
  "use strict";

  const gulp = require("gulp");
  const del = require("del");
  const tslint = require("gulp-tslint");
  const tsc = require("gulp-tsc");
  const tsconfig = require("./tsconfig.json");
  const Server = require('karma').Server;
  const parseArgs = require("minimist");
  const fs = require("fs");
  const tslintConfig = "tslint.json";
  const paths = {
    ts: {
      src: [
        "index.ts", "src/**/*.spec.ts"
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
    return gulp.src(["./src/**/*.ts", "*.ts"]).pipe(tslint({
      formatter: "verbose",
      configuration: tslintConfig
    })).pipe(tslint.report());
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
    const demoPath = "demo/node_modules/hci-ng-grid";
    const options = parseArgs(process.argv.slice(2), {
      boolean: "depCheck"
    });

    if((options.depCheck && !fs.existsSync(demoPath)) || !options.depCheck) {
      return gulp.src([
        "index.+(js|d.ts|js.map)",
        "src/**/!(*spec).+(js|d.ts|js.map)"
      ], {"base": "."})
          .pipe(gulp.dest(demoPath));
    }
  });

  /**
   * Schedule Typescript transpiling.
   */
  gulp.task("build", ["clean", "tslint"], () => {
    return gulp.src(paths.ts.src)
        .pipe(tsc(tsconfig.compilerOptions))
        .pipe(gulp.dest(paths.ts.dest));
  });
}());
