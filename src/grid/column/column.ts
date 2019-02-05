import {isDevMode, Type} from "@angular/core";

import {CellViewRenderer} from "../cell/viewRenderers/cell-view-renderer.interface";
import {CellTextView} from "../cell/viewRenderers/cell-text-view";
import {FilterRenderer} from "./filterRenderers/filter-renderer";
import {CellEditRenderer} from "../cell/editRenderers/cell-edit-renderer";
import {TextEditRenderer} from "../cell/editRenderers/text-edit-renderer.component";
import {CellPopupRenderer} from "../cell/viewPopupRenderer/cell-popup-renderer";
import {FormatterParser} from "./formatters/formatter-parser";
import {EmptyFactory} from "../utils/empty.factory";
import {DateMsFormatter} from "./formatters/date-ms.formatter";
import {DateIso8601Formatter} from "./formatters/date-iso8601.formatter";
import {ChoiceEditRenderer} from "../cell/editRenderers/choice-edit-renderer.component";
import {Row} from "../row/row";
import {SortInfo} from "../utils/sort-info";
import {FilterInfo} from "../utils/filter-info";

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
    viewConfig: {},
    viewRenderer: CellTextView,
    filterConfig: {},
    headerClasses: ""
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
  externalConfig: any;
  headerClasses: string = "";

  visible: boolean = true;
  editable: boolean = true;
  clickable: boolean = true;

  choices: any[] = [];
  choiceMap: Map<any, any> = new Map<any, any>();
  choiceValue: string = "value";
  choiceDisplay: string = "display";
  choiceUrl: string;

  formatterParserConfig: any = {};
  formatterParser: Type<FormatterParser> = FormatterParser;
  formatterParserInstance: FormatterParser;

  popupRenderer: Type<CellPopupRenderer>;

  editConfig: any = {};
  editRenderer: Type<CellEditRenderer>;

  viewConfig: any = {};
  viewRenderer: Type<CellViewRenderer> = CellTextView;
  viewRendererInstance: CellViewRenderer;

  filterConfig: any = {};
  filterRenderer: Type<FilterRenderer>;

  filterFunction: (value: any, filters: FilterInfo[], column: Column) => boolean;
  sortFunction: (a: any, b: any, sortInfo: SortInfo, column: Column) => number;

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
    if (object.externalConfig) {
      this.externalConfig = object.externalConfig;
    }
    if (object.headerClasses) {
      this.headerClasses = object.headerClasses;
    }

    if (object.filterFunction) {
      this.filterFunction = object.filterFunction;
    }
    if (object.sortFunction) {
      this.sortFunction = object.sortFunction;
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

    if (object.choiceValue) {
      this.choiceValue = object.choiceValue;
    }
    if (object.choiceDisplay) {
      this.choiceDisplay = object.choiceDisplay;
    }
    if (object.choices !== undefined && object.choices.length > 0) {
      this.setChoices(object.choices);
      this.dataType = "choice";
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

    if (!this.editRenderer) {
      if (this.dataType === "choice") {
        this.editRenderer = ChoiceEditRenderer;
      } else {
        this.editRenderer = TextEditRenderer;
      }
    }

    if (this.dataType === "date" && (!object.formatterParser || object.formatterParser === FormatterParser)) {
      this.formatterParser = DateIso8601Formatter;
      this.dataType = "date-iso8601";
    } else if (this.dataType === "date-iso8601" && (!object.formatterParser || object.formatterParser === FormatterParser)) {
      this.formatterParser = DateIso8601Formatter;
    } else if (this.dataType === "date-ms" && (!object.formatterParser || object.formatterParser === FormatterParser)) {
      this.formatterParser = DateMsFormatter;
    }

    if (this.dataType.indexOf("date") === 0 && !this.format) {
      this.format = "MM/DD/YYYY";
    }

    this.formatterParserInstance = (new EmptyFactory<FormatterParser>(this.formatterParser)).getInstance();
    if (!this.formatterParserConfig["format"] && this.format) {
      this.formatterParserConfig["format"] = this.format;
    }

    this.formatterParserInstance.setConfig(this.formatterParserConfig);

    if (this.formatterParserInstance["format"] && !this.format) {
      this.format = this.formatterParserInstance["format"];
    }

    if (!this.filterFunction) {
      this.filterFunction = this.createDefaultFilterFunction();
    }

    if (!this.sortFunction) {
      this.sortFunction = this.createDefaultSortFunction();
    }
  }

  setChoices(choices: any[]): void {
    this.choices = choices;

    this.choiceMap.clear();
    for (let choice of this.choices) {
      this.choiceMap.set(choice[this.choiceValue], choice[this.choiceDisplay]);
    }

    if (isDevMode()) {
      console.debug("setChoices: choiceValue: " + this.choiceValue + ", choiceDisplay:" + this.choiceDisplay + ", nChoices: " + this.choices.length);
    }
  }

  createDefaultFilterFunction(): (value: any, filters: FilterInfo[], column: Column) => boolean {
    if (this.dataType === "string") {
      return (value: any, filters: FilterInfo[], column: Column) => {
        for (let filterInfo of filters) {
          if (value.toString().toLowerCase().indexOf(filterInfo.value) === -1) {
            return false;
          }
        }

        return true;
      }
    } else if (this.dataType === "number") {
      return (value: any, filters: FilterInfo[], column: Column) => {
        for (let filterInfo of filters) {
          if (filterInfo.operator === "E") {
            if (+value !== +filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "LE") {
            if (+value > +filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "LT") {
            if (+value >= +filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "GE") {
            if (+value < +filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "GT") {
            if (+value <= +filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "B") {
            if (+value < +filterInfo.value || +value > +filterInfo.highValue) {
              return false;
            }
          } else if (filterInfo.operator === "O") {
            if (+value >= +filterInfo.value && +value <= +filterInfo.highValue) {
              return false;
            }
          }
        }

        return true;
      }
    } else if (this.dataType === "choice") {
      return (value: any, filters: FilterInfo[], column: Column) => {
        let include: boolean = false;

        for (let filterInfo of filters) {
          if (value === filterInfo.value) {
            include = true;
            break;
          }
        }

        return include;
      }
    } else if (this.dataType.indexOf("date") === 0) {
      return (value: any, filters: FilterInfo[], column: Column) => {
        for (let filterInfo of filters) {
          if (filterInfo.operator === "E") {
            if (value !== filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "LE") {
            if (value > filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "LT") {
            if (value <= filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "GE") {
            if (value < filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "GT") {
            if (value <= filterInfo.value) {
              return false;
            }
          } else if (filterInfo.operator === "B") {
            if (value < filterInfo.value || value > filterInfo.highValue) {
              return false;
            }
          } else if (filterInfo.operator === "O") {
            if (value >= filterInfo.value && value <= filterInfo.highValue ) {
              return false;
            }
          }
        }

        return true;
      }
    } else {
      return (value: any, filters: FilterInfo[], column: Column) => {
        return true;
      }
    }
  }

  createDefaultSortFunction(): (a: any, b: any, sortInfo: SortInfo, column: Column) => number {
    if (this.dataType === "number") {
      return (a: any, b: any, sortInfo: SortInfo, column: Column) => {
        if (sortInfo.asc) {
          return a - b;
        } else {
          return b - a;
        }
      };
    } else if (this.dataType === "string") {
      return (a: any, b: any, sortInfo: SortInfo, column: Column) => {
        if (sortInfo.asc) {
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a > b) {
            return -1;
          } else if (a < b) {
            return 1;
          } else {
            return 0;
          }
        }
      };
    } else if (this.dataType === "choice") {
      return (a: any, b: any, sortInfo: SortInfo, column: Column) => {
        a = column.choiceMap.get(a);
        b = column.choiceMap.get(b);

        if (sortInfo.asc) {
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a > b) {
            return -1;
          } else if (a < b) {
            return 1;
          } else {
            return 0;
          }
        }
      };
    } else {
      return (a: any, b: any, sortInfo: SortInfo, column: Column) => {
        console.warn("No sort function implemented.");
        return 0;
      };
    }
  }
}
