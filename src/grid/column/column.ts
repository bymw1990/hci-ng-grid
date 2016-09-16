export class Column {
  private _id: number;
  private _field: string;
  private _name: string;
  private _template: any;
  private _visible: boolean = true;
  private _validator: any;
  private _sortOrder: number;
  private _width: number = 100;
  private _minWidth: number = 100;
  private _maxWidth: number = 250;
  private _isFixed: boolean = false;
  private _isGroup: boolean = false;
  private _isUtility: boolean = false;
  private _defaultValue: any;

  constructor(o: Object) {
    Object.assign(this, o);
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
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

}
