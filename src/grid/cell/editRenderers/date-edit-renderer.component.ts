import {Component, ElementRef, isDevMode, ViewChild} from "@angular/core";

import * as moment from "moment";
import {NgbDatepicker, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

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
                    class="edit-renderer">
    </ngb-datepicker>
  `,
  styles: [ `

    .edit-renderer, .edit-renderer:focus {
      background-color: white;
      border: red 1px solid;
    }

  `]
})
export class DateEditRenderer extends CellEditRenderer {

  @ViewChild("datepicker", {read: ElementRef}) datepickerEl: ElementRef;
  @ViewChild("datepicker") datepicker: NgbDatepicker;

  /**
   * Upon creation of the datepicker, focus on it to enable key nav.
   */
  init() {
    this.datepickerEl.nativeElement.focus();

    this.datepicker.navigateTo(this.value);
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

    //this.saveData();

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
      year: +date.year(),
      month: +date.month() + 1,
      day: +date.date()
    };
  }

  /**
   * NgbDateStruct stores day, month and year.  Parse this to the expected date type.
   *
   * This is a little complicated because the format in the view (say MM/DD/YYYY) is not the same format as the editor
   * which is the NgbDateStruct.  To handle this, you need to convert the NgbDateStruct to a iso8601 date, then create
   * a moment out of that.  Then you can use whatever the formatter is to format it.  Then you can take that and parse it.
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

    let v: any = date.year + "-" + ((date.month < 10) ? "0" : "") + date.month + "-" + ((date.day < 10) ? "0" : "") + date.day;
    v = moment(v).format(this.column.formatterParserInstance["format"]);
    return this.column.parseValue(v);
  }

}
