import {
  ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2, TemplateRef, ViewChild,
  ViewEncapsulation
} from "@angular/core";

import {RowGroup} from "./row-group";
import {GridService} from "../services/grid.service";

/**
 * A Cell represents an i and j position in a grid.  This component binds the grid data for that position.  Rendering of
 * the data is left to a dynamically generated template which extends the CellTemplate class.  By default the DefaultCell
 * class is used which simply renders the value in a span.
 */
@Component({
  selector: "hci-row-group",
  template: `
    <div #rowGroupRef>
      <!--<div *ngIf="rowGroup !== null && rowGroup.header !== null"
           (click)="rowHeaderClick()"
           class="hci-grid-row-group-header">-->
      <div *ngIf="rowGroup !== null && rowGroup.header !== null"
           class="hci-grid-row-group-header">
        <!--
        <span style="padding-left: 10px;" (click)="expandCollapse($event)">
          <span *ngIf="rowGroup.state === rowGroup.EXPANDED"><span class="fas fa-minus"></span></span>
          <span *ngIf="rowGroup.state === rowGroup.COLLAPSED"><span class="fas fa-plus"></span></span>
        </span>
        -->
        <ng-container *ngIf="rowGroup !== null">
          <span *ngFor="let cell of rowGroup.header.cells"
                class="hci-grid-row-group-column-header">
            {{cell.value}}
          </span>
        </ng-container>
      </div>
      <ng-container *ngIf="rowGroup !== null && (rowGroup.state === rowGroup.EXPANDED || rowGroup.header === null)">
        <hci-row *ngFor="let row of rowGroup.rows; let j = index"
                 class="d-flex flex-nowrap"
                 [i]="i"
                 [j]="j"
                 [fixed]="fixed">
        </hci-row>
      </ng-container>
    </div>
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
  encapsulation: ViewEncapsulation.None
})
export class RowGroupComponent {

  @Input() i: number;
  @Input() fixed: boolean;

  rowGroup: RowGroup;

  @ViewChild("rowGroupRef") rowGroupRef: ElementRef;

  constructor(private renderer: Renderer2, private gridService: GridService) {}

  ngOnInit() {
    this.rowGroup = this.gridService.getRowGroup(this.i);
  }

  ngAfterViewInit() {
    this.gridService.data.subscribe((data: Array<RowGroup>) => {
      if (this.gridService.getRowGroup(this.i) === null) {
        this.renderer.setStyle(this.rowGroupRef.nativeElement, "display", "none");
      } else {
        this.renderer.setStyle(this.rowGroupRef.nativeElement, "display", "unset");
      }
      //this.changeDetectorRef.markForCheck();
    });
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
    this.gridService.sort("GROUP_BY");
  }
}
