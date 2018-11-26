import * as moment from "moment";

import {FormatterParser} from "./formatter-parser";

export class DateFormatter extends FormatterParser {

  dateFormat: string = "MM/DD/YYYY";

  setConfig(config: any) {
    super.setConfig(config);

    if (config.dateFormat) {
      this.dateFormat = config.dateFormat;
    }
  }

  format(value: any): any {
    if (value) {
      let date: string = moment((new Date(<string>value))).format(this.dateFormat);

      if (date === "Invalid date") {
        throw new Error("Could not format date.");
      } else {
        return date;
      }
    } else {
      return undefined;
    }
  }

  parse(value: string): any {
    if (value) {
      let date: string =  moment(<string>value, this.dateFormat).toISOString();

      if (date === "Invalid Date") {
        throw new Error("Could not format date.");
      } else {
        return date;
      }
    } else {
      return undefined;
    }
  }
}
