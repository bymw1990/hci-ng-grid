import { Column } from "../column";
import { GroupCollapseExpandCell } from "../cell/group-collapse-expand.component";

export class GridConfiguration {

  private _nUtilityColumns: number = 0;
  private _columnDefinitions: Column[];
  private _groupBy: string[] = null;
  private _externalFiltering: boolean = false;
  private _externalSorting: boolean = false;

  init() {
    if (this._groupBy !== null) {
      let groupColumnExists: boolean = false;
      for (var i = 0; i < this._columnDefinitions.length; i++) {
        if (this._columnDefinitions[i].field === "GROUP_COLLAPSE_EXPAND") {
          groupColumnExists = true;
        }
      }
      if (!groupColumnExists) {
        this._columnDefinitions.push(new Column({ field: "GROUP_COLLAPSE_EXPAND", name: "", sortOrder: -1, template: GroupCollapseExpandCell }));
        this.sortColumnDefinitions();
      }
    }
    let n: number = this._columnDefinitions.length;
    let width: number = 100;
    if (this._groupBy !== null) {
      width = width - 5;
      n = n - 1;
    }
    for (var i = 0; i < this._columnDefinitions.length; i++) {
      if (this._columnDefinitions[i].sortOrder < 0) {
        this._columnDefinitions[i].width = 5;
      } else {
        this._columnDefinitions[i].width = width / n;
      }
    }
  }

  get columnDefinitions() {
    return this._columnDefinitions;
  }

  set columnDefinitions(columnDefinitions: Column[]) {
    this._columnDefinitions = columnDefinitions;
    this.initColumnDefinitions();
    this.sortColumnDefinitions();
  }

  initColumnDefinitions() {
    for (var i = 0; i < this._columnDefinitions.length; i++) {
      this._columnDefinitions[i].sortOrder = i;
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
  }

  get groupBy() {
    return this._groupBy;
  }

  set groupBy(groupBy: string[]) {
    this._groupBy = groupBy;
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
