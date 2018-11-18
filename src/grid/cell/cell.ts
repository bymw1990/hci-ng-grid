export class Cell {
  value: any;
  key: number;
  dirty: boolean = false;

  constructor(o: Object) {
    Object.assign(this, o);
  }
}
