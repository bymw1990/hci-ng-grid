import { Cell } from "../cell/cell";

/**
 *
 */
export class Row {
  cells: Array<Cell> = new Array<Cell>();
  private _key: any;
  private _visible: boolean = true;

  equals(row: Row, compareIndexes: Array<number>): boolean {
    if (this.length() !== row.length()) {
      return false;
    }
    let v: number = 0;
    for (var i = 0; i < compareIndexes.length; i++) {
      if (typeof this.get(compareIndexes[i]).value === "number") {
        v = this.get(compareIndexes[i]).value - row.get(compareIndexes[i]).value;
      } else if (typeof this.get(compareIndexes[i]).value === "string") {
        if (this.get(compareIndexes[i]).value < row.get(compareIndexes[i]).value) {
          v = -1;
        } else if (this.get(compareIndexes[i]).value > row.get(compareIndexes[i]).value) {
          v = 1;
        }
      }
      if (v !== 0) {
        return false;
      }
    }
    return true;
  }

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
