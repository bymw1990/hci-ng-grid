import {Inject, Injectable, isDevMode} from "@angular/core";

import {Dictionary} from "../model/dictionary.interface";
import {GridService} from "./grid.service";
import {FilterInfo} from "../utils/filter-info";

/**
 * A singleton service that allows default configuration for all grids, grouping grids together, and referencing a grid
 * from another grid.
 */
@Injectable()
export class GridGlobalService {

  tempId: number = 0;
  groupServiceMap: Map<string, GridService[]> = new Map<string, GridService[]>();

  themeChoices: Dictionary[] = [
    {value: "excel", display: "Excel"},
    {value: "report", display: "Report"}
  ];

  constructor(@Inject("globalConfig") private globalConfig: any) {
    if (isDevMode()) {
      console.debug("GridGlobalService: " + JSON.stringify(globalConfig));
    }

    if (globalConfig.themeChoices) {
      this.themeChoices = globalConfig.themeChoices;
    }
  }

  getGlobalConfig(): any {
    return this.globalConfig;
  }

  register(gridService: GridService) {
    if (!gridService.id) {
      gridService.id = "hci-grid-" + this.tempId++;
    }

    if (isDevMode()) {
      console.debug("GridGlobalService.register: " + gridService.id);
    }
  }

  /**
   * When a grid is created, register itself with this service.
   *
   * @param {string} group
   * @param {GridService} gridService
   */
  registerGroup(group: string, gridService: GridService) {
    if (!group) {
      return;
    }

    if (isDevMode()) {
      console.debug("GridGlobalService.registerGroup: group: " + group + ", grid: " + gridService.id);
    }

    if (this.groupServiceMap.has(group)) {
      this.groupServiceMap.get(group).push(gridService);
    } else {
      let gridArray: GridService[] = [];
      gridArray.push(gridService);
      this.groupServiceMap.set(group, gridArray);
    }
  }

  pushConfigEvent(group: string, id: string, config: any) {
    for (let grid of this.groupServiceMap.get(group)) {
      if (grid.id !== id) {
        grid.updateConfig(config);
      }
    }
  }

  clearPushFilter(group: string, id: string, field: string, filters: FilterInfo[]) {
    for (let grid of this.groupServiceMap.get(group)) {
      if (grid.id !== id) {
        grid.addFilters(field, filters);
        grid.filter();
      }
    }
  }
}
