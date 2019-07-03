import {Cell} from "../cell/cell";

/**
 *
 */
export class Row {

  cells: Cell[] = [];
  data: Object = {};
  //size: number = 1;

  i: number;
  private _key: any;
  private _rowNum: number;
  private _groupKey: string;
  private _selected: boolean = false;
  private _visible: boolean = true;

  equals(row: Row, compareIndexes: number[]): boolean {
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

  isDirty(): boolean {
    for (let cell of this.cells) {
      if (cell.dirty) {
        return true;
      }
    }

    return false;
  }

  createGroupKey(headerColumns: number[]): string {
    this._groupKey = undefined;
    for (var i = 0; i < headerColumns.length; i++) {
      this._groupKey = this._groupKey === undefined ? this.cells[headerColumns[i]].value : this._groupKey + "," + this.cells[headerColumns[i]].value;
    }
    return this._groupKey;
  }

  getHeader(headerColumns: number[]): string {
    let header: string = undefined;
    for (var i = 0; i < headerColumns.length; i++) {
      header = header === undefined ? this.cells[headerColumns[i]].value : header + ", " + this.cells[headerColumns[i]].value;
    }
    return header;
  }

  getConcatenatedCells() {
    let all: string = undefined;
    for (let cell of this.cells) {
      all = (all === undefined) ? cell.value : all + ", " + cell.value;
    }
    return all;
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

  get groupKey(): string {
    return this._groupKey;
  }

  set groupKey(groupKey: string) {
    this._groupKey = groupKey;
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

  get rowNum(): any {
    return this._rowNum;
  }

  set rowNum(rowNum: any) {
    this._rowNum = rowNum;
  }

  get selected(): any {
    return this._selected;
  }

  set selected(selected: any) {
    this._selected = selected;
  }
}
