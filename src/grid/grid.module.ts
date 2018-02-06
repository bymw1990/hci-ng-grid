/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {GridComponent} from "./grid.component";
import {CellModule} from "./cell/cell.module";
import {ColumnHeaderComponent} from "./column/column-header.component";
import {IsVisiblePipe} from "./utils/is-visible.pipe";
import {IsGroupPipe} from "./utils/is-group.pipe";
import {IsFixedPipe} from "./utils/is-fixed.pipe";
import {IsRowVisiblePipe} from "./utils/is-row-visible.pipe";
import {LabelCell} from "./cell/label-cell.component";
import {InputCell} from "./cell/input-cell.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CellModule
  ],
  declarations: [
    GridComponent,
    ColumnHeaderComponent,
    IsVisiblePipe,
    IsGroupPipe,
    IsFixedPipe,
    IsRowVisiblePipe
  ],
  exports: [
    GridComponent,
    LabelCell,
    InputCell
  ]
})
export class GridModule {}
