import {Cell} from "../cell/cell";
import {Row} from "./row";

/**
 *
 */
export class RowGroup {

  HIDDEN: number = 0;
  COLLAPSED: number = 1;
  EXPANDED: number = 2;

  state: number = this.EXPANDED;
  header: Row = null;
  rows: Array<Row> = new Array<Row>();

  createHeader(headerColumns: Array<number>) {
    if (this.rows.length > 0) {
      this.header = new Row();
      for (var i = 0; i < headerColumns.length; i++) {
        this.header.add(new Cell({ value: this.rows[0].get(headerColumns[i]).value }));
      }
    }
  }

  hasHeader(): boolean {
    return this.header !== null;
  }

  isExpanded(): boolean {
    return this.state === this.EXPANDED;
  }

  isCollaposed(): boolean {
    return this.state === this.COLLAPSED;
  }

  add(row: Row) {
    this.rows.push(row);
  }

  length(): number {
    return this.rows.length;
  }

  equals(row: Row, compareIndexes: Array<number>): boolean {
    if (this.header == null) {
      return false;
    }
    let v: number = 0;
    for (var i = 0; i < compareIndexes.length; i++) {
      if (typeof this.header.get(i).value === "number") {
        v = this.header.get(i).value - row.get(compareIndexes[i]).value;
      } else if (typeof this.header.get(i).value === "string") {
        if (this.header.get(i).value < row.get(compareIndexes[i]).value) {
          v = -1;
        } else if (this.header.get(i).value > row.get(compareIndexes[i]).value) {
          v = 1;
        }
      }
      if (v !== 0) {
        return false;
      }
    }
    return true;
  }

  get(j: number): Row {
    return this.rows[j];
  }

  getHeader(): Row {
    return this.header;
  }

  setHeader(header: Row) {
    this.header = header;
  }

}
