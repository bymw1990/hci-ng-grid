import {Type} from "@angular/core";

import {CellViewRenderer} from "../cell/viewRenderers/cell-view-renderer.interface";
import {CellTextView} from "../cell/viewRenderers/cell-text-view";
import {FilterRenderer} from "./filterRenderers/filter-renderer";
import {FilterInfo} from "../utils/filter-info";
import {CellEditRenderer} from "../cell/editRenderers/cell-edit-renderer";
import {TextEditRenderer} from "../cell/editRenderers/text-edit-renderer.component";
import {CellPopupRenderer} from "../cell/viewPopupRenderer/cell-popup-renderer";
import {FormatterParser} from "./formatters/formatter-parser";
import {EmptyFactory} from "../utils/empty.factory";
import {DateFormatter} from "./formatters/date.formatter";

/**
 * Contains all configurable information related to a column.  This is the field, name, format, filtering info, etc....
 */
export class Column {
  id: number;
  isKey: boolean = false;
  field: string;
  name: string = null;
  format: string = null;
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
  dataType: string = "string";
  selectable: boolean = true;
  isLast: boolean = false;

  visible: boolean = true;
  editable: boolean = true;
  clickable: boolean = true;

  choices: Array<any> = [];
  choiceValue: string = "value";
  choiceDisplay: string = "display";
  choiceUrl: string;

  formatterParserConfig: any = {};
  formatterParser: Type<FormatterParser> = FormatterParser;
  formatterParserInstance: FormatterParser;

  popupRenderer: Type<CellPopupRenderer>;

  editRenderer: Type<CellEditRenderer> = TextEditRenderer;

  viewConfig: any = {};
  viewRenderer: Type<CellViewRenderer> = CellTextView;
  viewRendererInstance: CellViewRenderer;

  filterConfig: any = {};
  filterRenderer: Type<FilterRenderer>;
  filters: Array<FilterInfo> = [];

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

  getViewConfig(): any {
    return this.viewConfig;
  }

  getViewRenderer(): CellViewRenderer {
    if (!this.viewRendererInstance) {
      this.viewRendererInstance = (new EmptyFactory<CellViewRenderer>(this.viewRenderer)).getInstance();
      this.viewRendererInstance.setConfig(this.viewConfig);
      this.viewRendererInstance.updateColumn(this);
    }

    return this.viewRendererInstance;
  }

  addFilter(filterInfo: FilterInfo) {
    this.filters.push(filterInfo);
  }

  removeFilter(filterInfo: FilterInfo) {
    this.filters = [];
  }

  clearFilters() {
    this.filters = [];
  }

  formatValue(value: any): string {
    return this.formatterParserInstance.format(value);
  }

  parseValue(value: any): string {
    return this.formatterParserInstance.parse(value);
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
    if (object.format !== undefined) {
      this.format = object.format;
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
    if (object.filterConfig) {
      this.filterConfig = object.filterConfig;
    }
    if (object.filterRenderer) {
      this.filterRenderer = object.filterRenderer;
    }
    if (object.dataType !== undefined) {
      this.dataType = object.dataType;
    }
    if (object.selectable !== undefined) {
      this.selectable = object.selectable;
    }

    if (object.visible !== undefined) {
      this.visible = object.visible;
    }
    if (object.editable !== undefined) {
      this.editable = object.editable;
    }
    if (object.clickable !== undefined) {
      this.clickable = object.clickable;
    }

    if (object.popupRenderer) {
      this.popupRenderer = object.popupRenderer;
    }
    if (object.editRenderer) {
      this.editRenderer = object.editRenderer;
    }
    if (object.viewConfig) {
      this.viewConfig = object.viewConfig;
    }
    if (object.viewRenderer) {
      this.viewRenderer = object.viewRenderer;
    }

    if (object.choices !== undefined && object.choices.length > 0) {
      this.choices = object.choices;
      this.dataType = "choice";
    }
    if (object.choiceValue) {
      this.choiceValue = object.choiceValue;
    }
    if (object.choiceDisplay) {
      this.choiceDisplay = object.choiceDisplay;
    }
    if (object.choiceUrl !== undefined) {
      this.choiceUrl = object.choiceUrl;
      this.dataType = "choice";
    }

    if (object.formatterParserConfig) {
      this.formatterParserConfig = object.formatterParserConfig;
    }
    if (object.formatterParser) {
      this.formatterParser = object.formatterParser;
    }

    if (this.dataType === "date" && (!object.formatterParser || object.formatterParser === FormatterParser)) {
      this.formatterParser = DateFormatter;
    }

    this.formatterParserInstance = (new EmptyFactory<FormatterParser>(this.formatterParser)).getInstance();
    this.formatterParserInstance.setConfig(this.formatterParserConfig);
  }

}
