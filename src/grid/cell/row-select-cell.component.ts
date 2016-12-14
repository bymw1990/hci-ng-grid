import { Component, ViewEncapsulation } from "@angular/core";

import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "hci-grid-cell-row-select",
  template: `
    <span class="hci-grid-cell-template hci-grid-cell-rsc" [ngClass]="{ 'focused': focused }">
      <i (click)="onClick($event)"
         class="fa fa-check"
         [style.color]="selected ? '#00cc00' : 'red'"></i>
    </span>
  `,
  styles: [ `
    .hci-grid-cell-rsc {
      height: 100%;
      padding-top: 3px;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class RowSelectCellComponent extends CellTemplate {

  selected: boolean = false;
  valueable: boolean = false;

  onClick(event: MouseEvent) {
    this.selected = !this.selected;
  }
}
