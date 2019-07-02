/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {enableProdMode} from "@angular/core";
import {platformBrowser} from "@angular/platform-browser";

import {DemoModuleNgFactory} from "./app/demo.module.ngfactory";

if (process.env.ENV === "production") {
  enableProdMode();
}

platformBrowser().bootstrapModuleFactory(DemoModuleNgFactory);
