export class PageInfo {

  public page: number = 0;
  public pageSize: number = 10;
  public dataSize: number = 0;
  public numPages: number = 0;

  constructor() {
    this.page = 0;
    this.pageSize = 10;
    this.dataSize = 0;
    this.numPages = 0;
  }

  getPage(): number {
    return this.page;
  }
  setPage(page: number) {
    this.page = page;
  }

  getPageSize(): number {
    return this.pageSize;
  }
  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
  }

  getDataSize(): number {
    return this.dataSize;
  }
  setDataSize(dataSize: number) {
    this.dataSize = dataSize;
  }

  getNumPages(): number {
    return this.numPages;
  }
  setNumPages(numPages: number) {
    this.numPages = numPages;
  }
}
