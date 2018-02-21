import {Component, ElementRef, ViewChild} from "@angular/core";

import {Point} from "../../utils/point";
import {CellEditRenderer} from "./cell-edit-renderer";

@Component({
  selector: "hci-grid-text-edit",
  template: `
    <input #input
           [ngModel]="value"
           autofocus
           (ngModelChange)="onModelChange($event)"
           (click)="onClick($event)"
           (keydown)="onInputKeyDown($event)"
           class="hci-grid-text-edit"
           [ngClass]="{ 'focused': focused }" />
  `,
  styles: [ `
      
    .hci-grid-text-edit, .hci-grid-text-edit:focus {
      overflow-x: hidden;
      border: none;
      outline: none;
      width: -webkit-fill-available;
      height: -webkit-fill-available;
    }
  `]
})
export class TextEditRenderer extends CellEditRenderer {

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

  updateLocation() {
    super.updateLocation();
    this.renderer.setStyle(this.elementRef.nativeElement, "border", "red 1px solid");
    this.renderer.setStyle(this.elementRef.nativeElement, "background-color", "white");
  }

  onInputKeyDown(event: KeyboardEvent) {
    console.log("TextEditRenderer.onInputKeyDown " + event.keyCode);

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
