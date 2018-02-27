import {GridComponent} from "../grid.component";

export class EventListener {

  grid: GridComponent;

  /*constructor(grid: GridComponent) {
    this.grid = grid;
  }

  create<T extends EventListener>(instance: (new (grid: GridComponent) => T), grid: GridComponent): T {
    return new instance(grid);
  }*/

  create<T extends EventListener>(instance: (new () => T)): T {
    return new instance();
  }

  setGrid(grid: GridComponent) {
    this.grid = grid;
  }
}
