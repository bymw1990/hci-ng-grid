import {FormatterParser} from "hci-ng-grid/index";

export class LabFP extends FormatterParser {

  format(value: any): string {
    if (value === undefined || value === null) {
      return "";
    } else {
      return value["type"];
    }
  }

  parse(value: string): any {
    if (value === undefined || value === null) {
      return "";
    } else {
      return null;
    }
  }
}
