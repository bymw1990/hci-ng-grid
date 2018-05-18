import {Component, ElementRef, Input, ViewChild} from "@angular/core";

import {Column} from "../column";
import {FilterRenderer} from "./filter-renderer";
import {FilterInfo} from "../../utils/filter-info";

@Component({
  selector: "hci-grid-text-filter",
  template: `
    <div class="d-flex flex-nowrap"
         (mousedown)="stop($event)"
         (mouseup)="stop($event)"
         (click)="stop($event)"
         [style.width.px]="width"
         style="align-items: center; padding: 0.5rem 0; background-color: white; border: black 1px solid; position: absolute;">
      <input #input
             [ngModel]="filterInfo.value"
             (ngModelChange)="valueChange($event)"
             (click)="inputClick($event)"
             style="width: 100%; margin: 0 0.5rem;" />
      <div (click)="valueClear()" style="padding-left: 5px; padding-right: 5px; color: red;">
        <i class="fas fa-times"></i>
      </div>
      <div (click)="shared = !shared" [style.color]="shared ? 'green' : 'red'">
        <i class="fas fa-share-alt-square"></i>
      </div>
    </div>
  `
})
export class TextFilterRenderer extends FilterRenderer {

  @ViewChild("input") input: ElementRef;

  @Input() column: Column;

  shared = false;
  width: number = 200;
  filterInfo: FilterInfo;

  ngAfterViewInit() {
    this.input.nativeElement.focus();
  }

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

    this.column.clearFilters();
    this.filterInfo.value = value;
    this.column.addFilter(this.filterInfo);

    this.gridService.filter();

    if (this.shared) {
      this.gridService.globalClearPushFilter(this.column.name, this.filterInfo);
    }
  }

  valueClear() {
    super.valueClear();

    this.reset();
    this.column.clearFilters();
    this.gridService.filter();
  }

  inputClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
