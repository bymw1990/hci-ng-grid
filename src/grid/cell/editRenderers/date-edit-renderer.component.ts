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
                    (click)="onClick($event)"
                    (keydown)="onInputKeyDown($event)"
                    class="edit-renderer"></ngb-datepicker>
  `,
  styles: [ `

    .edit-renderer, .edit-renderer:focus {
      background-color: white;
    }
    /*.edit-renderer, .edit-renderer:focus {
      overflow-x: hidden;
      border: none;
      outline: none;
      width: -webkit-fill-available;
      height: -webkit-fill-available;
    }*/
  `]
})
export class DateEditRenderer extends CellEditRenderer {

  @ViewChild("datepicker") datepicker: ElementRef;

  ngAfterViewInit() {
    //this.datepicker.nativeElement.focus();
  }

  //NgbDateStruct
  //return date.year + "-" + ((date.month < 10) ? "0" : "") + date.month + "-" + ((date.day < 10) ? "0" : "") + date.day + "T12:00-06:00";
  onClick(event: MouseEvent) {
    if (isDevMode()) {
      console.debug("ChoiceEditRenderer.onClick");
    }

    if (this.value !== this.data.value) {
      let date: string = this.value.year + "-" + ((this.value.month < 10) ? "0" : "") + this.value.month + "-" + ((this.value.day < 10) ? "0" : "") + this.value.day + "T12:00-06:00";
      this.data.value = this.gridService.parseData(this.j, date);
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.data.value);
    }
    event.stopPropagation();
    event.preventDefault();
  }

  onInputKeyDown(event: KeyboardEvent) {
    console.log("TextEditRenderer.onInputKeyDown " + event.keyCode);

    if (event.keyCode === 13) {
      let date: string = this.value.year + "-" + ((this.value.month < 10) ? "0" : "") + this.value.month + "-" + ((this.value.day < 10) ? "0" : "") + this.value.day + "T12:00-06:00";
      this.gridEventService.setSelectedLocation(new Point(-1, -1), null);
      this.data.value = this.gridService.parseData(this.j, date);
      this.gridService.handleValueChange(this.i, this.j, this.data.key, this.data.value);
    }
  }
}
