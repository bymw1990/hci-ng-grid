import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Rx";

import { GridConfigService } from "./grid-config.service";
import { RowData } from "../row/row-data";
import { Column } from "../column";

@Injectable()
export class GridDataService {

  inputData: Object[];
  gridData: Array<RowData>;
  data = new Subject<Array<RowData>>();

  constructor(private gridConfigService: GridConfigService) {}

  handleValueChange(i: number, j: number, value: any) {
    console.log("GridDataService.addDataObserver: " + i + ":" + j + ":" + value);
    //this.inputData[i][this.gridConfigService.gridConfiguration.columnDefinitions[j].field] = value;
    this.setInputData(i, this.gridConfigService.gridConfiguration.columnDefinitions[j].field, value);
  }

  /**
   * When a cell value updates, we have a i,j,k position and value.  Now this works for updating our internal
   * grid data which is flattened, but our input data could have a complex data structure.  An list of Person
   * may have a field like demographics.firstName which is in its own demographic object within person.
   *
   * @param rowIndex
   * @param field
   * @param value
   */
  setInputData(rowIndex: number, field: string, value: any) {
    var fields = field.split(".");

    var obj = this.inputData[rowIndex];
    for (var i = 0; i < fields.length - 1; i++) {
      obj = obj[fields[i]];
    }
    obj[fields[fields.length - 1]] = value;
  }

  getRow(i: number): RowData {
    return this.gridData[i];
  }

  /**
   * TODO: If groupBy, don't just push rows, but check for pre-existing keys and add those rows to existing rowData.
   *
   * @param inputData
   */
  setGridData(inputData: Array<Object>): void {
    console.log("setData");
    this.inputData = inputData;
    //console.log(this.gridConfigService.gridConfiguration.columnDefinitions);
    let columnDefinitions: Column[] = this.gridConfigService.gridConfiguration.columnDefinitions;

    this.gridData = new Array<RowData>();
    for (var i = 0; i < inputData.length; i++) {
      let rowData: Array<any> = new Array<any>();

      for (var j = 0; j < columnDefinitions.length; j++) {
        //console.log("createGridData col " + j);
        //console.log(this.columnDefinitions[j]);
        //this.gridData[i][j] = { "value": 0 };
        //this.gridData[i][j].value = this.getField(this.inputData[i], this.columnDefinitions[j].field);
        rowData.push({ "value": this.getField(inputData[i], columnDefinitions[j].field) });
      }
      let row: RowData = new RowData();
      row.pushRowData(rowData);
      this.gridData.push(row);
    }
    this.data.next(this.gridData);
  }

  getField(row: Object, field: String): Object {
    console.log("getField of " + field);
    var fields = field.split(".");

    var obj = row[fields[0]];
    for (var i = 1; i < fields.length; i++) {
      obj = obj[fields[i]];
    }
    return obj;
  }
}
