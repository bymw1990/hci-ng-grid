export class FilterInfo {
  public field: string = null;
  public value: any = null;

  constructor(field: string, value: any) {
    this.field = field;
    this.value = value;
  }

  getField(): string {
    return this.field;
  }

  setField(field: string) {
    this.field = field;
  }

  getValue(): any {
    return this.value;
  }

  setValue(value: any) {
    this.value = value;
  }
}
