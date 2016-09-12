import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "ng2-bootstrap/ng2-bootstrap";
import { DatepickerModule } from "ng2-bootstrap/ng2-bootstrap";

import { LabelCell } from "./label-cell.component";
import { InputCell } from "./input-cell.component";
import { DateCell } from "./date-cell.component";
import { GroupCollapseExpandCell } from "./group-collapse-expand.component";

@NgModule({
    imports: [ CommonModule, FormsModule, DropdownModule, DatepickerModule ],
    declarations: [ LabelCell, InputCell, DateCell, GroupCollapseExpandCell ],
    bootstrap: [ LabelCell, InputCell, DateCell, GroupCollapseExpandCell ]
})
export class CellModule {}
