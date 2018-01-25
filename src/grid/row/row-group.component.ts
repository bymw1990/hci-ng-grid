import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";

import { RowGroup } from "./row-group";
import { GridConfigService } from "../services/grid-config.service";
import { GridDataService } from "../services/grid-data.service";

/**
 * A Cell represents an i and j position in a grid.  This component binds the grid data for that position.  Rendering of
 * the data is left to a dynamically generated template which extends the CellTemplate class.  By default the DefaultCell
 * class is used which simply renders the value in a span.
 */
@Component({
  selector: "hci-row-group",
  template: `
    <div *ngIf="rowGroup.header !== null"
         (click)="rowHeaderClick()"
         class="hci-grid-row-group-header">
      <span style="padding-left: 10px;" (click)="expandCollapse($event)">
        <span *ngIf="rowGroup.state === rowGroup.EXPANDED"><span class="fas fa-minus"></span></span>
        <span *ngIf="rowGroup.state === rowGroup.COLLAPSED"><span class="fas fa-plus"></span></span>
      </span>
      <span *ngFor="let cell of rowGroup.header.cells"
            class="hci-grid-row-group-column-header">
        {{cell.value}}
      </span>
    </div>
    <ng-container *ngIf="rowGroup.state === rowGroup.EXPANDED || rowGroup.header === null">
      <hci-row *ngFor="let row of rowGroup.rows; let j = index"
               class="d-flex flex-nowrap"
               [i]="i"
               [j]="j"
               [fixed]="fixed">
      </hci-row>
    </ng-container>
  `,
  styles: [ `
      
    .hci-grid-row-group-header {
      padding-top: 3px;
      border: black 1px solid;
      width: 100%;
    }
    
    .hci-grid-row-group-column-header {
      padding-left: 10px;
    }
      
  ` ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowGroupComponent {

  @Input() i: number;
  @Input() fixed: boolean;

  rowGroup: RowGroup;

  constructor(private gridDataService: GridDataService, private gridConfigService: GridConfigService) {}

  ngOnInit() {
    this.rowGroup = this.gridDataService.getRowGroup(this.i);
  }

  expandCollapse(event: MouseEvent) {
    if (this.rowGroup.state === this.rowGroup.EXPANDED) {
      this.rowGroup.state = this.rowGroup.COLLAPSED;
    } else {
      this.rowGroup.state = this.rowGroup.EXPANDED;
    }

    event.stopPropagation();
  }

  rowHeaderClick() {
    this.gridDataService.sort("GROUP_BY");
  }
}
