import { NgModule, Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { GridService } from "./grid.service";
import { CellModule } from "./cell/cell.module";
import { IJ } from "./row-column";
import { Column } from "./column";
import { CellComponent } from "./cell/cell.component";
import { DefaultCell } from "./cell/default-cell.component";

/**
 *
 */
@Component({
  selector: "hci-grid",
  styles: [ `
    .grid-header {
      background-color: transparent;
      color: black;
      padding: 10px;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      border: black 1px solid;
      font-weight: bold;
      font-size: large;
    }
    .grid-header-button {
      float: right;
      margin-top: -5px;
    }
    .grid-cell {
      display: inline-block;
      border: black 1px solid;
      height: 40px;
      vertical-align: top;
    }
    .grid-cell-template {
      width: 100%;
      padding: 5px;
      background-color: transparent;
      display: inline-block;
    }
    .grid-cell-edit {
      display: inline-block;
    }
    .grid-cell-header {
      display: inline-block;
      padding: 5px;
      border: black 1px solid;
      font-weight: bold;
      background-color: transparent;
      color: black;
    }
    .grid-cell-header-first {
      border-top-left-radius: 0px;
    }
    .grid-cell-header-last {
      border-top-right-radius: 0px;
    }
    .grid-input {
      width: 100%;
    }
    .grid-cell-fill {
      width: 100%;
      height: 100%;
      background-color: transparent;
    }
  ` ],
  template: `
    <div (keydown)="onKeyDown($event);">
      <div class="grid-header">
        <textarea #copypastearea style="position: absolute; left: -2000px;"></textarea>
        <span (click)="print();">{{ title }}</span></div>
      <div>
        <span class="grid-cell-header"
              *ngFor="let colHeader of columnDefinitions; let j = index"
              [ngStyle]="{ width: (100 / columnDefinitions.length) + '%' }"
              (mousedown)="colHeaderOnMouseDown(j);"
              (mouseup)="colHeaderOnMouseUp(j);">
          {{ colHeader.name }}
        </span>
      </div>
      <div *ngFor="let row of gridData; let i = index">
        <hci-cell *ngFor="let cell of row; let j = index"
              [type]="columnDefinitions[j].template"
              [(value)]="gridData[i][j].value"
              (click)="cellClick($event, i, j)"
              (cellFocused)="cellFocused($event)"
              (onUDLR)="onUDLR($event)"
              [i]="i"
              [j]="j"
              class="grid-cell"
              [ngStyle]="{ 'width': (100 / row.length) + '%', 'background-color': (cell._bgColor != null) ? cell._bgColor : 'transparent' }">
        </hci-cell>
      </div>
    </div>
  `
})
export class GridComponent implements OnInit {

  @ViewChild("copypastearea") copypastearea: any;

  @Input() title: String;
  @Input() inputData: Object[];
  @Input() columnDefinitions: Column[];

  gridData: Array<Array<any>> = new Array<Array<any>>();

  /* Drag and Drop Columns (from Header) */
  jMouseEntered: number;

  private el: HTMLElement;
  private clickData: Object = {
    "i1": 0,
    "j1": 0,
    "i2": 0,
    "j2": 0
  };
  private firstClick: Object = null;
  private secondClick: Object = null;

  private selectColor: String = "#ddffdd";
  private multiSelectColor: String = "#ffffdd";

  constructor(el: ElementRef, private gridService: GridService) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    console.log("GridComponent.ngOnInit " + this.inputData);

    for (var j = 0; j < this.columnDefinitions.length; j++) {
      if (this.columnDefinitions[j].template === null) {
        this.columnDefinitions[j].template = DefaultCell;
      }
    }

    this.createGridData();

    console.log(this.gridData);
  }

  ngAfterContentInit() {
    if (this.inputData.length > 0 && this.columnDefinitions.length > 0) {
      this.gridService.setSelectedLocation(new IJ(0, 0));
    }
  }

  print() {
    console.log("GridComponent.print");

    console.log(this.gridData);
  }

  createGridData() {
    this.gridData = new Array<Array<any>>();
    for (var i = 0; i < this.inputData.length; i++) {
      this.gridData.push(new Array<any>());
      for (var j = 0; j < this.columnDefinitions.length; j++) {
        console.log("createGridData col " + j);
        console.log(this.columnDefinitions[j]);
        this.gridData[i][j] = {"value": 0, "_bgColor": null};
        this.gridData[i][j].value = this.getField(this.inputData[i], this.columnDefinitions[j].field);
        this.gridData[i][j]._bgColor = "transparent";
      }
    }
  }

  getField(row: Object, field: String) {
    console.log("getField of " + field);
    var fields = field.split(".");

    var obj = row[fields[0]];
    for (var i = 1; i < fields.length; i++) {
      obj = obj[fields[i]];
    }
    return obj;
  }

  getCellData(rowIndex: number, field: String, value: any) {
    var fields = field.split(".");

    var obj = this.inputData[rowIndex];
    for (var i = 0; i < fields.length; i++) {
      obj = obj[fields[i]];
    }
    if (obj[fields[fields.length - 1]] !== value) {
      obj[fields[fields.length - 1]] = value;
    }
  }

  cellFocused(o: Object) {
    console.log("cellFocused");
    console.log(o);

    this.cellClick(null, o["i"], o["j"]);
  }

  /* Mouse and Click Events */
  resetColors() {
    for (var i = 0; i < this.gridData.length; i++) {
      for (var j = 0; j < this.gridData[i].length; j++) {
        this.gridData[i][j]._bgColor = "transparent";
      }
    }
  }

  setSelectedColor() {
    var color: String = this.multiSelectColor;

    if (this.clickData["i1"] === this.clickData["i2"] && this.clickData["j1"] === this.clickData["j2"]) {
      color = this.selectColor;
    }

    for (var i = this.clickData["i1"]; i <= this.clickData["i2"]; i++) {
      for (var j = this.clickData["j1"]; j <= this.clickData["j2"]; j++) {
        this.gridData[i][j]._bgColor = color;
      }
    }
  }

  setClickData() {
    if (this.secondClick === null) {
      this.clickData["i1"] = this.firstClick["i"];
      this.clickData["i2"] = this.firstClick["i"];
      this.clickData["j1"] = this.firstClick["j"];
      this.clickData["j2"] = this.firstClick["j"];
    } else {
      this.clickData["i1"] = Math.min(this.firstClick["i"], this.secondClick["i"]);
      this.clickData["i2"] = Math.max(this.firstClick["i"], this.secondClick["i"]);
      this.clickData["j1"] = Math.min(this.firstClick["j"], this.secondClick["j"]);
      this.clickData["j2"] = Math.max(this.firstClick["j"], this.secondClick["j"]);
    }
  }

  cellClick(event: MouseEvent, ii: number, jj: number) {
    console.log("cellClick " + ii + " " + jj);
    this.gridService.setSelectedLocation(new IJ(ii, jj));
    /*var ctrl: Boolean = true;
    if (event === null) {
      ctrl = false;
    } else {
      ctrl = event.ctrlKey;
    }

    if (ctrl && this.firstClick === null) {
      this.firstClick = { "i": ii, "j": jj };
      this.secondClick = null;
      this.resetColors();
      this.setClickData();
      this.setSelectedColor();
    } else if (ctrl) {
      this.secondClick = { "i": ii, "j": jj };
      this.setClickData();
      this.setSelectedColor();
    } else {
      this.firstClick = { "i": ii, "j": jj };
      this.secondClick = null;
      this.resetColors();
      this.setClickData();
      this.setSelectedColor();
    }*/
  }

  /* Key Events */
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode === 67) {
      console.log("Copy Event");

      this.setCopyPaste();

      this.copypastearea.nativeElement.select();
      event.stopPropagation();
    }
  }

  /**
   * Currently, only allow up and down.  Want left/right to go between characters in input (unless check cursor position)
   * { key, i, j }
   * 37 = Left, 38 = Up, 39 = Right, 40 = Down
   *
   * @param o
   */
  onUDLR(o: Object) {
    console.log("GridComponent.onUDLR");
    console.log(o);
    let key: number = o["key"];
    let i: number = o["i"];
    let j: number = o["j"];
    if (key === 37) {
      j = Math.max(0, j - 1);
    } else if (key === 38) {
      i = Math.max(0, i - 1);
    } else if (key === 39) {
      j = j + 1;
    } else if (key === 40) {
      i = i + 1;
    }
    this.gridService.setSelectedLocation(new IJ(i, j));
  }

  setCopyPaste() {
    var copy: String = "";

    for (var i = this.clickData["i1"]; i <= this.clickData["i2"]; i++) {
      for (var j = this.clickData["j1"]; j <= this.clickData["j2"]; j++) {
        copy = copy + this.gridData[i][j].value;
        if (j < this.clickData["j2"]) {
          copy = copy + "\t";
        }
      }
      copy = copy + "\n";
    }
    this.copypastearea.nativeElement.value = copy;
  }

  colHeaderOnMouseDown(jj: number) {
    this.jMouseEntered = jj;
  }

  colHeaderOnMouseUp(jj: number) {
    if (this.jMouseEntered !== jj) {
      var o = this.columnDefinitions.splice(this.jMouseEntered, 1)[0];
      this.columnDefinitions.splice(jj, 0, o);

      this.createGridData();
    }
  }

}

@NgModule({
  imports: [ CommonModule, FormsModule, CellModule ],
  declarations: [ GridComponent, CellComponent ],
  exports: [ GridComponent, CellComponent ],
  providers: [ GridService ]
})
export class GridModule {}
