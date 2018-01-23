import {Injectable} from "@angular/core";

import {Subject} from "rxjs/Subject";

import {Column} from "../column/column";

@Injectable()
export class GridConfigService {

  columnsChangedSubject: Subject<boolean> = new Subject<boolean>();

  columnHeaders: boolean = true;
  rowSelect: boolean = false;
  cellSelect: boolean = false;
  keyNavigation: boolean = false;
  nUtilityColumns: number = 0;
  columnDefinitions: Column[] = null;
  fixedColumns: string[] = null;
  groupBy: string[] = null;
  externalFiltering: boolean = false;
  externalSorting: boolean = false;
  externalPaging: boolean = false;
  pageSize: number = -1;
  pageSizes: number[] = [10, 25, 50];

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
    if (config.nUtilityColumns !== undefined) {
      if (this.nUtilityColumns !== config.nUtilityColumns) {
        columnsChanged = true;
      }
      this.nUtilityColumns = config.nUtilityColumns;
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
      this.pageSize = config.pageSize;
    }
    if (config.pageSizes !== undefined) {
      this.pageSizes = config.pageSizes;
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

    let nLeft: number = 0;
    let wLeft: number = 100;
    let nRight: number = this.columnDefinitions.length;
    let wRight: number = 100;

    for (var i = 0; i < this.columnDefinitions.length; i++) {
      if (this.columnDefinitions[i].sortOrder < 0) {
        nLeft = nLeft + 1;
        nRight = nRight - 1;
        wLeft = wLeft - 10;
      } else if (this.columnDefinitions[i].isFixed && this.columnDefinitions[i].visible) {
        nLeft = nLeft + 1;
        nRight = nRight - 1;
      } else if (!this.columnDefinitions[i].isFixed && !this.columnDefinitions[i].visible) {
        nRight = nRight - 1;
      }
    }
    for (var i = 0; i < this.columnDefinitions.length; i++) {
      if (!this.columnDefinitions[i].visible) {
        this.columnDefinitions[i].width = 0;
      } else if (this.columnDefinitions[i].sortOrder < 0) {
        this.columnDefinitions[i].width = 5;
      } else if (this.columnDefinitions[i].isFixed) {
        this.columnDefinitions[i].width = wLeft / nLeft;
      } else {
        this.columnDefinitions[i].width = wRight / nRight;
      }
    }
  }

  getColumnDefinitions() {
    return this.columnDefinitions;
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
    let nGroupBy: number = 0;
    let nFixedColumns: number = 0;
    if (this.groupBy !== null) {
      nGroupBy = this.groupBy.length;
    }
    if (this.fixedColumns !== null) {
      nFixedColumns = this.fixedColumns.length;
    }

    if (this.rowSelect) {
      let rowSelectColumn: Column = Column.deserialize({ name: "", template: "RowSelectCellComponent", minWidth: 30, maxWidth: 30 });
      rowSelectColumn.sortOrder = -10;
      rowSelectColumn.isUtility = true;
      this.columnDefinitions.push(rowSelectColumn);
    }

    let hasFilter: boolean = false;
    for (var i = 0; i < this.columnDefinitions.length; i++) {
      if (this.columnDefinitions[i].filterType !== null) {
        hasFilter = true;
      }
    }

    this.columnHeaders = false;
    for (var i = 0; i < this.columnDefinitions.length; i++) {
      if (this.columnDefinitions[i].name !== null) {
        this.columnHeaders = true;
      }
      if (this.columnDefinitions[i].filterType === null && hasFilter) {
        this.columnDefinitions[i].filterType = "";
      }

      if (this.columnDefinitions[i].isUtility) {
        continue;
      }

      let m: number = 0;
      let k: number = i;
      for (var j = 0; j < nGroupBy; j++) {
        if (this.columnDefinitions[i].field === this.groupBy[j]) {
          this.columnDefinitions[i].isGroup = true;
          this.columnDefinitions[i].visible = false;
          k = j;
          m = 1;
          break;
        }
      }
      if (m === 0) {
        for (var j = 0; j < nFixedColumns; j++) {
          if (this.columnDefinitions[i].field === this.fixedColumns[j]) {
            this.columnDefinitions[i].isFixed = true;
            k = j;
            m = 2;
            break;
          }
        }
      }

      if (m === 0) {
        this.columnDefinitions[i].sortOrder = nGroupBy + nFixedColumns + k;
      } else if (m === 1) {
        this.columnDefinitions[i].sortOrder = nGroupBy + k;
      } else if (m === 2) {
        this.columnDefinitions[i].sortOrder = k;
      }
    }
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

    for (var i = 0; i < this.columnDefinitions.length; i++) {
      this.columnDefinitions[i].id = i;
    }
  }

  getColumnsChangedSubject(): Subject<boolean> {
    return this.columnsChangedSubject;
  }

}
