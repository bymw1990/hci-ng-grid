/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {
  AfterViewInit, ComponentFactoryResolver, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input,
  isDevMode, OnChanges, Output, Renderer2, SimpleChange, ViewChild, ViewEncapsulation, ViewContainerRef
} from "@angular/core";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";

import {GridService} from "./services/grid.service";
import {GridEventService} from "./services/grid-event.service";
import {GridMessageService} from "./services/grid-message.service";
import {Point} from "./utils/point";
import {Row} from "./row/row";
import {Column} from "./column/column";
import {PageInfo} from "./utils/page-info";
import {ExternalInfo} from "./utils/external-info";
import {ExternalData} from "./utils/external-data";
import {CellEditRenderer} from "./cell/editRenderers/cell-edit-renderer";
import {Cell} from "./cell/cell";
import {CheckRowSelectRenderer} from "./cell/check-row-select-renderer";

/**
 * A robust grid for angular.
 * Features:
 *   Row Grouping
 *   Fixed Columns
 *   Excel like editing
 *   Copy and paste
 *
 * @since 1.0.0
 */
@Component({
  selector: "hci-grid",
  providers: [
    GridService,
    GridEventService,
    GridMessageService
  ],
  template: `
    <div #gridContainer id="gridContainer" [ngClass]="theme" (click)="onClick($event)" (dblclick)="onDblClick($event)" (keydown)="onKeyDown($event)">
      <input #focuser1 id="focuser1" style="position: absolute; left: -1000px;" (focus)="onFocus($event)" />
      <div #busyOverlay class="hci-grid-busy" style="display: none;">
        <div class="hci-grid-busy-div" [style.transform]="gridContainerHeightCalc">
          <span class="fas fa-sync fa-spin fa-5x fa-fw hci-grid-busy-icon"></span>
        </div>
      </div>
      <textarea #copypastearea style="position: absolute; left: -2000px;"></textarea>
      
      <!-- Title Bar -->
      <div *ngIf="title !== null" id="titleBar">
        <span>{{title}}</span>
      </div>
      
      <div #mainContent id="mainContent">
        
        <div *ngIf="gridData.length === 0" class="d-flex flex-nowrap empty-content">
          <div *ngIf="!busy" class="empty-content-text">No Data</div>
          <div *ngIf="busy" class="empty-content-text">Loading Data...</div>
        </div>
        
        <div #headerContent
             id="headerContent"
             [class.hide]="!columnHeaders"
             [style.height.px]="rowHeight">
          <div #leftHeaderView
               id="leftHeaderView"
               [style.height.px]="rowHeight">
            <div id="leftHeaderContainer" *ngIf="columnDefinitions.length > 0">
              <hci-column-header *ngFor="let column of columnDefinitions | isFixed: true | isVisible"
                                 [id]="'header-' + column.id"
                                 [column]="column"
                                 class="hci-grid-header hci-grid-row-height"
                                 [class.hci-grid-row-height]="column.filterType === null"
                                 [class.hci-grid-row-height-filter]="column.filterType !== null"
                                 style="vertical-align: top; display: inline-flex; align-items: center;"
                                 [style.height.px]="rowHeight"
                                 [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                                 [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
              </hci-column-header>
            </div>
          </div>
          <div #rightHeaderView
               id="rightHeaderView"
               [style.height.px]="rowHeight">
            <div id="rightHeaderContainer" *ngIf="columnDefinitions.length > 0">
              <hci-column-header *ngFor="let column of columnDefinitions | isFixed: false | isVisible"
                                 [id]="'header-' + column.id"
                                 [column]="column"
                                 class="hci-grid-header hci-grid-row-height"
                                 [class.hci-grid-row-height]="column.filterType === null"
                                 [class.hci-grid-row-height-filter]="column.filterType !== null"
                                 style="vertical-align: top; display: inline-flex; align-items: center;"
                                 [style.height.px]="rowHeight"
                                 [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                                 [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
              </hci-column-header>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div #gridContent id="gridContent">
          <div #leftView id="leftView">
            <div #leftContainer id="leftContainer" class="hci-grid-left-row-container">
              <div #leftCellEditContainer></div>
            </div>
          </div>

          <!-- Right (Main) Content -->
          <div #rightView id="rightView">
            <div #rightRowContainer id="rightContainer">
              <div #rightCellEditContainer></div>
              <div id="base-row" class="hci-grid-row" style="position: absolute; left: 0px; top: 0px;">
                <div id="base-cell" class="hci-grid-cell" style="position: absolute; left: 0px; top: 0px;"></div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <input #focuser2 id="focuser2" style="position: absolute; left: -1000px;" (focus)="onFocus($event)" />
      
      <!-- Footer -->
      <div *ngIf="pageInfo.pageSize > 0"
           id="gridFooter">
        <div>
          <div style="float: left; font-weight: bold;" *ngIf="pageInfo.numPages > 0">
            Showing page {{pageInfo.page + 1}} of {{pageInfo.numPages}}
          </div>
          <div style="margin-left: auto; margin-right: auto; width: 75%; text-align: center;">
            <span (click)="doPageFirst();" style="padding-left: 15px; padding-right: 15px;"><span class="fas fa-fast-backward"></span></span>
            <span (click)="doPagePrevious();" style="padding-left: 15px; padding-right: 15px;"><span class="fas fa-backward"></span></span>
            <select [ngModel]="pageInfo.pageSize"
                    (ngModelChange)="doPageSize($event)"
                    style="padding-left: 15px; padding-right: 15px;">
              <option *ngFor="let o of pageSizes" [ngValue]="o">{{o}}</option>
            </select>
            <span (click)="doPageNext();" style="padding-left: 15px; padding-right: 15px;"><span class="fas fa-forward"></span></span>
            <span (click)="doPageLast();" style="padding-left: 15px; padding-right: 15px;"><span class="fas fa-fast-forward"></span></span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: [
    "./themes/excel.css",
    "./themes/report.css"
  ],
  styles: [ `

    #gridContainer {
      display: inline-block;
      width: 100%;
    }
    
    #titleBar {
      padding: 10px;
      font-weight: bold;
      font-size: large;
    }

    #mainContent {
      width: 100%;
      height: 0px;
    }
    
    #headerContent {
      position: relative;
      font-weight: bold;
    }
    
    #headerContent.hide {
      display: none;
      height: 0px;
    }
    
    #leftHeaderView {
      position: absolute;
      display: inline-block;
      white-space: nowrap;
      overflow: visible;
    }
    
    #leftHeaderContainer {
      float: left;
      top: 0px;
    }
    
    #rightHeaderView {
      display: inline-block;
      white-space: nowrap;
      margin-left: 0px;
      margin-right: 0px;
      overflow: visible;
      width: 0px;
    }      
    
    #rightHeaderContainer {
      display: inline;
      position: relative;
    }
    
    #gridContent {
      display: inline-block;
      position: absolute;
      margin-top: 0px;
    }
    
    #leftView {
      float: left;
      overflow: hidden;
      height: 250px;
    }
    
    #leftContainer {
      white-space: nowrap;
      top: 0px;
      position: relative;
    }
    
    #rightView {
      position: absolute;
      margin-left: 0px;
      width: 0px;
      overflow-x: auto;
      overflow-y: auto;
      height: 250px;
    }
    
    #rightContainer {
      white-space: nowrap;
    }
    
    #gridFooter {
      width: 100%;
      border-top: none;
      padding: 3px;
    }
    
    .hci-grid-busy {
      z-index: 9999;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      position: absolute;
    }
    
    .hci-grid-busy-div {
      transform-origin: top left;
    }
    
    .hci-grid-busy-icon {
      color: rgba(255, 0, 0, 0.5);
    }

    .row-select > span.selected-span {
      display: none;
    }

    .row-select.selected > span.selected-span {
      display: inherit;
    }
    
    .row-select.selected > span.unselected-span {
      display: none;
    }

    .empty-content {
      position: absolute;
      width: 100%;
      height: -webkit-fill-available;
    }
    
    .empty-content-text {
      margin-left: auto;
      margin-right: auto;
      margin-top: auto;
      margin-bottom: auto;
      font-size: 72px;
      color: lightgrey;
    }

  `],
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnChanges, AfterViewInit {

  @ViewChild("leftCellEditContainer", { read: ViewContainerRef }) leftCellEditContainer: any;
  @ViewChild("rightCellEditContainer", { read: ViewContainerRef }) rightCellEditContainer: any;
  @ViewChild("copypastearea") copypastearea: any;
  @ViewChild("gridContainer") gridContainer: ElementRef;
  @ViewChild("busyOverlay") busyOverlay: ElementRef;
  @ViewChild("focuser1") focuser1: ElementRef;
  @ViewChild("focuser2") focuser2: ElementRef;
  @ViewChild("rightRowContainer") rightRowContainer: ElementRef;

  @Input("data") boundData: Object[] = null;
  @Input("dataCall") onExternalDataCall: Function;

  @Input() config: any = {};
  @Input() title: string = null;
  @Input() theme: string = "excel";
  @Input() rowSelect: boolean;
  @Input() cellSelect: boolean;
  @Input() keyNavigation: boolean;
  @Input() nUtilityColumns: number;
  @Input() columnDefinitions: Column[] = [];
  @Input() fixedColumns: string[];
  @Input() groupBy: string[];
  @Input() groupByCollapsed: boolean;
  @Input() externalFiltering: boolean;
  @Input() externalSorting: boolean;
  @Input() externalPaging: boolean;
  @Input() pageSize: number;
  @Input() pageSizes: number[];
  @Input("nVisibleRows") cfgNVisibleRows: number = 10;

  @Input() rowSelectRenderer: string = "CheckRowSelectRenderer";

  @Input() onRowDoubleClick: Function;

  @Output() warning: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedRows: EventEmitter<any[]> = new EventEmitter<any[]>();

  gridData: Array<Row> = new Array<Row>();
  pageInfo: PageInfo = new PageInfo();
  initialized: boolean = false;
  columnHeaders: boolean = false;
  gridContainerHeight: number = 0;
  gridContainerHeightCalc: SafeStyle = this.domSanitizer.bypassSecurityTrustStyle("'translate(calc(50% - 2.5em), 0px)'");

  rowHeight: number = 30;
  clickTimer: any;
  singleClickCancel: boolean = false;
  busy: boolean = false;
  busySubject: Subject<boolean> = new Subject<boolean>();

  inputDataSubject: Subject<Object[]> = new Subject<Object[]>();

  renderedRows: Array<number> = [];

  columnsChangedSubscription: Subscription;

  private componentRef: CellEditRenderer = null;
  private selectedLocationSubscription: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2, private resolver: ComponentFactoryResolver, private changeDetectorRef: ChangeDetectorRef,
              private domSanitizer: DomSanitizer, private gridService: GridService, private gridEventService: GridEventService,
              private gridMessageService: GridMessageService) {}

  ngOnInit() {
    this.gridMessageService.messageObservable.subscribe((message: string) => {
      this.warning.emit(message);
    });
  }

  /**
   * Setup listeners and pass inputs to services (particularly the config service).
   */
  ngAfterContentInit() {
    this.findBaseRowCell();

    this.buildConfig();
    this.gridService.setConfig(this.config);
    this.initGridConfiguration();
    this.updateGridContainerHeight();

    /* The grid component handles the footer which includes paging.  Listen to changes in the pageInfo and update. */
    this.gridService.pageInfoObserved.subscribe((pageInfo: PageInfo) => {
      this.pageInfo = pageInfo;
      //this.updateRenderSize();
    });

    /* Listen to changes in Sort/Filter/Page.
     If there is an onExternalDataCall defined, send that info to that provided function. */
    if (this.onExternalDataCall) {
      this.gridService.externalInfoObserved.subscribe((externalInfo: ExternalInfo) => {
        this.updateGridContainerHeight();
        this.busySubject.next(true);
        this.onExternalDataCall(externalInfo).then((externalData: ExternalData) => {
          if (externalData.externalInfo === null) {
            this.gridService.pageInfo.setNumPages(1);
          } else {
            this.gridService.pageInfo = externalData.externalInfo.getPage();
          }
          this.gridService.setOriginalData(externalData.data);

          this.pageInfo = this.gridService.pageInfo;
          //this.updateRenderSize();
        });
      });
    }

    this.gridService.getSelectedRowsSubject().subscribe((selectedRows: any[]) => {
      this.selectedRows.emit(selectedRows);
    });

    /* If onRowDoubleClick is provided, then listen and send to function. */
    /*if (this.onRowDoubleClick) {
      this.gridService.doubleClickObserved.subscribe((row: Row) => {
        let keys: number[] = this.gridService.getKeyColumns();
        if (keys.length === 0) {
          return;
        } else {
          this.onRowDoubleClick(row.cells[keys[0]].value);
        }
      });
    }*/

    /* Get initial page Info */
    this.pageInfo = this.gridService.pageInfo;

    /* Can't use boundData and onExternalDataCall.  If onExternalDataCall provided, use that, otherwise use boundData. */
    if (this.onExternalDataCall) {
      this.busySubject.next(true);
      this.onExternalDataCall(new ExternalInfo(null, null, this.pageInfo)).then((externalData: ExternalData) => {
        this.gridService.pageInfo = externalData.getExternalInfo().getPage();
        if (this.gridService.setOriginalData(externalData.getData())) {
          this.initGridConfiguration();
        }
        this.postInit();
      });
    } else if (this.boundData) {
      if (this.gridService.setOriginalData(this.boundData)) {
        this.initGridConfiguration();
      }
      this.postInit();
    } else {
      this.postInit();
    }

    this.columnsChangedSubscription = this.gridService.getColumnsChangedSubject().subscribe((changed: boolean) => {
      if (changed) {
        this.initGridConfiguration();
        this.gridService.initData();
        this.postInit();
      }
    });
  }

  ngAfterViewInit() {
    this.findBaseRowCell();

    this.updateGridSizes();

    this.gridContainer.nativeElement.querySelector("#rightView").addEventListener("scroll", this.onScroll.bind(this), true);

    this.inputDataSubject.subscribe((boundData: Object[]) => {
      if (isDevMode()) {
        console.debug("inputDataSubject.subscribe: " + boundData.length);
      }
      this.busySubject.next(true);
      this.gridService.setOriginalData(this.boundData);
      this.gridService.initData();
      this.busySubject.next(false);
    });

    /* Listen to changes in the data.  Updated data when the data service indicates a change. */
    this.gridService.getViewDataSubject().subscribe((data: Array<Row>) => {
      if (isDevMode()) {
        console.debug("data.subscribe: " + data.length);
      }
      this.setGridData(data);
    });

    this.busySubject.subscribe((busy: boolean) => {
      this.busy = busy;
      if (this.busyOverlay && this.busyOverlay.nativeElement) {
        this.renderer.setStyle(this.busyOverlay.nativeElement, "display", busy ? "block" : "none");
        this.renderer.setStyle(this.busyOverlay.nativeElement, "height", this.gridContainerHeight + "px");
      }
    });

    this.pageInfo = this.gridService.pageInfo;

    this.selectedLocationSubscription = this.gridEventService.getSelectedLocationSubject().subscribe((p: Point) => {
      if (isDevMode()) {
        console.debug("GridComponent.selectedLocationSubscription");
      }
      this.leftCellEditContainer.clear();
      this.rightCellEditContainer.clear();
      this.componentRef = null;
      if (p.isNotNegative()) {
        this.selectComponent(p.i, p.j);
      }
    });

    this.gridService.getValueSubject().subscribe((location: Point) => {
      let e = this.gridContainer.nativeElement.querySelector("#cell-" + location.i + "-" + location.j);
      if (e) {
        e.textContent = "";
        let value = this.columnDefinitions[location.j].formatValue(this.gridService.getCell(location.i, location.j).value);
        let text = this.renderer.createText(value);
        this.renderer.appendChild(e, text);
      }
    });

    let rightView: HTMLElement = this.gridContainer.nativeElement.querySelector("#rightView");
    rightView.addEventListener("scroll", this.onScrollRightView.bind(this), true);

    this.initialized = true;
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if (changes["boundData"]) {
      this.inputDataSubject.next(this.boundData);
    } else if (changes["config"]) {
      this.gridService.setConfig(this.config);
    } else {
      this.buildConfig();
      this.gridService.setConfig(this.config);
    }

    this.updateGridContainerHeight();
  }

  ngOnDestroy() {
    if (this.columnsChangedSubscription) {
      this.columnsChangedSubscription.unsubscribe();
    }
  }

  /**
   * TODO: Allow the implementing application to force the grid to re-draw.
   */
  public refresh() {
    // redraw grid height
    // rerender data
  }

  /**
   * Updates the configuration object based on the @Inputs.  This allows the user to configure the grid based on a
   * combination of config and @Input settings.
   */
  public buildConfig() {
    if (this.rowSelect !== undefined) {
      this.config.rowSelect = this.rowSelect;
    }
    if (this.cellSelect !== undefined) {
      this.config.cellSelect = this.cellSelect;
    }
    if (this.keyNavigation !== undefined) {
      this.config.keyNavigation = this.keyNavigation;
    }
    if (this.nUtilityColumns !== undefined) {
      this.config.nUtilityColumns = this.nUtilityColumns;
    }
    if (this.columnDefinitions !== undefined) {
      this.config.columnDefinitions = this.columnDefinitions;
    }
    if (this.fixedColumns !== undefined) {
      this.config.fixedColumns = this.fixedColumns;
    }
    if (this.groupBy !== undefined) {
      this.config.groupBy = this.groupBy;
    }
    if (this.groupByCollapsed !== undefined) {
      this.config.groupByCollapsed = this.groupByCollapsed;
    }
    if (this.externalFiltering !== undefined) {
      this.config.externalFiltering = this.externalFiltering;
    }
    if (this.externalSorting !== undefined) {
      this.config.externalSorting = this.externalSorting;
    }
    if (this.externalPaging !== undefined) {
      this.config.externalPaging = this.externalPaging;
    }
    if (this.pageSize !== undefined) {
      this.config.pageSize = this.pageSize;
    }
    if (this.pageSizes !== undefined) {
      this.config.pageSizes = this.pageSizes;
    }
    if (this.cfgNVisibleRows !== undefined) {
      this.config.nVisibleRows = this.cfgNVisibleRows;
    }
  }

  public doPageFirst() {
    this.gridService.setPage(-2);
  }

  public doPagePrevious() {
    this.gridService.setPage(-1);
  }

  public doPageSize(value: number) {
    this.gridService.setPageSize(value);
  }

  public doPageNext() {
    this.gridService.setPage(1);
  }

  public doPageLast() {
    this.gridService.setPage(2);
  }

  public clearSelectedRows() {
    this.gridService.clearSelectedRows();
  }

  public deleteSelectedRows() {
    this.gridService.deleteSelectedRows();
  }

  onScroll() {
    if (isDevMode()) {
      console.debug("onScroll");
    }

    if (this.componentRef !== null) {
      this.componentRef.updateLocation();
    }
  }

  onScrollRightView(event: Event) {
    if (isDevMode()) {
      console.debug("onScrollRightView");
    }
    let rightRowContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#rightView");
    let rightHeaderContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#rightHeaderContainer");
    let leftContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#leftContainer");
    this.renderer.setStyle(rightHeaderContainer, "left", "-" + rightRowContainer.scrollLeft + "px");
    this.renderer.setStyle(leftContainer, "top", "-" + rightRowContainer.scrollTop + "px");
    this.updateGridSizes();
    this.renderData();
  }

  onClick(event: MouseEvent) {
    this.clickTimer = 0;
    this.singleClickCancel = false;

    this.clickTimer = setTimeout(() => {
      if (!this.singleClickCancel) {
        if (isDevMode()) {
          console.debug("single click");
        }

        let idElement: HTMLElement = <HTMLElement>event.srcElement;
        while (!idElement.id) {
          idElement = idElement.parentElement;
        }

        if (idElement.id.startsWith("filter-")) {
          //
        } else if (idElement.id === "row-select") {
          event.stopPropagation();

          let parentId: string = idElement.parentElement.id;
          let rowId: number = +parentId.split("-")[1];
          let cellId: number = +parentId.split("-")[2];
          this.gridData[rowId].get(cellId).value = !<boolean>this.gridData[rowId].get(cellId).value;
          this.renderer.removeClass(idElement, "selected");
          if (this.gridData[rowId].get(cellId).value) {
            this.renderer.addClass(idElement, "selected");
          }
        } else {
          event.stopPropagation();

          this.gridEventService.setSelectedLocation(Point.getPoint(idElement.id), null);
        }
      }
    }, 100);
  }

  onDblClick(event: MouseEvent) {
    this.singleClickCancel = true;
    clearTimeout(this.clickTimer);
    if (isDevMode()) {
      console.debug("onDblClick");
    }

    if (this.onRowDoubleClick) {
      let e = event.srcElement;
      while (e.id.indexOf("row-") < 0) {
        e = event.srcElement.parentElement;
      }
      let j: number = +e.id.split("-")[2];
      let keys: number[] = this.gridService.getKeyColumns();
      if (keys.length === 0) {
        return;
      } else {
        this.onRowDoubleClick(this.gridData[j].cells[keys[0]].value);
      }
    }
  }

  onFocus(event: Event) {
    event.stopPropagation();
    let id: string = event.srcElement.id;
    if (id === "focuser2") {
      this.focuser1.nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (isDevMode()) {
      console.debug("GridComponent.onKeyDown");
    }

    if (event.ctrlKey && event.keyCode === 67) {
      /*this.gridMessageService.debug("Copy Event");

      let range: Range = this.gridEventService.currentRange;
      if (range != null && !range.min.equals(range.max)) {
        let copy: string = "";

        for (var i = range.min.i; i <= range.max.i; i++) {
          for (var j = range.min.j; j <= range.max.j; j++) {
            for (var k = range.min.k; k <= range.max.k; k++) {
              copy += this.gridService.getRowGroup(i).get(j).get(k).value;
              if (k < range.max.k) {
                copy += "\t";
              }
            }
            if (i < range.max.i) {
              copy += "\n";
            } else if (i === range.max.i && j < range.max.j) {
              copy += "\n";
            }
          }
        }

        this.copypastearea.nativeElement.value = copy;
        this.copypastearea.nativeElement.select();
        event.stopPropagation();
      }*/
    } else if (event.ctrlKey && event.keyCode === 86) {
      /*this.copypastearea.nativeElement.select();
      let paste: string = this.copypastearea.nativeElement.value;

      this.gridMessageService.debug("Paste Event: " + paste);

      let range: Range = this.gridEventService.currentRange;
      if (range === null) {
        this.gridMessageService.warn("No cell selected to paste");
        return;
      } else if (paste === null || paste === "") {
        this.gridMessageService.warn("No data to paste");
        return;
      }

      let i = range.min.i;
      let j = range.min.j;
      //let k = range.min.k;
      let cols: string[] = null;

      if (paste.endsWith("\n")) {
        paste = paste.substr(0, paste.length - 1);
      }

      let allowPaste: boolean = true;
      let rows: string[] = paste.split("\n");
      for (var ii = 0; ii < rows.length; ii++) {
        cols = rows[ii].split("\t");
        for (var kk = 0; kk < cols.length; kk++) {
          if (this.gridService.getRowGroup(i) == null) {
            allowPaste = false;
            break;
          } else if (this.gridService.getRowGroup(i).get(j) == null) {
            allowPaste = false;
            break;
          } else if (this.gridService.getRowGroup(i).get(j).get(k) == null) {
            allowPaste = false;
            break;
          }
          //k = k + 1;
        }
        if (!allowPaste) {
          break;
        } else if (this.gridService.getRowGroup(i).get(j + 1) != null) {
          j = j + 1;
        } else {
          i = i + 1;
          j = 0;
        }
        //k = range.min.k;
        if (this.gridService.getRowGroup(i) == null && ii !== rows.length - 1) {
          allowPaste = false;
          break;
        }
      }

      i = range.min.i;
      j = range.min.j;
      //k = range.min.k;

      if (allowPaste) {
        for (var ii = 0; ii < rows.length; ii++) {
          cols = rows[ii].split("\t");
          for (var kk = 0; kk < cols.length; kk++) {
            this.gridService.getRowGroup(i).get(j).get(k).value = cols[kk];
            k = k + 1;
          }

          if (this.gridService.getRowGroup(i).get(j + 1) != null) {
            j = j + 1;
          } else {
            i = i + 1;
            j = 0;
          }
          k = range.min.k;
        }

        //this.gridService.cellDataUpdate(new Range(range.min, new Point(i, j, k + cols.length - 1)));
      } else {
        this.gridMessageService.warn("Paste went out of range");
      }*/
    } else if (event.keyCode === 9) {
      event.stopPropagation();
      this.gridEventService.tabFrom(null, null);
    } else if (event.keyCode === 37) {
      event.stopPropagation();
      this.gridEventService.arrowFrom(null, -1, 0, null);
    } else if (event.keyCode === 39) {
      event.stopPropagation();
      this.gridEventService.arrowFrom(null, 1, 0, null);
    } else if (event.keyCode === 38) {
      event.stopPropagation();
      this.gridEventService.arrowFrom(null, 0, -1, null);
    } else if (event.keyCode === 40) {
      event.stopPropagation();
      this.gridEventService.arrowFrom(null, 0, 1, null);
    }
  }

  private findBaseRowCell() {
    this.rowHeight = this.gridContainer.nativeElement.querySelector("#base-row").offsetHeight;
    if (!this.rowHeight || this.rowHeight === 0) {
      this.rowHeight = 30;
    }
  }

  private updateGridSizes() {
    if (isDevMode()) {
      console.debug("updateGridSizes: " + this.initialized);
    }

    let e = this.gridContainer.nativeElement;
    let gridWidth: number = e.offsetWidth;
    let insideGridWidth: number = gridWidth;
    let w: number = 0;

    if (isDevMode()) {
      console.debug("gridWidth: " + gridWidth);
    }
    if (this.gridService.getNVisibleRows() > 0
        && ((this.pageInfo.pageSize > 0 && this.gridService.getNVisibleRows() < this.pageInfo.pageSize)
        || (this.pageInfo.pageSize < 0 && this.gridService.getNVisibleRows() < this.gridData.length))) {
      insideGridWidth = gridWidth - 17;
    }

    let fixedWidth: number = 0;
    let fixedMinWidth: number = 0;
    let nonFixedWidth: number = 0;
    let nonFixedMinWidth: number = 0;

    let exactWidth: number = 0;
    let remainder: number = 0;

    let nAutoWidth: number = 0;
    let availableWidth: number = insideGridWidth;

    if (isDevMode()) {
      console.debug("availableWidth: " + availableWidth);
    }

    for (var j = 0; j < this.gridService.getNVisibleColumns(); j++) {
      this.columnDefinitions[j].renderWidth = 0;
      if (this.columnDefinitions[j].width > 0) {
        this.columnDefinitions[j].renderWidth = Math.max(this.columnDefinitions[j].width, this.columnDefinitions[j].minWidth);
        availableWidth = availableWidth - this.columnDefinitions[j].renderWidth;
      }
    }

    let percentWidth: number = availableWidth;
    if (isDevMode()) {
      console.debug("percentWidth: " + percentWidth);
    }

    for (var j = 0; j < this.gridService.getNVisibleColumns(); j++) {
      if (this.columnDefinitions[j].widthPercent > 0) {
        this.columnDefinitions[j].renderWidth = Math.max(percentWidth * (this.columnDefinitions[j].widthPercent / 100), this.columnDefinitions[j].minWidth);
        availableWidth = availableWidth - this.columnDefinitions[j].renderWidth;
      } else if (this.columnDefinitions[j].width === 0) {
        nAutoWidth = nAutoWidth + 1;
      }
    }

    if (nAutoWidth > 0) {
      if (isDevMode()) {
        console.debug("nAutoWidth: " + nAutoWidth);
      }

      for (var j = 0; j < this.gridService.getNVisibleColumns(); j++) {
        if (this.columnDefinitions[j].renderWidth === 0) {
          this.columnDefinitions[j].renderWidth = Math.max(availableWidth / nAutoWidth, this.columnDefinitions[j].minWidth);
        }
      }
    }

    for (var j = 0; j < this.gridService.getNVisibleColumns(); j++) {
      if (isDevMode()) {
        console.debug("Column: " + this.columnDefinitions[j].field);
      }

      exactWidth = this.columnDefinitions[j].renderWidth;
      if (exactWidth !== Math.floor(exactWidth)) {
        remainder = remainder + exactWidth - Math.floor(exactWidth);
      }
      e = this.gridContainer.nativeElement.querySelector("#header-" + j);
      w = Math.floor(exactWidth);

      if (isDevMode()) {
        console.debug("exactWidth: " + exactWidth + " " + w + " " + remainder);
      }

      if (this.columnDefinitions.length - 1 === j) {
        w = w + remainder;
      }
      if (e) {
        this.columnDefinitions[j].renderWidth = w;
        this.renderer.setStyle(e, "width", w + "px");
        if (this.columnDefinitions[j].isLast) {
          this.renderer.addClass(e, "last");
        }
      }
      if (this.columnDefinitions[j].isFixed) {
        this.columnDefinitions[j].renderLeft = Math.max(fixedWidth, fixedMinWidth);
        fixedWidth = fixedWidth + w;
      } else {
        this.columnDefinitions[j].renderLeft = Math.max(nonFixedWidth, nonFixedMinWidth);
        nonFixedWidth = nonFixedWidth + w;
      }
    }

    e = this.gridContainer.nativeElement.querySelector("#leftView");
    this.renderer.setStyle(e, "width", fixedWidth + "px");

    e = this.gridContainer.nativeElement.querySelector("#leftContainer");
    this.renderer.setStyle(e, "width", fixedWidth + "px");
    this.renderer.setStyle(e, "height", (this.rowHeight * this.gridData.length) + "px");

    e = this.gridContainer.nativeElement.querySelector("#rightContainer");
    this.renderer.setStyle(e, "width", nonFixedWidth + "px");
    this.renderer.setStyle(e, "height", (this.rowHeight * this.gridData.length) + "px");

    e = this.gridContainer.nativeElement.querySelector("#headerContent");
    this.renderer.setStyle(e, "width", gridWidth);
    e = this.gridContainer.nativeElement.querySelector("#rightHeaderView");
    this.renderer.setStyle(e, "margin-left", Math.max(fixedWidth, fixedMinWidth) + "px");
    this.renderer.setStyle(e, "width", (gridWidth - Math.max(fixedWidth, fixedMinWidth)) + "px");

    e = this.gridContainer.nativeElement.querySelector("#rightView");
    this.renderer.setStyle(e, "margin-left", Math.max(fixedWidth, fixedMinWidth) + "px");
    this.renderer.setStyle(e, "width", (gridWidth - Math.max(fixedWidth, fixedMinWidth)) + "px");
    if (this.gridService.getNVisibleRows() === this.pageInfo.pageSize) {
      this.renderer.setStyle(e, "overflow-y", "hidden");
    }
  }

  private setGridData(gridData: Array<Row>) {
    if (isDevMode()) {
      console.debug("setGridData");
      console.debug(gridData);
    }

    this.changeDetectorRef.markForCheck();
    this.gridData = gridData;
    this.renderData();
    this.busySubject.next(false);
  }

  private renderData() {
    if (isDevMode()) {
      console.debug("renderData");
    }
    this.changeDetectorRef.detectChanges();
    this.updateGridContainerHeight();
    this.updateGridSizes();

    let leftContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#leftContainer");
    for (let i of this.renderedRows) {
      try {
        this.renderer.removeChild(leftContainer, leftContainer.querySelector("#row-left-" + i));
      } catch (e) {
        // Ignore
      }
    }
    let rightContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#rightContainer");
    for (let i of this.renderedRows) {
      try {
        this.renderer.removeChild(rightContainer, rightContainer.querySelector("#row-right-" + i));
      } catch (e) {
        // Ignore
      }
    }
    this.renderedRows = [];

    let start: number = Math.floor(this.gridContainer.nativeElement.querySelector("#rightView").scrollTop / this.rowHeight);
    let end: number = this.gridService.getNVisibleRows();
    if (end < 0) {
      end = this.gridData.length;
    } else {
      end = start + end;
    }

    let cell: Cell = null;
    let row: Row = null;
    let lRow: HTMLElement = null;
    let rRow: HTMLElement = null;
    for (var i = start; this.gridData.length; i++) {
      row = this.gridData[i];
      if (!row) {
        return;
      }

      if (this.gridService.getNFixedColumns() > 0) {
        lRow = this.createRow(leftContainer, "left", i);
      }
      rRow = this.createRow(rightContainer, "right", i);
      this.renderedRows.push(i);

      for (var j = 0; j < this.gridService.getNFixedColumns(); j++) {
        cell = this.gridData[i].get(j);
        if (this.columnDefinitions[j].isUtility) {
          this.createCell(lRow, this.columnDefinitions[j], cell, i, j, "");
        } else if (this.columnDefinitions[j].field === "GROUPBY") {
          if (row.hasHeader()) {
            this.createCell(lRow, this.columnDefinitions[j], cell, i, j, row.header);
          } else {
            this.createCell(lRow, this.columnDefinitions[j], cell, i, j, "");
          }
        } else {
          this.createCell(lRow, this.columnDefinitions[j], cell, i, j, cell.value);
        }
      }

      for (var j = this.gridService.getNFixedColumns(); j < this.gridService.getNVisibleColumns(); j++) {
        cell = this.gridData[i].get(j);
        if (this.columnDefinitions[j].isUtility) {
          this.createCell(rRow, this.columnDefinitions[j], cell, i, j, "");
        } else if (this.columnDefinitions[j].field === "GROUPBY") {
          if (row.hasHeader()) {
            this.createCell(rRow, this.columnDefinitions[j], cell, i, j, row.header);
          } else {
            this.createCell(rRow, this.columnDefinitions[j], cell, i, j, "");
          }
        } else {
          this.createCell(rRow, this.columnDefinitions[j], cell, i, j, cell.value);
        }
      }

      if (i === end) {
        break;
      }
    }

    this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.markForCheck();
  }

  private createRow(container: Element, lr: string, i: number): HTMLElement {
    let row = this.renderer.createElement("div");
    this.renderer.setAttribute(row, "id", "row-" + lr + "-" + i);
    this.renderer.addClass(row, "hci-grid-row");
    if (i % 2 === 0) {
      this.renderer.addClass(row, "even");
    } else {
      this.renderer.addClass(row, "odd");
    }
    this.renderer.setStyle(row, "position", "absolute");
    this.renderer.setStyle(row, "display", "inline-block");
    this.renderer.setStyle(row, "top", (i * this.rowHeight) + "px");
    this.renderer.appendChild(container, row);
    return row;
  }

  private createCell(row: HTMLElement, column: Column, cell: Cell, i: number, j: number, value: string) {
    let eCell = this.renderer.createElement("div");
    this.renderer.setAttribute(eCell, "id", "cell-" + i + "-" + j);
    this.renderer.addClass(eCell, "hci-grid-cell");
    if (column.isLast) {
      this.renderer.addClass(eCell, "last");
    }
    this.renderer.setStyle(eCell, "position", "absolute");
    this.renderer.setStyle(eCell, "flex-wrap", "nowrap");
    this.renderer.setStyle(eCell, "height", this.rowHeight + "px");
    this.renderer.setStyle(eCell, "padding-left", "8px");
    this.renderer.setStyle(eCell, "left", column.renderLeft + "px");
    this.renderer.setStyle(eCell, "min-width:", column.minWidth + "px");
    this.renderer.setStyle(eCell, "max-width", column.maxWidth + "px");
    this.renderer.setStyle(eCell, "width", column.renderWidth + "px");

    if (column.field === "ROW_SELECT") {
      this.renderer.appendChild(eCell, new CheckRowSelectRenderer().createCell(this.renderer, column, cell));
    } else {
      this.renderer.appendChild(eCell, column.getViewRenderer().createElement(this.renderer, column, value));
    }
    this.renderer.appendChild(row, eCell);
  }

  private selectComponent(i: number, j: number) {
    if (isDevMode()) {
      console.log("GridComponent.selectComponent: " + i + " " + j);
    }
    let e = this.gridContainer.nativeElement.querySelector("#cell-" + i + "-" + j);
    this.createCellComponent(e);
  }

  private createCellComponent(cellElement: HTMLElement) {
    if (isDevMode()) {
      console.debug("createCellComponent: " + cellElement.id);
    }

    if (cellElement.id) {
      let id: string = cellElement.id;
      let ids = id.split("-");
      let i: number = +ids[1];
      let j: number = +ids[2];

      try {
        this.gridData[i].get(j);
      } catch (e) {
        this.gridEventService.setSelectedLocation(new Point(-1, -1), null);
      }

      let column: Column = this.columnDefinitions[j];

      if (!column.visible && this.gridEventService.getLastDx() === 1) {
        this.gridEventService.repeatLastEvent();
      } else if (!column.visible) {
        this.gridEventService.setSelectedLocation(new Point(-1, -1), null);
      }

      let factory = this.resolver.resolveComponentFactory(column.editRenderer);
      if (column.isFixed) {
        this.componentRef = this.leftCellEditContainer.createComponent(factory).instance;
      } else {
        this.componentRef = this.rightCellEditContainer.createComponent(factory).instance;
      }
      this.componentRef.setColumn(column);
      this.componentRef.setPosition(i, j);
      this.componentRef.setData(this.gridData[i].get(j));
      this.componentRef.setLocation(cellElement);
    }
  }

  @HostListener("window:resize", ["$event"])
  private onResize(event: Event) {
    //this.updateGridContainerHeight();
    this.updateGridSizes();
    this.renderData();
  }

  /**
   * Sets the height of the view containers based on either the rows allowed to render or the data size.
   */
  private updateGridContainerHeight() {
    if (this.gridService.nVisibleRows) {
      if (isDevMode()) {
        console.debug("updateGridContainerHeight.nVisibleRows: " + this.gridService.getNVisibleRows());
      }

      let headerHeight: number = this.gridContainer.nativeElement.querySelector("#headerContent").offsetHeight;
      if (this.gridService.getNVisibleRows() <= 0) {
        let height: number = this.gridData.length * this.rowHeight;
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#mainContent"), "height", (headerHeight + height) + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#leftView"), "height", height + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#rightView"), "height", height + "px");
      } else {
        let height: number = this.gridService.getNVisibleRows() * this.rowHeight;
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#mainContent"), "height", (headerHeight + height) + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#leftView"), "height", height + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#rightView"), "height", height + "px");
      }
    }
  }

  private postInit() {
    if (isDevMode()) {
      console.debug("postInit");
    }

    this.pageInfo = this.gridService.pageInfo;
    this.pageSizes = this.gridService.pageSizes;
    this.updateGridContainerHeight();
    this.updateGridSizes();

    this.gridEventService.setSelectedLocation(null, null);
    this.changeDetectorRef.markForCheck();
  }

  private initGridConfiguration() {
    if (isDevMode()) {
      console.debug("this.initGridConfiguration()");
    }

    this.gridService.pageInfo = this.gridService.pageInfo;
    this.gridService.init();
    this.columnDefinitions = this.gridService.columnDefinitions;
    this.columnHeaders = this.gridService.getColumnHeaders();
  }

  @HostListener("document:click", ["$event"])
  private clickout(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.leftCellEditContainer.clear();
      this.rightCellEditContainer.clear();
      this.componentRef = null;
      this.gridEventService.clearSelectedLocation();
    }
  }
}
