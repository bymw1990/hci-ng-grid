import {Component, Input} from "@angular/core";

import * as moment from "moment";

import {Column} from "../column";
import {FilterRenderer} from "./filter-renderer";
import {FilterInfo} from "../../utils/filter-info";

@Component({
  selector: "hci-grid-compare-filter",
  template: `
    <div class="d-flex flex-nowrap"
         style="width: 250px; padding: .5rem 0;"
         [style.background-color]="valid ? 'inherit' : '#ffccaa;'">
      <div class="parent">
        <select [ngModel]="operator" (ngModelChange)="operatorChange($event)" (click)="stop($event)" class="operator inputs">
          <option *ngFor="let o of options" [ngValue]="o" [selected]="o.value === operator.value">
            {{ o.display }}
          </option>
        </select>
        
        <input [ngModel]="filterInfo.value"
               (ngModelChange)="valueChange($event)"
               (click)="stop($event)"
               class="value inputs" />
        <input *ngIf="operator.value === 'B' || operator.value === 'O'"
               [ngModel]="filterInfo.highValue"
               (ngModelChange)="highValueChange($event)"
               (click)="inputClick($event)"
               class="value inputs" />
      </div>
      <div class="close flex-nowrap">
        <span *ngIf="changed" (click)="filter()" class="fade-in-out" style="color: green;">
          <span class="fas fa-check"></span>
        </span>
        <span (click)="valueClear()" style="color: red;">
          <span class="fas fa-times"></span>
        </span>
      </div>
    </div>
  `,
  styles: [`
  
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
      
    .close {
      flex: 0 0 20%;
      padding-left: 5px;
      padding-right: 5px;
      text-align: right;
    }
    
    .operator {
      background-color: #007bff;
      color: white;
      border-radius: 5px;
      width: 100%;
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

  @Input() column: Column;

  changed: boolean = false;
  valid: boolean = false;
  filterInfo: FilterInfo;

  operator = { value: "E", display: "Equal" };

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
    this.column.clearFilters();
    this.column.addFilter(this.filterInfo);
    this.gridService.filter();
    this.changed = false;
  }

  stop(event: MouseEvent) {
    event.stopPropagation();
  }

  setConfig(config: any) {
    super.setConfig(config);
    this.reset();
  }

  operatorChange(operator: any) {
    this.operator = operator;
    this.filterInfo.operator = operator.value;
    this.changed = true;
  }

  reset() {
    if (this.column.dataType === "number") {
      this.filterInfo = new FilterInfo(this.column.field, this.column.dataType, "0", null, "EQUALS");
    } else if (this.column.dataType === "date") {
      this.filterInfo = new FilterInfo(this.column.field, this.column.dataType, moment().toISOString(), null, "EQUALS");
    }  else {
      this.filterInfo = new FilterInfo(this.column.field, this.column.dataType, "", null, "EQUALS");
    }
  }

  valueChange(value: string) {
    if (!this.filterInfo) {
      this.setConfig({});
    }

    this.filterInfo.value = value;
    this.changed = true;
  }

  highValueChange(highValue: string) {
    if (!this.filterInfo) {
      this.setConfig({});
    }

    this.filterInfo.highValue = highValue;
    this.changed = true;
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
