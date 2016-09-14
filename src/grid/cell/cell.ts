export class Cell {
  private _value: any = null;
  private _key: number = null;

  constructor(o: Object) {
    Object.assign(this, o);
  }

  get value() {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
  }

  get key() {
    return this._key;
  }

  set key(key: number) {
    this._key = key;
  }
}
