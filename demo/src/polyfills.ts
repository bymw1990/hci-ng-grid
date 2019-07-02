/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

if (process.env.ENV === "production") {
  // Production
} else {
  Error["stackTraceLimit"] = Infinity;
  require("zone.js/dist/long-stack-trace-zone");
}
