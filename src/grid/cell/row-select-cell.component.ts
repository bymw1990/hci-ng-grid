import {Component, ViewEncapsulation} from "@angular/core";

import {CellTemplate} from "./cell-template.component";
import {GridEventService} from "../services/grid-event.service";
import {GridDataService} from "../services/grid-data.service";

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

  constructor(private gridDataService: GridDataService) {
    super();
  }

  ngOnInit() {
    this.selected = this.gridDataService.getRowGroup(this.i).get(this.j).selected;
  }

  onClick(event: MouseEvent) {
    this.selected = !this.selected;

    if (this.selected) {
      this.gridDataService.setSelectedRow(this.i, this.j, this.k);
    } else {
      this.gridDataService.setUnselectedRow(this.i, this.j, this.k);
    }
  }
}
