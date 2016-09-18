import { Column } from "../column/column";
import { GroupCollapseExpandCell } from "../cell/group-collapse-expand.component";

export class GridConfiguration {

  private _nUtilityColumns: number = 0;
  private _columnDefinitions: Column[];
  private _fixedColumns: string[] = null;
  private _groupBy: string[] = null;
  private _externalFiltering: boolean = false;
  private _externalSorting: boolean = false;

  init() {
    /*for (var i = 0; i < this._columnDefinitions.length; i++) {
      if (!this._columnDefinitions[i].visible) {
        this._columnDefinitions[i].sortOrder = -9;
        //this._nUtilityColumns = this._nUtilityColumns + 1;
      }
    }*/

    this.initColumnDefinitions();
    this.sortColumnDefinitions();

    /*if (this._groupBy !== null) {
      let groupColumnExists: boolean = false;
      for (var i = 0; i < this._columnDefinitions.length; i++) {
        if (this._columnDefinitions[i].field === "GROUP_COLLAPSE_EXPAND") {
          groupColumnExists = true;
        }
      }
      if (!groupColumnExists) {
        this._columnDefinitions.push(new Column({ field: "GROUP_COLLAPSE_EXPAND", name: "", sortOrder: -1, template: GroupCollapseExpandCell, isUtility: true, defaultValue: "collapsed" }));
        this.sortColumnDefinitions();
      }
    }*/
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

  initColumnDefinitions() {
    let nGroupBy: number = 0;
    let nFixedColumns: number = 0;
    if (this._groupBy !== null) {
      nGroupBy = this._groupBy.length;
    }
    if (this._fixedColumns !== null) {
      nFixedColumns = this._fixedColumns.length;
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

  get groupBy() {
    return this._groupBy;
  }

  set groupBy(groupBy: string[]) {
    this._groupBy = groupBy;
  }

  get fixedColumns() {
    return this._fixedColumns;
  }

  set fixedColumns(fixedColumns: string[]) {
    this._fixedColumns = fixedColumns;
  }

  get externalFiltering() {
    return this._externalFiltering;
  }

  set externalFiltering(externalFiltering: boolean) {
    this._externalFiltering = externalFiltering;
  }

  get externalSorting() {
    return this._externalSorting;
  }

  set externalSorting(externalSorting: boolean) {
    this._externalSorting = externalSorting;
  }

  get nUtilityColumns() {
    return this._nUtilityColumns;
  }

  set nUtilityColumns(nUtilityColumns: number) {
    this._nUtilityColumns = nUtilityColumns;
  }
}
