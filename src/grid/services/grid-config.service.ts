import { Injectable } from "@angular/core";

import { GridConfiguration } from "../utils/grid-configuration";

@Injectable()
export class GridConfigService {

  private _gridConfiguration: GridConfiguration = new GridConfiguration();

  get gridConfiguration() {
    return this._gridConfiguration;
  }

  set gridConfiguration(gridConfiguration: GridConfiguration) {
    this._gridConfiguration = gridConfiguration;
  }

}
