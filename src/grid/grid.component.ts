import { Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter } from "@angular/core";

import { GridDataService } from "./services/grid-data.service";
import { GridEventService } from "./services/grid-event.service";
import { GridConfigService } from "./services/grid-config.service";
import { GridConfiguration } from "./utils/grid-configuration";
import { Point } from "./utils/point";
import { RowData } from "./row/row-data";
import { Column } from "./column";
import { DefaultCell } from "./cell/default-cell.component";

/**
 * Thoughts...
 * data or click represented by three ints
 * i = rowGroup, j = subRow, k = col
 * if no grouping, then j always 0.
 *
 * group by a, b
 *   A   B
 *           x   y   z
 *           1   2   3
 *
 *   grouped data separated into subRow -1?  click on subrow collapses/expands?  not show grouped keys for rest of rows (0 and 1)?
 *
 * TODO:
 * Header:
 *   Components for rendering different header views.
 *   Label, Filter, Sort, Filter/Sort, Fill
 *
 * Data:
 *   Service for handling/updating data
 *   Group by row
 *
 * Cells:
 *   Select/Dropdown
 *
 * Events:
 *   Update navigation event to handle click event history and ctrl click to support copy/paste groups of cells
 *
 * Validation:
 *   On cell templates or additional value validation thing.  Or custom validation that can be added to cell template for
 *   real time checking.
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
        <span>{{ title }}</span></div>
      <div>
        <span class="grid-cell-header"
              *ngFor="let colHeader of columnDefinitions; let j = index"
              [ngStyle]="{ width: (100 / columnDefinitions.length) + '%' }"
              (click)="colHeaderOnClick($event);"
              (mousedown)="colHeaderOnMouseDown(j);"
              (mouseup)="colHeaderOnMouseUp(j);">
          {{ colHeader.name }}
        </span>
      </div>
      <hci-row *ngFor="let row of gridData; let i = index" [i]="i">
        
      </hci-row>
      <!--<div *ngFor="let row of gridData; let i = index">
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
      </div>-->
    </div>
  `
})
export class GridComponent implements OnInit {

  @ViewChild("copypastearea") copypastearea: any;

  @Input() title: String;
  @Input() inputData: Object[];

  // Grid Configuration
  @Input() gridConfiguration: GridConfiguration;
  @Input() columnDefinitions: Column[];
  @Input() groupBy: string[];
  @Input() externalFiltering: boolean = false;
  @Input() externalSorting: boolean = false;

  @Output() onExternalFilter: EventEmitter<Object> = new EventEmitter<Object>();

  gridData: Array<RowData> = new Array<RowData>();
  nColumns: number;

  /* Drag and Drop Columns (from Header) */
  jMouseEntered: number;

  /*private el: HTMLElement;
  private clickData: Object = {
    "i1": 0,
    "j1": 0,
    "i2": 0,
    "j2": 0
  };
  private firstClick: Object = null;
  private secondClick: Object = null;*/

  constructor(private gridDataService: GridDataService, private gridEventService: GridEventService, private gridConfigService: GridConfigService) {}

  ngOnInit() {
    console.log("GridComponent.ngOnInit " + this.inputData);

    this.gridDataService.data.subscribe((data: Array<RowData>) => {
      console.log("GridComponent GridDataService.data.subscribe");
      console.log(data);
      this.gridData = data;
    });

    this.initGridConfiguration();
    this.gridDataService.setGridData(this.inputData);

    console.log(this.gridData);
  }

  initGridConfiguration() {
    if (this.gridConfiguration) {
      this.gridConfigService.gridConfiguration = this.gridConfiguration;
    }
    if (this.columnDefinitions) {
      for (var k = 0; k < this.columnDefinitions.length; k++) {
        if (this.columnDefinitions[k].template === null) {
          this.columnDefinitions[k].template = DefaultCell;
        }
      }
      this.gridConfigService.gridConfiguration.columnDefinitions = this.columnDefinitions;
    } else {
      console.log("columnDefinitions Required");
    }
    if (this.groupBy) {
      this.gridConfigService.gridConfiguration.groupBy = this.groupBy;
    }
    if (this.externalFiltering) {
      this.gridConfigService.gridConfiguration.externalFiltering = this.externalFiltering;
    }
    if (this.externalSorting) {
      this.gridConfigService.gridConfiguration.externalSorting = this.externalSorting;
    }
    this.nColumns = this.gridConfigService.gridConfiguration.columnDefinitions.length;
    this.gridEventService.setNColumns(this.nColumns);
  }

  ngAfterContentInit() {
    if (this.inputData.length > 0 && this.columnDefinitions.length > 0) {
      this.gridEventService.setSelectedLocation(new Point(0, 0));
    }
  }

  /**
   * InputData is the raw object array passed to this component.  This gets mapped to gridData.
   * We want to do two things, only push the data in column definitions and also flatten the
   * data such that a field in gridData may represent a nested object in inputData.
   * For example, if an array of patientCancerGroups, a field might be "patient.person.firstName".
   * If this field is passed to the external filter/sort, JPA will know what relationships mush be
   * built into the query to handle that field even though the queries entity is PatientCancerGroup.
   */
  /*createGridData() {
    this.gridData = new Array<Array<any>>();
    for (var i = 0; i < this.inputData.length; i++) {
      this.gridData.push(new Array<any>());
      for (var j = 0; j < this.columnDefinitions.length; j++) {
        console.log("createGridData col " + j);
        console.log(this.columnDefinitions[j]);
        this.gridData[i][j] = { "value": 0 };
        this.gridData[i][j].value = this.getField(this.inputData[i], this.columnDefinitions[j].field);
      }
    }
    this.gridEventService.setSize(this.gridData.length, this.columnDefinitions.length);
  }*/

  /*getField(row: Object, field: String) {
    console.log("getField of " + field);
    var fields = field.split(".");

    var obj = row[fields[0]];
    for (var i = 1; i < fields.length; i++) {
      obj = obj[fields[i]];
    }
    return obj;
  }*/

  cellFocused(o: Object) {
    console.log("cellFocused");
    console.log(o);

    this.cellClick(null, o["i"], o["j"]);
  }

  /* Mouse and Click Events */
  /*resetColors() {
    for (var i = 0; i < this.gridData.length; i++) {
      for (var j = 0; j < this.gridData[i].length; j++) {
        this.gridData[i][j]._bgColor = "transparent";
      }
    }
  }*/

  /*setSelectedColor() {
    var color: String = this.multiSelectColor;

    if (this.clickData["i1"] === this.clickData["i2"] && this.clickData["j1"] === this.clickData["j2"]) {
      color = this.selectColor;
    }

    for (var i = this.clickData["i1"]; i <= this.clickData["i2"]; i++) {
      for (var j = this.clickData["j1"]; j <= this.clickData["j2"]; j++) {
        this.gridData[i][j]._bgColor = color;
      }
    }
  }*/

  /*setClickData() {
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
  }*/

  cellClick(event: MouseEvent, ii: number, jj: number) {
    console.log("cellClick " + ii + " " + jj);
    this.gridEventService.setSelectedLocation(new Point(ii, jj));
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

      //this.setCopyPaste();

      //this.copypastearea.nativeElement.select();
      //event.stopPropagation();
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
    this.gridEventService.setSelectedLocation(new Point(i, j));
  }

  /*setCopyPaste() {
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
  }*/

  colHeaderOnMouseDown(jj: number) {
    this.jMouseEntered = jj;
  }

  colHeaderOnMouseUp(jj: number) {
    if (this.jMouseEntered !== jj) {
      var o = this.columnDefinitions.splice(this.jMouseEntered, 1)[0];
      this.columnDefinitions.splice(jj, 0, o);
      //this.createGridData();
    }
  }

  colHeaderOnClick(event: MouseEvent) {
    console.log("GridComponent.colHeaderOnClick");
    if (this.gridConfigService.gridConfiguration.externalFiltering) {
      this.onExternalFilter.emit(true);
      //this.createGridData();
    }
  }

}
