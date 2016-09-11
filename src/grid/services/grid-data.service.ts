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
    this.inputData[i][this.gridConfigService.gridConfiguration.columnDefinitions[j].field] = value;
    //this.selectedLocationObservable.subscribe(observer);
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
