import {Component, ViewEncapsulation} from "@angular/core";

import {CellTemplate} from "./cell-template.component";
import {GridService} from "../services/grid.service";

@Component({
  selector: "hci-grid-cell-row-select",
  template: `
    <span class="hci-grid-cell-template hci-grid-cell-rsc"
          [ngClass]="{ 'focused': focused }"
          (click)="onClick($event)" [style.color]="selected ? '#00cc00' : 'red'">
      <span class="fas fa-check"></span>
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

  /*constructor(private gridService: GridService) {
    super();
  }*/

  ngOnInit() {
    //this.selected = this.gridService.getRowGroup(this.i).get(this.j).selected;
  }

  onClick(event: MouseEvent) {
    this.selected = !this.selected;

    /*if (this.selected) {
      this.gridService.setSelectedRow(this.i, this.j, this.k);
    } else {
      this.gridService.setUnselectedRow(this.i, this.j, this.k);
    }*/
  }
}
