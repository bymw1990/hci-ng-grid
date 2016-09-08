import { Component } from "@angular/core";

import { CELL_CSS } from "./cell-template.component";
import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "default-cell",
  styles: [ CELL_CSS ],
  template: `
    <div (keydown)="onKeyDown($event);" class="btn-group grid-cell-fill" style="width: 100%; height: 100%;">
        <span class="grid-cell-template" [ngClass]="{ 'focused': focused }">{{ value }}</span>
    </div>
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
