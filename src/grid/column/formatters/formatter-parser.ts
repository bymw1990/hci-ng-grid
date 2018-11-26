/**
 * Most simple formatter parser which just returns the value without modification.
 */
export class FormatterParser {

  config: any = {};

  setConfig(config: any) {
    this.config = config;
  }

  format(value: any): any {
    if (value) {
      return value;
    } else {
      return "";
    }
  }

  parse(value: string): any {
    if (value) {
      return value;
    } else {
      return "";
    }
  }
}
