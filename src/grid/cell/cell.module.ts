import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {LabelCell} from "./label-cell.component";
import {InputCell} from "./input-cell.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    LabelCell,
    InputCell
  ],
  entryComponents: [
      LabelCell,
      InputCell
  ],
  exports: [
      LabelCell,
      InputCell
  ],
})
export class CellModule {}
