import {Component, ElementRef, ViewChild} from "@angular/core";

import {HciFilterDto} from "hci-ng-grid-dto";

import {FilterRenderer} from "./filter-renderer";

@Component({
  selector: "hci-grid-text-filter",
  template: `
    <div class="d-flex flex-nowrap"
         (mousedown)="stop($event)"
         (mouseup)="stop($event)"
         (click)="stop($event)"
         [style.width.px]="width"
         style="align-items: center; padding: 5px; background-color: white; border: black 1px solid; position: absolute;">
      <input #input
             [ngModel]="filters[0].value"
             (ngModelChange)="valueChange($event)"
             (click)="inputClick($event)"
             style="width: 100%; margin: 0 0.5rem;" />
      <div (click)="valueClear()"
           placement="top"
           container="body"
           ngbTooltip="Clear Filter"
           style="padding-left: 5px; padding-right: 5px; color: red;">
        <i class="fas fa-times-circle fa-lg"></i>
      </div>
      <div *ngIf="gridService.linkedGroups"
           (click)="toggleShared()"
           placement="top"
           container="body"
           ngbTooltip="Share Filter with other Grids"
           [style.color]="shared ? 'green' : 'red'"
           style="padding-left: 5px; padding-right: 5px;">
        <i class="fas fa-share-alt-square fa-lg"></i>
      </div>
    </div>
  `
})
export class TextFilterRenderer extends FilterRenderer {

  @ViewChild("input", {static: true}) input: ElementRef;

  value: any;
  width: number = 200;

  ngAfterViewInit() {
    this.input.nativeElement.focus();
  }

  setConfig(config: any) {
    super.setConfig(config);
    this.reset();
  }

  reset() {
    super.reset();

    if (this.filters.length === 0) {
      this.filters.push(new HciFilterDto(this.column.field, this.column.dataType, "", undefined, "LIKE", false));
    } else {
      this.filters[0] = new HciFilterDto(this.column.field, this.column.dataType, "", undefined, "LIKE", false);
    }

    if (this.shared) {
      this.gridService.globalClearPushFilter(this.column.field, this.filters);
    }

    this.changeDetectorRef.detectChanges();
  }

  valueChange(value: string) {
    if (!this.filters) {
      this.setConfig({});
    }

    this.value = value;
    this.filter();
  }

  filter () {
    if (this.filters.length === 0) {
      this.reset();
    }
    this.filters[0].value = this.value;

    this.filters[0].valid = (!this.value || this.value === "") ? false : true;

    this.gridService.addFilters(this.column.field, this.filters);
    this.gridService.filter();

    if (this.shared) {
      this.gridService.globalClearPushFilter(this.column.field, this.filters);
    }
  }

  valueClear() {
    super.valueClear();

    this.reset();
    this.gridService.addFilters(this.column.field, this.filters);
    this.gridService.filter();
  }

  inputClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
