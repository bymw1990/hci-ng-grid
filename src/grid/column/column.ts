import * as moment from "moment";

export class Column {
  id: number;
  isKey: boolean = false;
  field: string;
  name: string = null;
  template: string = "LabelCell";
  format: string = null;
  visible: boolean = true;
  validator: any;
  sortable: boolean = true;
  sortOrder: number = 0;
  width: number = 0;
  widthPercent: number = 0;
  minWidth: number = 135;
  maxWidth: number = 1000;
  isFixed: boolean = false;
  isGroup: boolean = false;
  isUtility: boolean = false;
  defaultValue: any;
  filterType: string = null;
  filterOptions: Array<any> = null;
  filterValue: any = null;
  component: any = null;
  dataType: string = "string";
  selectable: boolean = true;
  isLast: boolean = false;

  renderLeft: number = 0;
  renderWidth: number = 0;

  static deserialize(object): Column {
    return new Column(object);
  }

  static deserializeArray(list: Object[]): Column[] {
    let columns: Column[] = [];
    for (var i = 0; i < list.length; i++) {
      columns.push(Column.deserialize(list[i]));
    }
    return columns;
  }

  constructor(object: any) {
    this.setConfig(object);
  }

  formatValue(value: any): string {
    if (value === undefined || value === null) {
      return "";
    } else if (this.dataType === "date") {
      return moment((new Date(<string>value))).format(this.format);
    } else {
      return value;
    }
  }

  parseValue(value: any): string {
    if (value === undefined || value === null) {
      return "";
    } else if (this.dataType === "date") {
      return moment(<string>value, this.format).toISOString();
    } else {
      return value;
    }
  }

  setConfig(object: any) {
    if (object.id !== undefined) {
      this.id = object.id;
    }
    if (object.isKey !== undefined) {
      this.isKey = object.isKey;
    }
    if (object.field !== undefined) {
      this.field = object.field;
    }
    if (object.name !== undefined) {
      this.name = object.name;
    }
    if (object.template !== undefined) {
      this.template = object.template;
    }
    if (object.format !== undefined) {
      this.format = object.format;
    }
    if (object.visible !== undefined) {
      this.visible = object.visible;
    }
    if (object.validator !== undefined) {
      this.validator = object.validator;
    }
    if (object.sortOrder !== undefined) {
      this.sortOrder = object.sortOrder;
    }
    if (object.width !== undefined) {
      this.width = object.width;
    }
    if (object.widthPercent !== undefined) {
      this.widthPercent = object.widthPercent;
    }
    if (object.minWidth !== undefined) {
      this.minWidth = object.minWidth;
    }
    if (object.maxWidth !== undefined) {
      this.maxWidth = object.maxWidth;
    }
    if (object.isFixed !== undefined) {
      this.isFixed = object.isFixed;
    }
    if (object.isGroup !== undefined) {
      this.isGroup = object.isGroup;
    }
    if (object.isUtility !== undefined) {
      this.isUtility = object.isUtility;
    }
    if (object.defaultValue !== undefined) {
      this.defaultValue = object.defaultValue;
    }
    if (object.filterType !== undefined) {
      this.filterType = object.filterType;
    }
    if (object.filterOptions !== undefined) {
      this.filterOptions = object.filterOptions;
    }
    if (object.filterValue !== undefined) {
      this.filterValue = object.filterValue;
    }
    if (object.component !== undefined) {
      this.component = object.component;
    }
    if (object.dataType !== undefined) {
      this.dataType = object.dataType;
    }
    if (object.selectable !== undefined) {
      this.selectable = object.selectable;
    }
  }

}
