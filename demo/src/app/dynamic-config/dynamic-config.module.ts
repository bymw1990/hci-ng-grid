/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {DynamicConfigGridComponent} from "./dynamic-config.component";

const routes: Routes = [
  { path: "dynamic-config", component: DynamicConfigGridComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DynamicConfigGridModule {}
