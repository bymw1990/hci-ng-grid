import { Component, Input } from "@angular/core";

import { Column } from "./column";
import { GridConfigService } from "../services/grid-config.service";
import { GridDataService } from "../services/grid-data.service";
import { SortInfo } from "../utils/sort-info";

/**
 * fa-sort fa-sort-asc fa-sort-desc
 */
@Component({
  selector: "hci-column-header",
  template: `
    <span (click)="doSort()">
      {{ column.name }}
      <i *ngIf="asc === 0" class="fa fa-sort"></i>
      <i *ngIf="asc === 1" class="fa fa-sort-asc"></i>
      <i *ngIf="asc === -1" class="fa fa-sort-desc"></i>
    </span>
  `
})
export class ColumnHeaderComponent {

  @Input() k: number;
  @Input() column: Column;

  asc: number = 0;

  constructor(private gridConfigService: GridConfigService, private gridDataService: GridDataService) {}

  ngOnInit() {
    this.gridDataService.sortInfoObserved.subscribe((sortInfo: SortInfo) => {
      if (this.column.field === sortInfo.column) {
        if (sortInfo.asc) {
          this.asc = 1;
        } else {
          this.asc = -1;
        }
      } else {
        this.asc = 0;
      }
    });
  }

  doSort() {
    this.gridDataService.sort(this.column.field);
  }
}
