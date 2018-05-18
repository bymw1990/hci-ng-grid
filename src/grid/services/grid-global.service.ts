import {Inject, Injectable, isDevMode} from "@angular/core";

import {Dictionary} from "../model/dictionary.interface";
import {GridService} from "./grid.service";
import {FilterInfo} from "../utils/filter-info";
import {Column} from "../column/column";

@Injectable()
export class GridGlobalService {

  tempId: number = 0;
  groupMap: Map<string, GridService[]> = new Map<string, GridService[]>();

  themeChoices: Dictionary[] = [
    {value: "excel", display: "Excel"},
    {value: "report", display: "Report"}
  ];

  constructor(@Inject("globalConfig") private globalConfig) {
    if (globalConfig.themeChoices) {
      this.themeChoices = globalConfig.themeChoices;
    }
  }

  register(group: string, grid: GridService) {
    if (!grid.id) {
      grid.id = "hci-grid-" + this.tempId++;
    }

    if (isDevMode()) {
      console.debug("GridGlobalService.register: group: " + group + ", grid: " + grid.id);
    }

    if (this.groupMap.has(group)) {
      this.groupMap.get(group).push(grid);
    } else {
      let gridArray: GridService[] = [];
      gridArray.push(grid);
      this.groupMap.set(group, gridArray);
    }
  }

  pushConfigEvent(group: string, id: string, config: any) {
    for (let grid of this.groupMap.get(group)) {
      if (grid.id !== id) {
        grid.updateConfig(config);
      }
    }
  }

  clearPushFilter(group: string, id: string, name: string, filterInfo: FilterInfo) {
    for (let grid of this.groupMap.get(group)) {
      if (grid.id !== id) {
        let column: Column = grid.getColumnByName(name);
        column.clearFilters();
        column.addFilter(filterInfo);
        grid.filter();
      }
    }
  }
}
