import {Injectable, isDevMode} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {Subject} from "rxjs/Rx";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {GridGlobalService} from "./grid-global.service";
import {Cell} from "../cell/cell";
import {Row} from "../row/row";
import {Column} from "../column/column";
import {Range} from "../utils/range";
import {SortInfo} from "../utils/sort-info";
import {PageInfo} from "../utils/page-info";
import {Point} from "../utils/point";
import {FilterInfo} from "../utils/filter-info";
import {ExternalInfo} from "../utils/external-info";
import {RowChange} from "../utils/row-change";

/**
 * The service for handling configuration and data binding/parsing.
 */
@Injectable()
export class GridService {

  static defaultConfig: any = {
    theme: "spreadsheet",
    columnHeaders: true,
    groupByCollapsed: true,
    externalFiltering: false,
    externalSorting: false,
    externalPaging: false,
    pageSizes: [10, 25, 50],
    nVisibleRows: -1,
    busyTemplate: undefined
  };

  config: any = {};
  configSubject: BehaviorSubject<any> = new BehaviorSubject<any>(GridService.defaultConfig);

  linkedGroups: string[];

  id: string;
  columnHeaders: boolean;
  columns: Column[];
  fixedColumns: string[];
  groupBy: string[];
  groupByCollapsed: boolean;
  externalFiltering: boolean;
  externalSorting: boolean;
  externalPaging: boolean;
  pageSizes: number[];
  nVisibleRows: number;

  originalData: Object[];
  preparedData: Row[];

  viewData: Row[] = [];
  viewDataSubject: BehaviorSubject<Row[]> = new BehaviorSubject<Row[]>([]);

  filterInfo: FilterInfo[] = [];

  sortInfo: SortInfo = new SortInfo();
  sortInfoObserved = new Subject<SortInfo>();

  pageInfo: PageInfo = new PageInfo();
  pageInfoObserved = new Subject<PageInfo>();

  externalInfoObserved = new Subject<ExternalInfo>();
  doubleClickObserved = new Subject<Object>();
  cellDataUpdateObserved = new Subject<Range>();

  gridElement: HTMLElement;

  private selectedRowColumn: number = 0;
  private columnMapSubject: BehaviorSubject<Map<string, Column[]>> = new BehaviorSubject<Map<string, Column[]>>(undefined);
  private filterMap: Map<string, FilterInfo[]> = new Map<string, FilterInfo[]>();
  private filterMapSubject: BehaviorSubject<Map<string, FilterInfo[]>> = new BehaviorSubject<Map<string, FilterInfo[]>>(this.filterMap);
  private configured: boolean = false;
  private nUtilityColumns: number = 0;
  private nFixedColumns: number = 0;
  private nNonFixedColumns: number = 0;
  private nVisibleColumns: number = 0;

  private rowChangedSubject: Subject<RowChange> = new Subject<RowChange>();

  private dataChangeSubject: Subject<any> = new Subject<any>();
  private valueSubject: Subject<Point> = new Subject<Point>();

  private dirtyCells: Point[] = [];
  private dirtyCellsSubject: Subject<Point[]> = new Subject<Point[]>();

  private selectedRows: any[] = [];
  private selectedRowsSubject: Subject<any[]> = new Subject<any[]>();

  constructor(private gridGlobalService: GridGlobalService, private http: HttpClient) {
    this.gridGlobalService.register(this);
  }

