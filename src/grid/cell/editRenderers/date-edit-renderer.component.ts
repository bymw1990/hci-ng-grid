import {Component, ElementRef, isDevMode, ViewChild} from "@angular/core";

import * as moment from "moment";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

import {CellEditRenderer} from "./cell-edit-renderer";
import {Point} from "../../utils/point";
import {Cell} from "../cell";

@Component({
  selector: "hci-grid-date-edit",
  template: `
    <ngb-datepicker #datepicker
                    [ngModel]="value"
                    (ngModelChange)="onModelChange($event)"
                    (mouseup)="stop($event)"
                    (mousedown)="stop($event)"
                    (click)="onClick($event)"
                    (keydown)="onKeyDown($event)"
                    class="edit-renderer"></ngb-datepicker>
  `,
  styles: [ `

    .edit-renderer, .edit-renderer:focus {
      background-color: white;
      border: red 1px solid;
    }

  `]
})
export class DateEditRenderer extends CellEditRenderer {

  @ViewChild("datepicker", {read: ElementRef}) datepicker: ElementRef;

  /**
   * Upon creation of the datepicker, focus on it to enable key nav.
   */
  ngAfterViewInit() {
    this.changeDetectorRef.markForCheck();
    this.datepicker.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
  }

  onModelChange(value: Object) {
    this.value = value;
  }

  saveData(value?: any): boolean {
    if (!value) {
      value = this.value;
    }

    let newValue: any = this.ngbDateToString(<NgbDateStruct>value);

    if (this.data.value !== newValue) {
      let oldValue: any = this.data.value;
      this.data.value = newValue;
      this.gridService.handleValueChange(this.i, this.j, this.data.key, newValue, oldValue);

      return true;
    } else {
      return false;
    }
  }

  stop(event: MouseEvent) {
    event.stopPropagation();
  }

  onClick(event: MouseEvent) {
    if (isDevMode()) {
      console.debug("ChoiceEditRenderer.onClick");
    }

    this.saveData();

    event.stopPropagation();
    event.preventDefault();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.gridEventService.setSelectedLocation(new Point(-1, -1), undefined);
      this.saveData();
    }
  }

  setData(data: Cell) {
    this.data = data;

    let date: any = moment(this.data.value);
    this.value = <NgbDateStruct>{
      year: date.year(),
      month: date.month() + 1,
      day: date.date()
    };

    console.debug(this.value);
  }

  /**
   * NgbDateStruct stores day, month and year.  Convert this to ISO8601.
   *
   * @param date
   * @returns {any}
   */
  private ngbDateToString(date: NgbDateStruct): string {
    if (date === undefined || date === null) {
      return undefined;
    } else if (!date.year || !date.month || !date.day) {
      return undefined;
    }

    return date.year + "-" + ((date.month < 10) ? "0" : "") + date.month + "-" + ((date.day < 10) ? "0" : "") + date.day;
  }

}
