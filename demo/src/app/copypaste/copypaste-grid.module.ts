/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CopyPasteGridComponent } from "./copypaste-grid.component";

const routes: Routes = [
  { path: "copypaste", component: CopyPasteGridComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class CopyPasteGridModule {}
