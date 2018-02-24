import {Component, Input} from "@angular/core";

import {Column} from "../column";
import {FilterRenderer} from "./filter-renderer";
import {FilterInfo} from "../../utils/filter-info";

/**
 * Offers comparison with a few different data types such as numbers and dates.
 *
 * @since 1.0.0
 */
@Component({
  selector: "hci-grid-select-filter",
  template: `
    <div class="d-flex flex-nowrap"
         style="width: 300px; padding: .5rem 0;">
      <div class="parent">
        <div class="form-group" style="margin-bottom: 8px;" (click)="stop($event)">
          <button class="btn btn-primary" (click)="selectAll()">Select All</button>
          <button class="btn btn-secondary" (click)="deselectAll()">Deselect All</button>
        </div>
        
        <div class="form-group choice-list" (click)="stop($event)">
          <div *ngFor="let choice of column.choices" class="input-group flex-nowrap" (click)="valueChange(choice.value)">
            <input type="checkbox" id="choiceCheckbox" [ngModel]="choice.selected" class="form-control" />
            <label class="form-check-label" for="choiceCheckbox">{{choice.display}}</label>
          </div>
        </div>
      </div>
      <div class="close flex-nowrap">
        <span *ngIf="changed" (click)="filter()" class="fade-in-out" style="color: green;">
          <span class="fas fa-check-circle"></span>
        </span>
        <span (click)="valueClear()" style="color: red;">
          <span class="fas fa-times-circle"></span>
        </span>
      </div>
    </div>
  `,
  styles: [`
  
    .choice-list {
      max-height: 200px;
      overflow-y: auto;
      border-top: black 2px solid;
    }
  
    .btn {
      padding: 1px 8px;
    }
    
    .form-group {
      flex: 1 0 100%;
    }
    
    .input-group {
      align-items: center;
      padding: 5px;
    }
    
    .form-control {
      flex: 0 1 10%;
      margin-right: 5px;
    }
    
    .form-check-label {
      flex: 1 0 90%;
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
export class SelectFilterRenderer extends FilterRenderer {

  @Input() column: Column;

  init: boolean = false;
  changed: boolean = false;

  filter() {
    this.column.clearFilters();
    for (let choice of this.column.choices) {
      if (choice.selected) {
        this.column.addFilter(new FilterInfo(this.column.field, this.column.dataType, choice.value, null, "E"));
      }
    }

    this.gridService.filter();
    this.changed = false;
  }

  stop(event: MouseEvent) {
    event.stopPropagation();
  }

  deselectAll() {
    for (let choice of this.column.choices) {
      choice.selected = false;
    }
  }

  selectAll() {
    for (let choice of this.column.choices) {
      choice.selected = true;
    }
  }

  /**
   * Negates the current selection.
   *
   * @param id The value of the choice.
   */
  valueChange(id: any) {
    this.changed = true;

    for (let choice of this.column.choices) {
      if (choice.value === id) {
        choice.selected = !choice.selected;
        break;
      }
    }
  }

  /**
   * Removes all filters on this column.
   */
  valueClear() {
    this.changed = false;
    this.deselectAll();
    this.column.clearFilters();
    this.gridService.filter();
  }

}
