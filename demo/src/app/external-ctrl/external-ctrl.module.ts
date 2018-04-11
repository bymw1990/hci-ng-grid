/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ExternalControlComponent} from "./external-ctrl.component";

const routes: Routes = [
  { path: "external-ctrl", component: ExternalControlComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class ExternalControlModule {}
