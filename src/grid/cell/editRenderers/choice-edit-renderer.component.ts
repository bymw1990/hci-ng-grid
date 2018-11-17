import {Component, ElementRef, isDevMode, ViewChild} from "@angular/core";

import {CellEditRenderer} from "./cell-edit-renderer";
import {Point} from "../../utils/point";

@Component({
  selector: "hci-grid-choice-edit",
  template: `
    <select #select
            [ngModel]="value"
            (ngModelChange)="onModelChange($event)"
            (click)="onClick($event)"
            (keydown)="onKeyDown($event)"
            class="edit-renderer">
      <option *ngFor="let choice of column.choices"
              [ngValue]="choice[column.choiceValue]"
              [selected]="choice[column.choiceValue] === value">
        {{ choice[column.choiceDisplay] }}
      </option>
    </select>
  `,
  styles: [ `
      
    .edit-renderer, .edit-renderer:focus {
      overflow-x: hidden;
      border: none;
      outline: none;
      width: -webkit-fill-available;
      height: -webkit-fill-available;
    }
  `]
})
export class ChoiceEditRenderer extends CellEditRenderer {

  @ViewChild("select") select: ElementRef;

  ngAfterViewInit() {
    this.select.nativeElement.focus();
  }

  updateLocation() {
    super.updateLocation();
    this.renderer.setStyle(this.elementRef.nativeElement, "border", "red 1px solid");
    this.renderer.setStyle(this.elementRef.nativeElement, "background-color", "white");
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
    if (event.keyCode === 37 || event.keyCode === 39) {
      this.saveData();
    } else if (event.keyCode === 38 || event.keyCode === 40) {
      // Do Nothing
    } else if (event.keyCode === 9) {
      this.saveData();
    } else if (event.keyCode === 27) {
      event.stopPropagation();
      this.gridEventService.setSelectedLocation(new Point(-1, -1), null);
    } else if (event.keyCode === 13) {
      if (this.saveData()) {
        event.stopPropagation();
        this.gridEventService.setSelectedLocation(new Point(-1, -1), null);
      }
    } else {
      event.stopPropagation();
    }
  }
}
