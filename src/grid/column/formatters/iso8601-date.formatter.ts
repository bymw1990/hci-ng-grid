import * as moment from "moment";

import {FormatterParser} from "./formatter-parser";

export class Iso8601DateFormatter extends FormatterParser {

  format: string = "MM/DD/YYYY";

  setConfig(config: any) {
    super.setConfig(config);

    if (config.format) {
      this.format = config.format;
    }
  }

  formatValue(value: any): any {
    console.debug(value);

    if (value) {
      let date: string = moment((new Date(<string>value))).format(this.format);

      if (date === "Invalid date") {
        throw new Error("Could not format date.");
      } else {
        return date;
      }
    } else {
      return undefined;
    }
  }

  parseValue(value: any): any {
    if (value) {
      let date: string = moment(<string>value, this.format).toISOString();

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
