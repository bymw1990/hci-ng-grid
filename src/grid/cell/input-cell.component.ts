import { Component, ElementRef, ViewChild } from "@angular/core";

import { CELL_CSS } from "./cell-template.component";
import { CellTemplate } from "./cell-template.component";

@Component({
  selector: "hci-grid-cell-input",
  styles: [ CELL_CSS, `
    .input-cell {
      border: none;
    }
  ` ],
  template: `
    <input #input [ngModel]="value" (ngModelChange)="onModelChange($event);" (click)="handleClick($event)" (focus)="handleFocus()" (keydown)="onInputKeyDown($event);" class="grid-cell-template input-cell" [ngClass]="{ 'focused': focused }" />
  `
})
export class InputCell extends CellTemplate {

  @ViewChild("input") input: ElementRef;

  /**
   * Override empty method in CellTemplate.
   */
  onFocus() {
    super.onFocus();
    this.input.nativeElement.focus();
  }

  handleClick(event: MouseEvent) {
    event.preventDefault();
  }

  onInputKeyDown(event: KeyboardEvent) {
    console.log("InputCell.onInputKeyDown " + event.keyCode);
    event.stopPropagation();

    if (event.keyCode === 37 && this.input.nativeElement.selectionStart === 0) {
      this.input.nativeElement.blur();
      this.keyEvent.emit(37);
    } else if (event.keyCode === 39 && this.input.nativeElement.selectionStart === this.input.nativeElement.value.length) {
      this.input.nativeElement.blur();
      this.keyEvent.emit(39);
    } else if (event.keyCode !== 37 && event.keyCode !== 39) {
      this.onKeyDown(event);
    }
  }
}
