import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

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
              style="height: 30px; border: black 1px solid; vertical-align: top;"
              [style.display]="column.visible ? 'inline-block' : 'none'"
              [style.width]="column.width + '%'"
              [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
              [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
    </hci-cell>
    <br />
  `,
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
