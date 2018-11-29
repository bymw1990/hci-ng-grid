import {Component, Input, ViewChild} from "@angular/core";

import * as moment from "moment";

import {Column} from "../column";
import {FilterRenderer} from "./filter-renderer";
import {FilterInfo} from "../../utils/filter-info";
import {NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";

/**
 * Offers comparison with a few different data types such as numbers and dates.
 *
 * @since 1.0.0
 */
@Component({
  selector: "hci-grid-compare-filter",
  template: `
    <div class="d-flex flex-nowrap"
         (mousedown)="stop($event)"
         (mouseup)="stop($event)"
         (click)="stop($event)"
         style="padding: .5rem 0; background-color: white; border: black 1px solid;"
         [style.width.px]="width"
         [style.background-color]="valid ? 'inherit' : '#ffccaa;'">
      <div class="parent">
        <div class="d-flex flex-nowrap" style="margin-bottom: 10px; align-items: center; width: 100%;">
          <select [ngModel]="operator" (ngModelChange)="operatorChange($event)" class="operator">
            <option *ngFor="let o of options" [ngValue]="o.value" [selected]="o.value === operator.value">
              {{ o.display }}
            </option>
          </select>
          <div class="d-flex justify-content-end" style="align-items: center; margin-left: auto; margin-right: 10px;">
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
                 ngbTooltip="Share Filter with other Grids"
                 [style.color]="shared ? 'green' : 'red'">
              <i class="fas fa-share-alt-square fa-lg l-gap"></i>
            </div>
          </div>
        </div>
        
        <ng-container *ngIf="column.dataType.indexOf('date-') === 0">
          <div class="form-group">
            <div class="input-group flex-nowrap" (click)="stop($event)">
              <input [ngModel]="lowValue"
                     (ngModelChange)="valueChange($event)"
                     [placeholder]="column.format"
                     [style.color]="filters && !filters[0].valid ? 'red' : 'inherit'"
                     class="form-control value inputs" />
              <!--<div class="input-group-append">
                <button class="btn btn-outline-secondary" (click)="dLow.toggle()" type="button">
                  <i class="fas fa-calendar-alt"></i>
                </button>
              </div>-->
            </div>
            <div *ngIf="operator === 'B' || operator === 'O'"
                 class="input-group flex-nowrap">
              <input
                  [ngModel]="highValue"
                  (ngModelChange)="highValueChange($event)"
                  [placeholder]="column.format"
                  class="form-control value inputs" />
              <!--
              <input ngbDatepicker #d2="ngbDatepicker"
                     [ngModel]="highValue"
                     (ngModelChange)="highValueChange($event)"
                     [minDate]="{year: 1900, month: 1, day: 1}"
                     placeholder="yyyy-mm-dd"
                     pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                     class="form-control value inputs" />
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" (click)="d2.toggle()" type="button">
                  <i class="fas fa-calendar-alt"></i>
                </button>
              </div>-->
            </div>
          </div>
        </ng-container>
        <ng-container *ngIf="column.dataType.indexOf('date-') !== 0">
          <input [ngModel]="filters[0].value"
                 (ngModelChange)="valueChange($event)"
                 class="value inputs" />
          <input *ngIf="operator === 'B' || operator === 'O'"
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
      this.filters[0] = new FilterInfo(this.column.field, this.column.dataType, undefined, undefined, "E", false);
    } else if (this.column.dataType === "date") {
      this.filters[0] = new FilterInfo(this.column.field, this.column.dataType, undefined, undefined, "E", false);
    } else {
      this.filters[0] = new FilterInfo(this.column.field, this.column.dataType, undefined, undefined, "E", false);
    }

    this.lowValue = this.format(this.filters[0].value);
    this.highValue = this.format(this.filters[0].highValue);
  }

  format(value: any): any {
    return this.column.formatValue(value);
    /*if (!value) {
      return value;
    } else if (this.column.dataType === "date") {
      let d: string[] = value.split("-");
      return {year: +d[0], month: +d[1], day: +d[2]};
    } else {
      return value;
    }*/
  }

  /**
   * TODO: Fix timezone.
   *
   * @param value
   * @returns {any}
   */
  parse(value: any): any {
    return this.column.parseValue(value);
    /*if (this.column.dataType.indexOf("date") === 0) {
      if (value) {
        let v: any = moment(value, this.column.formatterParserInstance["format"]).format(this.column.formatterParserInstance["format"]);
        return this.column.parseValue(v);
      } else {
        return undefined;
      }
    } else {
      return value;
    }*/
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
