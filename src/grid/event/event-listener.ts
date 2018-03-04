import {GridComponent} from "../grid.component";

export class EventListener {

  stopEvent: boolean = true;
  grid: GridComponent;

  setConfig(config: any) {
    if (!config) {
      return;
    }

    if (config.stopEvent !== undefined) {
      this.stopEvent = config.stopEvent;
    }
  }

  create<T extends EventListener>(instance: (new () => T)): T {
    return new instance();
  }

  setGrid(grid: GridComponent) {
    this.grid = grid;
  }
}
