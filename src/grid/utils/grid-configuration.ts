import { Column } from "../column";

export class GridConfiguration {

  private _columnDefinitions: Column[];
  private _groupBy: string[];
  private _externalFiltering: boolean = false;
  private _externalSorting: boolean = false;

  get columnDefinitions() {
    return this._columnDefinitions;
  }

  set columnDefinitions(columnDefinitions: Column[]) {
    this._columnDefinitions = columnDefinitions;
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
}
