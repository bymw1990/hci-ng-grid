import { Component, Input } from "@angular/core";

import { RowGroup } from "./row-group";
import { Column } from "../column/column";
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
  styles: [`
    .hci-row {
      width: 100%;
      height: 30px;
      border: black 1px solid;
    }
    .hci-row.header {
      background-color: #eeeeee;
    }
  `],
  template: `
    <div *ngIf="rowGroup.header !== null"
         (click)="rowHeaderClick()"
         class="hci-row header"
         style="padding-top: 3px;">
      <!--<hci-cell *ngFor="let column of columns | isGroup; let k = index"
                [i]="i"
                [j]="-1"
                [k]="k"
                style="height: 30px; border: black 1px solid; vertical-align: top;"
                [style.display]="column.visible ? 'inline-block' : 'none'"
                [style.width]="column.width + '%'">
      </hci-cell>-->
      <span style="padding-left: 10px;"><i class="fa fa-minus"></i></span><span *ngFor="let cell of rowGroup.header.cells" style="padding-left: 10px;">{{cell.value}}</span>
    </div>
    <div *ngFor="let row of rowGroup.rows | isRowVisible; let j = index"
         class="hci-row">
      <hci-cell *ngFor="let column of columns | isFixed:fixed"
                [i]="i"
                [j]="j"
                [k]="column.id"
                style="height: 30px; border: black 1px solid; vertical-align: top;"
                [style.display]="column.visible ? 'inline-block' : 'none'"
                [style.width]="column.width + '%'">
      </hci-cell>
    </div>
  `
})
export class RowComponent {

  @Input() i: number;
  @Input() fixed: boolean;

  state: number = COLLAPSED;
  rowGroup: RowGroup;
  columns: Column[];

  constructor(private gridDataService: GridDataService, private gridConfigService: GridConfigService) {}

  ngOnInit() {
    //console.log("RowComponent.ngOnInit");
    this.columns = this.gridConfigService.gridConfiguration.columnDefinitions;
    this.rowGroup = this.gridDataService.getRowGroup(this.i);
    //console.log(this.i);
    //console.log(this.rowGroup);
  }

  rowHeaderClick() {
    console.log("RowComponent.rowHeaderClick");
    this.gridDataService.sort("GROUP_BY");
  }
}
