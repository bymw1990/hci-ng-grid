/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ResizeDemoComponent} from "./resize.component";

const routes: Routes = [
    { path: "resize", component: ResizeDemoComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class ResizeDemoModule {}
