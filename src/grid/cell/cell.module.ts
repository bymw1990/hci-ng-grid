import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {LabelCell} from "./label-cell.component";
import {InputCell} from "./input-cell.component";
import {DateCell} from "./date-cell.component";
import {DatePickerCell} from "./date-picker-cell.component";
import {GroupCollapseExpandCell} from "./group-collapse-expand.component";
import {RowSelectCellComponent} from "./row-select-cell.component";

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      NgbModule.forRoot()],
    declarations: [
      LabelCell,
      InputCell,
      DateCell,
      DatePickerCell,
      GroupCollapseExpandCell,
      RowSelectCellComponent
    ],
    entryComponents: [
        LabelCell,
        InputCell,
        DateCell,
        DatePickerCell,
        GroupCollapseExpandCell,
        RowSelectCellComponent
    ],
    exports: [
        LabelCell,
        InputCell,
        DateCell,
        DatePickerCell,
        GroupCollapseExpandCell,
        RowSelectCellComponent
    ],
})
export class CellModule {}
