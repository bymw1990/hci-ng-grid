import {Component, Input} from "@angular/core";

import {Column} from "../column";
import {FilterRenderer} from "./filter-renderer";
import {FilterInfo} from "../../utils/filter-info";

@Component({
  selector: "hci-grid-text-filter",
  template: `
    <div class="d-flex flex-nowrap" style="align-items: center; padding-left: 5px; width: 200px;">
      <input [ngModel]="filterInfo.value"
             (ngModelChange)="valueChange($event)"
             (click)="inputClick($event)"
             style="width: 100%;" />
      <div (click)="valueClear()" style="padding-left: 5px; padding-right: 5px;">
        <span class="fas fa-times"></span>
      </div>
    </div>
  `
})
export class TextFilterRenderer extends FilterRenderer {

  @Input() column: Column;

  filterInfo: FilterInfo;

  setConfig(config: any) {
    super.setConfig(config);
    this.reset();
  }

  reset() {
    this.filterInfo = new FilterInfo(this.column.field, this.column.dataType, "", null, "LIKE");
  }

  valueChange(value: string) {
    if (!this.filterInfo) {
      this.setConfig({});
    }

    this.filterInfo.value = value;
    this.column.clearFilters();
    this.column.addFilter(this.filterInfo);
    this.gridService.filter();
  }

  valueClear() {
    this.reset();
    this.column.clearFilters();
    this.gridService.filter();
  }

  inputClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
