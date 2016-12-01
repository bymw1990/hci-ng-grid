import { Component } from "@angular/core";

import { CELL_CSS } from "./cell-template.component";
import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "hci-grid-cell-label",
  styles: [ CELL_CSS, `
    .label-cell {
      height: 100%;
      padding-top: 3px;
    }
  `],
  template: `
    <span (keydown)="onKeyDown($event)" (click)="onClick($event)" class="grid-cell-template label-cell" [class.focused]="focused">
      <span *ngIf="formatType === null">{{ value }}</span>
      <span *ngIf="formatType === 'date'">{{ value | date:format }}</span>
    </span>
  `
})
export class LabelCell extends CellTemplate {
  handleClick: boolean = true;
}
