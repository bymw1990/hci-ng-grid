import {Component, ElementRef, ViewChild, ViewEncapsulation} from "@angular/core";

import {CellTemplate} from "./cell-template.component";

@Component({
  selector: "hci-grid-cell-input",
  template: `
    <input #input
           [ngModel]="value"
           autofocus
           (ngModelChange)="onModelChange($event)"
           (click)="onClick($event)"
           (keydown)="onInputKeyDown($event);"
           class="hci-grid-cell-template hci-grid-cell-input"
           [ngClass]="{ 'focused': focused }" />
  `,
  styles: [ `
      
    .hci-grid-cell-input, .hci-grid-cell-input:focus {
      overflow-x: hidden;
      border: none;
      outline: none;
      width: -webkit-fill-available;
      height: -webkit-fill-available;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class InputCell extends CellTemplate {

  @ViewChild("input") input: ElementRef;

  ngAfterViewInit() {
    this.input.nativeElement.focus();
  }

  /**
   * Override empty method in CellTemplate.
   */
  onFocus() {
    super.onFocus();
    this.input.nativeElement.focus();
  }

  inputClick(event: MouseEvent) {
    event.preventDefault();
  }

  onInputKeyDown(event: KeyboardEvent) {
    console.log("InputCell.onInputKeyDown " + event.keyCode);

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
    }
  }
}
