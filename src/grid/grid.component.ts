/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {
  AfterViewInit, ComponentFactoryResolver, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input,
  isDevMode, OnChanges, Output, Renderer2, SimpleChange, ViewChild, ViewContainerRef, Injector
} from "@angular/core";

import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

import {GridService} from "./services/grid.service";
import {GridEventService} from "./services/grid-event.service";
import {GridGlobalService} from "./services/grid-global.service";
import {GridMessageService} from "./services/grid-message.service";
import {Row} from "./row/row";
import {Column} from "./column/column";
import {Cell} from "./cell/cell";
import {CellEditRenderer} from "./cell/editRenderers/cell-edit-renderer";
import {CellPopupRenderer} from "./cell/viewPopupRenderer/cell-popup-renderer";
import {ClickCellEditListener} from "./event/click-cell-edit.listener";
import {EventListener} from "./event/event-listener";
import {RangeSelectListener} from "./event/range-select.listener";
import {ClickRowSelectListener} from "./event/click-row-select.listener";
import {EventListenerArg} from "./event/event-listener-arg.interface";
import {InjectableFactory} from "./utils/injectable.factory";
import {EventMeta} from "./utils/event-meta";
import {RowChange} from "./utils/row-change";
import {PageInfo} from "./utils/page-info";
import {ExternalInfo} from "./utils/external-info";
import {ExternalData} from "./utils/external-data";
import {Point} from "./utils/point";
import {Range} from "./utils/range";

const NO_EVENT: number = -1;
const RESIZE: number = 0;
const SCROLL: number = 1;

