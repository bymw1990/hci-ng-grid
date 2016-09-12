import { Component } from "@angular/core";

import { CELL_CSS } from "./cell-template.component";
import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "group-collapse-expand-cell",
  styles: [ CELL_CSS, `
    .gce-cell {
      height: 100%;
      padding-top: 3px;
    }
  `],
  template: `
    <span class="grid-cell-template gce-cell" [ngClass]="{ 'focused': focused }">
      +-
    </span>
  `
})
export class GroupCollapseExpandCell extends CellTemplate {

  valueable: boolean = false;

  ngOnInit() {
    console.log("GroupCollapseExpandCell.ngOnInit");
  }
}
