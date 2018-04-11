/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ExternalDataComponent } from "./external-data.component";

const routes: Routes = [
  { path: "external-data", component: ExternalDataComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class ExternalDataModule {}
