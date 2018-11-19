/**
 * A holder for the cell's data and other metadata needed for rendering or data management.
 */
export class Cell {
  value: any;
  key: number;
  dirty: boolean = false;

  constructor(o: Object) {
    Object.assign(this, o);
  }
}
