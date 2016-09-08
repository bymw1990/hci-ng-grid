import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "ng2-bootstrap/ng2-bootstrap";
import { DatepickerModule } from "ng2-bootstrap/ng2-bootstrap";

import { DefaultCell } from "./default-cell.component";
import { InputCell } from "./input-cell.component";
import { DateCell } from "./date-cell.component";

@NgModule({
    imports: [ CommonModule, FormsModule, DropdownModule, DatepickerModule ],
    declarations: [ DefaultCell, InputCell, DateCell ],
    bootstrap: [ DefaultCell, InputCell, DateCell ]
})
export class CellModule {}
