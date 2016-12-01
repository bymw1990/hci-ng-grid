export class EventMeta {

  private _alt: boolean = false;
  private _ctrl: boolean = false;
  private _shift: boolean = false;

  constructor(alt: boolean, ctrl: boolean, shift: boolean) {
    this._alt = alt;
    this._ctrl = ctrl;
    this._shift = shift;
  }

  isNull(): boolean {
    return !this._alt && !this._ctrl && !this._shift;
  }

  toString(): string {
    return "EventMeta(" + this._alt + "," + this._ctrl + "," + this._shift + ")";
  }

  get alt(): boolean {
    return this._alt;
  }

  set alt(alt: boolean) {
    this._alt = alt;
  }

  get ctrl(): boolean {
    return this._ctrl;
  }

  set ctrl(ctrl: boolean) {
    this._ctrl = ctrl;
  }

  get shift(): boolean {
    return this._shift;
  }

  set shift(shift: boolean) {
    this._shift = shift;
  }

}
