import { Column } from "../column/column";
import { RowSelectCellComponent } from "../cell/row-select-cell.component";

export class GridConfiguration {

  private _rowSelect: boolean = false;
  private _cellSelect: boolean = false;
  private _keyNavigation: boolean = false;
  private _nUtilityColumns: number = 0;
  private _columnDefinitions: Column[];
  private _fixedColumns: string[] = null;
  private _groupBy: string[] = null;
  private _externalFiltering: boolean = false;
  private _externalSorting: boolean = false;
  private _externalPaging: boolean = false;
  private _pageSize: number = 10;
  private _pageSizes: number[] = [ 10, 25, 50 ];

  init() {
    this.initColumnDefinitions();
    this.sortColumnDefinitions();

    let nLeft: number = 0;
    let wLeft: number = 100;
    let nRight: number = this._columnDefinitions.length;
    let wRight: number = 100;

    for (var i = 0; i < this._columnDefinitions.length; i++) {
      if (this._columnDefinitions[i].sortOrder < 0) {
        nLeft = nLeft + 1;
        nRight = nRight - 1;
        wLeft = wLeft - 10;
      } else if (this._columnDefinitions[i].isFixed && this._columnDefinitions[i].visible) {
        nLeft = nLeft + 1;
        nRight = nRight - 1;
      } else if (!this._columnDefinitions[i].isFixed && !this._columnDefinitions[i].visible) {
        nRight = nRight - 1;
      }
    }
    for (var i = 0; i < this._columnDefinitions.length; i++) {
      if (!this._columnDefinitions[i].visible) {
        this._columnDefinitions[i].width = 0;
      } else if (this._columnDefinitions[i].sortOrder < 0) {
        this._columnDefinitions[i].width = 5;
      } else if (this._columnDefinitions[i].isFixed) {
        this._columnDefinitions[i].width = wLeft / nLeft;
      } else {
        this._columnDefinitions[i].width = wRight / nRight;
      }
    }
  }

  get columnDefinitions() {
    return this._columnDefinitions;
  }

  set columnDefinitions(columnDefinitions: Column[]) {
    this._columnDefinitions = columnDefinitions;
  }

  getKeyColumns(): Array<number> {
    let keys: Array<number> = new Array<number>();
    for (var i = 0; i < this._columnDefinitions.length; i++) {
      if (this._columnDefinitions[i].isKey) {
        keys.push(i);
      }
    }
    return keys;
  }

  initColumnDefinitions() {
    let nGroupBy: number = 0;
    let nFixedColumns: number = 0;
    if (this._groupBy !== null) {
      nGroupBy = this._groupBy.length;
    }
    if (this._fixedColumns !== null) {
      nFixedColumns = this._fixedColumns.length;
    }

    if (this._rowSelect) {
      let rowSelectColumn: Column = new Column({ name: "", template: RowSelectCellComponent, minWidth: 30, maxWidth: 30 });
      rowSelectColumn.sortOrder = -10;
      rowSelectColumn.isUtility = true;
      this._columnDefinitions.push(rowSelectColumn);
    }

    let hasFilter: boolean = false;
    for (var i = 0; i < this._columnDefinitions.length; i++) {
      if (this._columnDefinitions[i].filterType !== null) {
        hasFilter = true;
      }
    }

    for (var i = 0; i < this._columnDefinitions.length; i++) {
      if (this._columnDefinitions[i].filterType === null && hasFilter) {
        this._columnDefinitions[i].filterType = "";
      }

      if (this._columnDefinitions[i].isUtility) {
        continue;
      }

      let m: number = 0;
      let k: number = i;
      for (var j = 0; j < nGroupBy; j++) {
        if (this._columnDefinitions[i].field === this._groupBy[j]) {
          this._columnDefinitions[i].isGroup = true;
          this._columnDefinitions[i].visible = false;
          k = j;
          m = 1;
          break;
        }
      }
      if (m === 0) {
        for (var j = 0; j < nFixedColumns; j++) {
          if (this._columnDefinitions[i].field === this._fixedColumns[j]) {
            this._columnDefinitions[i].isFixed = true;
            k = j;
            m = 2;
            break;
          }
        }
      }

      if (m === 0) {
        this._columnDefinitions[i].sortOrder = nGroupBy + nFixedColumns + k;
      } else if (m === 1) {
        this._columnDefinitions[i].sortOrder = nGroupBy + k;
      } else if (m === 2) {
        this._columnDefinitions[i].sortOrder = k;
      }
    }
  }

  sortColumnDefinitions() {
    this._columnDefinitions = this._columnDefinitions.sort((a: Column, b: Column) => {
      if (a.sortOrder < b.sortOrder) {
        return -1;
      } else if (a.sortOrder > b.sortOrder) {
        return 1;
      } else {
        return 0;
      }
    });

    for (var i = 0; i < this._columnDefinitions.length; i++) {
      this._columnDefinitions[i].id = i;
    }
  }

  get cellSelect(): boolean {
    return this._cellSelect;
  }

  set cellSelect(cellSelect: boolean) {
    this._cellSelect = cellSelect;
  }

  get rowSelect(): boolean {
    return this._rowSelect;
  }

  set rowSelect(rowSelect: boolean) {
    this._rowSelect = rowSelect;
  }

  get groupBy(): string[] {
    return this._groupBy;
  }

  set groupBy(groupBy: string[]) {
    this._groupBy = groupBy;
  }

  get fixedColumns(): string[] {
    return this._fixedColumns;
  }

  set fixedColumns(fixedColumns: string[]) {
    this._fixedColumns = fixedColumns;
  }

  get externalFiltering(): boolean {
    return this._externalFiltering;
  }

  set externalFiltering(externalFiltering: boolean) {
    this._externalFiltering = externalFiltering;
  }

  get externalSorting(): boolean {
    return this._externalSorting;
  }

  set externalSorting(externalSorting: boolean) {
    this._externalSorting = externalSorting;
  }

  get externalPaging(): boolean {
    return this._externalPaging;
  }

  set externalPaging(externalPaging: boolean) {
    this._externalPaging = externalPaging;
  }

  get keyNavigation(): boolean {
    return this._keyNavigation;
  }

  set keyNavigation(keyNavigation: boolean) {
    this._keyNavigation = keyNavigation;
  }

  get nUtilityColumns(): number {
    return this._nUtilityColumns;
  }

  set nUtilityColumns(nUtilityColumns: number) {
    this._nUtilityColumns = nUtilityColumns;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(pageSize: number) {
    this._pageSize = pageSize;
  }

  get pageSizes(): number[] {
    return this._pageSizes;
  }

  set pageSizes(pageSizes: number[]) {
    this._pageSizes = pageSizes;
  }
}