/**
 * A robust grid for angular.  The grid is highly configurable to meet a variety of needs.  It may be for
 * purely viewing with many styling options but also can handle many types of event listeners and editing possibilities.
 * In a true edit mode, all cells can be edited as text with key navigation and tabbing to switch between cells.
 *
 * Listeners.  One concept is that throughout most headers, rows and cells, events are allowed to bubble up to the top
 * of the grid.  At this point, an array of listeners (defaut or added by the user) will gobble up the event.  A listener
 * if designed to process a particular event for a particular element can handle that and cancel further propagation.
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
    <iframe #iframeSensor
            class="hci-grid-iframe"
            allowtransparency="true"></iframe>
    <div #gridContainer
         id="grid-container"
         [ngClass]="config.theme"
         (click)="click($event)"
         (mouseover)="mouseOver($event)"
         (mousedown)="mouseDown($event)"
         (mouseup)="mouseUp($event)"
         (mousemove)="mouseDrag($event)"
         (dblclick)="dblClick($event)"
         (keydown)="keyDown($event)">
      
      <input #focuser1 id="focuser1" style="position: absolute; left: -100000px; width: 0px; height: 0px;" (focus)="onFocus($event)" />
      <textarea #copypastearea style="position: absolute; left: -2000px;"></textarea>
      
      <!-- Title Bar -->
      <div *ngIf="config.title || configurable" id="title-bar">
        <div>{{config.title}}</div>
        <ng-container *ngIf="configurable">
          <div class="right" ngbDropdown placement="bottom-right">
            <a id="config-dropdown-toggle" class="dropdown-toggle no-arrow" ngbDropdownToggle>
              <i class="fas fa-cog fa-lg"></i>
            </a>
            <ul ngbDropdownMenu id="config-dropdown-menu" aria-labelledby="config-dropdown-toggle" class="dropdown-menu">
              <hci-grid-config-menu [grid]="this"></hci-grid-config-menu>
            </ul>
          </div>
        </ng-container>
      </div>

      <div #mainContent id="main-content">
        <div #mainContentHeaderContainer></div>
        <div #mainContentPopupContainer></div>

        <!-- Busy spinner for loading data. -->
        <div #busyOverlay class="hci-grid-busy">
          <div class="hci-grid-busy-div">
            <span class="fas fa-sync fa-spin fa-5x fa-fw hci-grid-busy-icon"></span>
          </div>
        </div>

        <!-- Overlay messages for loading content or re-rendering. -->
        <div #emptyContent class="empty-content">
          <!--<div [style.display]="!busy ? 'flex' : 'none'" class="empty-content-text">No Data</div>
          <div [style.display]="busy ? 'flex' : 'none'" class="empty-content-text">Loading Data...</div>-->
        </div>
        
        <!-- Container for the header.  Split in to a left view (for fixed columns) and right view. -->
        <div #headerContent
             id="header-content"
             [class.hide]="!config.columnHeaders"
             [style.height.px]="rowHeight">
          <div #leftHeaderView
               id="left-header-view"
               class="header-view"
               [style.height.px]="rowHeight">
            <div id="left-header-container" *ngIf="columnMap && columnMap.get('LEFT_VISIBLE').length > 0">
              <hci-column-header *ngFor="let column of columnMap.get('LEFT_VISIBLE')"
                                 [id]="'header-' + column.id"
                                 [column]="column"
                                 [container]="headerContainer"
                                 class="hci-grid-header hci-grid-row-height"
                                 [class.hci-grid-row-height]="!column.filterType"
                                 [class.hci-grid-row-height-filter]="column.filterType"
                                 style="vertical-align: top; display: inline-flex; align-items: center;"
                                 [style.height.px]="rowHeight"
                                 [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                                 [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
              </hci-column-header>
            </div>
          </div>
          <div #rightHeaderView
               id="right-header-view"
               class="header-view"
               [style.height.px]="rowHeight">
            <div id="right-header-container" *ngIf="columnMap && columnMap.get('MAIN_VISIBLE').length > 0">
              <hci-column-header *ngFor="let column of columnMap.get('MAIN_VISIBLE')"
                                 [id]="'header-' + column.id"
                                 [column]="column"
                                 [container]="headerContainer"
                                 class="hci-grid-header hci-grid-row-height"
                                 [class.hci-grid-row-height]="!column.filterType"
                                 [class.hci-grid-row-height-filter]="column.filterType"
                                 style="vertical-align: top; display: inline-flex; align-items: center;"
                                 [style.height.px]="rowHeight"
                                 [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                                 [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
              </hci-column-header>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div #gridContent id="grid-content">
          <div #leftView id="left-view" class="cell-view">
            <div #leftContainer id="left-container" class="hci-grid-left-row-container">
              <div #leftCellEditContainer></div>
            </div>
          </div>

          <!-- Right (Main) Content -->
          <div #rightView id="right-view" class="cell-view">
            <div #rightRowContainer id="right-container">
              <div #rightCellEditContainer></div>
              <div id="base-row" class="hci-grid-row" style="position: absolute; left: 0px; top: 0px;">
                <div id="base-cell" class="hci-grid-cell" style="position: absolute; left: 0px; top: 0px;"></div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <input #focuser2 id="focuser2" style="position: absolute; left: -100000px; width: 0px; height: 0px;" (focus)="onFocus($event)" />
      
      <!-- Footer -->
      <div *ngIf="pageInfo.pageSize > 0"
           id="grid-footer"
           (mouseup)="$event.stopPropagation()"
           (mousedown)="$event.stopPropagation()"
           (click)="$event.stopPropagation()">
        <div>
          <div style="float: left; font-weight: bold;" *ngIf="pageInfo.numPages > 0">
            Page {{pageInfo.page + 1}} of {{pageInfo.numPages}}
          </div>
          <div style="margin-left: auto; margin-right: auto; width: 75%; text-align: center;">
            <span (click)="doPageFirst();" style="padding-left: 15px; padding-right: 15px;"><span class="fas fa-fast-backward"></span></span>
            <span (click)="doPagePrevious();" style="padding-left: 15px; padding-right: 15px;"><span class="fas fa-backward"></span></span>
            <select id="pageSelect"
                    [ngModel]="pageInfo.pageSize"
                    (ngModelChange)="doPageSize($event)"
                    style="padding-left: 15px; padding-right: 15px;">
              <option *ngFor="let o of config.pageSizes" [ngValue]="o">{{o}}</option>
            </select>
            <span (click)="doPageNext();" style="padding-left: 15px; padding-right: 15px;"><span class="fas fa-forward"></span></span>
            <span (click)="doPageLast();" style="padding-left: 15px; padding-right: 15px;"><span class="fas fa-fast-forward"></span></span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    require("./themes/excel.css"),
    require("./themes/report.css"),
    `

    :host {
      display: block;
      width: 100%;
    }
    
    .hci-grid-iframe {
      height: 0px;
      width: 100%;
      position: relative;
      z-index: -1;
      border: none;
      background-color: transparent;
    }
    
    #grid-container {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    #title-bar {
      display: inline-flex;
      width: 100%;
    }

    #title-bar .right {
      margin-left: auto;
      margin-right: 0px;
    }

    #title-bar .dropdown-toggle.no-arrow::after {
      display: none;
    }

    #congigDropdownMenu.dropdown-menu {
      padding: 0;
      margin: 0;
      border: none;
      background-color: transparent;
    }
    
    #main-content {
      position: relative;
      width: 100%;
      height: 0px;
    }
    
    #header-content {
      position: relative;
    }
    
    #header-content.hide {
      display: none;
      height: 0px;
    }
    
    #left-header-view {
      position: absolute;
      display: inline-block;
      white-space: nowrap;
      overflow: visible;
    }
    
    #left-header-container {
      float: left;
      top: 0px;
    }
    
    #right-header-view {
      display: inline-block;
      white-space: nowrap;
      margin-left: 0px;
      margin-right: 0px;
      overflow: hidden;
      width: 0px;
    }      
    
    #right-header-container {
      display: inline;
      position: relative;
    }
    
    #grid-content {
      display: inline-block;
      position: absolute;
      margin-top: 0px;
    }
    
    #left-view {
      float: left;
      overflow: hidden;
      height: 250px;
    }
    
    #left-container {
      white-space: nowrap;
      top: 0px;
      position: relative;
    }
    
    #right-view {
      position: absolute;
      margin-left: 0px;
      width: 0px;
      overflow-x: auto;
      overflow-y: hidden;
      height: 250px;
    }
    
    #right-container {
      white-space: nowrap;
    }
    
    #grid-footer {
      width: 100%;
      border-top: none;
      padding: 3px;
    }
    
    #pageSize {
      border: none;
    }
    
    .hci-grid-busy {
      z-index: 9999;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      position: absolute;
      height: 0px;
      display: none;
    }

    .hci-grid-busy.show {
      display: flex;
    }
    
    .hci-grid-busy-div {
      display: block;
      margin-top: auto;
      margin-bottom: auto;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hci-grid-busy-icon {
      color: rgba(255, 0, 0, 0.5);
    }

    .row-select > .row-selected-icon {
      display: none;
      color: green;
    }

    .hci-grid-row.selected .row-select .row-selected-icon {
      display: flex;
    }

    .row-select > .row-unselected-icon {
      display: flex;
      color: rgba(255, 0, 0, 0.2);
    }

    .hci-grid-row.selected .row-select .row-unselected-icon {
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

    `]
})
export class GridComponent implements OnChanges, AfterViewInit {

  @ViewChild("mainContentHeaderContainer", { read: ViewContainerRef }) headerContainer: ViewContainerRef;
  @ViewChild("mainContentPopupContainer", { read: ViewContainerRef }) popupContainer: ViewContainerRef;
  @ViewChild("leftCellEditContainer", { read: ViewContainerRef }) leftCellEditContainer: ViewContainerRef;
  @ViewChild("rightCellEditContainer", { read: ViewContainerRef }) rightCellEditContainer: ViewContainerRef;
  @ViewChild("copypastearea") copypastearea: any;
  @ViewChild("gridContainer") gridContainer: ElementRef;
  @ViewChild("busyOverlay") busyOverlay: ElementRef;
  @ViewChild("emptyContent") emptyContent: ElementRef;
  @ViewChild("focuser1") focuser1: ElementRef;
  @ViewChild("focuser2") focuser2: ElementRef;
  @ViewChild("rightRowContainer") rightRowContainer: ElementRef;
  @ViewChild("iframeSensor") iframeSensor: ElementRef;

  @Input("data") boundData: Object[];
  @Input("dataCall") onExternalDataCall: Function;

  @Input() id: string;
  @Input("config") inputConfig: any = {};
  @Input("linkedGroups") inputLinkedGroups: string[];

  // The following inputs are useful shortcuts for what can be provided via the config input.
  @Input() configurable: boolean = false;
  @Input("title") inputTitle: string;
  @Input("theme") inputTheme: string;
  @Input() rowSelect: boolean;
  @Input() cellSelect: boolean;
  @Input() rangeSelect: boolean;
  @Input() keyNavigation: boolean;
  @Input() nUtilityColumns: number;
  @Input("columnDefinitions") inputColumnDefinitions: Column[];
  @Input() fixedColumns: string[];
  @Input() groupBy: string[];
  @Input() groupByCollapsed: boolean;
  @Input() externalFiltering: boolean;
  @Input() externalSorting: boolean;
  @Input() externalPaging: boolean;
  @Input() pageSize: number;
  @Input("pageSizes") inputPageSizes: number[];
  @Input("nVisibleRows") inputNVisibleRows: number = -1;
  @Input() saveOnDirtyRowChange: boolean = false;
  @Input() eventListeners: EventListenerArg[] = [
    { type: RangeSelectListener },
    { type: ClickRowSelectListener },
    { type: ClickCellEditListener }
  ];

  @Output("onCellSave") onCellSave: EventEmitter<any> = new EventEmitter<any>();
  @Output("onRowSave") onRowSave: EventEmitter<any> = new EventEmitter<any>();
  @Output("onConfigChange") onConfigChange: EventEmitter<any> = new EventEmitter<any>();
  @Output("cellClick") outputCellClick: EventEmitter<any> = new EventEmitter<any>();
  @Output("cellDblClick") outputCellDblClick: EventEmitter<any> = new EventEmitter<any>();
  @Output("rowClick") outputRowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output("rowDblClick") outputRowDblClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() warning: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedRows: EventEmitter<any[]> = new EventEmitter<any[]>();

  config: any = {};
  columnMap: Map<string, Column[]>;
  gridData: Row[] = [];
  pageInfo: PageInfo = new PageInfo();
  initialized: boolean = false;
  gridContainerHeight: number = 0;

  /* Timers and data to determine the difference between single and double clicks. */
  clickTimer: any;
  singleClickCancel: boolean = false;

  /* The height of cell rows which is used to calculate the total grid size. */
  rowHeight: number = 30;

  /* The busy flag controls animations during data load. */
  busy: boolean = false;
  busySubject: Subject<boolean> = new Subject<boolean>();

  boundDataSubject: Subject<Object[]> = new Subject<Object[]>();

  renderedRows: number[] = [];

  columnsChangedSubscription: Subscription;
  doRenderSubscription: Subscription;

  private event: number = NO_EVENT;
  private popupRef: CellPopupRenderer;
  private componentRef: CellEditRenderer;
  private selectedLocationSubscription: Subscription;

  /* Arrays of listeners for different types.  A single instance of a listener can exist on multiple types. */
  private clickListeners: EventListener[] = [];
  private dblClickListeners: EventListener[] = [];
  private mouseDownListeners: EventListener[] = [];
  private mouseDragListeners: EventListener[] = [];
  private mouseUpListeners: EventListener[] = [];
  private mouseOverListeners: EventListener[] = [];

  private iFrameWidth: number[] = [0, 0];

  private updateSelectedRowsTimeout: any;

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private resolver: ComponentFactoryResolver,
              private changeDetectorRef: ChangeDetectorRef,
              private injector: Injector,
              private gridService: GridService,
              private gridEventService: GridEventService,
              private gridMessageService: GridMessageService,
              private gridGlobalService: GridGlobalService) {}

  ngOnInit() {
    this.registerEventListeners();

    this.gridMessageService.messageObservable.subscribe((message: string) => {
      this.warning.emit(message);
    });
  }

  /**
   * Setup listeners and pass inputs to services (particularly the config service).
   * Everything here now knows that the DOM has been created.
   */
  ngAfterViewInit() {
    this.findBaseRowCell();

    this.columnsChangedSubscription = this.gridService.getColumnMapSubject().subscribe((columnMap: Map<string, Column[]>) => {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": getColumnsChangedSubject().subscribe");
      }

      this.columnMap = columnMap;
      this.gridService.initData();
      this.doRender();
    });

    this.gridService.getConfigSubject().subscribe((config: any) => {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": getConfigSubect().subscribe: " + JSON.stringify(config));
      }

      this.config = config;

      this.gridService.pageInfo = this.gridService.pageInfo;
      this.gridService.initData();
      this.doRender();

      // If the config update came externally, don't re-broadcast it.
      if (this.config.external !== undefined && this.config.external) {
        this.config.external = false;
      } else {
        this.onConfigChange.emit(this.config);
      }
    });

    /* The grid component handles the footer which includes paging.  Listen to changes in the pageInfo and update. */
    this.gridService.pageInfoObserved.subscribe((pageInfo: PageInfo) => {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": this.gridService.pageInfoObserved: " + pageInfo.toString());
      }
      this.pageInfo = pageInfo;
    });

    /* When the bound data updates, pass it off to the grid service for processing. */
    this.boundDataSubject.subscribe((boundData: Object[]) => {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": boundDataSubject.subscribe: " + boundData.length);
      }
      this.busySubject.next(true);
      this.gridService.setOriginalData(this.boundData);
      this.gridService.initData();
      this.busySubject.next(false);
    });

    /* Subscribe to busy change.  Update the busy boolean. */
    this.busySubject.subscribe((busy: boolean) => {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": busySubject.subscribe: " + busy);
      }
      this.busy = busy;
      if (this.busyOverlay && this.busyOverlay.nativeElement) {
        if (busy) {
          this.renderer.addClass(this.busyOverlay.nativeElement, "show");
        } else {
          this.renderer.removeClass(this.busyOverlay.nativeElement, "show");
        }
        this.renderer.setStyle(this.emptyContent.nativeElement, "display", !busy && (!this.gridData || this.gridData.length === 0) ? "flex" : "none");
      }
    });

    /* Listen to changes in Sort/Filter/Page.
     If there is an onExternalDataCall defined, send that info to that provided function. */
    if (this.onExternalDataCall) {
      this.gridService.externalInfoObserved.subscribe((externalInfo: ExternalInfo) => {
        this.updateGridContainerHeight();
        this.busySubject.next(true);
        this.onExternalDataCall(externalInfo).then((externalData: ExternalData) => {
          if (!externalData.externalInfo) {
            this.gridService.pageInfo.setNumPages(1);
          } else {
            this.gridService.pageInfo = externalData.externalInfo.getPage();
          }
          this.gridService.setOriginalData(externalData.data);

          this.pageInfo = this.gridService.pageInfo;
          this.busySubject.next(false);
        });
      });
    }

    this.gridService.getSelectedRowsSubject().subscribe((selectedRows: any[]) => {
      this.updateSelectedRows(selectedRows);

      this.selectedRows.emit(selectedRows);
    });

    /* Get initial page Info */
    this.pageInfo = this.gridService.pageInfo;

    /* Can't use boundData and onExternalDataCall.  If onExternalDataCall provided, use that, otherwise use boundData. */
    if (this.onExternalDataCall) {
      this.gridService.externalInfoObserved.next(new ExternalInfo(undefined, undefined, this.pageInfo));
    } else if (this.boundData) {
      this.gridService.setOriginalData(this.boundData);
    }

    this.pageInfo = this.gridService.pageInfo;
    this.gridEventService.setSelectedLocation(undefined, undefined);

    this.buildConfigFromInput();
    this.gridService.updateConfig(this.inputConfig);

    this.gridService.setGridElement(this.gridContainer.nativeElement);

    (<HTMLIFrameElement>this.iframeSensor.nativeElement).contentWindow.addEventListener("resize", () => {
      this.event = RESIZE;

      let iw: number = this.iframeSensor.nativeElement.offsetWidth;

      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": iFrame Resize: " + this.iFrameWidth + ", " + iw);
      }

      if (iw !== this.iFrameWidth[0] || Math.abs(this.iFrameWidth[1] - iw) > 2) {
        this.doRender();
      }
      if (iw !== this.iFrameWidth[1]) {
        this.iFrameWidth[0] = this.iFrameWidth[1];
        this.iFrameWidth[1] = iw;
      }
    });

    this.findBaseRowCell();

    this.gridContainer.nativeElement.querySelector("#right-view").addEventListener("scroll", this.onScroll.bind(this), true);

    /* Listen to changes in the data.  Updated data when the data service indicates a change. */
    this.gridService.getViewDataSubject().subscribe((data: Row[]) => {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": data.subscribe: " + data.length);
      }
      this.setGridData(data);
    });

    /* Update the pageInfo from the proper one in the gridService. */
    this.pageInfo = this.gridService.pageInfo;

    this.selectedLocationSubscription = this.gridEventService.getSelectedLocationSubject().subscribe((p: Point) => {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": GridComponent.selectedLocationSubscription");
      }
      this.popupContainer.clear();
      this.leftCellEditContainer.clear();
      this.rightCellEditContainer.clear();
      this.componentRef = undefined;

      if (p.isNotNegative()) {
        this.selectComponent(p.i, p.j);
      } else {
        this.clearSelectedComponents();
      }
    });

    this.gridEventService.getUnselectSubject().subscribe((p: Point) => {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": GridComponent.unselectSubjectSubscription");
      }
      this.popupContainer.clear();
      this.leftCellEditContainer.clear();
      this.rightCellEditContainer.clear();
      this.componentRef = undefined;
      this.focuser1.nativeElement.focus();
    });

    this.gridEventService.getSelectedRange().subscribe((range: Range) => {
      this.updateSelectedCells(range);
    });

    this.gridService.getValueSubject().subscribe((location: Point) => {
      this.renderCellsAndData();
    });

    this.gridService.getDataChangeSubject().subscribe((dataChange: any) => {
      this.onCellSave.emit(dataChange);
    });

    this.gridService.getDirtyCellsSubject().subscribe((dirtyCells: Point[]) => {
      this.renderDirtyCells(dirtyCells);
    });

    this.gridService.getRowChangedSubject().subscribe((rowChange: RowChange) => {
      if (this.gridService.getRow(rowChange.oldRowNum).isDirty() && this.saveOnDirtyRowChange) {
        this.onRowSave.emit({
          key: this.gridService.getRow(rowChange.oldRowNum).key,
          rowNum: rowChange.oldRowNum,
          row: this.gridService.getOriginalRow(this.gridService.getRow(rowChange.oldRowNum).rowNum)
        });
      }
    });

    let rightView: HTMLElement = this.gridContainer.nativeElement.querySelector("#right-view");
    rightView.addEventListener("scroll", this.onScrollRightView.bind(this), true);

    this.initialized = true;
  }

  /**
   * Listen for changes which is either data or configuration.  If configuration, pass the new config to the gridService
   * for updating.  Any changes, particularly to columns, will be notified to the grid through a subscription.
   *
   * @param {{[p: string]: SimpleChange}} changes
   */
  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": ngOnChanges");
      console.debug(changes);
    }

    if (changes["config"]) {
      // Flag this config as originating externally.  Don't re-broadcast.
      this.inputConfig.external = true;
      this.gridService.updateConfig(this.inputConfig);
    }
    if (changes["boundData"]) {
      this.boundDataSubject.next(this.boundData);
    }

    for (let change in changes) {
      if (change !== "config" && change !== "boundData") {
        // Flag this config as originating externally.  Don't re-broadcast.
        this.inputConfig.external = true;
        this.buildConfigFromInput();
        this.gridService.updateConfig(this.inputConfig);
        break;
      }
    }
  }

  ngOnDestroy() {
    if (this.columnsChangedSubscription) {
      this.columnsChangedSubscription.unsubscribe();
    }
    if (this.doRenderSubscription) {
      this.doRenderSubscription.unsubscribe();
    }
  }

  /**
   * Create instances of the event listeners and place them in the appropriate event type arrays.
   */
  public registerEventListeners() {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": registerEventListeners");
    }

    for (let eventListener of this.eventListeners) {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": registering: " + eventListener.type.name);
      }

      let instance: EventListener = new InjectableFactory<EventListener>(eventListener.type, this.injector).getInstance();
      instance.setGrid(this);
      if (eventListener.config) {
        instance.setConfig(eventListener.config);
      } else {
        instance.setConfig({});
      }

      if ("click" in instance) {
        this.clickListeners.push(instance);
      }
      if ("dblclick" in instance) {
        this.dblClickListeners.push(instance);
      }
      if ("mouseDown" in instance) {
        this.mouseDownListeners.push(instance);
      }
      if ("mouseDrag" in instance) {
        this.mouseDragListeners.push(instance);
      }
      if ("mouseUp" in instance) {
        this.mouseUpListeners.push(instance);
      }
      if ("mouseOver" in instance) {
        this.mouseOverListeners.push(instance);
      }
    }
  }

  public addClickListener(clickListener: EventListener) {
    this.clickListeners.push(clickListener);
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
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": clearSelectedRows");
    }

    let rows: HTMLElement[] = this.gridContainer.nativeElement.querySelectorAll(".hci-grid-row");

    if (rows) {
      for (let row of rows) {
        this.renderer.removeClass(row, "selected");
      }
    }
  }

  public deleteSelectedRows() {
    this.gridService.deleteSelectedRows();
  }

  getGridService(): GridService {
    return this.gridService;
  }

  getGridEventService(): GridEventService {
    return this.gridEventService;
  }

  /**
   * Public facing function for triggering render.  Note, if you have a hidden parent, not only do you need to call this
   * to re-render, but you might need to include a slight delay.
   *
   * @param {number} delay (Optional) In ms, the delay or interval delay until trying to render.
   * @param {string} id (Optional) Id of a dom parent, loops until the display is not "none".
   */
  doRender(delay?: number, id?: string) {
    if (this.doRenderSubscription) {
      this.doRenderSubscription.unsubscribe();
    }

    let el: HTMLElement;
    if (id) {
      el = this.el.nativeElement.closest("#" + id);
    }

    if (delay && el) {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": doRender: delay && el: " + el.style.display);
      }
      this.doRenderSubscription = Observable.interval(delay)
          .takeWhile((i: any) => {
            return el.style.display === "none" && i < 10;
          })
          .subscribe(
            (value) => {},
            (error) => {},
            () => {
              this.renderCellsAndData();
            }
          );
    } else if (delay) {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": doRender: delay");
      }
      this.doRenderSubscription = Observable.interval(delay)
          .take(1)
          .subscribe(i => {
            this.renderCellsAndData();
          });
    } else {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": doRender: none");
      }
      this.renderCellsAndData();
    }
  }

  /**
   * The bound scroll listener for the #right-view container.
   */
  onScroll() {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": onScroll");
    }

    if (this.componentRef) {
      this.componentRef.updateLocation();
    }
  }

  onScrollRightView(event: Event) {
    this.event = SCROLL;

    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": onScrollRightView");
    }
    let rightRowContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#right-view");
    let rightHeaderContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#right-header-container");
    let leftContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#left-container");
    this.renderer.setStyle(rightHeaderContainer, "left", "-" + rightRowContainer.scrollLeft + "px");
    this.renderer.setStyle(leftContainer, "top", "-" + rightRowContainer.scrollTop + "px");
    this.renderCellsAndData();

    this.event = NO_EVENT;
  }

  /**
   * Handled for mouseDown event.
   *
   * @param {MouseEvent} event
   */
  mouseDown(event: MouseEvent) {
    if (!event || !event.target) {
      return;
    }

    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": mouseDown " + (<HTMLElement>event.target).id);
    }

    for (let mouseDownListener of this.mouseDownListeners) {
      if (mouseDownListener["mouseDown"](event)) {
        break;
      }
    }
  }

  /**
   * Handled for mouseOver event.
   *
   * @param {MouseEvent} event
   */
  mouseOver(event: MouseEvent) {
    if (!event || !event.target) {
      return;
    }

    for (let mouseOverListener of this.mouseOverListeners) {
      if (mouseOverListener["mouseOver"](event)) {
        break;
      }
    }
  }

  /**
   * Handled for mouseUp event.
   *
   * @param {MouseEvent} event
   */
  mouseUp(event: MouseEvent) {
    if (!event || !event.target) {
      return;
    }

    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": mouseUp " + (<HTMLElement>event.target).id);
    }

    for (let mouseUpListener of this.mouseUpListeners) {
      if (mouseUpListener["mouseUp"](event)) {
        break;
      }
    }
  }

  /**
   * Handled for mouseDrag event.
   *
   * @param {MouseEvent} event
   */
  mouseDrag(event: MouseEvent) {
    if (!event || !event.target) {
      return;
    }

    for (let mouseDragListener of this.mouseDragListeners) {
      if (mouseDragListener["mouseDrag"](event)) {
        break;
      }
    }
  }

  /**
   * Handled for click event.
   *
   * @param {MouseEvent} event
   */
  click(event: MouseEvent) {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": click");
    }

    if (!event || !event.target) {
      return;
    }

    this.clickTimer = 0;
    this.singleClickCancel = false;

    this.clickTimer = setTimeout(() => {
      if (!this.singleClickCancel) {
        if (isDevMode()) {
          console.debug("hci-grid: " + this.id + ": single click");
        }
        for (let clickListener of this.clickListeners) {
          if (clickListener["click"](event)) {
            break;
          }
        }
      }
    }, 100);
  }

  /**
   * Handled for dblClick event.
   *
   * @param {MouseEvent} event
   */
  dblClick(event: MouseEvent) {
    this.singleClickCancel = true;
    clearTimeout(this.clickTimer);
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": onDblClick");
    }

    for (let dblClickListener of this.dblClickListeners) {
      if (dblClickListener["dblclick"](event)) {
        break;
      }
    }
  }

  /**
   * Called when either the first or second focus listener is called.  The second focus listener is after all other
   * grid inputs, so if that is focused, it focuses the first focus listener.  The idea being that when you are focused
   * on this grid, you stay focused until you register an event outside.  This is key to enabling key navigation across
   * cells.
   *
   * @param {Event} event
   */
  onFocus(event: Event) {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": onFocus: " + (<HTMLElement>event.target).id);
    }

    event.stopPropagation();
    let id: string = (<HTMLElement>event.target).id;
    if (id === "focuser2") {
      this.focuser1.nativeElement.focus();
    }
  }

  /**
   * Handled for keyDown event.
   *
   * @param {MouseEvent} event
   */
  keyDown(event: KeyboardEvent) {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": GridComponent.onKeyDown");
    }

    if (event.ctrlKey && event.keyCode === 67) {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": Copy Event");
      }

      let range: Range = this.gridEventService.getCurrentRange();
      if (range && !range.min.equals(range.max)) {
        let copy: string = "";

        for (var i = range.min.i; i <= range.max.i; i++) {
          for (var j = range.min.j; j <= range.max.j; j++) {
            copy += this.gridService.getRow(i).get(j).value;
            if (j < range.max.j) {
              copy += "\t";
            }
          }

          if (i < range.max.i) {
            copy += "\n";
          } else if (i === range.max.i && j < range.max.j) {
            copy += "\n";
          }
        }

        this.copypastearea.nativeElement.value = copy;
        this.copypastearea.nativeElement.select();
        event.stopPropagation();
      }
    } else if (event.ctrlKey && event.keyCode === 86) {
      this.copypastearea.nativeElement.select();
      let paste: string = this.copypastearea.nativeElement.value;

      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": Paste Event: " + paste);
      }

      let range: Range = this.gridEventService.getCurrentRange();
      let p: Point = this.gridEventService.getSelectedLocation();
      if (!range) {
        if (!p) {
          this.gridMessageService.warn("No selected cell or range to paste");
          return;
        }
      } else if (!paste || paste === "") {
        this.gridMessageService.warn("No data to paste");
        return;
      }

      if (paste.endsWith("\n")) {
        paste = paste.substr(0, paste.length - 1);
      }

      let cols: string[] = undefined;
      let rows: string[] = paste.split("\n");

      if (!range) {
        range = new Range(p, new Point(p.i + rows.length - 1, p.j + rows[0].split("\t").length - 1));
      }
      let i = range.min.i;
      let j = range.min.j;

      let allowPaste: boolean = true;
      for (var ii = 0; ii < rows.length; ii++) {
        cols = rows[ii].split("\t");
        for (var jj = 0; jj < cols.length; jj++) {
          if (!this.gridService.getRow(i)) {
            allowPaste = false;
            break;
          } else if (!this.gridService.getRow(i).get(j)) {
            allowPaste = false;
            break;
          }
          j = j + 1;
        }
        if (!allowPaste) {
          break;
        }

        i = i + 1;
        j = range.min.j;
      }

      i = range.min.i;
      j = range.min.j;

      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": allowPaste: " + allowPaste);
      }
      if (allowPaste) {
        for (var ii = 0; ii < rows.length; ii++) {
          cols = rows[ii].split("\t");
          for (var jj = 0; jj < cols.length; jj++) {
            this.gridService.getRow(i).get(j).value = cols[jj];
            j = j + 1;
          }

          i = i + 1;
          j = range.min.j;
        }

        this.renderCellsAndData();
      } else {
        this.gridMessageService.warn("Paste went out of range");
      }
    } else if (event.keyCode === 9) {
      event.preventDefault();
      event.stopPropagation();
      this.gridEventService.tabFrom(undefined, undefined);
    } else if (event.keyCode === 37) {
      event.stopPropagation();
      this.gridEventService.arrowFrom(undefined, -1, 0, undefined);
    } else if (event.keyCode === 39) {
      event.stopPropagation();
      this.gridEventService.arrowFrom(undefined, 1, 0, undefined);
    } else if (event.keyCode === 38) {
      event.stopPropagation();
      this.gridEventService.arrowFrom(undefined, 0, -1, undefined);
    } else if (event.keyCode === 40) {
      event.stopPropagation();
      this.gridEventService.arrowFrom(undefined, 0, 1, undefined);
    } else if (event.keyCode === 27) {
      event.stopPropagation();
      this.gridEventService.setSelectedLocation(new Point(-1, -1), new EventMeta(event.altKey, event.ctrlKey, event.shiftKey));
    }
  }

  /**
   * Inject a popup over the cell.
   *
   * @param {Point} location The cell location to perform popup on.
   */
  createPopup(location: Point) {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": createPopup at " + location.toString());
    }

    let column: Column = this.columnMap.get("ALL")[location.j];
    if (!column.popupRenderer) {
      return;
    }
    if (this.popupRef && this.popupRef.i === location.i && this.popupRef.j === location.j) {
      return;
    }

    this.popupContainer.clear();
    let factory = this.resolver.resolveComponentFactory(column.popupRenderer);
    this.popupRef = this.popupContainer.createComponent(factory).instance;
    this.popupRef.setPosition(location);
    this.popupRef.setLocation(this.gridContainer.nativeElement.querySelector("#cell-" + location.i + "-" + location.j));
  }

  /**
   * Removes old selectors and re-adds classes based on the selected rows.
   *
   * It appears that the renderer is asynchronous, so clearing the selected rows by fetching .hci-grid-row takes
   * longer than getting the row to be selected with #row-right-0.  So the rows were being cleared of selected after
   * they were being selected.
   * Solution: Use a timeout with a little delay.
   * TODO: More processing, but don't clear out the rows that you know are to be selected.  This is better than timeout delay.
   *
   * @param {any[]} selectedRows
   */
  updateSelectedRows(selectedRows: any[]) {
    if (isDevMode()) {
      console.info("hci-grid: " + this.id + ": updateSelectedRows: " + JSON.stringify(selectedRows));
    }

    this.clearSelectedRows();

    if (this.updateSelectedRowsTimeout) {
      clearTimeout(this.updateSelectedRowsTimeout);
    }

    this.updateSelectedRowsTimeout = setTimeout(() => {
      for (let key of selectedRows) {
        let i: number = this.gridService.getRowIndexFromKey(key);

        let e: HTMLElement = this.gridContainer.nativeElement.querySelector("#row-left-" + i);
        if (e) {
          this.renderer.addClass(e, "selected");
        }
        e = this.gridContainer.nativeElement.querySelector("#row-right-" + i);
        if (e) {
          this.renderer.addClass(e, "selected");
        }
      }
    }, 10);
  }

  /**
   * Clears the cell at the i and j position of its ng-dirty selector.  This is intended to be called after the onCellSave
   * output.  Once an external post is made, this function can be called to confirm that the data is saved and is no
   * longer dirty.
   *
   * @param {number} i
   * @param {number} j
   */
  clearDirtyCell(i: number, j: number) {
    this.gridService.clearDirtyCell(i, j);
  }

  /**
   * Updates the configuration object based on the @Inputs.  This allows the user to configure the grid based on a
   * combination of config and @Input settings.
   */
  private buildConfigFromInput() {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": buildConfigFromInput");
    }

    if (this.id !== undefined) {
      this.inputConfig.id = this.id;
    }
    if (this.inputTitle !== undefined) {
      this.inputConfig.title = this.inputTitle;
    }
    if (this.inputLinkedGroups !== undefined) {
      this.inputConfig.linkedGroups = this.inputLinkedGroups;
    }
    if (this.rowSelect !== undefined) {
      this.inputConfig.rowSelect = this.rowSelect;
    }
    if (this.keyNavigation !== undefined) {
      this.inputConfig.keyNavigation = this.keyNavigation;
    }
    if (this.nUtilityColumns !== undefined) {
      this.inputConfig.nUtilityColumns = this.nUtilityColumns;
    }
    if (this.inputColumnDefinitions !== undefined) {
      this.inputConfig.columnDefinitions = this.inputColumnDefinitions;
    }
    if (this.fixedColumns !== undefined) {
      this.inputConfig.fixedColumns = this.fixedColumns;
    }
    if (this.groupBy !== undefined) {
      this.inputConfig.groupBy = this.groupBy;
    }
    if (this.groupByCollapsed !== undefined) {
      this.inputConfig.groupByCollapsed = this.groupByCollapsed;
    }
    if (this.externalFiltering !== undefined) {
      this.inputConfig.externalFiltering = this.externalFiltering;
    }
    if (this.externalSorting !== undefined) {
      this.inputConfig.externalSorting = this.externalSorting;
    }
    if (this.externalPaging !== undefined) {
      this.inputConfig.externalPaging = this.externalPaging;
    }
    if (this.pageSize !== undefined) {
      this.inputConfig.pageSize = this.pageSize;
    }
    if (this.inputPageSizes !== undefined) {
      this.inputConfig.pageSizes = this.inputPageSizes;
    }
    if (this.inputNVisibleRows !== undefined) {
      this.inputConfig.nVisibleRows = this.inputNVisibleRows;
    }
    if (this.inputTheme !== undefined) {
      this.inputConfig.theme = this.inputTheme;
    }

    if (this.inputConfig.id === undefined && this.id === undefined) {
      this.id = this.gridService.id;
      this.inputConfig.id = this.gridService.id;
    }
  }

  private findBaseRowCell() {
    this.rowHeight = this.gridContainer.nativeElement.querySelector("#base-row").offsetHeight;
    if (!this.rowHeight || this.rowHeight === 0) {
      this.rowHeight = 30;
    }
  }

  /**
   * Calculate the sizes of the containers and column header sizes.
   */
  private updateGridContainerAndColumnSizes() {
    this.gridService.setNVisibleRows();
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": updateGridContainerAndColumnSizes: " + this.gridService.getNVisibleRows() + " " + this.pageInfo.pageSize);
    }

    let e = this.gridContainer.nativeElement;
    //let gridWidth: number = e.offsetWidth;
    let gridWidth: number =  this.el.nativeElement.parentElement.offsetWidth;

    this.renderer.setStyle(this.gridContainer.nativeElement, "width", gridWidth + "px");
    let insideGridWidth: number = gridWidth;
    let w: number = 0;

    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": gridWidth: " + gridWidth);
    }
    if (this.gridService.getNVisibleRows() > 0
        && ((this.pageInfo.pageSize > 0 && this.gridService.getNVisibleRows() < this.pageInfo.pageSize)
        || (this.pageInfo.pageSize < 0 && this.gridService.getNVisibleRows() < this.gridData.length))) {
      insideGridWidth = gridWidth - 17;
    }

    this.renderer.setStyle(this.gridContainer.nativeElement.querySelector(".hci-grid-busy"), "width", gridWidth + "px");

    let fixedWidth: number = 0;
    let fixedMinWidth: number = 0;
    let nonFixedWidth: number = 0;
    let nonFixedMinWidth: number = 0;

    let exactWidth: number = 0;
    let remainder: number = 0;

    let nAutoWidth: number = 0;
    let availableWidth: number = insideGridWidth;

    if (isDevMode()) {
      if (!this.columnMap) {
        console.debug("hci-grid: " + this.id + ": columnMap is undefined");
      } else {
        console.debug("hci-grid: " + this.id + ": visible columnMap: " + this.columnMap.get("VISIBLE").length);
      }
    }

    if (this.columnMap) {
      for (let column of this.columnMap.get("VISIBLE")) {
        column.renderWidth = 0;
        if (column.width > 0) {
          column.renderWidth = Math.max(column.width, column.minWidth);
          availableWidth = availableWidth - column.renderWidth;
        }
      }

      let percentWidth: number = availableWidth;
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": percentWidth: " + percentWidth);
      }

      for (let column of this.columnMap.get("VISIBLE")) {
        if (column.widthPercent > 0) {
          column.renderWidth = Math.max(percentWidth * (column.widthPercent / 100), column.minWidth);
          availableWidth = availableWidth - column.renderWidth;
        } else if (column.width === 0) {
          nAutoWidth = nAutoWidth + 1;
        }
      }

      if (nAutoWidth > 0) {
        if (isDevMode()) {
          console.debug("hci-grid: " + this.id + ": nAutoWidth: " + nAutoWidth);
        }

        for (let column of this.columnMap.get("VISIBLE")) {
          if (column.renderWidth === 0) {
            column.renderWidth = Math.max(availableWidth / nAutoWidth, column.minWidth);
          }
        }
      }

      for (let column of this.columnMap.get("VISIBLE")) {
        exactWidth = column.renderWidth;
        if (exactWidth !== Math.floor(exactWidth)) {
          remainder = remainder + exactWidth - Math.floor(exactWidth);
        }
        e = this.gridContainer.nativeElement.querySelector("#header-" + column.id);
        w = Math.floor(exactWidth);

        if (this.columnMap.get("VISIBLE")[this.columnMap.get("VISIBLE").length - 1].field === column.field) {
          w = w + remainder;
        }
        if (e) {
          column.renderWidth = w;
          this.renderer.setStyle(e, "width", w + "px");
          if (column.isLast) {
            this.renderer.addClass(e, "last");
          }
        }
        if (column.isFixed) {
          column.renderLeft = Math.max(fixedWidth, fixedMinWidth);
          fixedWidth = fixedWidth + w;
        } else {
          column.renderLeft = Math.max(nonFixedWidth, nonFixedMinWidth);
          nonFixedWidth = nonFixedWidth + w;
        }
      }
    }

    e = this.gridContainer.nativeElement.querySelector("#left-view");
    this.renderer.setStyle(e, "width", fixedWidth + "px");

    e = this.gridContainer.nativeElement.querySelector("#left-container");
    this.renderer.setStyle(e, "width", fixedWidth + "px");
    this.renderer.setStyle(e, "height", (this.rowHeight * this.gridData.length) + "px");

    e = this.gridContainer.nativeElement.querySelector("#right-container");
    this.renderer.setStyle(e, "width", nonFixedWidth + "px");
    this.renderer.setStyle(e, "height", (this.rowHeight * this.gridData.length) + "px");

    e = this.gridContainer.nativeElement.querySelector("#header-content");
    this.renderer.setStyle(e, "width", gridWidth);
    e = this.gridContainer.nativeElement.querySelector("#right-header-view");
    this.renderer.setStyle(e, "margin-left", Math.max(fixedWidth, fixedMinWidth) + "px");
    this.renderer.setStyle(e, "width", (gridWidth - Math.max(fixedWidth, fixedMinWidth)) + "px");

    e = this.gridContainer.nativeElement.querySelector("#right-view");
    this.renderer.setStyle(e, "margin-left", Math.max(fixedWidth, fixedMinWidth) + "px");
    this.renderer.setStyle(e, "width", (gridWidth - Math.max(fixedWidth, fixedMinWidth)) + "px");
    if (this.gridService.getNVisibleRows() === this.pageInfo.pageSize) {
      this.renderer.setStyle(e, "overflow-y", "hidden");
    } else {
      this.renderer.setStyle(e, "overflow-y", "auto");
    }
  }

  private setGridData(gridData: Row[]) {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": setGridData");
      console.debug(gridData);
    }

    this.gridData = gridData;
    this.renderCellsAndData();
  }

  /**
   * Removed currently rendered rows.  Then render cells and inject html from the view renderers in to each cell.
   */
  private renderCellsAndData(scroll?: boolean) {
    if (isDevMode()) {
      if (this.columnMap) {
        console.debug("hci-grid: " + this.id + ": renderCellsAndData: columnMap.length: " + this.columnMap.get("ALL").length + " gridData.length: " + this.gridData.length);
      } else {
        console.debug("hci-grid: " + this.id + ": renderCellsAndData: columnMap is undefined: gridData.length: " + this.gridData.length);
      }
      if (scroll) {
        console.debug("hci-grid: " + this.id + ": renderCellsAndData: scroll: " + scroll);
      }
    }
    this.changeDetectorRef.detectChanges();
    this.updateGridContainerHeight();
    this.updateGridContainerAndColumnSizes();

    let leftContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#left-container");
    for (let i of this.renderedRows) {
      try {
        for (let row of leftContainer.querySelectorAll("#row-left-" + i)) {
          this.renderer.removeChild(leftContainer, row);
        }
      } catch (e) {
        // Ignore
      }
    }
    let rightContainer: HTMLElement = this.gridContainer.nativeElement.querySelector("#right-container");
    for (let i of this.renderedRows) {
      try {
        for (let row of rightContainer.querySelectorAll("#row-right-" + i)) {
          this.renderer.removeChild(rightContainer, row);
        }
      } catch (e) {
        // Ignore
      }
    }
    this.renderedRows = [];

    let start: number = Math.floor(this.gridContainer.nativeElement.querySelector("#right-view").scrollTop / this.rowHeight);
    let end: number = this.gridService.getNVisibleRows();
    if (end < 0) {
      end = this.gridData.length;
    } else {
      end = start + end;
    }

    let cell: Cell = undefined;
    let row: Row = undefined;
    let lRow: HTMLElement = undefined;
    let rRow: HTMLElement = undefined;
    for (var i = start; this.gridData.length; i++) {
      row = this.gridData[i];
      if (!row) {
        break;
      }
      row.rowNum = i;

      if (this.gridService.getNFixedColumns() > 0) {
        lRow = this.createRow(leftContainer, "left", i);
      }
      rRow = this.createRow(rightContainer, "right", i);
      this.renderedRows.push(i);

      for (let column of this.columnMap.get("LEFT_VISIBLE")) {
        cell = this.gridData[i].get(column.id);
        if (column.isUtility) {
          this.createCell(lRow, column, cell, i, column.id, "");
        } else if (column.field === "GROUPBY") {
          if (row.hasHeader()) {
            this.createCell(lRow, column, cell, i, column.id, row.header);
          } else {
            this.createCell(lRow, column, cell, i, column.id, "");
          }
        } else {
          this.createCell(lRow, column, cell, i, column.id, cell.value);
        }
      }

      for (let column of this.columnMap.get("MAIN_VISIBLE")) {
        cell = this.gridData[i].get(column.id);
        if (column.isUtility) {
          this.createCell(rRow, column, cell, i, column.id, "");
        } else if (column.field === "GROUPBY") {
          if (row.hasHeader()) {
            this.createCell(rRow, column, cell, i, column.id, row.header);
          } else {
            this.createCell(rRow, column, cell, i, column.id, "");
          }
        } else {
          this.createCell(rRow, column, cell, i, column.id, cell.value);
        }
      }

      if (i === end) {
        break;
      }
    }

    // This method wipes out all cells and re-draws.  That means that the following cell meta data must be re-processed.
    if (this.event === RESIZE || this.event === SCROLL) {
      this.updateSelectedRows(this.gridService.getSelectedRows());
    }

    //this.renderDirtyCells(this.gridService.getDirtyCells());
  }

  /**
   * Clear all ng-dirty selectors and re-populate based on known dirty cells.
   *
   * @param {Point[]} dirtyCells
   */
  private renderDirtyCells(dirtyCells: Point[]) {
    let els: HTMLElement[] = this.gridContainer.nativeElement.querySelectorAll(".ng-dirty");
    for (let el of els) {
      this.renderer.removeClass(el, "ng-dirty");
    }

    for (let cell of dirtyCells) {
      let el: HTMLElement = this.gridContainer.nativeElement.querySelector("#cell-" + cell.i + "-" + cell.j);
      this.renderer.addClass(el, "ng-dirty");
    }
  }

  /**
   * Creates a div that is a row which is a container for cells.  The id is formatted such as row-right-0.
   *
   * @param {Element} container The grid container, either left or right.
   * @param {string} lr Either left or right which is used to build the id.
   * @param {number} i The row number.
   * @returns {HTMLElement} The created dom element.
   */
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
    this.renderer.setStyle(row, "height", this.rowHeight + "px");
    this.renderer.setStyle(row, "width", (container.clientWidth - 2) + "px");
    this.renderer.appendChild(container, row);
    return row;
  }

  /**
   * Create the cell element.  This creates a holder div which then appends the result of the cell view renderer.
   *
   * @param {HTMLElement} row The parent row element.
   * @param {Column} column The column element.
   * @param {Cell} cell The data for the cell.
   * @param {number} i The row number.
   * @param {number} j The cell number.
   * @param {string} value The original value to display after formatting.
   */
  private createCell(row: HTMLElement, column: Column, cell: Cell, i: number, j: number, value: string) {
    let eCell = this.renderer.createElement("div");
    this.renderer.setAttribute(eCell, "id", "cell-" + i + "-" + j);
    this.renderer.addClass(eCell, "hci-grid-cell");
    if (column.isLast) {
      this.renderer.addClass(eCell, "last");
    }
    if (cell.dirty) {
      this.renderer.addClass(eCell, "ng-dirty");
    }
    this.renderer.setStyle(eCell, "position", "absolute");
    this.renderer.setStyle(eCell, "display", "flex");
    this.renderer.setStyle(eCell, "flex-wrap", "nowrap");
    this.renderer.setStyle(eCell, "height", this.rowHeight + "px");
    this.renderer.setStyle(eCell, "left", column.renderLeft + "px");
    this.renderer.setStyle(eCell, "min-width:", column.minWidth + "px");
    this.renderer.setStyle(eCell, "max-width", column.maxWidth + "px");
    this.renderer.setStyle(eCell, "width", column.renderWidth + "px");

    this.renderer.appendChild(eCell, column.getViewRenderer().createElement(this.renderer, column, value, i, j));
    this.renderer.appendChild(row, eCell);
  }

  /**
   * Select a cell based on the row and column then call a cell edit renderer.
   *
   * @param {number} i The row number.
   * @param {number} j The column number.
   */
  private selectComponent(i: number, j: number) {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": selectComponent: " + i + " " + j);
    }
    let e = this.gridContainer.nativeElement.querySelector("#cell-" + i + "-" + j);

    this.clearSelectedComponents();
    this.renderer.addClass(e, "selected");
    this.createCellComponent(e);
  }

  /**
   * Remove the selected class from all selected cells.
   */
  private clearSelectedComponents() {
    let els: HTMLElement[] = this.gridContainer.nativeElement.querySelector("#grid-content").querySelectorAll(".selected");
    for (let el of els) {
      this.renderer.removeClass(el, "selected");
    }
  }

  /**
   * Inject a cell edit renderer at a cell when that cell is selected.
   *
   * @param {HTMLElement} cellElement The cell dom element.
   */
  private createCellComponent(cellElement: HTMLElement) {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": createCellComponent: " + cellElement.id);
    }
    this.popupContainer.clear();
    this.leftCellEditContainer.clear();
    this.rightCellEditContainer.clear();

    if (cellElement.id) {
      let id: string = cellElement.id;
      let ids = id.split("-");
      let i: number = +ids[1];
      let j: number = +ids[2];

      try {
        this.gridData[i].get(j);
      } catch (e) {
        this.gridEventService.setSelectedLocation(new Point(-1, -1), undefined);
      }

      let column: Column = this.columnMap.get("VISIBLE")[j];

      if (!column.visible && this.gridEventService.getLastDx() === 1) {
        this.gridEventService.repeatLastEvent();
      } else if (!column.visible) {
        this.gridEventService.setSelectedLocation(new Point(-1, -1), undefined);
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
      this.componentRef.init();
    }
  }

  /**
   * Sets the height of the view containers based on either the rows allowed to render or the data size.
   */
  private updateGridContainerHeight() {
    if (this.gridService.nVisibleRows) {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": updateGridContainerHeight.nVisibleRows: " + this.gridService.getNVisibleRows());
      }

      let headerHeight: number = this.gridContainer.nativeElement.querySelector("#header-content").offsetHeight;
      if (this.gridService.getNVisibleRows() <= 0) {
        let height: number = Math.max(100, this.gridData.length * this.rowHeight);
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#main-content"), "height", (headerHeight + height) + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#left-view"), "height", height + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#right-view"), "height", height + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector(".hci-grid-busy"), "height", (headerHeight + height) + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector(".empty-content"), "height", (headerHeight + height) + "px");
      } else {
        let height: number = Math.max(100, this.gridService.getNVisibleRows() * this.rowHeight);
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#main-content"), "height", (headerHeight + height) + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#left-view"), "height", height + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector("#right-view"), "height", height + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector(".hci-grid-busy"), "height", (headerHeight + height) + "px");
        this.renderer.setStyle(this.gridContainer.nativeElement.querySelector(".empty-content"), "height", (headerHeight + height) + "px");
      }
    }
  }

  /**
   * When a range of cells is selected, de-select everything, then select the range.
   *
   * @param {Range} range The min and max cell location that represents the selection.
   */
  private updateSelectedCells(range: Range) {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": updateSelectedCells: " + ((range) ? range.toString() : "undefined"));
    }

    let es: HTMLElement[] = this.gridContainer.nativeElement.querySelectorAll(".hci-grid-cell");

    if (es) {
      for (let e of es) {
        this.renderer.removeClass(e, "selected");
        this.renderer.removeClass(e, "left");
        this.renderer.removeClass(e, "right");
        this.renderer.removeClass(e, "top");
        this.renderer.removeClass(e, "bottom");
      }
      if (range) {
        for (var i = range.min.i; i <= range.max.i; i++) {
          for (var j = range.min.j; j <= range.max.j; j++) {
            let e: HTMLElement = this.gridContainer.nativeElement.querySelector("#cell-" + i + "-" + j);
            this.renderer.addClass(e, "selected");
            if (i === range.min.i) {
              this.renderer.addClass(e, "top");
            }
            if (i === range.max.i) {
              this.renderer.addClass(e, "bottom");
            }
            if (j === range.min.j) {
              this.renderer.addClass(e, "left");
            }
            if (j === range.max.j) {
              this.renderer.addClass(e, "right");
            }
          }
        }
      }
    }
  }

  /**
   * TODO: Re-enable.  We want to clear editing and popupes, not row selection.
   *
   * If an event occurs out of the grid, then de-select everything.
   *
   * @param event The window event.
   */
  @HostListener("document:click", ["$event"])
  private documentClickEvent(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.popupContainer.clear();
      this.leftCellEditContainer.clear();
      this.rightCellEditContainer.clear();
      this.componentRef = undefined;
    }
  }
}
