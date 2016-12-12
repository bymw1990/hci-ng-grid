/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AlertsGridComponent } from "./alerts-grid.component";

const routes: Routes = [
  { path: "alerts", component: AlertsGridComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AlertsGridModule {}
