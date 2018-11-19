/**
 * Most simple formatter parser which just returns the value without modification.
 */
export class FormatterParser {

  setConfig(config: any) {}

  format(value: any): string {
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
