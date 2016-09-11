/**
 *
 */
export class RowData {
  data: Array<any> = new Array<any>();

  pushRowData(row: Array<any>) {
    //this.rowGroup.push(row);
    this.data = row;
  }

}
