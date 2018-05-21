export class FilterInfo {
  public field: string = null;
  public dataType: string = "string";
  public value: any = null;
  public highValue: any = null;
  public operator: string = "LIKE";
  public valid: boolean = false;

  constructor(field: string, dataType: string, value: any, highValue: any, operator: string, valid: boolean) {
    this.field = field;
    this.dataType = dataType;
    this.value = value;
    this.highValue = highValue;
    this.operator = operator;
    this.valid = valid;
  }

}
