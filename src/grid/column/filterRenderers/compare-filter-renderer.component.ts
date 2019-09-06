import {Component} from "@angular/core";

import {HciFilterDto} from "hci-ng-grid-dto";

import {FilterRenderer} from "./filter-renderer";

/**
 * Offers comparison with a few different data types such as numbers and dates.
 *
 * @since 1.0.0
 */
@Component({
  selector: "hci-grid-compare-filter",
  template: `
    <div (mousedown)="stop($event)"
         (mouseup)="stop($event)"
         (click)="stop($event)"
         style="display: flex; flex-wrap: nowrap; padding: .5rem 0; background-color: white; border: black 1px solid;"
         [style.width.px]="width"
         [style.background-color]="valid ? 'inherit' : '#ffccaa;'">
      <div class="parent">
        <div style="display: flex; flex-wrap: nowrap; margin-bottom: 10px; align-items: center; width: 100%;">
          <select [ngModel]="operator" (ngModelChange)="operatorChange($event)" class="operator">
            <option *ngFor="let o of options" [ngValue]="o.value" [selected]="o.value === operator">
              {{ o.display }}
            </option>
          </select>
          <div style="display: flex; justify-content: end; align-items: center; margin-left: auto; margin-right: 10px;">
            <div *ngIf="changed" (click)="filter()" class="fade-in-out" style="color: green;">
              <i class="fas fa-check-circle fa-lg l-gap"></i>
            </div>
            <div (click)="valueClear()" style="color: red;">
              <i class="fas fa-times-circle fa-lg l-gap"></i>
            </div>
            <div *ngIf="gridService.linkedGroups"
                 (click)="toggleShared()"
                 placement="top"
                 container="body"
                 matTooltip="Share Filter with other Grids"
                 [style.color]="shared ? 'green' : 'red'">
              <i class="fas fa-share-alt-square fa-lg l-gap"></i>
            </div>
          </div>
        </div>
        
        <ng-container *ngIf="column.dataType.indexOf('date-') === 0">
          <div class="form-group">
            <div class="input-group" style="flex-wrap: nowrap;" (click)="stop($event)">
              <input [ngModel]="lowValue"
                     (ngModelChange)="valueChange($event)"
                     [placeholder]="column.format"
                     [style.color]="filters && filters.length === 1 && !filters[0].valid ? 'red' : 'inherit'"
                     class="form-control value inputs" />
            </div>
            <div *ngIf="operator === 'B' || operator === 'O'"
                 class="input-group" >
              <input
                  [ngModel]="highValue"
                  (ngModelChange)="highValueChange($event)"
                  [placeholder]="column.format"
                  class="form-control value inputs" />
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="column.dataType.indexOf('date-') !== 0">
          <input *ngIf="filters && filters.length === 1"
                 [ngModel]="filters[0].value"
                 (ngModelChange)="valueChange($event)"
                 class="value inputs" />
          <input *ngIf="filters && filters.length === 1 && (operator === 'B' || operator === 'O')"
                 [ngModel]="filters[0].highValue"
                 (ngModelChange)="highValueChange($event)"
                 class="value inputs" />
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
  
    .input-group-append {
      height: 38px;
    }
      
    .inputs {
      margin-bottom: 10px;
    }
      
    .parent {
      flex: 1 1 80%;
      align-items: center;
      padding-left: 5px;
      flex-wrap: wrap;
      display: flex;
    }

    .l-gap {
      margin-left: 5px;
    }

    .operator {
      background-color: #007bff;
      color: white;
      border-radius: 5px;
      font-weight: 500;
    }
      
    .value {
      border-radius: 5px;
      width: 100%;
      font-weight: 500;
    }
    
    .fade-in-out {
      opacity: 1.0;
      animation: fade 2.0s linear infinite;
    }

    @keyframes fade {
      0%, 100% { opacity: 1.0 }
      50% { opacity: 0.0 }
    }
  `]
})
export class CompareFilterRenderer extends FilterRenderer {

  width: number = 300;
  changed: boolean = false;
  valid: boolean = false;

  lowValue: any;
  highValue: any;

  operator: string = "E";

  options = [
    { value: "LE", display: "Less Than or Equal" },
    { value: "LT", display: "Less Than" },
    { value: "E", display: "Equal" },
    { value: "GE", display: "Greater Than or Equal" },
    { value: "GT", display: "Greater Than" },
    { value: "B", display: "Between" },
    { value: "O", display: "Outside" }
  ];

  filter() {
    this.filters[0].valid = true;
    this.gridService.addFilters(this.column.field, this.filters);
    this.gridService.filter();
    this.changed = false;

    if (this.shared) {
      this.gridService.globalClearPushFilter(this.column.field, this.filters);
    }

    this.changeDetectorRef.detectChanges();
  }

  setConfig(config: any) {
    super.setConfig(config);
    this.reset();
  }

  operatorChange(operator: string) {
    this.operator = operator;
    this.filters[0].operator = operator;
    this.changed = true;
  }

  reset() {
    super.reset();

    if (this.column.dataType === "number") {
      this.filters[0] = new HciFilterDto(this.column.field, this.column.dataType, undefined, undefined, "E", false);
    } else if (this.column.dataType.indexOf("date") === 0) {
      this.filters[0] = new HciFilterDto(this.column.field, this.column.dataType, undefined, undefined, "E", false);
    } else {
      this.filters[0] = new HciFilterDto(this.column.field, this.column.dataType, undefined, undefined, "E", false);
    }

    this.lowValue = this.format(this.filters[0].value);
    this.highValue = this.format(this.filters[0].highValue);

    this.changeDetectorRef.detectChanges();
  }

  format(value: any): any {
    return this.column.formatValue(value);
  }

  /**
   * TODO: Fix timezone.
   *
   * @param value
   * @returns {any}
   */
  parse(value: any): any {
    return this.column.parseValue(value);
  }

  valueChange(value: any) {
    if (!this.filters) {
      this.setConfig({});
    }

    this.filters[0].valid = true;

    try {
      if (!value || value.length === 0) {
        this.filters[0].valid = false;
      } else if (this.column.format && value.length !== this.column.format.length) {
        this.filters[0].valid = false;
      }

      this.filters[0].value = this.parse(value);
      this.changed = true;
    } catch (error) {
      this.filters[0].valid = false;
    }
  }

  highValueChange(value: any) {
    if (!this.filters) {
      this.setConfig({});
    }

    try {
      this.filters[0].valid = (!value || value === "") ? false : true;
      this.filters[0].highValue = this.parse(value);
      this.changed = true;
    } catch (error) {
      this.filters[0].valid = false;
    }
  }

  valueClear() {
    super.valueClear();

    this.reset();
    this.gridService.addFilters(this.column.field, this.filters);
    this.gridService.filter();

    if (this.shared) {
      this.gridService.globalClearPushFilter(this.column.field, this.filters);
    }
  }

}
