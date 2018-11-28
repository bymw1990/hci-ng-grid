import {Type} from "@angular/core";

import {CellViewRenderer} from "../cell/viewRenderers/cell-view-renderer.interface";
import {CellTextView} from "../cell/viewRenderers/cell-text-view";
import {FilterRenderer} from "./filterRenderers/filter-renderer";
import {CellEditRenderer} from "../cell/editRenderers/cell-edit-renderer";
import {TextEditRenderer} from "../cell/editRenderers/text-edit-renderer.component";
import {CellPopupRenderer} from "../cell/viewPopupRenderer/cell-popup-renderer";
import {FormatterParser} from "./formatters/formatter-parser";
import {EmptyFactory} from "../utils/empty.factory";
import {MsDateFormatter} from "./formatters/ms-date.formatter";
import {Iso8601DateFormatter} from "./formatters/iso8601-date.formatter";

/**
 * Contains all configurable information related to a column.  This is the field, name, format, filtering info, etc....
 */
export class Column {

  static defaultConfig: any = {
    isKey: false,
    name: undefined,
    format: undefined,
    width: 0,
    widthPercent:  0,
    minWidth: 135,
    maxWidth: 1000,
    isFixed: false,
    isGroup: false,
    isUtility: false,
    dataType: "string",
    selectable: true,
    isLast: false,
    visible: true,
    editable: true,
    clickable: true,
    choices: [],
    choiceValue: "value",
    choiceDisplay: "display",
    formatterParserConfig: {},
    formatterParser: FormatterParser,
    editRenderer: TextEditRenderer,
    viewConfig: {},
    viewRenderer: CellTextView,
    filterConfig: {}
  };

  id: number;
  isKey: boolean = false;
  field: string;
  name: string;
  format: string;
  validator: any;
  sortable: boolean = true;
  renderOrder: number = 0;
  sortOrder: number;
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

  editConfig: any = {};
  editRenderer: Type<CellEditRenderer> = TextEditRenderer;

  viewConfig: any = {};
  viewRenderer: Type<CellViewRenderer> = CellTextView;
  viewRendererInstance: CellViewRenderer;

  filterConfig: any = {};
  filterRenderer: Type<FilterRenderer>;

  renderLeft: number = 0;
  renderWidth: number = 0;

  static deserialize(object): Column {
    return new Column(object);
  }

  static deserializeArray(list: Object[]): Column[] {
    let columns: Column[] = [];
    for (var i = 0; i < list.length; i++) {
      let column: Column = Column.deserialize(list[i]);
      if (!column.sortOrder) {
        column.sortOrder = i;
      }
      columns.push(column);
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

  formatValue(value: any): any {
    return this.formatterParserInstance.formatValue(value);
  }

  parseValue(value: any): string {
    return this.formatterParserInstance.parseValue(value);
  }

  setConfig(object: any) {
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

    if (object.editConfig) {
      this.editConfig = object.editConfig;
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
      this.formatterParser = Iso8601DateFormatter;
    } else if (this.dataType === "ios8601-date" && (!object.formatterParser || object.formatterParser === FormatterParser)) {
      this.formatterParser = Iso8601DateFormatter;
    } else if (this.dataType === "ms-date" && (!object.formatterParser || object.formatterParser === FormatterParser)) {
      this.formatterParser = MsDateFormatter;
    }

    this.formatterParserInstance = (new EmptyFactory<FormatterParser>(this.formatterParser)).getInstance();
    if (!this.formatterParserConfig["format"] && this.format) {
      this.formatterParserConfig["format"] = this.format;
    }
    this.formatterParserInstance.setConfig(this.formatterParserConfig);
  }

}
