import * as moment from "moment";

import {FormatterParser} from "./formatter-parser";

export class DateFormatter extends FormatterParser {

  dateFormat: string = "MM/DD/YYYY";

  setConfig(config: any) {
    if (config.dateFormat) {
      this.dateFormat = config.dateFormat;
    }
  }

  format(value: any): string {
    if (value === undefined || value === null) {
      return "";
    } else {
      return moment((new Date(<string>value))).format(this.dateFormat);
    }
  }

  parse(value: string): any {
    if (value === undefined || value === null) {
      return "";
    } else {
      return moment(<string>value, this.dateFormat).toISOString();
    }
  }
}
