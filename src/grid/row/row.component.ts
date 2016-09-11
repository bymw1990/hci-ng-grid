import { Component, Input } from "@angular/core";

import { RowData } from "./row-data";
import { GridConfigService } from "../services/grid-config.service";
import { GridDataService } from "../services/grid-data.service";

const HIDDEN: number = 0;
const COLLAPSED: number = 1;
const EXPANDED: number = 2;

/**
 * A Cell represents an i and j position in a grid.  This component binds the grid data for that position.  Rendering of
 * the data is left to a dynamically generated template which extends the CellTemplate class.  By default the DefaultCell
 * class is used which simply renders the value in a span.
 */
@Component({
  selector: "hci-row",
  template: `
    <div style="width: 100%; height: 30px; border: black 1px solid;">
      <hci-cell *ngFor="let cell of rowGroup.data; let j = index"
                [(value)]="cell.value"
                [i]="i"
                [j]="j"
                style="display: inline-block; height: 30px; border: black 1px solid; vertical-align: top;"
                [ngStyle]="{ 'width': (100 / nColumns) + '%' }">
      </hci-cell>
    </div>
  `
})
export class RowComponent {

  @Input() i: number;

  nColumns: number;
  state: number = COLLAPSED;
  rowGroup: RowData;

  constructor(private gridDataService: GridDataService, private gridConfigService: GridConfigService) {}

  ngOnInit() {
    console.log("RowComponent.ngOnInit");
    this.nColumns = this.gridConfigService.gridConfiguration.columnDefinitions.length;
    this.rowGroup = this.gridDataService.getRow(this.i);
    console.log(this.i);
    console.log(this.rowGroup);
  }
}
