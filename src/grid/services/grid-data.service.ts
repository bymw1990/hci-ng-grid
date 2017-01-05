import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Rx";

import { GridConfigService } from "./grid-config.service";
import { Cell } from "../cell/cell";
import { LabelCell } from "../cell/label-cell.component";
import { Row } from "../row/row";
import { RowGroup } from "../row/row-group";
import { Column } from "../column/column";
import { Range } from "../utils/range";
import { SortInfo } from "../utils/sort-info";
import { PageInfo } from "../utils/page-info";
import { FilterInfo } from "../utils/filter-info";
import { ExternalInfo } from "../utils/external-info";

@Injectable()
export class GridDataService {

  inputData: Object[];
  preparedData: Array<Row>;

  gridData: Array<RowGroup>;
  data = new Subject<Array<RowGroup>>();

  columnDefinitions: Column[] = null;
  refreshGridInit: boolean = false;

  filterInfo: Array<FilterInfo> = new Array<FilterInfo>();

  sortInfo: SortInfo = new SortInfo();
  sortInfoObserved = new Subject<SortInfo>();

  pageInfo: PageInfo = new PageInfo();
  pageInfoObserved = new Subject<PageInfo>();

  externalInfoObserved = new Subject<ExternalInfo>();
  doubleClickObserved = new Subject<Object>();
  cellDataUpdateObserved = new Subject<Range>();

  constructor(private gridConfigService: GridConfigService) {
    this.pageInfo.page = 0;
    this.pageInfo.pageSize = this.gridConfigService.gridConfiguration.pageSize;
  }

  cellDataUpdate(range: Range) {
    this.cellDataUpdateObserved.next(range);
  }

  doubleClickRow(i: number, j: number) {
    this.doubleClickObserved.next(this.gridData[i].rows[j]);
  }

