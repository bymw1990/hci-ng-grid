import {ElementRef} from "@angular/core";

import {Column} from "../../column/column";
import {GridService} from "../../services/grid.service";

export class FilterRenderer {

  config: any = {};
  column: Column;
  gridService: GridService;
  elementRef: ElementRef;

  constructor(gridService: GridService, elementRef: ElementRef) {
    this.gridService = gridService;
    this.elementRef = elementRef;
  }

  getConfig(): any {
    return this.config;
  }

  setConfig(config: any) {
    if (config) {
      this.config = config;
    }
  }

}
