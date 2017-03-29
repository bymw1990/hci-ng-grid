import { FilterInfo } from "./filter-info";
import { PageInfo } from "./page-info";
import { SortInfo } from "./sort-info";

export class ExternalInfo {
  public filter: Array<FilterInfo>;
  public sort: SortInfo;
  public page: PageInfo;

  constructor(filter: Array<FilterInfo>, sort: SortInfo, page: PageInfo) {
    this.filter = filter;
    this.sort = sort;
    this.page = page;
  }

  getFilter(): Array<FilterInfo> {
    return this.filter;
  }

  setFilter(filter: Array<FilterInfo>) {
    this.filter = filter;
  }

  getSort(): SortInfo {
    return this.sort;
  }

  setSort(sort: SortInfo) {
    this.sort = sort;
  }

  getPage(): PageInfo {
    return this.page;
  }

  setPage(page: PageInfo) {
    this.page = page;
  }
}
