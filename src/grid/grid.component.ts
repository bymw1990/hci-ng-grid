/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter } from "@angular/core";

import { GridDataService } from "./services/grid-data.service";
import { GridEventService } from "./services/grid-event.service";
import { GridConfigService } from "./services/grid-config.service";
import { GridConfiguration } from "./utils/grid-configuration";
import { Point } from "./utils/point";
import { RowGroup } from "./row/row-group";
import { Column } from "./column";
import { LabelCell } from "./cell/label-cell.component";

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
 *   If row groups are hidden/expanded or the filtering/sorting (in the grid data) is different from input data, need
 *   some kind of key definition to set data.
 *
 * Cells:
 *   Select/Dropdown (how to feed dictionary/options to dropdown?)
 *       cell knows its type and can just pull the dropdown config from configservice?
 *
 * Columns:
 *   Fixed columns and the rest horizontally scrollable
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
  providers: [ GridDataService, GridEventService, GridConfigService ],
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
      <!-- Title Bar -->
      <div class="grid-header">
        <textarea #copypastearea style="position: absolute; left: -2000px;"></textarea>
        <span>{{ title }}</span>
      </div>
      
      <!--<div *ngFor="let rowGroup of gridData">
        <div *ngIf="rowGroup.header !== null" >
          <span *ngFor="let cell of rowGroup.header.cells">
            {{ cell.value }}
          </span>
        </div>
        <div *ngFor="let row of rowGroup.rows" >
          <span *ngFor="let cell of row.cells">
            {{ cell.value }}
          </span>
        </div>
      </div>-->
      
      <!-- Column Headers TODO: add filter/sorting templates -->
      <div style="width: 100%; height: 30px; border: black 1px solid;">
        <span class="grid-cell-header"
              *ngFor="let column of columnDefinitions; let j = index"
              style="height: 30px; border: black 1px solid; vertical-align: top;"
              [style.display]="column.visible ? 'inline-block' : 'none'"
              [style.width]="column.width + '%'">
          {{ column.name }}
        </span>
      </div>
      
      <!-- Data Rows -->
      <hci-row *ngFor="let row of gridData; let i = index" [i]="i"></hci-row>
      
      <!-- Footer TODO: actually add functionality -->
      <div style="width: 100%; height: 30px; border: black 1px solid;">
        <span style="padding-right: 100px;">Showing x of N rows</span>
        <span><i class="fa fa-fast-backward"></i></span>
        <span><i class="fa fa-backward"></i></span>
        <span>10</span>
        <span><i class="fa fa-forward"></i></span>
        <span><i class="fa fa-fast-forward"></i></span>
      </div>
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
  @Input() key: string[];
  @Input() groupBy: string[];
  @Input() externalFiltering: boolean = false;
  @Input() externalSorting: boolean = false;

  @Output() onExternalFilter: EventEmitter<Object> = new EventEmitter<Object>();

  gridData: Array<RowGroup> = new Array<RowGroup>();
  nColumns: number;

  constructor(private gridDataService: GridDataService, private gridEventService: GridEventService, private gridConfigService: GridConfigService) {}

  ngOnInit() {
    //console.log("GridComponent.ngOnInit " + this.inputData);

    this.gridDataService.data.subscribe((data: Array<RowGroup>) => {
      //console.log("GridComponent GridDataService.data.subscribe");
      //console.log(data);
      this.gridData = data;
    });

    this.initGridConfiguration();
    this.gridDataService.setInputData(this.inputData);

    //console.log(this.gridData);
  }

  initGridConfiguration() {
    if (this.gridConfiguration) {
      this.gridConfigService.gridConfiguration = this.gridConfiguration;
    }
    if (this.columnDefinitions) {
      for (var k = 0; k < this.columnDefinitions.length; k++) {
        if (this.columnDefinitions[k].template === null) {
          this.columnDefinitions[k].template = LabelCell;
        }
      }
      this.gridConfigService.gridConfiguration.columnDefinitions = this.columnDefinitions;
    } else {
      //console.log("columnDefinitions Required");
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
    this.gridConfigService.gridConfiguration.init();

    this.nColumns = this.gridConfigService.gridConfiguration.columnDefinitions.length;
    this.columnDefinitions = this.gridConfigService.gridConfiguration.columnDefinitions;
    this.gridEventService.setNColumns(this.nColumns);
  }

  ngAfterContentInit() {
    if (this.inputData.length > 0 && this.columnDefinitions.length > 0) {
      this.gridEventService.setSelectedLocation(new Point(0, 0, 0));
    }
  }

  cellFocused(o: Object) {
    //console.log("cellFocused");
    //console.log(o);

    this.cellClick(null, o["i"], o["j"], o["k"]);
  }

  cellClick(event: MouseEvent, ii: number, jj: number, kk: number) {
    //console.log("cellClick " + ii + " " + jj);
    this.gridEventService.setSelectedLocation(new Point(ii, jj, kk));
  }

  /* Key Events */
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode === 67) {
      //console.log("Copy Event");

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
    //console.log("GridComponent.onUDLR");
    //console.log(o);
    let key: number = o["key"];
    let i: number = o["i"];
    let j: number = o["j"];
    let k: number = o["k"];
    if (key === 37) {
      j = Math.max(0, j - 1);
    } else if (key === 38) {
      i = Math.max(0, i - 1);
    } else if (key === 39) {
      j = j + 1;
    } else if (key === 40) {
      i = i + 1;
    }
    this.gridEventService.setSelectedLocation(new Point(i, j, k));
  }

  colHeaderOnClick(event: MouseEvent) {
    //console.log("GridComponent.colHeaderOnClick");
    if (this.gridConfigService.gridConfiguration.externalFiltering) {
      this.onExternalFilter.emit(true);
    }
  }

}
