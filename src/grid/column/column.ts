import { QueryList } from "@angular/core";

import { ColumnDefComponent } from "./column-def.component";

export class Column {
  private _id: number;
  private _isKey: boolean = false;
  private _field: string;
  private _name: string = null;
  private _template: string = "LabelCell";
  private _format: string = null;
  private _visible: boolean = true;
  private _validator: any;
  private _sortOrder: number;
  private _width: number = 100;
  private _minWidth: number = 100;
  private _maxWidth: number = 500;
  private _isFixed: boolean = false;
  private _isGroup: boolean = false;
  private _isUtility: boolean = false;
  private _defaultValue: any;
  private _filterType: string = null;
  private _filterOptions: Array<any> = null;
  private _filterValue: any = null;
  private _component: any = null;

  static getColumns(columnDefComponents: QueryList<ColumnDefComponent>): Column[] {
    let columns: Column[] = new Array<Column>();
    let columnDefs: ColumnDefComponent[] = <ColumnDefComponent[]> columnDefComponents.toArray();
    for (var i = 0; i < columnDefs.length; i++) {
      let column: Column = new Column(null);

      column.field = columnDefs[i].field;
      column.name = columnDefs[i].name;
      column.width = columnDefs[i].width;
      column.template = columnDefs[i].template;
      column.component = columnDefs[i].component;

      columns.push(column);
    }
    return columns;
  }

  constructor(param: any) {
    if (param !== null) {
      if (param instanceof Object) {
        Object.assign(this, <Object> param);
      }
    }
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  get isKey(): boolean {
    return this._isKey;
  }

  set isKey(isKey: boolean) {
    this._isKey = isKey;
  }

  get field(): string {
    return this._field;
  }

  set field(field: string) {
    this._field = field;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get template(): any {
    return this._template;
  }

  set template(template: any) {
    this._template = template;
  }

  get format(): string {
    return this._format;
  }

  set format(format: string) {
    this._format = format;
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(visible: boolean) {
    this._visible = visible;
  }

  get validator(): any {
    return this._validator;
  }

  set validator(validator: any) {
    this._validator = validator;
  }

  get sortOrder(): number {
    return this._sortOrder;
  }

  set sortOrder(sortOrder: number) {
    this._sortOrder = sortOrder;
  }

  get width(): number {
    return this._width;
  }

  set width(width: number) {
    this._width = width;
  }

  get minWidth(): number {
    return this._minWidth;
  }

  set minWidth(minWidth: number) {
    this._minWidth = minWidth;
  }

  get maxWidth(): number {
    return this._maxWidth;
  }

  set maxWidth(maxWidth: number) {
    this._maxWidth = maxWidth;
  }

  get isFixed(): boolean {
    return this._isFixed;
  }

  set isFixed(isFixed: boolean) {
    this._isFixed = isFixed;
  }

  get isGroup(): boolean {
    return this._isGroup;
  }

  set isGroup(isGroup: boolean) {
    this._isGroup = isGroup;
  }

  get isUtility(): boolean {
    return this._isUtility;
  }

  set isUtility(isUtility: boolean) {
    this._isUtility = isUtility;
  }

  get defaultValue(): any {
    return this._defaultValue;
  }

  set defaultValue(defaultValue: any) {
    this._defaultValue = defaultValue;
  }

  get filterType(): string {
    return this._filterType;
  }

  set filterType(filterType: string) {
    this._filterType = filterType;
  }

  get filterOptions(): Array<any> {
    return this._filterOptions;
  }

  set filterOptions(filterOptions: Array<any>) {
    this._filterOptions = filterOptions;
  }

  get filterValue(): any {
    return this._filterValue;
  }

  set filterValue(filterValue: any) {
    this._filterValue = filterValue;
  }

  get component(): any {
    return this._component;
  }

  set component(component: any) {
    this._component = component;
  }

}
