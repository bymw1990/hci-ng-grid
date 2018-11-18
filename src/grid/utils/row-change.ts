export class RowChange {

  oldRowNum: number;
  newRowNum: number;

  constructor(oldRowNum: number, newRowNum: number) {
    this.oldRowNum = oldRowNum;
    this.newRowNum = newRowNum;
  }
}
