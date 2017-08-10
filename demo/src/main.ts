/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {platformBrowser} from "@angular/platform-browser";

import {AppModuleNgFactory} from "./app/app.module.ngfactory";

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
