/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter, HostListener } from "@angular/core";

import { GridDataService } from "./services/grid-data.service";
import { GridEventService } from "./services/grid-event.service";
import { GridConfigService } from "./services/grid-config.service";
import { GridConfiguration } from "./utils/grid-configuration";
import { Point } from "./utils/point";
import { RowGroup } from "./row/row-group";
import { Column } from "./column/column";
import { LabelCell } from "./cell/label-cell.component";
import { PageInfo } from "./utils/page-info";

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
      
      <!-- Column Headers TODO: add filter/sorting templates -->
      <div style="display: inline-block; width: 100%; white-space: nowrap; overflow-x: hidden; margin-bottom: -5px; border: black 1px solid;">
        <div style="vertical-align: top;"
             [style.display]="nFixedColumns > 0 ? 'inline-block' : 'none'"
             [style.width]="nFixedColumns > 0 ? (nFixedColumns * 10) + '%' : '0%'"
             [style.min-width]="fixedMinWidth + 'px'">
            <hci-column-header class="grid-cell-header"
                  *ngFor="let column of columnDefinitions | isFixed:true; let j = index"
                  [column]="column"
                  style="height: 30px; border: black 1px solid; vertical-align: top;"
                  [style.display]="column.visible ? 'inline-block' : 'none'"
                  [style.height]="column.filterType === null ? '30px' : '60px'"
                  [style.width]="column.width + '%'"
                  [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                  [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
            </hci-column-header><br />
          
          <!-- Data Rows -->
          <hci-row-group *ngFor="let row of gridData; let i = index" [i]="i" [fixed]="true"></hci-row-group>
        </div>
        <div style="display: inline-block; overflow-x: scroll; white-space: nowrap; vertical-align: top; margin-left: -4px;"
             class="rightDiv"
             [style.width]="nFixedColumns > 0 ? (100 - (nFixedColumns * 10)) + '%' : '100%'">
            <hci-column-header class="grid-cell-header"
                  *ngFor="let column of columnDefinitions | isFixed:false; let j = index"
                  [column]="column"
                  style="height: 30px; border: black 1px solid; vertical-align: top;"
                  [style.display]="column.visible ? 'inline-block' : 'none'"
                  [style.height]="column.filterType === null ? '30px' : '60px'"
                  [style.width]="column.width + '%'"
                  [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                  [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
            </hci-column-header><br />
          
          <!-- Data Rows -->
          <hci-row-group *ngFor="let row of gridData; let i = index" [i]="i" [fixed]="false"></hci-row-group>
        </div>
      </div>
      
      <div style="width: 100%; height: 30px; border: black 1px solid; text-align: center; padding-top: 3px;">
        <span style="float: left; font-weight: bold;">Showing page {{ pageInfo.page + 1 }} of {{ pageInfo.nPages }}</span>
        <span style="text-align; middle;">
          <span (click)="doPageFirst();" style="padding-left: 15px; padding-right: 15px;"><i class="fa fa-fast-backward"></i></span>
          <span (click)="doPagePrevious();" style="padding-left: 15px; padding-right: 15px;"><i class="fa fa-backward"></i></span>
          <select [ngModel]="pageSize"
                  (ngModelChange)="doPageSize($event)"
                  style="padding-left: 15px; padding-right: 15px;">
            <option *ngFor="let o of pageSizes" [ngValue]="o">{{ o }}</option>
          </select>
          <span (click)="doPageNext();" style="padding-left: 15px; padding-right: 15px;"><i class="fa fa-forward"></i></span>
          <span (click)="doPageLast();" style="padding-left: 15px; padding-right: 15px;"><i class="fa fa-fast-forward"></i></span>
        </span>
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
  @Input() fixedColumns: string[];
  @Input() groupBy: string[];
  @Input() externalFiltering: boolean = false;
  @Input() externalSorting: boolean = false;

  @Output() onExternalFilter: EventEmitter<Object> = new EventEmitter<Object>();

  pageSize: number = 10;
  pageSizes: number[] = [ 10, 25, 50 ];
  gridData: Array<RowGroup> = new Array<RowGroup>();
  nFixedColumns: number = 0;
  nColumns: number = 0;
  fixedMinWidth: number = 0;
  pageInfo: PageInfo;

  constructor(private el: ElementRef, private gridDataService: GridDataService, private gridEventService: GridEventService, private gridConfigService: GridConfigService) {}

  ngOnInit() {
    //console.log("GridComponent.ngOnInit " + this.inputData);

    this.gridDataService.data.subscribe((data: Array<RowGroup>) => {
      console.log("GridComponent GridDataService.data.subscribe");
      //console.log(data);
      this.gridData = data;
    });
    this.gridDataService.pageInfoObserved.subscribe((pageInfo: PageInfo) => {
      this.pageInfo = pageInfo;
    });

    this.initGridConfiguration();
    this.gridDataService.setInputData(this.inputData);

    //console.log(this.gridData);
  }

  doPageFirst() {
    this.gridDataService.setPage(-2);
  }

  doPagePrevious() {
    this.gridDataService.setPage(-1);
  }

  doPageSize(value: number) {
    this.gridDataService.setPageSize(value);
  }

  doPageNext() {
    this.gridDataService.setPage(1);
  }

  doPageLast() {
    this.gridDataService.setPage(2);
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
    if (this.fixedColumns) {
      this.gridConfigService.gridConfiguration.fixedColumns = this.fixedColumns;
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

    if (this.gridConfigService.gridConfiguration.fixedColumns != null) {
      this.nFixedColumns = this.gridConfigService.gridConfiguration.fixedColumns.length;
    }
    this.nColumns = this.gridConfigService.gridConfiguration.columnDefinitions.length;
    this.columnDefinitions = this.gridConfigService.gridConfiguration.columnDefinitions;
    this.gridEventService.setNColumns(this.nColumns);
    this.fixedMinWidth = 0;
    for (var i = 0; i < this.columnDefinitions.length; i++) {
      if (this.columnDefinitions[i].isFixed) {
        this.fixedMinWidth = this.fixedMinWidth + this.columnDefinitions[i].minWidth;
      }
    }
  }

  ngAfterContentInit() {
    //this.gridConfigService.gridConfiguration.setDivWidths(this.el.nativeElement.getElementsByClassName("leftDiv")[0].offsetWidth, this.el.nativeElement.getElementsByClassName("rightDiv")[0].offsetWidth);

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

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    console.log("window.resize");
    //this.gridConfigService.gridConfiguration.setDivWidths(this.el.nativeElement.getElementsByClassName("leftDiv")[0].offsetWidth, this.el.nativeElement.getElementsByClassName("rightDiv")[0].offsetWidth);
  }
}
