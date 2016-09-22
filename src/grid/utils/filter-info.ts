export class FilterInfo {
  private _field: string = null;
  private _value: any = null;

  constructor(field: string, value: any) {
    this._field = field;
    this._value = value;
  }

  get field(): string {
    return this._field;
  }

  set field(field: string) {
    this._field = field;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
  }
}
