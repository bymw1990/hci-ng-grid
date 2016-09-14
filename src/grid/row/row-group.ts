import { Cell } from "../cell/cell";
import { Row } from "./row";

/**
 *
 */
export class RowGroup {
  header: Row = null;
  rows: Array<Row> = new Array<Row>();

  add(row: Row) {
    this.rows.push(row);
  }

  length(): number {
    return this.rows.length;
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

  equals(otherHeader: Row): boolean {
    if (this.header == null) {
      return false;
    } else if (this.header.length() !== otherHeader.length()) {
      return false;
    } else {
      for (var i = 0; i < this.header.length(); i++) {
        if (this.header.get(i).key === 0 && this.header.get(i).value !== otherHeader.get(i).value) {
          return false;
        }
      }
      return true;
    }
  }
}
