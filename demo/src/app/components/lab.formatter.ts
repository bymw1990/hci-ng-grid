import {FormatterParser} from "hci-ng-grid";

export class LabFP extends FormatterParser {

  formatValue(value: any): string {
    if (value === undefined || value === null) {
      return "";
    } else {
      return value["type"];
    }
  }

  parseValue(value: any): any {
    if (value === undefined || value === null) {
      return "";
    } else {
      return undefined;
    }
  }
}
