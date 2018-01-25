/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {platformBrowser} from "@angular/platform-browser";

import {DemoModuleNgFactory} from "./app/demo.module.ngfactory";

platformBrowser().bootstrapModuleFactory(DemoModuleNgFactory);
