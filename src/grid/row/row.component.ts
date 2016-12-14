import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";

import { Column } from "../column/column";
import { GridConfigService } from "../services/grid-config.service";
import { GridDataService } from "../services/grid-data.service";

@Component({
  selector: "hci-row",
  template: `
    <hci-cell *ngFor="let column of columns | isFixed:fixed | isVisible"
              (dblclick)="onDoubleClick($event)"
              [i]="i"
              [j]="j"
              [k]="column.id"
              class="hci-grid-cell hci-grid-row-height"
              [class.hci-grid-row-odd]="i % 2 === 1"
              [class.hci-grid-row-even]="i % 2 === 0"
              [style.display]="column.visible ? 'inline-block' : 'none'"
              [style.width]="column.width + '%'"
              [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
              [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
    </hci-cell>
    <br />
  `,
  styles: [ `
    .hci-grid-row-odd {
      background-color: transparent;
    }
    .hci-grid-row-even {
      background-color: #eeeeee;
    }
    .hci-grid-cell {
      border: black 1px solid;
      vertical-align: top;
    }
  ` ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowComponent {

  @Input() i: number;
  @Input() j: number;
  @Input() fixed: boolean;
  columns: Column[];

  constructor(private gridDataService: GridDataService, private gridConfigService: GridConfigService) {}

  ngOnInit() {
    //console.log("RowComponent.ngOnInit " + this.i + " " + this.j);
    this.columns = this.gridConfigService.gridConfiguration.columnDefinitions;
  }

  onDoubleClick(event: Event) {
    this.gridDataService.doubleClickRow(this.i, this.j);
  }

}
