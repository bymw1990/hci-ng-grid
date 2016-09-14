/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { SimpleGridComponent } from "./simple-grid.component";

const routes: Routes = [
  { path: "", redirectTo: "/simple", pathMatch: "full" },
  { path: "simple", component: SimpleGridComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class SimpleGridModule {}