  /**
   * Expects an object with the above configuration options as fields.  This is built on top of the default values,
   * then the global config options, then these passed in specific configuration options.
   *
   * @param config
   */
  public updateConfig(config: any, forceColumnsChanged?: boolean): void {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": GridService.updateConfig");
    }
    if (!this.configured) {
      this.config = Object.assign({}, GridService.defaultConfig, this.gridGlobalService.getGlobalConfig(), config);
      this.configured = true;
    } else {
      Object.assign(this.config, config);
    }

    let columnsChanged: boolean = false;
    if (forceColumnsChanged !== undefined && forceColumnsChanged) {
      columnsChanged = forceColumnsChanged;
    }

    if (config.id) {
      this.id = config.id;
    }
    if (config.linkedGroups) {
      this.linkedGroups = config.linkedGroups;
      for (let linkedGroup of this.linkedGroups) {
        this.gridGlobalService.registerGroup(linkedGroup, this);
      }
    }

    // Column Related Configuration
    if (config.columns !== undefined) {
      if (this.columns !== config.columns) {
        columnsChanged = true;
      }
      // Bring in column defaults to config
      for (var i = 0; i < config.columns.length; i++) {
        config.columns[i] = Object.assign({}, Column.defaultConfig, config.columns[i]);
      }
      this.columns = Column.deserializeArray(config.columns);
    }
    if (config.columnHeaders !== undefined) {
      if (this.columnHeaders !== config.columnHeaders) {
        columnsChanged = true;
      }
      this.columnHeaders = config.columnHeaders;
    }
    if (config.fixedColumns) {
      if (!this.fixedColumns) {
        columnsChanged = true;
      } else if (this.fixedColumns.length !== config.fixedColumns.length) {
        columnsChanged = true;
      } else {
        for (var i = 0; i < this.fixedColumns.length; i++) {
          if (this.fixedColumns[i] !== config.fixedColumns[i]) {
            columnsChanged = true;
          }
        }
      }
      this.fixedColumns = Object.assign([], config.fixedColumns);
    }
    if (config.groupBy !== undefined) {
      if (this.groupBy !== config.groupBy) {
        columnsChanged = true;
      }
      this.groupBy = config.groupBy;
    }
    if (config.groupByCollapsed !== undefined) {
      if (this.groupByCollapsed !== config.groupByCollapsed) {
        columnsChanged = true;
      }
      this.groupByCollapsed = config.groupByCollapsed;
    }

    // Data Display and Fetching Configuration
    if (config.externalFiltering !== undefined) {
      this.externalFiltering = config.externalFiltering;
    }
    if (config.externalSorting !== undefined) {
      this.externalSorting = config.externalSorting;
    }
    if (config.externalPaging !== undefined) {
      this.externalPaging = config.externalPaging;
    }
    if (config.pageSize !== undefined) {
      this.pageInfo.pageSize = config.pageSize;
    }
    if (config.pageSizes !== undefined) {
      this.pageSizes = config.pageSizes;
    }
    if (config.nVisibleRows !== undefined) {
      this.nVisibleRows = config.nVisibleRows;
    }

    this.setNVisibleRows();

    // Notify listeners if anything related to column configuration changed.
    if (columnsChanged) {
      this.initColumnDefinitions();
    }

    this.configSubject.next(this.config);
  }

  /**
   * Modifies the number of visible rows based upon other factors.  For example, if nVisibleRows is -1 and there is no
   * paging, it will stay -1, so all data will appear at once.  If nVisibleRows is -1 and there is paging, then the
   * nVisibleRows will be set to the page size.
   */
  public setNVisibleRows(): void {
    if (this.config.nVisibleRows === -1 && this.pageInfo.pageSize > 0) {
      this.nVisibleRows = this.pageInfo.pageSize;
    } else if (this.config.nVisibleRows === -1 && this.pageInfo.pageSize === -1) {
      this.nVisibleRows = -1;
    }
  }

  /**
   * If the column configuration changes, e.g. by user editing the config, then re-sort the columns.
   *
   * @param {string} field
   * @param {number} position
   */
  public updateSortOrder(field: string, position: number): void {
    let n: number = -1;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].field === field) {
        n = i;
        break;
      }
    }
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": GridService.updateSortOrder: " + field + ", " + position + ", " + n);
    }

    if (n === -1) {
      console.warn("hci-grid: " + this.id + ": GridService.updateSortOrder: Column not found.");
    } else if (position === -2) {
      this.columns[n].sortOrder = 0;
      for (let i = n - 1; i >= 0; i--) {
        this.columns[i].sortOrder = this.columns[i].sortOrder + 1;
      }
    } else if (position === -1 && n > 0) {
      this.columns[n].sortOrder = this.columns[n].sortOrder - 1;
      this.columns[n - 1].sortOrder = this.columns[n - 1].sortOrder + 1;
    } else if (position === 1 && n < this.columns.length - 1) {
      this.columns[n].sortOrder = this.columns[n].sortOrder + 1;
      this.columns[n + 1].sortOrder = this.columns[n + 1].sortOrder - 1;
    } else if (position === 2) {
      this.columns[n].sortOrder = this.columns.length - 1;
      for (let i = n + 1; i < this.columns.length; i++) {
        this.columns[i].sortOrder = this.columns[i].sortOrder - 1;
      }
    }

    this.updateConfig({}, true);
  }

  /**
   * Based upon the nature of the columns, sorts them.  For example, utility columns as a negative, then fixed columns
   * starting at zero then others.
   */
  public initColumnDefinitions(): void {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": GridService.initColumnDefinitions()");
    }

    let columnMap: Map<string, Column[]> = this.createColumnMap();

    if (!this.columns) {
      this.columnMapSubject.next(columnMap);
      return;
    }

    // Prior to arranging columns in initColumnProperties, if the key is not set, use the first column.
    let keyDefined: boolean = false;
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i].isKey) {
        keyDefined = true;
      }
    }
    if (!keyDefined && this.columns.length > 0) {
      this.columns[0].isKey = true;
    }

    this.initColumnProperties(columnMap);

    this.nFixedColumns = 0;
    this.nNonFixedColumns = 0;
    for (var j = 0; j < this.columns.length; j++) {
      if (this.columns[j].visible) {
        if (this.columns[j].isFixed) {
          this.nFixedColumns = this.nFixedColumns + 1;
        } else {
          this.nNonFixedColumns = this.nNonFixedColumns + 1;
        }
      }
    }

    this.config.columns = this.columns;

    this.columnMapSubject.next(columnMap);
  }

  /**
   * Usually called when config changes, re-init the columns.  We re-sort based upon the preferred sort order then
   * calculate things like visible columns and group by, then re-sort based on the rendering order.
   */
  public initColumnProperties(columnMap: Map<string, Column[]>): void {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": GridService.initColumnProperties");
    }

    this.columns.sort((a: Column, b: Column) => {
      if (a.sortOrder && b.sortOrder) {
        if (a.sortOrder < b.sortOrder) {
          return -1;
        } else if (a.sortOrder > b.sortOrder) {
          return 1;
        } else {
          return 0;
        }
      } else if (a.sortOrder) {
        return -1;
      } else if (b.sortOrder) {
        return 1;
      } else {
        return 0;
      }
    });

    for (var j = 0; j < this.columns.length; j++) {
      // Reset isLast
      this.columns[j].isLast = false;

      if (this.columns[j].choiceUrl) {
        this.http.get(this.columns[j].choiceUrl).subscribe((choices: any) => {
          this.columns[j].choices = choices;
        });
      }
    }

    this.nUtilityColumns = 0;
    let nGroupBy: number = 0;
    if (this.groupBy) {
      nGroupBy = this.groupBy.length;
    }

    let groupByDisplay: string = undefined;

    this.nVisibleColumns = 0;

    for (var j = 0; j < this.columns.length; j++) {
      if (this.fixedColumns) {
        // Reset isFixed to false
        this.columns[j].isFixed = false;

        for (var k = 0; k < this.fixedColumns.length; k++) {
          if (this.columns[j].field === this.fixedColumns[k]) {
            this.columns[j].isFixed = true;
          }
        }
      }
      if (this.groupBy) {
        for (var k = 0; k < this.groupBy.length; k++) {
          if (this.columns[j].field === this.groupBy[k]) {
            groupByDisplay = (groupByDisplay) ? groupByDisplay + ", " + this.columns[j].name : this.columns[j].name;
            this.columns[j].isGroup = true;
            this.columns[j].visible = false;
            break;
          }
        }
      }

      if (this.columns[j].visible) {
        this.nVisibleColumns = this.nVisibleColumns + 1;
      } else {
        this.columns[j].selectable = false;
      }

      // Set the order of columns based on how they should appear.  Non visible columns are at the back.
      if (this.columns[j].isUtility) {
        this.columns[j].renderOrder = this.columns[j].sortOrder;
      } else if (this.columns[j].isFixed) {
        this.columns[j].renderOrder = 10000 + this.columns[j].sortOrder;
      } else if (this.columns[j].visible) {
        this.columns[j].renderOrder = 20000 + this.columns[j].sortOrder;
      } else {
        this.columns[j].renderOrder = 30000 + this.columns[j].sortOrder;
      }
    }

    if (nGroupBy > 0) {
      let column: Column = new Column({renderOrder: 1999, field: "GROUPBY", name: groupByDisplay, selectable: false});
      this.columns.push(column);
      this.nVisibleColumns = this.nVisibleColumns + 1;
    }

    // Re-sort columns based on render order.
    this.columns.sort((a: Column, b: Column) => {
      if (a.renderOrder < b.renderOrder) {
        return -1;
      } else if (a.renderOrder > b.renderOrder) {
        return 1;
      } else {
        return 0;
      }
    });

    for (var j = 0; j < this.columns.length; j++) {
      columnMap.get("ALL").push(this.columns[j]);

      if (this.columns[j].visible) {
        this.columns[j].id = j;
        columnMap.get("VISIBLE").push(this.columns[j]);

        if (this.columns[j].isUtility) {
          columnMap.get("UTILITY").push(this.columns[j]);
        }
        if (this.columns[j].isUtility || this.columns[j].isFixed) {
          columnMap.get("LEFT_VISIBLE").push(this.columns[j]);
        } else {
          columnMap.get("MAIN_VISIBLE").push(this.columns[j]);
        }
      } else {
        columnMap.get("NON_VISIBLE").push(this.columns[j]);
      }
    }

    if (isDevMode()) {
      for (var j = 0; j < this.columns.length; j++) {
        console.debug("field: " + this.columns[j].field + ", sortOrder: " + this.columns[j].sortOrder + ", renderOrder: " + this.columns[j].renderOrder
            + ", visible: " + this.columns[j].visible + ", selectable: " + this.columns[j].selectable + ", isFixed: " + this.columns[j].isFixed);
      }
    }
  }

  /**
   * Rather than store columns in a single array based on a number for rendering, create maps so different types of columns
   * can be easily referenced.
   *
   * @returns {Map<string, Column[]>}
   */
  public createColumnMap(): Map<string, Column[]> {
    let columnMap: Map<string, Column[]> = new Map<string, Column[]>();
    columnMap.set("ALL", []);
    columnMap.set("UTILITY", []);
    columnMap.set("VISIBLE", []);
    columnMap.set("LEFT_VISIBLE", []);
    columnMap.set("MAIN_VISIBLE", []);
    columnMap.set("NON_VISIBLE", []);
    return columnMap;
  }

  public getConfigSubject(): BehaviorSubject<any> {
    return this.configSubject;
  }

  public getColumnHeaders(): boolean {
    return this.columnHeaders;
  }

  public getNVisibleRows(): number {
    return this.nVisibleRows;
  }

  public getNFixedColumns(): number {
    return this.nFixedColumns;
  }

  public getNNonFixedColumns(): number {
    return this.nNonFixedColumns;
  }

  public getColumns(): Column[] {
    return this.columns;
  }

  public getViewDataSubject(): BehaviorSubject<Row[]> {
    return this.viewDataSubject;
  }

  /**
   * Assemble an array of column indexes which are labeled as forming a key for a row of data.
   *
   * @returns {Array<number>}
   */
  public getKeyColumns(): Array<number> {
    let keys: number[] = [];
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i].isKey) {
        keys.push(i);
      }
    }
    return keys;
  }

  public getColumn(j: number): Column {
    return this.columns[j];
  }

  public isColumnSelectable(j: number): boolean {
    return this.columns[j].selectable;
  }

  public getNVisibleColumns(): number {
    return this.nVisibleColumns;
  }

  public getColumnMapSubject(): Subject<Map<string, Column[]>> {
    return this.columnMapSubject;
  }

  public setGridElement(gridElement: HTMLElement): void {
    this.gridElement = gridElement;
  }

  /**
   * Deletes the selected rows based on the key of the selected row.  This is really for bound viewDataSubject only.  If deleting
   * from an external viewDataSubject source, the call should be made to that service to delete the rows, then the grid should just
   * be refreshed.
   */
  public deleteSelectedRows(): void {
    this.originalData = this.originalData.filter((row: Object) => {
      for (var j = 0; j < this.columns.length; j++) {
        if (this.columns[j].isKey && this.selectedRows.indexOf(this.getField(row, this.columns[j].field)) !== -1) {
          return false;
        }
      }
      return true;
    });
    this.initData();

    if (this.viewData.length === 0) {
      this.setPage(-2);
    }

    this.selectedRows = [];
    this.selectedRowsSubject.next(this.selectedRows);
  }

  public clearSelectedRows(): void {
    for (let row of this.selectedRows) {
      try {
        this.getRowByKey(row).get(this.selectedRowColumn).value = false;
      } catch (error) {
        console.error(error);
      }
    }

    this.selectedRows = [];
    this.selectedRowsSubject.next(this.selectedRows);
  }

  /**
   * Given the key on row i, negate the value at i, j.  This is expected to be a column with a boolean value
   * that governs the selected property.
   *
   * @param {number} i The row.
   * @param {number} j The column.
   * @returns {boolean} Returns the negated value.
   */
  public negateSelectedRow(i: number, j: number, multiSelect: boolean): boolean {
    this.selectedRowColumn = j;

    let key: any = this.getKey(i, j);
    // If the value doesn't exist, assume it would have been previously false, so set to true.
    let value: boolean = true;
    if (this.getRow(i).get(j).value) {
      value = !this.getRow(i).get(j).value;
    }

    this.getRow(i).get(j).value = value;

    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": negateSelectedRow: " + i + " " + j + " " + value);
    }

    if (value) {
      if (!multiSelect) {
        this.clearSelectedRows();
        this.selectedRows.push(key);
      } else if (this.selectedRows.indexOf(key) === -1) {
        this.selectedRows.push(key);
      }
    } else {
      if (!multiSelect) {
        this.clearSelectedRows();
      } else if (this.selectedRows.indexOf(key) !== -1) {
        this.selectedRows.splice(this.selectedRows.indexOf(key), 1);
      }
    }
    this.selectedRowsSubject.next(this.selectedRows);

    return value;
  }

  public setSelectedRow(i: number, j: number): void {
    let key: any = this.getKey(i, j);
    this.getRow(i).get(j).value = true;

    if (this.selectedRows.indexOf(key) === -1) {
      this.selectedRows.push(key);
    }
    this.selectedRowsSubject.next(this.selectedRows);
  }

  public setUnselectedRow(i: number, j: number): void {
    let key: any = this.getKey(i, j);
    this.getRow(i).get(j).value = false;

    if (this.selectedRows.indexOf(key) !== -1) {
      this.selectedRows.splice(this.selectedRows.indexOf(key), 1);
    }
    this.selectedRowsSubject.next(this.selectedRows);
  }

  public getSelectedRows(): any[] {
    return this.selectedRows;
  }

  public getSelectedRowsSubject(): Subject<any[]> {
    return this.selectedRowsSubject;
  }

  public cellDataUpdate(range: Range): void {
    this.cellDataUpdateObserved.next(range);
  }

  public doubleClickRow(i: number): void {
    this.doubleClickObserved.next(this.viewData[i]);
  }

  public getKey(i: number, j?: number): any {
    return this.viewData[i].key;
  }

  public getRowByKey(key: any): Row {
    for (let row of this.viewData) {
      if (row.key === key) {
        return row;
      }
    }

    return undefined;
  }

  /**
   * Upon filtering, we check for external filtering and if external, post new ExternalInfo to observable.
   * We will assume that there may be a mix of internal and external filtering/sorting/paging.  If external
   * filtering, we will send an ExternalInfo object, but if the sort/page is internal, set those values to
   * null in the ExternalInfo.  So the external call will filter but we will still rely internally on sorting
   * and paging.
   *
   * Filtering Steps
   * Re-init viewDataSubject.
   * Set page to 0;
   * Filter
   * Sort
   * Paginate
   */
  public filter(): void {
    if (this.externalFiltering) {
      this.filterInfo = [];
      this.filterMap.forEach((filters: FilterInfo[]) => {
        this.filterInfo = this.filterInfo.concat(filters);
      });
      if (isDevMode()) {
        console.debug("GridService.filter: externalFiltering: n: " + this.filterInfo.length);
      }

      this.pageInfo.setPage(0);

      this.externalInfoObserved.next(new ExternalInfo(this.filterInfo, (this.externalSorting) ? this.sortInfo : undefined, this.pageInfo));
    } else {
      this.pageInfo.setPage(0);
      this.initDataWithOptions(true, !this.externalFiltering, !this.externalSorting, !this.externalPaging);
    }
  }

  public getColumnIndexByField(field: string): number {
    for (var j = 0; j < this.columns.length; j++) {
      if (this.columns[j].field === field) {
        return j;
      }
    }
    return -1;
  }

  public filterPreparedData(): void {
    if (isDevMode()) {
      console.debug("filterPreparedData");
    }

    let filteredData: Row[] = [];

    if (this.preparedData) {
      for (var i = 0; i < this.preparedData.length; i++) {
        let inc: boolean = true;

        for (var j = 0; j < this.columns.length; j++) {
          let filters: FilterInfo[] = this.filterMap.get(this.columns[j].field);
          if (!filters) {
            continue;
          }
          filters = filters.filter((filter: FilterInfo) => {
            return filter.valid;
          });

          if (filters.length > 0 && this.preparedData[i].get(j).value === null) {
            inc = false;
            break;
          }

          if (this.columns[j].dataType === "choice") {
            if (filters.length === 0) {
              inc = true;
            } else {
              let colInc: boolean = false;
              for (let filterInfo of filters) {
                if (this.preparedData[i].get(j).value === filterInfo.value) {
                  colInc = true;
                  break;
                }
              }

              if (!colInc) {
                inc = false;
                break;
              }
            }
          } else {
            let colInc: boolean = true;
            for (let filterInfo of filters) {
              if (!filterInfo.valid) {
                continue;
              } else if (filterInfo.dataType === "number") {
                colInc = false;
                if (filterInfo.operator === "E") {
                  if (+this.preparedData[i].get(j).value === +filterInfo.value) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "LE") {
                  if (+this.preparedData[i].get(j).value <= +filterInfo.value) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "LT") {
                  if (+this.preparedData[i].get(j).value < +filterInfo.value) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "GE") {
                  if (+this.preparedData[i].get(j).value >= +filterInfo.value) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "GT") {
                  if (+this.preparedData[i].get(j).value > +filterInfo.value) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "B") {
                  if (+filterInfo.value <= +this.preparedData[i].get(j).value && +this.preparedData[i].get(j).value <= +filterInfo.highValue) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "O") {
                  if (+this.preparedData[i].get(j).value < +filterInfo.value || +filterInfo.highValue < +this.preparedData[i].get(j).value) {
                    colInc = true;
                    break;
                  }
                }
              } else if (filterInfo.dataType.indexOf("date") === 0) {
                colInc = false;

                let v: any = this.preparedData[i].get(j).value;
                let f1: any = filterInfo.value;
                let f2: any = filterInfo.highValue;

                if (filterInfo.operator === "E") {
                  if (v === f1) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "LE") {
                  if (v <= f1) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "LT") {
                  if (v < f1) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "GE") {
                  if (v >= f1) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "GT") {
                  if (v > f1) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "B") {
                  if (f1 <= v && v <= f2) {
                    colInc = true;
                    break;
                  }
                } else if (filterInfo.operator === "O") {
                  if (v < f1 || f2 < v) {
                    colInc = true;
                    break;
                  }
                }
              } else {
                if (isDevMode()) {
                  console.debug("hci-grid: " + this.id + ": Filter text: " + filterInfo.value + ": " + this.preparedData[i].get(j).value);
                }

                if (this.preparedData[i].get(j).value.toString().toLowerCase().indexOf(filterInfo.value) === -1) {
                  colInc = false;
                  break;
                }
              }
            }

            if (!colInc) {
              inc = false;
              break;
            }
          }
        }
        if (inc) {
          filteredData.push(this.preparedData[i]);
        }
      }
    }
    this.preparedData = filteredData;
  }

  public getCell(i: number, j: number): Cell {
    try {
      return this.viewData[i].get(j);
    } catch (e) {
      return null;
    }
  }

  public getField(row: Object, field: String): Object {
    if (!field) {
      if (isDevMode()) {
        console.debug("hci-grid: " + this.id + ": getField: field is undefined.");
      }
      return null;
    }

    var fields = field.split(".");

    var obj = row[fields[0]];
    for (var i = 1; i < fields.length; i++) {
      obj = obj[fields[i]];
    }
    return obj;
  }

  public getRow(i: number): Row {
    if (i > this.viewData.length - 1) {
      return undefined;
    } else {
      return this.viewData[i];
    }
  }

  public getRowFromKey(key: any): Row {
    for (let row of this.viewData) {
      if (row.key === key) {
        return row;
      }
    }

    return undefined;
  }

  public getRowIndexFromKey(key: any): number {
    for (let i = 0; i < this.viewData.length; i++) {
      if (this.viewData[i].key === key) {
        return i;
      }
    }

    return undefined;
  }

  public clearDirtyCell(i: number, j: number): void {
    this.getRow(i).get(j).dirty = false;

    for (let ii = 0; ii < this.dirtyCells.length; ii++) {
      if (this.dirtyCells[ii].i === i && this.dirtyCells[ii].j === j) {
        this.dirtyCells.splice(ii, 1);
        break;
      }
    }
    this.dirtyCellsSubject.next(this.dirtyCells);
  }

  public handleValueChange(i: number, j: number, key: number, newValue: any, oldValue: any): void {
    if (isDevMode()) {
      console.debug("hci-grid: " + this.id + ": handleValueChange: " + i + " " + j + " " + newValue + " " + oldValue);
    }

    this.setInputDataValue(key, this.columns[j].field, newValue);

    // TODO: Still used?
    this.valueSubject.next(new Point(i, j));

    this.getRow(i).get(j).dirty = true;
    this.dirtyCells.push(new Point(i, j));
    this.dirtyCellsSubject.next(this.dirtyCells);

    this.dataChangeSubject.next({
      key: this.getRow(i).key,
      i: i,
      j: j,
      field: this.columns[j].field,
      oldValue: oldValue,
      newValue: newValue
    });
  }

  /**
   * TODO: If groupBy, don't just push rows, but check for pre-existing keys and add those rows to existing rowData.
   *
   * @param originalData
   */
  public initDataWithOptions(prep: boolean, filter: boolean, sort: boolean, paginate: boolean): void {
    if (!this.originalData) {
      return;
    }

    if (prep) {
      this.prepareData();
    }
    if (filter) {
      this.filterPreparedData();
    }
    if (sort) {
      this.sortPreparedData();
    }
    this.resetUtilityColumns();

    let START: number = 0;
    let END: number = this.preparedData.length;

    if (!this.externalPaging) {
      this.pageInfo.setDataSize(this.preparedData.length);
    }
    if (paginate && this.pageInfo.getPageSize() > 0) {
      START = this.pageInfo.getPage() * this.pageInfo.getPageSize();
      END = Math.min(START + this.pageInfo.getPageSize(), this.pageInfo.getDataSize());
      this.pageInfo.setNumPages(Math.ceil(this.pageInfo.getDataSize() / this.pageInfo.getPageSize()));
    } else if (this.externalPaging) {
      this.pageInfo.setNumPages(Math.ceil(this.pageInfo.getDataSize() / this.pageInfo.getPageSize()));
    } else if (!this.externalPaging) {
      this.pageInfo.setNumPages(1);
    }
    this.pageInfoObserved.next(this.pageInfo);

    this.viewData = [];
    if (this.groupBy) {
      // This is all wrong for sorting... if group by, only search for next common row.
      // If sorting on non group-by fields, then grouping sort of breaks unless those sorted rows still happen to
      // lay next to each other
      let groupColumns: number[] = [];
      for (var i = 0; i < this.columns.length; i++) {
        if (this.columns[i].isGroup) {
          groupColumns.push(i);
        }
      }

      for (var i = START; i < END; i++) {
        this.preparedData[i].createHeader(groupColumns);
      }

      let currentHeader: any = undefined;
      for (var i = START; i < END; i++) {
        if (!currentHeader) {
          currentHeader = this.preparedData[i].header;
        } else if (this.preparedData[i].header === currentHeader) {
          this.preparedData[i].header = undefined;
        } else {
          currentHeader = this.preparedData[i].header;
        }

        this.viewData.push(this.preparedData[i]);
      }
    } else {
      for (var i = START; i < END; i++) {
        this.viewData.push(this.preparedData[i]);
      }
    }

    this.viewDataSubject.next(this.viewData);
  }

  public resetUtilityColumns(): void {
    this.clearSelectedRows();

    for (var i = 0; i < this.preparedData.length; i++) {
      for (var j = 0; j < this.columns.length; j++) {
        if (this.columns[j].isUtility) {
          if (this.columns[j].defaultValue !== undefined) {
            this.preparedData[i].get(j).value = this.columns[j].defaultValue;
          }
        }
      }
    }
  }

  public prepareData(): void {
    if (!this.columns) {
      if (isDevMode()) {
        console.info("prepareData: No Columns, returning.");
      }
      return;
    }
    if (isDevMode()) {
      console.info("prepareData: nData: " + this.originalData.length + ", nCols: " + this.columns.length);
    }
    this.preparedData = [];

    for (var i = 0; i < this.originalData.length; i++) {
      let row: Row = new Row();
      row.rowNum = i;
      for (var j = 0; j < this.columns.length; j++) {
        if (this.columns[j].isKey) {
          row.key = this.getField(this.originalData[i], this.columns[j].field);
        }
        if (this.columns[j].field === "GROUPBY") {
          row.add(new Cell({value: "", key: i}));
        } else if (this.columns[j].isUtility) {
            row.add(new Cell({value: false}));
        } else {
          row.add(new Cell({value: this.getField(this.originalData[i], this.columns[j].field), key: i}));
        }
      }

      this.preparedData.push(row);
    }
  }

  /**
   * TODO: Fix auto create columns.
   *
   * @param originalData
   * @returns {boolean}
   */
  public setOriginalData(originalData: Object[]): boolean {
    this.originalData = originalData;

    if (this.pageInfo.getPageSize() === -1 && this.originalData.length > 50) {
      this.pageInfo.setPageSize(10);
    }

    if (!this.columns && this.originalData.length > 0) {
      this.columns = [];
      let keys: string[] = Object.keys(this.originalData[0]);
      for (var i = 0; i < keys.length; i++) {
        this.columns.push(Column.deserialize({ field: keys[i], template: "LabelCell" }));
        this.columns = this.columns;
      }
      this.initColumnDefinitions();
      return true;
    } else {
      this.initData();
      return false;
    }
  }

  public initData(): void {
    this.initDataWithOptions(true, !this.externalFiltering, !this.externalSorting, !this.externalPaging);
  }

  /**
   * When a cell value updates, we have a i,j,k position and value.  Now this works for updating our internal
   * grid viewDataSubject which is flattened, but our input viewDataSubject could have a complex viewDataSubject structure.  An list of Person
   * may have a field like demographics.firstName which is in its own demographic object within person.
   *
   * @param rowIndex
   * @param field
   * @param value
   */
  public setInputDataValue(key: number, field: string, value: any): void {
    var fields = field.split(".");

    var obj = this.originalData[key];
    for (var i = 0; i < fields.length - 1; i++) {
      obj = obj[fields[i]];
    }
    obj[fields[fields.length - 1]] = value;
  }

  /**
   * Used to change the page the grid is on.
   *
   * @param {number} mode -2 for first, 2 for last, -1 for previous, 1 for next.
   */
  public setPage(mode: number): void {
    let page: number = this.pageInfo.getPage();

    if (mode === -2) {
      this.pageInfo.setPage(0);
    } else if (mode === -1 && this.pageInfo.page > 0) {
      this.pageInfo.setPage(this.pageInfo.getPage() - 1);
    } else if (mode === 1 && this.pageInfo.getPage() < this.pageInfo.getNumPages() - 1) {
      this.pageInfo.setPage(this.pageInfo.getPage() + 1);
    } else if (mode === 2) {
      this.pageInfo.setPage(this.pageInfo.getNumPages() - 1);
    }

    if (page !== this.pageInfo.getPage()) {
      if (this.externalPaging) {
        this.externalInfoObserved.next(new ExternalInfo((this.externalFiltering) ? this.filterInfo : null, (this.externalSorting) ? this.sortInfo : null, this.pageInfo));
      } else {
        this.initDataWithOptions(false, !this.externalFiltering, !this.externalSorting, true);
      }
    }
  }

  public setPageSize(pageSize: number) {
    if (isDevMode()) {
      console.debug("setPageSize: " + pageSize);
    }

    this.pageInfo.setPageSize(pageSize);
    this.pageInfo.setPage(0);

    this.setNVisibleRows();

    if (this.externalPaging) {
      this.externalInfoObserved.next(new ExternalInfo((this.externalFiltering) ? this.filterInfo : null, (this.externalSorting) ? this.sortInfo : null, this.pageInfo));
    } else {
      this.initDataWithOptions(false, !this.externalFiltering, !this.externalSorting, this.pageInfo.getPageSize() > 0);
    }
  }

  /**
   * Sorting Steps
   * Sort
   * Paginate (stay on current page)
   *
   * @param column
   */
  public sort(field: string) {
    if (this.sortInfo.field === null || this.sortInfo.field !== field) {
      this.sortInfo.field = field;
      this.sortInfo.asc = true;
    } else {
      this.sortInfo.asc = !this.sortInfo.asc;
    }
    this.sortInfoObserved.next(this.sortInfo);

    if(this.externalSorting) {
      this.externalInfoObserved.next(new ExternalInfo((this.externalFiltering) ? this.filterInfo : null, this.sortInfo, (this.externalPaging) ? this.pageInfo : null));
    } else {
      this.initDataWithOptions(false, !this.externalFiltering, true, !this.externalPaging);
    }
  }

  public sortPreparedData() {
    let sortColumns: number[] = [];

    if (this.sortInfo.field === null && this.groupBy) {
      this.sortInfo.field = "GROUP_BY";
    }

    if (this.columns) {
      if (this.sortInfo.field === "GROUP_BY") {
        for (var i = 0; i < this.columns.length; i++) {
          if (this.columns[i].isGroup) {
            sortColumns.push(i);
          }
        }
      } else {
        for (var i = 0; i < this.columns.length; i++) {
          if (this.columns[i].field === this.sortInfo.field) {
            sortColumns.push(i);
            break;
          }
        }
      }
    }

    if (this.preparedData) {
      this.preparedData = this.preparedData.sort((o1: Row, o2: Row) => {
        let v: number = 0;
        for (var i = 0; i < sortColumns.length; i++) {
          if (typeof o1.get(sortColumns[i]).value === "number") {
            if (this.sortInfo.asc) {
              v = o1.get(sortColumns[i]).value - o2.get(sortColumns[i]).value;
            } else {
              v = o2.get(sortColumns[i]).value - o1.get(sortColumns[i]).value;
            }
          } else if (typeof o1.get(sortColumns[i]).value === "string") {
            if (this.sortInfo.asc) {
              if (o1.get(sortColumns[i]).value < o2.get(sortColumns[i]).value) {
                v = -1;
              } else if (o1.get(sortColumns[i]).value > o2.get(sortColumns[i]).value) {
                v = 1;
              }
            } else {
              if (o1.get(sortColumns[i]).value > o2.get(sortColumns[i]).value) {
                v = -1;
              } else if (o1.get(sortColumns[i]).value < o2.get(sortColumns[i]).value) {
                v = 1;
              }
            }
          }
          if (v !== 0) {
            return v;
          }
        }
        return v;
      });
    }
  }

  public getValueSubject(): Subject<Point> {
    return this.valueSubject;
  }

  public getColumnByName(name: string): Column {
    for (let column of this.columns) {
      if (column.name === name) {
        return column;
      }
    }
  }

  public getFilterMapSubject(): BehaviorSubject<Map<string, FilterInfo[]>> {
    return this.filterMapSubject;
  }

  public addFilter(field: string, filterInfo: FilterInfo) {
    if (!this.filterMap.has(field)) {
      this.filterMap.set(field, []);
    }
    this.filterMap.get(field).push(filterInfo);

    this.filterMapSubject.next(this.filterMap);
  }

  /**
   * Way for external grid or user to add filters to a field.
   *
   * @param {string} field
   * @param {FilterInfo[]} filters
   */
  public addFilters(field: string, filters: FilterInfo[]) {
    if (!this.filterMap.has(field)) {
      this.filterMap.set(field, []);
    }
    this.filterMap.set(field, filters);
    this.filterMapSubject.next(this.filterMap);
  }

  /**
   * If this grid is linked to other grids, prompt the syncing of this grid's filters through the global service.
   *
   * @param {string} field
   * @param {FilterInfo[]} filters
   */
  public globalClearPushFilter(field: string, filters: FilterInfo[]) {
    if (this.linkedGroups) {
      for (let linkedGroup of this.linkedGroups) {
        this.gridGlobalService.clearPushFilter(linkedGroup, this.id, field, filters);
      }
    }
  }

  public getOriginalData(): Object[] {
    return this.originalData;
  }

  public getOriginalRow(i: number): any {
    return this.originalData[i];
  }

  public getPreparedData(): Row[] {
    return this.preparedData;
  }

  public getDataChangeSubject(): Subject<any> {
    return this.dataChangeSubject;
  }

  public getDirtyCells(): Point[] {
    return this.dirtyCells;
  }

  public getDirtyCellsSubject(): Subject<Point[]> {
    return this.dirtyCellsSubject;
  }

  public getRowChangedSubject(): Subject<RowChange> {
    return this.rowChangedSubject;
  }
}