  /**
   * Upon filtering, we check for external filtering and if external, post new ExternalInfo to observable.
   * We will assume that there may be a mix of internal and external filtering/sorting/paging.  If external
   * filtering, we will send an ExternalInfo object, but if the sort/page is internal, set those values to
   * null in the ExternalInfo.  So the external call will filter but we will still rely internally on sorting
   * and paging.
   *
   * Filtering Steps
   * Re-init data.
   * Set page to 0;
   * Filter
   * Sort
   * Paginate
   */
  filter() {
    if(this.gridConfigService.gridConfiguration.externalFiltering) {
      this.filterInfo = new Array<FilterInfo>();
      for (var j = 0; j < this.columnDefinitions.length; j++) {
        if (this.columnDefinitions[j].filterValue !== null && this.columnDefinitions[j].filterValue !== "") {
          this.filterInfo.push(new FilterInfo(this.columnDefinitions[j].field, this.columnDefinitions[j].filterValue));
        }
      }

      this.pageInfo.page = 0;

      this.externalInfoObserved.next(new ExternalInfo(this.filterInfo, (this.gridConfigService.gridConfiguration.externalSorting) ? this.sortInfo : null, (this.gridConfigService.gridConfiguration.externalPaging) ? this.pageInfo : null));
    } else {
      this.pageInfo.page = 0;
      this.initData(true, !this.gridConfigService.gridConfiguration.externalFiltering, !this.gridConfigService.gridConfiguration.externalSorting, !this.gridConfigService.gridConfiguration.externalPaging);
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

  getCell(i: number, j: number, k: number): Cell {
    if (j === -1) {
      return this.gridData[i].getHeader().get(k);
    } else {
      return this.gridData[i].get(j).get(k);
    }
  }

  getField(row: Object, field: String): Object {
    var fields = field.split(".");

    var obj = row[fields[0]];
    for (var i = 1; i < fields.length; i++) {
      obj = obj[fields[i]];
    }
    return obj;
  }

  getRowGroup(i: number): RowGroup {
    return this.gridData[i];
  }

  handleValueChange(i: number, j: number, key: number, k: number, value: any) {
    if (j === -1) {
      for (var n = 0; n < this.gridData[i].length(); n++) {
        this.setInputDataValue(this.gridData[i].get(n).key, this.gridConfigService.gridConfiguration.columnDefinitions[k].field, value);
      }
    } else {
      this.setInputDataValue(key, this.gridConfigService.gridConfiguration.columnDefinitions[k].field, value);
    }
  }

  /**
   * TODO: If groupBy, don't just push rows, but check for pre-existing keys and add those rows to existing rowData.
   *
   * @param inputData
   */
  initData(prep: boolean, filter: boolean, sort: boolean, paginate: boolean) {
    this.columnDefinitions = this.gridConfigService.gridConfiguration.columnDefinitions;
    if (this.inputData === null) {
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

    let START: number = 0;
    let END: number = this.preparedData.length;
    this.pageInfo.nDataSize = this.preparedData.length;

    if (paginate && this.pageInfo.pageSize > 0) {
      START = this.pageInfo.page * this.pageInfo.pageSize;
      END = Math.min(START + this.pageInfo.pageSize, this.pageInfo.nDataSize);
      this.pageInfo.nPages = Math.ceil(this.pageInfo.nDataSize / this.pageInfo.pageSize);
    } else if (!this.gridConfigService.gridConfiguration.externalPaging) {
      this.pageInfo.nPages = 1;
    }
    this.pageInfoObserved.next(this.pageInfo);

    this.gridData = new Array<RowGroup>();
    if (this.gridConfigService.gridConfiguration.groupBy !== null) {
      // This is all wrong for sorting... if group by, only search for next common row.
      // If sorting on non group-by fields, then grouping sort of breaks unless those sorted rows still happen to
      // lay next to each other
      let groupColumns: Array<number> = new Array<number>();
      for (var i = 0; i < this.gridConfigService.gridConfiguration.columnDefinitions.length; i++) {
        if (this.gridConfigService.gridConfiguration.columnDefinitions[i].isGroup) {
          groupColumns.push(i);
        }
      }

      let currentRowGroup: RowGroup = null;
      for (var i = START; i < END; i++) {
        if (currentRowGroup === null) {
          currentRowGroup = new RowGroup();
          currentRowGroup.add(this.preparedData[i]);
          currentRowGroup.createHeader(groupColumns);
        } else if (currentRowGroup.equals(this.preparedData[i], groupColumns)) {
          currentRowGroup.add(this.preparedData[i]);
        } else {
          this.gridData.push(currentRowGroup);
          currentRowGroup = new RowGroup();
          currentRowGroup.add(this.preparedData[i]);
          currentRowGroup.createHeader(groupColumns);
        }
      }
      if (currentRowGroup !== null) {
        this.gridData.push(currentRowGroup);
      }
    } else {
      for (var i = START; i < END; i++) {
        let rowGroup: RowGroup = new RowGroup();
        rowGroup.add(this.preparedData[i]);
        this.gridData.push(rowGroup);
      }
    }

    this.data.next(this.gridData);
  }

  prepareData() {
    this.preparedData = new Array<any>();
    let columnDefinitions: Column[] = this.gridConfigService.gridConfiguration.columnDefinitions;

    for (var i = 0; i < this.inputData.length; i++) {
      let row: Row = new Row();
      row.key = i;
      let header: Row = null;
      for (var j = 0; j < columnDefinitions.length; j++) {
        if (columnDefinitions[j].isUtility) {
          row.add(new Cell({value: columnDefinitions[j].defaultValue}));
        } else {
          row.add(new Cell({value: this.getField(this.inputData[i], columnDefinitions[j].field), key: i}));
        }
      }
      this.preparedData.push(row);
    }
  }

  setInputData(inputData: Array<Object>): boolean {
    this.inputData = inputData;

    if (this.pageInfo.pageSize === -1 && this.inputData.length > 50) {
      this.pageInfo.pageSize = 10;
    }

    if (this.gridConfigService.gridConfiguration.columnDefinitions === null && this.inputData.length > 0) {
      this.columnDefinitions = new Array<Column>();
      let keys: Array<string> = Object.keys(this.inputData[0]);
      for (var i = 0; i < keys.length; i++) {
        this.columnDefinitions.push(new Column({ field: keys[i], template: "LabelCell" }));
        this.gridConfigService.gridConfiguration.columnDefinitions = this.columnDefinitions;
      }
      return true;
    } else {
      return false;
    }
  }

  setInputDataInit() {
    this.initData(true, !this.gridConfigService.gridConfiguration.externalFiltering, !this.gridConfigService.gridConfiguration.externalSorting, !this.gridConfigService.gridConfiguration.externalPaging);
  }

  /**
   * When a cell value updates, we have a i,j,k position and value.  Now this works for updating our internal
   * grid data which is flattened, but our input data could have a complex data structure.  An list of Person
   * may have a field like demographics.firstName which is in its own demographic object within person.
   *
   * @param rowIndex
   * @param field
   * @param value
   */
  setInputDataValue(key: number, field: string, value: any) {
    var fields = field.split(".");

    var obj = this.inputData[key];
    for (var i = 0; i < fields.length - 1; i++) {
      obj = obj[fields[i]];
    }
    obj[fields[fields.length - 1]] = value;
  }

  setPage(mode: number) {
    if (mode === -2) {
      this.pageInfo.page = 0;
    } else if (mode === -1 && this.pageInfo.page > 0) {
      this.pageInfo.page = this.pageInfo.page - 1;
    } else if (mode === 1 && this.pageInfo.page < this.pageInfo.nPages - 1) {
      this.pageInfo.page = this.pageInfo.page + 1;
    } else if (mode === 2) {
      this.pageInfo.page = this.pageInfo.nPages - 1;
    }

    if (this.gridConfigService.gridConfiguration.externalPaging) {
      this.externalInfoObserved.next(new ExternalInfo((this.gridConfigService.gridConfiguration.externalFiltering) ? this.filterInfo : null, (this.gridConfigService.gridConfiguration.externalSorting) ? this.sortInfo : null, this.pageInfo));
    } else {
      this.initData(false, !this.gridConfigService.gridConfiguration.externalFiltering, !this.gridConfigService.gridConfiguration.externalSorting, true);
    }
  }

  setPageSize(pageSize: number) {
    this.pageInfo.pageSize = pageSize;
    this.pageInfo.page = 0;

    if (this.gridConfigService.gridConfiguration.externalPaging) {
      this.externalInfoObserved.next(new ExternalInfo((this.gridConfigService.gridConfiguration.externalFiltering) ? this.filterInfo : null, (this.gridConfigService.gridConfiguration.externalSorting) ? this.sortInfo : null, this.pageInfo));
    } else {
      this.initData(false, !this.gridConfigService.gridConfiguration.externalFiltering, !this.gridConfigService.gridConfiguration.externalSorting, this.pageInfo.pageSize > 0);
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

    if(this.gridConfigService.gridConfiguration.externalSorting) {
      this.externalInfoObserved.next(new ExternalInfo((this.gridConfigService.gridConfiguration.externalFiltering) ? this.filterInfo : null, this.sortInfo, (this.gridConfigService.gridConfiguration.externalPaging) ? this.pageInfo : null));
    } else {
      this.initData(false, !this.gridConfigService.gridConfiguration.externalFiltering, true, !this.gridConfigService.gridConfiguration.externalPaging);
    }
  }

  sortPreparedData() {
    let sortColumns: Array<number> = new Array<number>();

    if (this.sortInfo.field === null && this.gridConfigService.gridConfiguration.groupBy !== null) {
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

}
