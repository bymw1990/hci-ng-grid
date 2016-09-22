import { FilterInfo } from "./filter-info";
import { PageInfo } from "./page-info";
import { SortInfo } from "./sort-info";

export class ExternalInfo {
  private _filter: Array<FilterInfo>;
  private _sort: SortInfo;
  private _page: PageInfo;

  constructor(filter: Array<FilterInfo>, sort: SortInfo, page: PageInfo) {
    this._filter = filter;
    this._sort = sort;
    this._page = page;
  }

  get filter(): Array<FilterInfo> {
    return this._filter;
  }

  set filter(filter: Array<FilterInfo>) {
    this._filter = filter;
  }

  get sort(): SortInfo {
    return this._sort;
  }

  set sort(sort: SortInfo) {
    this._sort = sort;
  }

  get page(): PageInfo {
    return this._page;
  }

  set page(page: PageInfo) {
    this._page = page;
  }
}
