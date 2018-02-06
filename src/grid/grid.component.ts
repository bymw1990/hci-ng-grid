/*
 * Copyright (c) 2016 Huntsman Cancer Institute at the University of Utah, Confidential and Proprietary
 */
import {
  AfterViewInit, ComponentFactoryResolver, ChangeDetectorRef, Component, ContentChildren, ElementRef,
  EventEmitter, HostListener, Input,
  OnChanges,
  Output, QueryList, Renderer2, SimpleChange, ViewChild, ViewEncapsulation,
  ViewContainerRef
} from "@angular/core";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

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
import {ColumnDefComponent} from "./column/column-def.component";
import {CellTemplate} from "./cell/cell-template.component";
import {InputCell} from "./cell/input-cell.component";

/**
 * Thoughts..
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
 */
@Component({
  selector: "hci-grid",
  providers: [
    GridService,
    GridEventService,
    GridMessageService],
  template: `
    <div #gridContainer [id]="gridContainer" (click)="onClick($event)" (keydown)="onKeyDown($event)">
      <input #focuser1 id="focuser1" style="position: absolute; left: -1000px;" (focus)="onFocus($event)" />
      <div [style.display]="busy ? 'inherit' : 'none'" class="hci-grid-busy" [style.height.px]="gridContainerHeight">
        <div class="hci-grid-busy-div" [style.transform]="gridContainerHeightCalc">
          <span class="fas fa-sync fa-spin fa-5x fa-fw hci-grid-busy-icon"></span>
        </div>
      </div>
      <textarea #copypastearea style="position: absolute; left: -2000px;"></textarea>
      <div #container></div>
      
      <!-- Title Bar -->
      <div *ngIf="title !== null" class="hci-grid-header">
        <span>{{title}}</span>
      </div>
      
      <!-- Content -->
      <div class="d-flex flex-nowrap" style="width: 100%; white-space: nowrap; border: black 1px solid;">
      
        <div *ngIf="origDataSize === 0" class="d-flex flex-nowrap empty-content">
          <div *ngIf="!busy" class="empty-content-text">No Data</div>
          <div *ngIf="busy" class="empty-content-text">Loading Data...</div>
        </div>
        
        <!-- Left (Fixed) Content -->
        <div [style.flex]="nFixedColumns > 0 ? '1 1 ' + (nFixedColumns * 10) + '%' : '1 1 0%'"
             [style.display]="nFixedColumns == 0 ? 'none' : ''">
          <!-- Left Headers -->
          <div *ngIf="columnHeaders" class="d-flex flex-nowrap">
            <hci-column-header class="hci-grid-column-header hci-grid-row-height"
                               *ngFor="let column of columnDefinitions | isFixed:true; let j = index"
                               [column]="column"
                               [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                               [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
            </hci-column-header>
          </div>
          
          <!-- Left Data Rows  #leftRowContainer -->
          <!--
          <hci-row-group *ngFor="let row of dataSize; let i = index" [i]="i" [fixed]="true"></hci-row-group>
          -->
        </div>
        
        <!-- Right (Main) Content -->
        <div class="rightDiv"
             style="overflow-x: auto;"
             [style.flex]="nFixedColumns > 0 ? '1 1 ' + (100 - nFixedColumns * 10) + '%' : '1 1 100%'">
          <!-- Right Headers -->
          <div #rightRowContainer id="rightRowContainer" class="hci-grid-right-row-container">
          <!--<div id="rightColumnHeader">-->
            <div id="rightColumnHeader"
                 style="position: sticky; float: left; top: 0; z-index: 1; background-color: white;"
                 [style.display]="columnHeaders ? 'table' : 'none'">
              <hci-column-header *ngFor="let column of columnDefinitions; let j = index"
                   [id]="'header-' + j"
                   [column]="column"
                   class="hci-grid-column-header hci-grid-row-height"
                   [class.hci-grid-row-height]="column.filterType === null"
                   [class.hci-grid-row-height-filter]="column.filterType !== null"
                   style="height: 30px; vertical-align: top;"
                   [style.display]="column.visible && column.isFixed == false ? 'inline-block' : 'none'"
                   [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                   [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
              </hci-column-header>
            </div>
            <!--</div>-->
              
              <!-- Right Data Rows -->
            <!--<div #rightRowContainer id="rightRowContainer" class="hci-grid-right-row-container">-->
              <ng-container *ngFor="let rowGroup of dataSize; let i = index">
                <div class="flex-nowrap"
                     style="display: table;"
                     [style.margin-top]="i === 0 && columnHeaders ? '30px' : '0px'">
                     <!--[style.display]="gridData === null || i > gridData.length - 1 ? 'none' : 'flex'">-->
                <ng-container *ngFor="let column of columnDefinitions; let j = index">
                  <div (click)="onClick($event)"
                       [id]="'cell-' + i + '-' + j"
                       class="hci-grid-cell-parent hci-grid-cell hci-grid-row-height"
                       style="border: black 1px solid; flex-wrap: nowrap; height: 30px; vertical-align: top;"
                       [style.display]="column.visible && column.isFixed == false ? 'inline-block' : 'none'"
                       [style.min-width]="column.minWidth ? column.minWidth + 'px' : 'initial'"
                       [style.max-width]="column.maxWidth ? column.maxWidth + 'px' : 'initial'">
                  </div>
                </ng-container>
              </div>
            </ng-container>
          </div>
        </div>
      </div>

      <input #focuser2 id="focuser2" style="position: absolute; left: -1000px;" (focus)="onFocus($event)" />
      
      <!-- Footer -->
      <div *ngIf="pageInfo.pageSize > 0"
           style="width: 100%; border: black 1px solid; padding: 3px;">
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
  styles: [ `
    
    .empty-content {
      height: 150px;
      flex: 1 0 100%;
    }
    
    .empty-content-text {
      align-self: center;
      margin-right: auto;
      margin-left: auto;
      color: #dddddd;
      font-size: 5em;
    }
    
    .hci-grid-header {
      background-color: transparent;
      color: black;
      padding: 10px;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      border: black 1px solid;
      font-weight: bold;
      font-size: large;
    }
    
    .hci-grid-column-header {
      display: flex;
      border: black 1px solid;
      font-weight: bold;
      background-color: transparent;
      color: black;
      vertical-align: top;
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
    
  ` ],
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnChanges, AfterViewInit {

  @ViewChild("container", { read: ViewContainerRef }) container: any;
  @ViewChild("copypastearea") copypastearea: any;
  @ViewChild("gridContainer") gridContainer: ElementRef;
  @ViewChild("focuser1") focuser1: ElementRef;
  @ViewChild("focuser2") focuser2: ElementRef;
  @ViewChild("rightRowContainer") rightRowContainer: ElementRef;

  @Input() inputData: Object[] = null;

  @Input() config: any = {};
  @Input() title: string = null;
  @Input() rowSelect: boolean;
  @Input() cellSelect: boolean;
  @Input() keyNavigation: boolean;
  @Input() nUtilityColumns: number;
  @Input() columnDefinitions: Column[];
  @Input() fixedColumns: string[];
  @Input() groupBy: string[];
  @Input() groupByCollapsed: boolean;
  @Input() externalFiltering: boolean;
  @Input() externalSorting: boolean;
  @Input() externalPaging: boolean;
  @Input() pageSize: number;
  @Input() pageSizes: number[];
  @Input("nVisibleRows") cfgNVisibleRows: number;

  @Input() onAlert: Function;
  @Input() onExternalDataCall: Function;
  @Input() level: string = null;
  @Input() onRowDoubleClick: Function;

  @Output() selectedRows: EventEmitter<any[]> = new EventEmitter<any[]>();

  @ContentChildren(ColumnDefComponent) columnDefComponents: QueryList<ColumnDefComponent>;

  dataSize: Array<Object> = new Array<Object>(0);

  gridData: Array<Row> = new Array<Row>();
  origDataSize: number = 0;
  nFixedColumns: number = 0;
  nColumns: number = 0;
  fixedMinWidth: number = 0;
  pageInfo: PageInfo = new PageInfo();
  initialized: boolean = false;
  columnHeaders: boolean = false;
  busy: boolean = false;
  gridContainerHeight: number = 0;
  gridContainerHeightCalc: SafeStyle = this.domSanitizer.bypassSecurityTrustStyle("'translate(calc(50% - 2.5em), 0px)'");

  columnsChangedSubscription: Subscription;

  private componentRef: CellTemplate = null;
  private cellKeySubscription: Subscription;
  private selectedLocationSubscription: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2, private resolver: ComponentFactoryResolver, private changeDetectorRef: ChangeDetectorRef,
              private domSanitizer: DomSanitizer, private gridService: GridService, private gridEventService: GridEventService,
              private gridMessageService: GridMessageService) {}

  /**
   * Setup listeners and pass inputs to services (particularly the config service).
   */
  ngAfterContentInit() {
    if (this.level) {
      this.gridMessageService.setLevel(this.level);
    }

    this.buildConfig();
    this.gridService.setConfig(this.config);
    this.initGridConfiguration();
    this.updateGridContainerHeight();

    /* Listen to changes in the data.  Updated data when the data service indicates a change. */
    this.gridService.data.subscribe((data: Array<Row>) => {
      console.debug("GridComponent.data.subscribe");
      console.debug(data);
      /*if (this.pageInfo.pageSize < 0) {
        this.dataSize = new Array<number>(data.length);
      }*/
      this.gridData = data;
      this.origDataSize = this.gridService.getOriginalDataSize();
      this.busy = false;
      this.changeDetectorRef.detectChanges();

      //this.updateColumnHeaders();
      this.updateCellSizes();

      let i: number = -1;
      for (let rowGroup of this.dataSize) {
        i = i + 1;
        for (var j = 0; j < this.columnDefinitions.length; j++) {
          let e = document.getElementById("cell-" + i + "-" + j);
          if (e) {
            e.textContent = "";
            this.renderer.removeClass(e, "editable");
          }
        }
      }

      i = -1;
      for (let row of this.gridData) {
        if (row.hasHeader()) {
          i = i + 1;
          let e = document.getElementById("cell-" + i + "-0");
          if (e) {
            e.textContent = "";
            let value = row.getHeader();
            let text = this.renderer.createText(value);
            this.renderer.appendChild(e, text);
          }
          i = i - 1;

          if (row.isExpanded()) {
            i = i + 1;
            let j: number = 0;
            for (let cell of row.cells) {
              if (j === 0) {
                j = j + 1;
                continue;
              }
              let e = document.getElementById("cell-" + i + "-" + j);
              if (e) {
                e.textContent = "";
                let value = this.columnDefinitions[j].formatValue(cell.value);
                let text = this.renderer.createText(value);
                this.renderer.appendChild(e, text);
                this.renderer.addClass(e, "editable");
              }
              j = j + 1;
            }
          }
        } else {
          i = i + 1;

          let j: number = 0;
          for (let cell of row.cells) {
            let e = document.getElementById("cell-" + i + "-" + j);
            if (e) {
              e.textContent = "";
              let value = this.columnDefinitions[j].formatValue(cell.value);
              let text = this.renderer.createText(value);
              this.renderer.appendChild(e, text);
            }
            j = j + 1;
          }
        }
      }
    });

    /* The grid component handles the footer which includes paging.  Listen to changes in the pageInfo and update. */
    this.gridService.pageInfoObserved.subscribe((pageInfo: PageInfo) => {
      this.pageInfo = pageInfo;
      this.updatePageSize();
    });

    /* Listen to changes in Sort/Filter/Page.
     If there is an onExternalDataCall defined, send that info to that provided function. */
    if (this.onExternalDataCall) {
      this.gridService.externalInfoObserved.subscribe((externalInfo: ExternalInfo) => {
        this.updateGridContainerHeight();
        this.busy = true;
        this.onExternalDataCall(externalInfo).then((externalData: ExternalData) => {
          if (externalData.externalInfo === null) {
            this.gridService.pageInfo.setNumPages(1);
          } else {
            this.gridService.pageInfo = externalData.externalInfo.getPage();
          }
          this.gridService.setInputData(externalData.data);
          this.gridService.setInputDataInit();

          this.pageInfo = this.gridService.pageInfo;
          this.updatePageSize();
        });
      });
    }

    if (this.onAlert) {
      this.gridMessageService.messageObservable.subscribe((message: string) => {
        this.onAlert(message);
      });
    }

    this.gridService.getSelectedRowsSubject().subscribe((selectedRows: any[]) => {
      this.selectedRows.emit(selectedRows);
    });

    /* If onRowDoubleClick is provided, then listen and send to function. */
    if (this.onRowDoubleClick) {
      this.gridService.doubleClickObserved.subscribe((row: Row) => {
        let keys: number[] = this.gridService.getKeyColumns();
        if (keys.length === 0) {
          return;
        } else {
          this.onRowDoubleClick(row.cells[keys[0]].value);
        }
      });
    }

    /* Get initial page Info */
    this.pageInfo = this.gridService.pageInfo;

    /* Can't use inputData and onExternalDataCall.  If onExternalDataCall provided, use that, otherwise use inputData. */
    if (this.onExternalDataCall) {
      this.busy = true;
      this.onExternalDataCall(new ExternalInfo(null, null, this.pageInfo)).then((externalData: ExternalData) => {
        this.gridService.pageInfo = externalData.getExternalInfo().getPage();
        this.gridService.setInputData(externalData.getData());
        this.gridService.setInputDataInit();
        this.postInit();
      });
    } else if (this.inputData) {
      if (this.gridService.setInputData(this.inputData)) {
        this.gridService.init();
        this.postInitGridConfiguration();
      }
      this.gridService.setInputDataInit();
      this.postInit();
    } else {
      this.postInit();
    }

    this.columnsChangedSubscription = this.gridService.getColumnsChangedSubject().subscribe((changed: boolean) => {
      if (changed) {
        this.initGridConfiguration();
        this.gridService.setInputDataInit();
        this.postInit();
      }
    });
  }

  ngAfterViewInit() {
    this.pageInfo = this.gridService.pageInfo;
    this.updatePageSize();
    this.updateGridContainerHeight();
    this.changeDetectorRef.markForCheck();

    this.selectedLocationSubscription = this.gridEventService.getSelectedLocationSubject().subscribe((p: Point) => {
      console.debug("GridComponent.selectedLocationSubscription");
      this.container.clear();
      if (p.isNotNegative()) {
        this.selectComponent(p.i, p.j);
        //this.selectedLocationSubscription.unsubscribe();
      }
    });

    this.gridService.getValueSubject().subscribe((location: Point) => {
      let e = document.getElementById("cell-" + location.i + "-" + location.j);
      if (e) {
        e.textContent = "";
        let value = this.columnDefinitions[location.j].formatValue(this.gridService.getCell(location.i, location.j).value);
        let text = this.renderer.createText(value);
        this.renderer.appendChild(e, text);
      }
    });

    this.initialized = true;
    this.updateCellSizes();
  }

  ngOnDestroy() {
    if (this.columnsChangedSubscription) {
      this.columnsChangedSubscription.unsubscribe();
    }
  }

  updateCellSizes() {
    console.debug("updateCellSize: " + this.initialized);
    if (this.initialized) {
      let e = this.gridContainer.nativeElement;
      let width: number = e.offsetWidth;

      for (var j = 0; j < this.columnDefinitions.length; j++) {
        let e = document.getElementById("header-" + j);
        if (e) {
          this.renderer.setStyle(e, "width", Math.floor(width / 100 * this.columnDefinitions[j].width) + "px");
        }
      }

      for (var i = 0; i < this.dataSize.length; i++) {
        for (var j = 0; j < this.columnDefinitions.length; j++) {
          let e = document.getElementById("cell-" + i + "-" + j);
          if (e) {
            this.renderer.setStyle(e, "width", Math.floor(width / 100 * this.columnDefinitions[j].width) + "px");
          }
        }
      }
    }
  }

  updatePageSize() {
    console.debug("updatePageSize: " + this.pageInfo.pageSize);

    if (this.dataSize.length !== this.pageInfo.pageSize && this.pageInfo.pageSize >= 0) {
      this.dataSize = new Array<Object>(this.pageInfo.pageSize);
    } else {
      //this.dataSize = new Array<Object>(0);
    }
  }

  selectComponent(i: number, j: number) {
    console.log("GridComponent.selectComponent: " + i + " " + j);
    let e = document.getElementById("cell-" + i + "-" + j);
    this.createCellComponent(e);
  }

  createCellComponent(cellElement: HTMLElement) {
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

      let factory = null;
      /*if (column.component instanceof Type) {
       var factories = Array.from(this.resolver["_factories"].keys());
       var factoryClass = <Type<any>> factories.find((o: any) => o.name === column.component.constructor.name);
       factory = this.resolver.resolveComponentFactory(factoryClass);
       } else if (column.component instanceof String) {
       var factories = Array.from(this.resolver["_factories"].keys());
       var factoryClass = <Type<any>> factories.find((o: any) => o.name === column.component);
       factory = this.resolver.resolveComponentFactory(factoryClass);
       //this.componentRef.setValues(this.component);
       } else {
       factory = this.resolver.resolveComponentFactory(LabelCell);
       }*/

      factory = this.resolver.resolveComponentFactory(InputCell);
      this.componentRef = this.container.createComponent(factory).instance;
      this.componentRef.setPosition(i, j);
      this.componentRef.setData(this.gridData[i].get(j));
      this.componentRef.setLocation(cellElement);
      /*this.cellKeySubscription = this.componentRef.keyEvent.subscribe((keyCode: number) => {
        console.log("cellKeySubscription: " + keyCode);
        this.gridEventService.arrowFromLocation(i, j, k, keyCode);
      });*/
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.updateGridContainerHeight();
    this.updateCellSizes();
  }

  updateGridContainerHeight() {
    this.gridContainerHeight = Math.max(150, this.gridContainer.nativeElement.offsetHeight);
    this.gridContainerHeightCalc = this.domSanitizer.bypassSecurityTrustStyle("translate(calc(50% - 2.5em), calc(" + (Math.floor(this.gridContainerHeight / 2)) + "px - 2.5em))");

    if (this.config.nVisibleRows) {
      console.debug("postInit.nVisibleRows");

      let height: number = 30;
      let cell = document.getElementById("cell-0-0-0");
      if (cell) {
        height = cell.offsetHeight;
      }
      console.debug(document.getElementById("rightRowContainer"));
      let rows = document.getElementById("rightRowContainer");
      this.renderer.setStyle(rows, "max-height", 30 * this.config.nVisibleRows + "px");
      this.renderer.setStyle(rows, "overflow-y", "auto");
      let header = document.getElementById("rightColumnHeader");
      if (header && rows.scrollHeight > rows.offsetHeight) {
        this.renderer.setStyle(header, "margin-right", "17px");
      } else {
        this.renderer.setStyle(header, "margin-right", "0px");
      }
    }
  }

  postInit() {
    console.debug("postInit");

    this.updateGridContainerHeight();

    this.pageInfo = this.gridService.pageInfo;
    this.updatePageSize();
    this.pageSizes = this.gridService.pageSizes;

    this.gridEventService.setSelectedLocation(null, null);
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if (this.initialized) {
      if (changes["inputData"]) {
        this.gridService.setInputData(this.inputData);
        this.gridService.setInputDataInit();
      } else if (changes["config"]) {
        this.gridService.setConfig(this.config);
      } else {
        this.buildConfig();
        this.gridService.setConfig(this.config);
      }

      this.updateGridContainerHeight();
    }
  }

  buildConfig() {
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
    } else if (this.columnDefComponents !== undefined) {
      this.config.columnDefinitions = Column.getColumns(this.columnDefComponents);
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
      console.debug("Set config.nVisibleRows");
      this.config.nVisibleRows = this.cfgNVisibleRows;
    }
  }

  doPageFirst() {
    this.gridService.setPage(-2);
  }

  doPagePrevious() {
    this.gridService.setPage(-1);
  }

  doPageSize(value: number) {
    this.dataSize = new Array<Object>(value);
    this.gridService.setPageSize(value);
  }

  doPageNext() {
    this.gridService.setPage(1);
  }

  doPageLast() {
    this.gridService.setPage(2);
  }

  initGridConfiguration() {
    this.gridService.pageInfo = this.gridService.pageInfo;
    this.gridService.init();
    this.postInitGridConfiguration();
  }

  postInitGridConfiguration() {
    if (this.gridService.columnDefinitions !== null) {
      this.columnDefinitions = this.gridService.columnDefinitions;

      this.columnHeaders = this.gridService.columnHeaders;

      if (this.gridService.fixedColumns != null) {
        this.nFixedColumns = this.gridService.fixedColumns.length;
      }
      this.nColumns = this.gridService.columnDefinitions.length;
      this.gridEventService.setNColumns(this.nColumns);
      this.fixedMinWidth = 0;
      for (var i = 0; i < this.gridService.columnDefinitions.length; i++) {
        if (this.gridService.columnDefinitions[i].isFixed) {
          this.fixedMinWidth = this.fixedMinWidth + this.gridService.columnDefinitions[i].minWidth;
        }
      }
    }

    this.updatePageSize();
  }

  /*updateColumnHeaders() {
    if (this.initialized) {
      for (var j = 0; j < this.columnDefinitions.length; j++) {
        let e = document.getElementById("header-" + j);
        if (e) {
          e.textContent = "";
          let text = this.renderer.createText(this.columnDefinitions[j].name);
          this.renderer.appendChild(e, text);
        }
      }
    }
  }*/

  public clearSelectedRows() {
    this.gridService.clearSelectedRows();
  }

  public deleteSelectedRows() {
    this.gridService.deleteSelectedRows();
  }

  onClick(event: MouseEvent) {
    console.debug("click");
    console.debug(event.srcElement);

    event.stopPropagation();
    /*console.debug("click");
    console.debug(event);

    this.createCellComponent(<HTMLElement>event.srcElement);*/
    this.gridEventService.setSelectedLocation(Point.getPoint(event.srcElement.id), null);
  }

  onFocus(event: Event) {
    event.stopPropagation();
    let id: string = event.srcElement.id;
    if (id === "focuser2") {
      this.focuser1.nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    console.debug("GridComponent.onKeyDown");

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

  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.container.clear();
    }
  }
}
