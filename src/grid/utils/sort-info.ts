export class SortInfo {
  public asc: boolean = true;
  public field: string = null;

  getAsc(): boolean {
    return this.asc;
  }

  setAsc(asc: boolean) {
    this.asc = asc;
  }

  getField(): string {
    return this.field;
  }

  setField(field: string) {
    this.field = field;
  }
}
