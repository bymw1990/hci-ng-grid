import { Component } from "@angular/core";

import { CELL_CSS } from "./cell-template.component";
import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "default-cell",
  styles: [ CELL_CSS, `
    .default-cell {
      height: 100%;
      padding-top: 3px;
    }
  `],
  template: `
    <span (keydown)="onKeyDown($event);" class="grid-cell-template default-cell" [ngClass]="{ 'focused': focused }">
      {{ value }}
    </span>
  `
})
export class DefaultCell extends CellTemplate {

  onKeyDown(event: KeyboardEvent) {
    console.log("DateCell.onKeyDown");
    if (event.keyCode === 9) {
      event.preventDefault();
      this.tabEvent.emit(true);
    }
  }

}
