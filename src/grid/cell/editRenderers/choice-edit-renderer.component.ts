import {Component, ElementRef, ViewChild} from "@angular/core";

import {CellEditRenderer} from "./cell-edit-renderer";

@Component({
  selector: "hci-grid-choice-edit",
  template: `
    <select #select
            [ngModel]="value"
            (ngModelChange)="onModelChange($event)">
      <option *ngFor="let choice of column.choices"
              [ngValue]="choice[column.choiceValue]"
              [selected]="choice[column.choiceValue] === value">
        {{ choice[column.choiceDisplay] }}
      </option>
    </select>
  `
})
export class ChoiceEditRenderer extends CellEditRenderer {

  @ViewChild("select") select: ElementRef;

  ngAfterViewInit() {
    //this.input.nativeElement.focus();
  }

}
