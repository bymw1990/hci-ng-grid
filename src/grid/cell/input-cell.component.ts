import {Component, ElementRef, ViewChild, ViewEncapsulation} from "@angular/core";

import {Point} from "../utils/point";
import {CellTemplate} from "./cell-template.component";

@Component({
  selector: "hci-ng-grid-cell-input",
  template: `
    <input #input
           [ngModel]="value"
           autofocus
           (ngModelChange)="onModelChange($event)"
           (click)="onClick($event)"
           (keydown)="onInputKeyDown($event);"
           class="hci-ng-grid-cell-template hci-ng-grid-cell-input"
           [ngClass]="{ 'focused': focused }" />
  `,
  styles: [ `
      
    .hci-ng-grid-cell-input, .hci-ng-grid-cell-input:focus {
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
    if (this.data !== null && this.data.value !== null) {
      if (this.gridEventService.getLastDx() === -1) {
        this.input.nativeElement.selectionStart = (<string>this.data.value).length;
      } else {
        this.input.nativeElement.selectionStart = 0;
      }
    }
  }

  /**
   * Override empty method in CellTemplate.
   */
  onFocus() {
    //super.onFocus();
    this.input.nativeElement.focus();
  }

  inputClick(event: MouseEvent) {
    event.preventDefault();
  }

  onInputKeyDown(event: KeyboardEvent) {
    console.log("InputCell.onInputKeyDown " + event.keyCode);

    if (event.keyCode === 37 && this.input.nativeElement.selectionStart === 0) {
      this.data.value = this.gridService.parseData(this.j, this.value);
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.data.value);
    } else if (event.keyCode === 39 && this.input.nativeElement.selectionStart === this.input.nativeElement.value.length) {
      this.data.value = this.gridService.parseData(this.j, this.value);
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.data.value);
    } else if (event.keyCode === 38 || event.keyCode === 40) {
      this.data.value = this.gridService.parseData(this.j, this.value);
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.data.value);
    } else if (event.keyCode === 9) {
      this.data.value = this.gridService.parseData(this.j, this.value);
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.data.value);
    } else if (event.keyCode === 27) {
      event.stopPropagation();
      this.gridEventService.setSelectedLocation(new Point(-1, -1), null);
    } else if (event.keyCode === 13) {
      event.stopPropagation();
      this.gridEventService.setSelectedLocation(new Point(-1, -1), null);
      this.data.value = this.gridService.parseData(this.j, this.value);
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.data.value);
    } else {
      event.stopPropagation();
    }
  }
}
