export class SortInfo {
  private _asc: boolean = true;
  private _field: string = null;

  get asc(): boolean {
    return this._asc;
  }

  set asc(asc: boolean) {
    this._asc = asc;
  }

  get field(): string {
    return this._field;
  }

  set field(field: string) {
    this._field = field;
  }
}
