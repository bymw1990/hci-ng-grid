/**
 * Most simple formatter parser which just returns the value without modification.
 */
export class FormatterParser {

  config: any = {};

  setConfig(config: any) {
    this.config = config;
  }

  formatValue(value: any): any {
    return value;
  }

  parseValue(value: any): any {
    return value;
  }
}
