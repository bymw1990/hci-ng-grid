/**
 * Most simple formatter parser which just returns the value without modification.
 */
export class FormatterParser {

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
      return "";
    } else {
      return value;
    }
  }
}
