/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { GridComponent } from "./grid.component";
import { RowComponent } from "./row/row.component";
import { RowGroupComponent } from "./row/row-group.component";
import { CellModule } from "./cell/cell.module";
import { CellComponent } from "./cell/cell.component";
import { ColumnHeaderComponent } from "./column/column-header.component";
import { IsVisiblePipe } from "./utils/is-visible.pipe";
import { IsGroupPipe } from "./utils/is-group.pipe";
import { IsFixedPipe } from "./utils/is-fixed.pipe";
import { IsRowVisiblePipe } from "./utils/is-row-visible.pipe";
import { ColumnDefComponent } from "./column/column-def.component";
import { LabelCell } from "./cell/label-cell.component";
import { InputCell } from "./cell/input-cell.component";
import { DateCell } from "./cell/date-cell.component";
import { DatePickerCell } from "./cell/date-picker-cell.component";

@NgModule({
  imports: [ CommonModule, FormsModule, CellModule ],
  declarations: [ GridComponent, RowComponent, RowGroupComponent, CellComponent, ColumnHeaderComponent, IsVisiblePipe, IsGroupPipe, IsFixedPipe, IsRowVisiblePipe, ColumnDefComponent ],
  providers: [ ],
  exports: [ GridComponent, ColumnDefComponent, LabelCell, InputCell, DateCell, DatePickerCell ]
})
export class GridModule {}
