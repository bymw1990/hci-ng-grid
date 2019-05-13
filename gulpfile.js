
var async = require("async");
var childProcess = require("child_process");
var gulp = require("gulp");
var exit = require("gulp-exit");
var debug = require("gulp-debug")
var gulpSequence = require("gulp-sequence")
var gulpLoad = require("gulp-load-plugins")
var install = require("gulp-install");
var clean = require("gulp-clean");
var del = require("del");
var jeditor = require("gulp-json-editor");
var jmodify = require("gulp-json-modify");
var fs = require("fs-extra");
var rename = require("gulp-rename");
var rimraf = require("rimraf");
var spawn = require("cross-spawn");
var path = require("path");
var argv = require("yargs").argv;
var logger = require("node-color-log");

/**
 * Run npm run build on the demo.
 */
gulp.task("build-demo", function(done) {
    logger.color("cyan").log("Task: build-demo");

    spawn.sync("npm", ["run", "build"], {stdio: "inherit", cwd: "./demo"});
    done();
});

/**
 * Builds and runs the demo.  This assumes the node_modules/@hci already exists.
 */
gulp.task("run-demo", gulp.series([], function() {
    logger.color("cyan").log("Task: run-demo");

    spawn.sync("npm", ["run", "run-demo"], { stdio: "inherit", cwd: "demo"});
}));

/**
 * Builds and runs the production demo.  This assumes the node_modules/@hci already exists.
 */
gulp.task("run-demo-prod", gulp.series([], function() {
    logger.color("cyan").log("Task: run-demo-prod");

    spawn.sync("npm", ["run", "run-demo-prod"], { stdio: "inherit", cwd: "demo"});
}));

/**
 * Run npm install on the demo.
 */
gulp.task("install-demo", function(done) {
    logger.color("cyan").log("Task: install-demo");

    spawn.sync("npm", ["install"], {stdio: "inherit", cwd: "./demo"});
    done();
});
