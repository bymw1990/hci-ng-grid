/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {LinkedDemoComponent} from "./linked.component";

const routes: Routes = [
  { path: "linked", component: LinkedDemoComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class LinkedDemoModule {}
