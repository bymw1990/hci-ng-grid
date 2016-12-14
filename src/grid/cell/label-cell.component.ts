import { Component, ViewEncapsulation } from "@angular/core";

import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "hci-grid-cell-label",
  template: `
    <span (keydown)="onKeyDown($event)" (click)="onClick($event)" class="hci-grid-cell-template hci-cell-label" [class.focused]="focused">
      <span *ngIf="formatType === null">{{ value }}</span>
      <span *ngIf="formatType === 'date'">{{ value | date:format }}</span>
    </span>
  `,
  styles: [ `
    .hci-cell-label {
      height: 100%;
      padding-top: 3px;
    }
  ` ],
  encapsulation: ViewEncapsulation.None
})
export class LabelCell extends CellTemplate {
  handleClick: boolean = true;
}
