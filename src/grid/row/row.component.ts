import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";

import {Column} from "../column/column";
import {GridService} from "../services/grid.service";

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
              [style.flex]="'1 1 ' + column.width + '%'"
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
      flex-flow: column;
      border: black 1px solid;
      vertical-align: top;
      min-height: 30px;
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

  constructor(private gridService: GridService) {}

  ngOnInit() {
    //console.log("RowComponent.ngOnInit " + this.i + " " + this.j);
    this.columns = this.gridService.columnDefinitions;
  }

  onDoubleClick(event: Event) {
    this.gridService.doubleClickRow(this.i, this.j);
  }

}
