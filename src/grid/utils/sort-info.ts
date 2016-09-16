export class SortInfo {
  private _asc: boolean = true;
  private _column: string = null;

  get asc(): boolean {
    return this._asc;
  }

  set asc(asc: boolean) {
    this._asc = asc;
  }

  get column(): string {
    return this._column;
  }

  set column(column: string) {
    this._column = column;
  }
}
