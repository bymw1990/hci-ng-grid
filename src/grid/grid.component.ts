/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import { ChangeDetectionStrategy, Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter, OnChanges, SimpleChange } from "@angular/core";

import { DragulaService } from "ng2-dragula/ng2-dragula";

import { GridDataService } from "./services/grid-data.service";
import { GridEventService } from "./services/grid-event.service";
import { GridConfigService } from "./services/grid-config.service";
import { GridConfiguration } from "./utils/grid-configuration";
import { Point } from "./utils/point";
import { Row } from "./row/row";
import { RowGroup } from "./row/row-group";
import { Column } from "./column/column";
import { LabelCell } from "./cell/label-cell.component";
import { PageInfo } from "./utils/page-info";
import { ExternalInfo } from "./utils/external-info";
import { ExternalData } from "./utils/external-data";

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
 * Selection:
 *   Add column for multiple row selection
 *
 * Key Nav:
 *   Improve key nav for all cell types.
 *   Handle row grouping
 *   Key nav as config option
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
      <textarea #copypastearea style="position: absolute; left: -2000px;"></textarea>
      
      <!-- Title Bar -->
      <div *ngIf="title !== null" class="grid-header">
        <span>{{ title }}</span>
      </div>
      
      <!-- Content -->
      <div style="display: inline-block; width: 100%; white-space: nowrap; overflow-x: hidden; margin-bottom: -5px; border: black 1px solid;">
      
        <!-- Left (Fixed) Content -->
        <div style="vertical-align: top;"
             [style.display]="nFixedColumns > 0 ? 'inline-block' : 'none'"
             [style.width]="nFixedColumns > 0 ? (nFixedColumns * 10) + '%' : '0%'"
             [style.min-width]="fixedMinWidth + 'px'">
          <!-- Left Headers -->
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
          
          <!-- Left Data Rows -->
          <hci-row-group *ngFor="let row of gridData; let i = index" [i]="i" [fixed]="true"></hci-row-group>
        </div>
        
        <!-- Right (Main) Content -->
        <div style="display: inline-block; overflow-x: scroll; white-space: nowrap; vertical-align: top; margin-left: -4px;"
             class="rightDiv"
             [style.width]="nFixedColumns > 0 ? (100 - (nFixedColumns * 10)) + '%' : '100%'">
          <!-- Right Headers -->
          <hci-column-header class="grid-cell-header"
                             *ngFor="let column of columnDefinitions | isFixed:false | isVisible; let j = index"
                             [column]="column"
                             style="height: 30px; border: black 1px solid; vertical-align: top;"
                             [style.display]="column.visible ? 'inline-block' : 'none'"
                             [style.height]="column.filterType === null ? '30px' : '60px'"
                             [style.width]="column.width + '%'"
                             [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                             [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
          </hci-column-header><br />
          
          <!-- Right Data Rows -->
          <hci-row-group *ngFor="let row of gridData; let i = index" [i]="i" [fixed]="false"></hci-row-group>
        </div>
      </div>
      
      <!-- Footer -->
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnChanges {

  @ViewChild("copypastearea") copypastearea: any;

  @Input() title: string = null;
  @Input() inputData: Object[] = null;

  // Grid Configuration
  @Input() cellSelect: boolean = false;
  @Input() columnDefinitions: Column[];
  @Input() onExternalDataCall: Function;
  @Input() externalFiltering: boolean = false;
  @Input() externalPaging: boolean = false;
  @Input() externalSorting: boolean = false;
  @Input() fixedColumns: string[];
  @Input() gridConfiguration: GridConfiguration;
  @Input() groupBy: string[];
  @Input() onRowDoubleClick: Function;
  @Input() rowSelect: boolean = false;

  pageSize: number = 10;
  pageSizes: number[] = [ 10, 25, 50 ];
  gridData: Array<RowGroup> = new Array<RowGroup>();
  nFixedColumns: number = 0;
  nColumns: number = 0;
  fixedMinWidth: number = 0;
  pageInfo: PageInfo;
  initialized: boolean = false;

  constructor(private el: ElementRef, private gridDataService: GridDataService, private gridEventService: GridEventService, private gridConfigService: GridConfigService, private dragulaService: DragulaService) {}

  /**
   * Setup listeners and pass inputs to services (particularly the config service).
   */
  ngOnInit() {
    this.dragulaService.dropModel.subscribe((value) => {
      this.gridDataService.setInputData(this.inputData);
    });

    /* Listen to changes in the data.  Updated data when the data service indicates a change. */
    this.gridDataService.data.subscribe((data: Array<RowGroup>) => {
      this.gridData = data;
    });

    /* The grid component handles the footer which includes paging.  Listen to changes in the pageInfo and update. */
    this.gridDataService.pageInfoObserved.subscribe((pageInfo: PageInfo) => {
      this.pageInfo = pageInfo;
    });

    /* Listen to changes in Sort/Filter/Page.
    If there is an onExternalDataCall defined, send that info to that provided function. */
    if (this.onExternalDataCall) {
      this.gridDataService.externalInfoObserved.subscribe((externalInfo: ExternalInfo) => {
        let externalData: ExternalData = this.onExternalDataCall(externalInfo);
        console.log("Return externalData");

        if (externalData.externalInfo === null) {
          this.gridDataService.pageInfo.nPages = 1;
        } else {
          this.gridDataService.pageInfo = externalData.externalInfo.page;
        }
        this.gridDataService.setInputData(externalData.data);
      });
    }

    /* If onRowDoubleClick is provided, then listen and send to function. */
    if (this.onRowDoubleClick) {
      this.gridDataService.doubleClickObserved.subscribe((row: Row) => {
        let keys: number[] = this.gridConfigService.gridConfiguration.getKeyColumns();
        if (keys.length === 0) {
          return;
        } else {
          this.onRowDoubleClick(row.cells[keys[0]].value);
        }
      });
    }

    this.initGridConfiguration();

    /* Get initial page Info */
    this.pageInfo = this.gridDataService.pageInfo;

    /* Can't use inputData and onExternalDataCall.  If onExternalDataCall provided, use that, otherwise use inputData. */
    if (this.onExternalDataCall) {
      let externalData: ExternalData = this.onExternalDataCall(new ExternalInfo(null, null, this.pageInfo));
      this.gridDataService.pageInfo = externalData.externalInfo.page;
      this.gridDataService.setInputData(externalData.data);
    } else if (this.inputData) {
      this.gridDataService.setInputData(this.inputData);
    }

    this.initialized = true;
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if (this.initialized && changes["inputData"]) {
      this.gridDataService.setInputData(this.inputData);
    }
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
    if (this.cellSelect) {
      this.gridConfigService.gridConfiguration.cellSelect = this.cellSelect;
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
    if (this.externalPaging) {
      this.gridConfigService.gridConfiguration.externalPaging = this.externalPaging;
    }
    if (this.rowSelect) {
      this.gridConfigService.gridConfiguration.rowSelect = this.rowSelect;
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

  /* Key Events */
  onKeyDown(event: KeyboardEvent) {
    //console.log("GridComponent.onKeyDown");
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

}
