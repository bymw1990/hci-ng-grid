/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FilterGridComponent } from "./filter-grid.component";

const routes: Routes = [
  { path: "", redirectTo: "/filter", pathMatch: "full" },
  { path: "filter", component: FilterGridComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class FilterGridModule {}
