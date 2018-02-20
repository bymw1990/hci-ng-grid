/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {GridComponent} from "./grid.component";
import {CellModule} from "./cell/cell.module";
import {ColumnHeaderComponent} from "./column/column-header.component";
import {IsVisiblePipe} from "./utils/is-visible.pipe";
import {IsGroupPipe} from "./utils/is-group.pipe";
import {IsFixedPipe} from "./utils/is-fixed.pipe";
import {IsRowVisiblePipe} from "./utils/is-row-visible.pipe";
import {TextFilterRenderer} from "./column/filterRenderers/text-filter-renderer.component";
import {CompareFilterRenderer} from "./column/filterRenderers/compare-filter-renderer.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CellModule,
    NgbModule.forRoot()
  ],
  declarations: [
    GridComponent,
    ColumnHeaderComponent,
    IsVisiblePipe,
    IsGroupPipe,
    IsFixedPipe,
    IsRowVisiblePipe,
    TextFilterRenderer,
    CompareFilterRenderer
  ],
  entryComponents: [
    TextFilterRenderer,
    CompareFilterRenderer
  ],
  exports: [
    GridComponent
  ]
})
export class GridModule {}
