import {Component, ElementRef, isDevMode, ViewChild} from "@angular/core";

import {CellEditRenderer} from "./cell-edit-renderer";
import {Point} from "../../utils/point";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "hci-grid-date-edit",
  template: `
    <ngb-datepicker #datepicker
                    [ngModel]="value"
                    (ngModelChange)="onModelChange($event)"
                    (mouseup)="stop($event)"
                    (mousedown)="stop($event)"
                    (click)="onClick($event)"
                    (keydown)="onInputKeyDown($event)"
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

  @ViewChild("datepicker") datepicker: ElementRef;

  ngAfterViewInit() {
    //this.datepicker.nativeElement.focus();
  }

  onModelChange(value: Object) {
    this.value = this.ngbDateToString(<NgbDateStruct>value);
  }

  stop(event: MouseEvent) {
    event.stopPropagation();
  }

  onClick(event: MouseEvent) {
    if (isDevMode()) {
      console.debug("ChoiceEditRenderer.onClick");
    }

    if (this.value !== this.data.value) {
      this.data.value = this.value;
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.data.value);
    }
    event.stopPropagation();
    event.preventDefault();
  }

  onInputKeyDown(event: KeyboardEvent) {
    console.log("TextEditRenderer.onInputKeyDown " + event.keyCode);

    if (event.keyCode === 13) {
      this.gridEventService.setSelectedLocation(new Point(-1, -1), null);
      this.data.value = this.value;
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.data.value);
    }
  }

  /**
   * NgbDateStruct stores day, month and year.  Convert this to ISO8601.
   *
   * @param date
   * @returns {any}
   */
  private ngbDateToString(date: NgbDateStruct): string {
    if (date === undefined || date === null) {
      return null;
    } else if (date.year === undefined || date.month === undefined || date.day === undefined) {
      return null;
    }

    return date.year + "-" + ((date.month < 10) ? "0" : "") + date.month + "-" + ((date.day < 10) ? "0" : "") + date.day + "T12:00-06:00";
  }

}
