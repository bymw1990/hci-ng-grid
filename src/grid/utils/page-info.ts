export class PageInfo {

  private _page: number = 0;
  private _pageSize: number = 10;
  private _nDataSize: number = 0;
  private _nPages: number = 0;

  get page(): number {
    return this._page;
  }
  set page(page: number) {
    this._page = page;
  }

  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(pageSize: number) {
    this._pageSize = pageSize;
  }

  get nDataSize(): number {
    return this._nDataSize;
  }
  set nDataSize(nDataSize: number) {
    this._nDataSize = nDataSize;
  }

  get nPages(): number {
    return this._nPages;
  }
  set nPages(nPages: number) {
    this._nPages = nPages;
  }
}
