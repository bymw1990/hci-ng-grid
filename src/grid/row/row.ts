import { Cell } from "../cell/cell";

/**
 *
 */
export class Row {
  cells: Array<Cell> = new Array<Cell>();
  private _key: any;
  private _visible: boolean = true;

  add(cell: Cell) {
    this.cells.push(cell);
  }

  get(i: number): Cell {
    return this.cells[i];
  }

  length(): number {
    return this.cells.length;
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(visible: boolean) {
    this._visible = visible;
  }

  get key(): any {
    return this._key;
  }

  set key(key: any) {
    this._key = key;
  }
}
