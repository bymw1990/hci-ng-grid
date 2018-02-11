import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Rx";

import {Cell} from "../cell/cell";
import {Row} from "../row/row";
import {Column} from "../column/column";
import {Range} from "../utils/range";
import {SortInfo} from "../utils/sort-info";
import {PageInfo} from "../utils/page-info";
import {Point} from "../utils/point";
import {FilterInfo} from "../utils/filter-info";
import {ExternalInfo} from "../utils/external-info";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {InputCell} from "../cell/input-cell.component";

@Injectable()
export class GridService {

  columnsChangedSubject: Subject<boolean> = new Subject<boolean>();

  columnHeaders: boolean = true;
  rowSelect: boolean = false;
  cellSelect: boolean = false;
  keyNavigation: boolean = false;
  columnDefinitions: Column[] = null;
  fixedColumns: string[] = null;
  groupBy: string[] = null;
  groupByCollapsed: boolean = false;
  externalFiltering: boolean = false;
  externalSorting: boolean = false;
  externalPaging: boolean = false;
  pageSizes: number[] = [10, 25, 50];
  nVisibleRows: number = null;

  originalData: Object[];
  preparedData: Array<Row>;

  viewData: Array<Row> = new Array<Row>();
  viewDataSubject: BehaviorSubject<Array<Row>> = new BehaviorSubject<Array<Row>>(new Array<Row>());

  filterInfo: Array<FilterInfo> = new Array<FilterInfo>();

  sortInfo: SortInfo = new SortInfo();
  sortInfoObserved = new Subject<SortInfo>();

  pageInfo: PageInfo = new PageInfo();
  pageInfoObserved = new Subject<PageInfo>();

  externalInfoObserved = new Subject<ExternalInfo>();
  doubleClickObserved = new Subject<Object>();
  cellDataUpdateObserved = new Subject<Range>();

  private nUtilityColumns: number = 0;
  private nFixedColumns: number = 0;
  private nNonFixedColumns: number = 0;
  private nVisibleColumns: number = 0;
  private valueSubject: Subject<Point> = new Subject<Point>();
  private selectedRows: any[] = [];
  private selectedRowsSubject: Subject<any[]> = new Subject<any[]>();

