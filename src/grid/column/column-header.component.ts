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
    <div class="d-flex flex-nowrap" style="align-items: center; padding-left: 8px; margin-top: auto; margin-bottom: auto;" (click)="doSort()">
      <span>{{ column.name }}</span>
      <!--
      <span class="sort-icon">
      <i *ngIf="asc === 0" class="fas fa-sort"></i>
      <i *ngIf="asc === 1" class="fas fa-sort-up"></i>
      <i *ngIf="asc === -1" class="fas fa-sort-down"></i>
      </span>-->
      <span *ngIf="asc === 0" class="sort-icon"><span class="fas fa-sort"></span></span>
      <span *ngIf="asc === 1" class="sort-icon"><span class="fas fa-sort-up"></span></span>
      <span *ngIf="asc === -1" class="sort-icon"><span class="fas fa-sort-down"></span></span>
    </div>
    <br *ngIf="column.filterType !== null" />
    <span *ngIf="column.filterType === 'input'">
      <input [ngModel]="column.filterValue"
             (ngModelChange)="doFilterChange($event)"
             style="width: 90%;" />
      <span (click)="doFilterClear();"><span class="fas fa-close"></span></span>
    </span>
    <span *ngIf="column.filterType === 'select'">
      <select [ngModel]="column.filterValue"
              (ngModelChange)="doFilterChange($event)"
              style="padding-left: 15px; padding-right: 15px; height: 30px; width: 90%;">
        <option *ngFor="let o of column.filterOptions" [ngValue]="o">{{ o }}</option>
      </select>
    </span>
  `,
  styles: [`
    .sort-icon {
      margin-left: auto;
      padding-left: 10px;
      padding-right: 5px;
    }
  `],
})
export class ColumnHeaderComponent {

  @Input() k: number;
  @Input() column: Column;

  asc: number = 0;

  constructor(private gridConfigService: GridConfigService, private gridDataService: GridDataService) {}

  ngOnInit() {
    this.gridDataService.sortInfoObserved.subscribe((sortInfo: SortInfo) => {
      if (this.column.field === sortInfo.field) {
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

  doFilterChange(value: any) {
    this.column.filterValue = value;
    this.gridDataService.filter();
  }

  doFilterClear() {
    this.doFilterChange("");
  }

  doSort() {
    this.gridDataService.sort(this.column.field);
  }
}
