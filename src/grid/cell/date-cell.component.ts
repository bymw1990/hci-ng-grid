import { Component, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";

import { CellTemplate } from "./cell-template.component";

/**
 * The ng2-bootstrap datepicker does not yet offer a popup mode, so we will wrap the datepicker in a traditional
 * bootstrap dropdown.
 */
@Component({
  selector: "hci-grid-cell-date",
  template: `
    <div (keydown)="onDateKeyDown($event);" class="hci-grid-cell-template" dropdown [(isOpen)]="status.isopen" (onToggle)="onToggle();" [class.focused]="focused">
      <button #datepickerbutton id="single-button" type="button" class="hci-cell-datebutton" dropdownToggle [disabled]="disabled" (click)="onClick($event)">
        {{ value | date }}
      </button>
      <div #datepickerParent dropdownMenu role="menu" role="menu" aria-labelledby="single-button" class="negate-dropdown-menu">
        <datepicker [ngModel]="value" (ngModelChange)="onModelChange($event);" class="hci-cell-datepicker"></datepicker>
      </div>
    </div>
  `,
  styles: [ `
    .hci-cell-datebutton {
      width: 100%;
      height: 100%;
      background-color: transparent;
      border: none;
      text-align: left;
    }
    .hci-cell-datepicker {
      background-color: transparent;
      padding-left: 8px;
      position: fixed;
    }
    .negate-dropdown-menu.dropdown-menu {
      position: fixed;
      top: auto;
      left: auto;
      padding: 0px;
      margin: 0px;
      border: none;
    }
  ` ],
  encapsulation: ViewEncapsulation.None,
})
export class DateCell extends CellTemplate {

  @ViewChild("datepickerbutton") datepickerbutton: ElementRef;
  @ViewChild("datepickerParent") datepickerParent: ElementRef;

  handleClick: boolean = true;
  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  onToggle() {
    if (this.status.isopen) {
      this.datepickerParent.nativeElement.getElementsByClassName("active")[0].focus();
    } else {
      this.onFocusOut();
    }
  }

  /**
   * This overrides the default cell template.  When the datetime in milliseconds is passed to the bootstrap datepicker,
   * it is converted to a js date.  When the date is updated, the js date is saved.  However, we want a long in milliseconds.
   * So we override the listener for the datepicker model to convert the value back to milliseconds before emitting the
   * new value back to the parent grid.
   *
   * @param value
   */
  onModelChange(value: Object) {
    console.log("DateCell.onKeyDown");

    if (value instanceof Date) {
      var ms: number = value.getTime();
      this.value = ms;
      this.valueChange.emit(ms);
    }
  }

  onFocus() {
    super.onFocus();
    this.datepickerbutton.nativeElement.focus();
    //this.datepicker.nativeElement.focus();
  }

  onFocusOut() {
    //console.log("CellTemplate.onFocusOut");
    this.focused = false;
    this.datepickerbutton.nativeElement.blur();
  }

  focus() {
    console.log("DateCell.focus");
    this.status.isopen = !this.status.isopen;
  }

  onDateKeyDown(event: KeyboardEvent) {
    console.log("DateCell.onDateKeyDown");
    if (event.keyCode === 9 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
      this.datepickerbutton.nativeElement.blur();
      this.onKeyDown(event);
    }
  }
}
