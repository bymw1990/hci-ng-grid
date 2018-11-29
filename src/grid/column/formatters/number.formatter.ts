import {FormatterParser} from "./formatter-parser";

/**
 * Most simple formatter parser which just returns the value without modification.
 */
export class NumberFormatter extends FormatterParser {

  setConfig(config: any) {}

  format(value: any): any {
    if (value !== undefined) {
      return value;
    } else {
      return undefined;
    }
  }

  parse(value: any): any {
    if (value !== undefined) {
      return +value;
    } else {
      return value;
    }
  }
}
