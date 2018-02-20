import {Column} from "../../column/column";
import {GridService} from "../../services/grid.service";

export class FilterRenderer {

  config: any = {};
  column: Column;

  gridService: GridService;

  constructor(gridService: GridService) {
    this.gridService = gridService;
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
