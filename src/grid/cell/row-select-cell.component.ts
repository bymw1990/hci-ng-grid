import { Component } from "@angular/core";

import { CELL_CSS } from "./cell-template.component";
import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "hci-grid-cell-row-select",
  styles: [ CELL_CSS, `
    .gce-cell {
      height: 100%;
      padding-top: 3px;
    }
  `],
  template: `
    <span class="grid-cell-template gce-cell" [ngClass]="{ 'focused': focused }">
      <i (click)="onClick($event)"
         class="fa fa-check"
         [style.color]="selected ? '#00cc00' : 'red'"></i>
    </span>
  `
})
export class RowSelectCellComponent extends CellTemplate {

  selected: boolean = false;
  valueable: boolean = false;

  ngOnInit() {
    console.log("RowSelectCellComponent.ngOnInit");
  }

  onClick(event: MouseEvent) {
    this.selected = !this.selected;
  }
}
