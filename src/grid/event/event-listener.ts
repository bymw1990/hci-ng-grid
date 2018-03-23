import {Injector} from "@angular/core";

import {GridComponent} from "../grid.component";
import {GridService} from "../services/grid.service";
import {GridEventService} from "../services/grid-event.service";

/**
 * Base class for listening to events.  This is created once such that it can have memory from event to event.
 */
export class EventListener {

  stopEvent: boolean = true;
  grid: GridComponent;
  gridService: GridService;
  gridEventService: GridEventService;

  constructor(injector: Injector) {
    this.gridService = injector.get(GridService);
    this.gridEventService = injector.get(GridEventService);
  }

  setConfig(config: any) {
    if (!config) {
      return;
    }

    if (config.stopEvent !== undefined) {
      this.stopEvent = config.stopEvent;
    }
  }

  /**
   * Manually set the grid reference.  With creating new instance dynamically, was not able to inject services.
   *
   * @param {GridComponent} grid
   */
  setGrid(grid: GridComponent) {
    this.grid = grid;
  }
}
