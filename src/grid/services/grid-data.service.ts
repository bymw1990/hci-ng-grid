import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Rx";

import { GridConfigService } from "./grid-config.service";
import { Cell } from "../cell/cell";
import { Row } from "../row/row";
import { RowGroup } from "../row/row-group";
import { Column } from "../column";

@Injectable()
export class GridDataService {

  inputData: Object[];
  gridData: Array<RowGroup>;
  data = new Subject<Array<RowGroup>>();

  constructor(private gridConfigService: GridConfigService) {}

  getCell(i: number, j: number, k: number): Cell {
    //let dataColumnOffset: number = this.gridConfigService.gridConfiguration.nUtilityColumns;
    if (j === -1) {
      return this.gridData[i].getHeader().get(k);
    } else {
      return this.gridData[i].get(j).get(k);
    }
  }

  handleValueChange(i: number, j: number, key: number, k: number, value: any) {
    console.log("GridDataService.handleValueChange: " + key + ":" + k + ":" + value);
    if (j === -1) {
      for (var n = 0; n < this.gridData[i].length(); n++) {
        this.setInputData(this.gridData[i].get(n).key, this.gridConfigService.gridConfiguration.columnDefinitions[k].field, value);
      }
    } else {
      this.setInputData(key, this.gridConfigService.gridConfiguration.columnDefinitions[k].field, value);
    }
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
  setInputData(key: number, field: string, value: any) {
    var fields = field.split(".");

    // Can't get by rowIndex anymore, need to use a key!! oorrrrr... generate a key based on initial position to use as future reference???  hmmmmm....
    // Would be impervious to any internal filtering/sorting.  Would break if inputData is modified outside of grid but that would be expected, so who cares.
    var obj = this.inputData[key];
    for (var i = 0; i < fields.length - 1; i++) {
      obj = obj[fields[i]];
    }
    obj[fields[fields.length - 1]] = value;
  }

  getRowGroup(i: number): RowGroup {
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
    let columnDefinitions: Column[] = this.gridConfigService.gridConfiguration.columnDefinitions;

    this.gridData = new Array<RowGroup>();
    for (var i = 0; i < inputData.length; i++) {
      let row: Row = new Row();
      row.key = i;
      let header: Row = null;

      for (var j = 0; j < columnDefinitions.length; j++) {
        if (columnDefinitions[j].isUtility) {
          row.add(new Cell({ value: columnDefinitions[j].defaultValue }));
        } else {
          row.add(new Cell({ value: this.getField(inputData[i], columnDefinitions[j].field), key: i }));
        }

        if (columnDefinitions[j].isGroup) {
          if (header === null) {
            header = new Row();
          }
          header.add(new Cell({ value: this.getField(inputData[i], columnDefinitions[j].field), key: 0 }));
        } else if (columnDefinitions[j].isUtility) {
          if (header === null) {
            header = new Row();
          }
          header.add(new Cell({ value: columnDefinitions[j].defaultValue, key: -1 }));
        }
      }

      let headerExists: boolean = false;
      if (header !== null) {
        for (var ii = 0; ii < this.gridData.length; ii++) {
          if (this.gridData[ii].equals(header)) {
            this.gridData[ii].add(row);
            headerExists = true;
            break;
          }
        }
      }
      if (!headerExists) {
        let rowGroup: RowGroup = new RowGroup();
        rowGroup.setHeader(header);
        rowGroup.add(row);
        this.gridData.push(rowGroup);
      }
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
