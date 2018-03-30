import {FormatterParser} from "./formatter-parser";

/**
 * Most simple formatter parser which just returns the value without modification.
 */
export class NumberFormatter extends FormatterParser {

  setConfig(config: any) {}

  format(value: any): string {
    if (value === undefined || value === null) {
      return "";
    } else {
      return value;
    }
  }

  parse(value: string): any {
    if (value === undefined || value === null) {
      return null;
    } else {
      return +value;
    }
  }
}