  /**
   * Expects an object with the above configuration options as fields.
   *
   * @param config
   */
  setConfig(config: any) {
    let columnsChanged: boolean = false;

    // Selection Related Configuration
    if (config.rowSelect !== undefined) {
      this.rowSelect = config.rowSelect;
    }
    if (config.cellSelect !== undefined) {
      this.cellSelect = config.cellSelect;
    }
    if (config.keyNavigation !== undefined) {
      this.keyNavigation = config.keyNavigation;
    }

    // Column Related Configuration
    if (config.columnDefinitions !== undefined) {
      if (this.columnDefinitions !== config.columnDefinitions) {
        columnsChanged = true;
      }
      this.columnDefinitions = Column.deserializeArray(config.columnDefinitions);
    }
    if (config.columnHeaders !== undefined) {
      if (this.columnHeaders !== config.columnHeaders) {
        columnsChanged = true;
      }
      this.columnHeaders = config.columnHeaders;
    }
    if (config.fixedColumns !== undefined) {
      if (this.fixedColumns !== config.fixedColumns) {
        columnsChanged = true;
      }
      this.fixedColumns = config.fixedColumns;
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

    if (this.nVisibleRows === null) {
      this.nVisibleRows = this.pageInfo.pageSize;
    }

    // Notify listeners if anything related to column configuration changed.
    if (columnsChanged) {
      //this.init();
      this.columnsChangedSubject.next(true);
    }
  }

  /**
   * Based upon the nature of the columns, sorts them.  For example, utility columns as a negative, then fixed columns
   * starting at zero then others.
   */
  init() {
    if (this.columnDefinitions === null) {
      return;
    }
    this.initColumnDefinitions();
    this.sortColumnDefinitions();

    this.nFixedColumns = 0;
    this.nNonFixedColumns = 0;
    for (var j = 0; j < this.columnDefinitions.length; j++) {
      if (this.columnDefinitions[j].visible) {
        if (this.columnDefinitions[j].isFixed) {
          this.nFixedColumns = this.nFixedColumns + 1;
        } else {
          this.nNonFixedColumns = this.nNonFixedColumns + 1;
        }
      }
    }

    let keyDefined: boolean = false;
    for (var i = 0; i < this.columnDefinitions.length; i++) {
      if (this.columnDefinitions[i].isKey) {
        keyDefined = true;
      }
    }
    if (!keyDefined && this.columnDefinitions.length > 0) {
      this.columnDefinitions[0].isKey = true;
    }
  }

  formatData(k: number, value: any): any {
    let column: Column = this.columnDefinitions[k];
    if (column.dataType === "string") {
      return value;
    } else if (column.dataType === "date") {
      return column.formatValue(value);
    } else {
      return "Add Formatter";
    }
  }

  parseData(k: number, value: any): any {
    let column: Column = this.columnDefinitions[k];
    if (column.dataType === "string") {
      return value;
    } else if (column.dataType === "date") {
      return column.parseValue(value);
    } else {
      return "Add Parser";
    }
  }

  getNVisibleRows(): number {
    return this.nVisibleRows;
  }

  getNFixedColumns(): number {
    return this.nFixedColumns;
  }

  getNNonFixedColumns(): number {
    return this.nNonFixedColumns;
  }

  getColumnDefinitions() {
    return this.columnDefinitions;
  }

  getViewDataSubject(): BehaviorSubject<Array<Row>> {
    return this.viewDataSubject;
  }

  getKeyColumns(): Array<number> {
    let keys: Array<number> = new Array<number>();
    for (var i = 0; i < this.columnDefinitions.length; i++) {
      if (this.columnDefinitions[i].isKey) {
        keys.push(i);
      }
    }
    return keys;
  }

  initColumnDefinitions() {
    this.nUtilityColumns = 0;
    let nGroupBy: number = 0;
    if (this.groupBy !== null) {
      nGroupBy = this.groupBy.length;
    }

    let groupByDisplay: string = null;

    if (this.rowSelect) {
      let rowSelectColumn: Column = Column.deserialize({ name: "", template: "InputCell", width: 30, minWidth: 30, maxWidth: 30 });
      rowSelectColumn.field = "ROW_SELECT";
      rowSelectColumn.sortable = false;
      rowSelectColumn.sortOrder = 0;
      rowSelectColumn.isFixed = true;
      rowSelectColumn.isUtility = true;
      this.columnDefinitions.push(rowSelectColumn);
    }

    //let hasFilter: boolean = false;
    /*for (var i = 0; i < this.columnDefinitions.length; i++) {
      if (this.columnDefinitions[i].filterType !== null) {
        hasFilter = true;
      }
    }*/

    this.nVisibleColumns = 0;
    this.columnHeaders = false;

    /*for (var i = 0; i < this.columnDefinitions.length; i++) {
      if (this.columnDefinitions[i].name !== null) {
        this.columnHeaders = true;
      }

      if (this.columnDefinitions[i].isUtility) {
        continue;
      }

      let m: number = 0;
      let k: number = i;
      for (var j = 0; j < nGroupBy; j++) {
        if (this.columnDefinitions[i].field === this.groupBy[j]) {
          groupByDisplay = (groupByDisplay === null) ? this.columnDefinitions[i].name : groupByDisplay + ", " + this.columnDefinitions[i].name;
          this.columnDefinitions[i].isGroup = true;
          this.columnDefinitions[i].visible = false;
          k = j;
          m = 1;
          break;
        }
      }
      if (m === 0) {
        for (var j = 0; j < this.nFixedColumns; j++) {
          if (this.columnDefinitions[i].field === this.fixedColumns[j]) {
            this.columnDefinitions[i].isFixed = true;
            k = j;
            m = 2;
            break;
          }
        }
      }

      if (m === 0) {
        this.columnDefinitions[i].sortOrder = nGroupBy + this.nFixedColumns + k + 1;
      } else if (m === 1) {
        this.columnDefinitions[i].sortOrder = nGroupBy + k + 1;
      } else if (m === 2) {
        this.columnDefinitions[i].sortOrder = k;
      }

      if (!this.columnDefinitions[i].visible) {
        this.columnDefinitions[i].sortOrder = this.columnDefinitions[i].sortOrder + 1000;
        this.columnDefinitions[i].selectable = false;
      } else {
        this.nVisibleColumns = this.nVisibleColumns + 1;
      }
    }*/
    for (var j = 0; j < this.columnDefinitions.length; j++) {
      if (this.columnDefinitions[j].name !== null) {
        this.columnHeaders = true;
      }

      if (this.fixedColumns) {
        for (var k = 0; k < this.fixedColumns.length; k++) {
          if (this.columnDefinitions[j].field === this.fixedColumns[k]) {
            this.columnDefinitions[j].isFixed = true;
            break;
          }
        }
      }
      if (this.groupBy) {
        for (var k = 0; k < this.groupBy.length; k++) {
          if (this.columnDefinitions[j].field === this.groupBy[k]) {
            groupByDisplay = (groupByDisplay === null) ? this.columnDefinitions[j].name : groupByDisplay + ", " + this.columnDefinitions[j].name;
            this.columnDefinitions[j].isGroup = true;
            this.columnDefinitions[j].visible = false;
            break;
          }
        }
      }

      if (this.columnDefinitions[j].visible) {
        this.nVisibleColumns = this.nVisibleColumns + 1;
      } else {
        this.columnDefinitions[j].selectable = false;
      }

      if (this.columnDefinitions[j].isUtility) {
        this.columnDefinitions[j].sortOrder = 1000 + j;
      } else if (this.columnDefinitions[j].isFixed) {
        this.columnDefinitions[j].sortOrder = 2000 + j;
      } else if (this.columnDefinitions[j].visible) {
        this.columnDefinitions[j].sortOrder = 3000 + j;
      } else {
        this.columnDefinitions[j].sortOrder = 4000 + j;
      }
    }

    if (nGroupBy > 0) {
      let column: Column = new Column({sortOrder: 1999, field: "GROUPBY", name: groupByDisplay, selectable: false});
      this.columnDefinitions.push(column);
      this.nVisibleColumns = this.nVisibleColumns + 1;
    }
  }

  getColumn(j: number): Column {
    return this.columnDefinitions[j];
  }

  isColumnSelectable(j: number): boolean {
    return this.columnDefinitions[j].selectable;
  }

  getNVisibleColumns(): number {
    return this.nVisibleColumns;
  }

  sortColumnDefinitions() {
    this.columnDefinitions = this.columnDefinitions.sort((a: Column, b: Column) => {
      if (a.sortOrder < b.sortOrder) {
        return -1;
      } else if (a.sortOrder > b.sortOrder) {
        return 1;
      } else {
        return 0;
      }
    });

    for (var j = 0; j < this.columnDefinitions.length; j++) {
      this.columnDefinitions[j].id = j;
      console.debug("Column: " + this.columnDefinitions[j].name + " " + this.columnDefinitions[j].sortOrder + " " + this.columnDefinitions[j].visible + " " + this.columnDefinitions[j].selectable + " " + this.columnDefinitions[j].isFixed);
    }
  }

  getColumnsChangedSubject(): Subject<boolean> {
    return this.columnsChangedSubject;
  }

  getOriginalDataSize(): number {
    if (this.originalData === undefined) {
      return 0;
    } else {
      return this.originalData.length;
    }
  }

  /**
   * Deletes the selected rows based on the key of the selected row.  This is really for bound viewDataSubject only.  If deleting
   * from an external viewDataSubject source, the call should be made to that service to delete the rows, then the grid should just
   * be refreshed.
   */
  deleteSelectedRows() {
    this.originalData = this.originalData.filter((row: Object) => {
      for (var j = 0; j < this.columnDefinitions.length; j++) {
        if (this.columnDefinitions[j].isKey && this.selectedRows.indexOf(this.getField(row, this.columnDefinitions[j].field)) !== -1) {
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

  clearSelectedRows() {
    this.selectedRows = [];
    this.selectedRowsSubject.next(this.selectedRows);
  }

  setSelectedRow(i: number, j: number) {
    let key: any = this.getKey(i, j);
    this.getRow(i).get(j).value = true;

    if (this.selectedRows.indexOf(key) === -1) {
      this.selectedRows.push(key);
    }
    this.selectedRowsSubject.next(this.selectedRows);
  }

  setUnselectedRow(i: number, j: number) {
    let key: any = this.getKey(i, j);
    this.getRow(i).get(j).value = false;

    if (this.selectedRows.indexOf(key) !== -1) {
      this.selectedRows.splice(this.selectedRows.indexOf(key), 1);
    }
    this.selectedRowsSubject.next(this.selectedRows);
  }

  getSelectedRowsSubject() {
    return this.selectedRowsSubject;
  }

  cellDataUpdate(range: Range) {
    this.cellDataUpdateObserved.next(range);
  }

  doubleClickRow(i: number) {
    this.doubleClickObserved.next(this.viewData[i]);
  }

  getKey(i: number, j: number): any {
    return this.viewData[i].key;
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
  filter() {
    if (this.externalFiltering) {
      this.filterInfo = new Array<FilterInfo>();
      for (var j = 0; j < this.columnDefinitions.length; j++) {
        if (this.columnDefinitions[j].filterValue !== null && this.columnDefinitions[j].filterValue !== "") {
          this.filterInfo.push(new FilterInfo(this.columnDefinitions[j].field, this.columnDefinitions[j].filterValue));
        }
      }

      this.pageInfo.setPage(0);

      this.externalInfoObserved.next(new ExternalInfo(this.filterInfo, (this.externalSorting) ? this.sortInfo : null, (this.externalPaging) ? this.pageInfo : null));
    } else {
      this.pageInfo.setPage(0);
      this.initDataWithOptions(true, !this.externalFiltering, !this.externalSorting, !this.externalPaging);
    }
  }

  /**
   * TODO: Make filter case insensitive.
   */
  filterPreparedData() {
    let filteredData: Array<Row> = new Array<Row>();

    for (var i = 0; i < this.preparedData.length; i++) {
      let inc: boolean = true;
      for (var j = 0; j < this.columnDefinitions.length; j++) {
        if (this.columnDefinitions[j].filterValue === null || this.columnDefinitions[j].filterValue === "") {
          continue;
        }

        if (this.columnDefinitions[j].filterType === "input" || this.columnDefinitions[j].filterType === "select") {
          if (this.preparedData[i].get(j).value === null || this.preparedData[i].get(j).value.toString().indexOf(this.columnDefinitions[j].filterValue) === -1) {
            inc = false;
            break;
          }
        }
      }
      if (inc) {
        filteredData.push(this.preparedData[i]);
      }
    }
    this.preparedData = filteredData;
  }

  getCell(i: number, j: number): Cell {
    try {
      return this.viewData[i].get(j);
    } catch (e) {
      return null;
    }
  }

  getField(row: Object, field: String): Object {
    if (!field) {
      console.debug("getField: field is undefined.");
      return null;
    }

    var fields = field.split(".");

    var obj = row[fields[0]];
    for (var i = 1; i < fields.length; i++) {
      obj = obj[fields[i]];
    }
    return obj;
  }

  getRow(i: number): Row {
    if (i > this.viewData.length - 1) {
      return null;
    } else {
      return this.viewData[i];
    }
  }

  handleValueChange(i: number, j: number, key: number, value: any) {
    console.log("handleValueChange: " + i + " " + j + " " + value);

    this.setInputDataValue(key, this.columnDefinitions[j].field, value);

    this.valueSubject.next(new Point(i, j));
  }

  /**
   * TODO: If groupBy, don't just push rows, but check for pre-existing keys and add those rows to existing rowData.
   *
   * @param originalData
   */
  initDataWithOptions(prep: boolean, filter: boolean, sort: boolean, paginate: boolean) {
    if (this.originalData === null) {
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

    this.viewData = new Array<Row>();
    if (this.groupBy !== null) {
      // This is all wrong for sorting... if group by, only search for next common row.
      // If sorting on non group-by fields, then grouping sort of breaks unless those sorted rows still happen to
      // lay next to each other
      let groupColumns: Array<number> = new Array<number>();
      for (var i = 0; i < this.columnDefinitions.length; i++) {
        if (this.columnDefinitions[i].isGroup) {
          groupColumns.push(i);
        }
      }

      for (var i = START; i < END; i++) {
        this.preparedData[i].createHeader(groupColumns);
      }

      let currentHeader: any = null;
      for (var i = START; i < END; i++) {
        if (currentHeader === null) {
          currentHeader = this.preparedData[i].header;
        } else if (this.preparedData[i].header === currentHeader) {
          this.preparedData[i].header = null;
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

  resetUtilityColumns() {
    this.clearSelectedRows();

    for (var i = 0; i < this.preparedData.length; i++) {
      for (var j = 0; j < this.columnDefinitions.length; j++) {
        if (this.columnDefinitions[j].isUtility) {
          if (this.columnDefinitions[j].defaultValue !== undefined) {
            /*if (this.columnDefinitions[j].template === "RowSelectCellComponent" || this.columnDefinitions[j].component === RowSelectCellComponent) {
              this.preparedData[i].get(j).value = false;
            }*/
          } else {
            this.preparedData[i].get(j).value = this.columnDefinitions[j].defaultValue;
          }
        }
      }
    }
  }

  prepareData() {
    console.debug("prepareData: nData: " + this.originalData.length + ", nCols: " + this.columnDefinitions.length);
    this.preparedData = new Array<any>();

    for (var i = 0; i < this.originalData.length; i++) {
      let row: Row = new Row();
      row.rowNum = i;
      for (var j = 0; j < this.columnDefinitions.length; j++) {
        if (this.columnDefinitions[j].isKey) {
          row.key = this.getField(this.originalData[i], this.columnDefinitions[j].field);
        }
        if (this.columnDefinitions[j].field === "GROUPBY") {
          row.add(new Cell({value: "", key: i}));
        } else if (this.columnDefinitions[j].isUtility) {
            row.add(new Cell({value: false}));
        } else {
          row.add(new Cell({value: this.getField(this.originalData[i], this.columnDefinitions[j].field), key: i}));
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
  setOriginalData(originalData: Array<Object>) {
    this.originalData = originalData;

    if (this.pageInfo.getPageSize() === -1 && this.originalData.length > 50) {
      this.pageInfo.setPageSize(10);
    }

    if (this.columnDefinitions === null && this.originalData.length > 0) {
      this.columnDefinitions = new Array<Column>();
      let keys: Array<string> = Object.keys(this.originalData[0]);
      for (var i = 0; i < keys.length; i++) {
        this.columnDefinitions.push(Column.deserialize({ field: keys[i], template: "LabelCell" }));
        this.columnDefinitions = this.columnDefinitions;
      }
    }

    this.initData();
  }

  initData() {
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
  setInputDataValue(key: number, field: string, value: any) {
    var fields = field.split(".");

    var obj = this.originalData[key];
    for (var i = 0; i < fields.length - 1; i++) {
      obj = obj[fields[i]];
    }
    obj[fields[fields.length - 1]] = value;
  }

  setPage(mode: number) {
    if (mode === -2) {
      this.pageInfo.setPage(0);
    } else if (mode === -1 && this.pageInfo.page > 0) {
      this.pageInfo.setPage(this.pageInfo.getPage() - 1);
    } else if (mode === 1 && this.pageInfo.getPage() < this.pageInfo.getNumPages() - 1) {
      this.pageInfo.setPage(this.pageInfo.getPage() + 1);
    } else if (mode === 2) {
      this.pageInfo.setPage(this.pageInfo.getNumPages() - 1);
    }

    if (this.externalPaging) {
      this.externalInfoObserved.next(new ExternalInfo((this.externalFiltering) ? this.filterInfo : null, (this.externalSorting) ? this.sortInfo : null, this.pageInfo));
    } else {
      this.initDataWithOptions(false, !this.externalFiltering, !this.externalSorting, true);
    }
  }

  setPageSize(pageSize: number) {
    this.pageInfo.setPageSize(pageSize);
    this.pageInfo.setPage(0);

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
  sort(field: string) {
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

  sortPreparedData() {
    let sortColumns: Array<number> = new Array<number>();

    if (this.sortInfo.field === null && this.groupBy !== null) {
      this.sortInfo.field = "GROUP_BY";
    }

    if (this.sortInfo.field === "GROUP_BY") {
      for (var i = 0; i < this.columnDefinitions.length; i++) {
        if (this.columnDefinitions[i].isGroup) {
          sortColumns.push(i);
        }
      }
    } else {
      for (var i = 0; i < this.columnDefinitions.length; i++) {
        if (this.columnDefinitions[i].field === this.sortInfo.field) {
          sortColumns.push(i);
          break;
        }
      }
    }

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

  getValueSubject(): Subject<Point> {
    return this.valueSubject;
  }

}
