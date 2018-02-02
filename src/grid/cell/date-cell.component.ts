import {ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import * as moment from "moment";

import { CellTemplate } from "./cell-template.component";

/**
 * The ng2-bootstrap datepicker does not yet offer a popup mode, so we will wrap the datepicker in a traditional
 * bootstrap dropdown.
 */
@Component({
  selector: "hci-grid-cell-date",
  template: `
    <input #input
           [ngModel]="formattedValue"
           (ngModelChange)="onModelChange($event);"
           (click)="onClick($event)"
           (keydown)="onInputKeyDown($event);"
           placeholder="dateFormat"
           [pattern]="pattern"
           class="hci-grid-cell-template hci-grid-cell-date"
           [ngClass]="{ 'focused': focused }" />
  `,
  styles: [ `
    .hci-grid-cell-date {
      border: none;
    }
  ` ],
  encapsulation: ViewEncapsulation.None
})
export class DateCell extends CellTemplate {

  @Input() pattern: string = "[A-Z][a-z][a-z] [0-9]{1,2}, [0-9]{4}";
  @Input() dateFormat: string = "MMM D, YYYY";

  @ViewChild("input") input: ElementRef;

  formattedValue: string = "";

  onModelChange(value: Object) {
    console.log("DateCell.onModelChange " + this.formattedValue + " to " + value);

    this.formattedValue = <string> value;
  }

  saveValue() {
    try {
      let date: Date = new Date(this.formattedValue);
      if (date !== undefined) {
        console.log(date.toISOString());
        super.onModelChange(date.toISOString());
      }
    } catch (e) {
      //
    }
  }

  onInputKeyDown(event: KeyboardEvent) {
    console.log("DateCell.onInputKeyDown " + event.keyCode);

    if (event.keyCode === 37 && this.input.nativeElement.selectionStart === 0) {
      event.stopPropagation();
      this.input.nativeElement.blur();
      this.keyEvent.next(37);
    } else if (event.keyCode === 39 && this.input.nativeElement.selectionStart === this.input.nativeElement.value.length) {
      event.stopPropagation();
      this.input.nativeElement.blur();
      this.keyEvent.next(39);
    } else if (event.keyCode === 9 || event.keyCode === 38 || event.keyCode === 40) {
      event.stopPropagation();
      this.input.nativeElement.blur();
      this.onKeyDown(event);
    } else if (event.keyCode === 13) {
      this.saveValue();
    }
  }

  onFocus() {
    super.onFocus();
    this.input.nativeElement.focus();
  }

  setValue(value: Object) {
    this.formattedValue = moment((new Date(<string>value))).format(this.dateFormat);
  }
}
