import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs/Rx";

import { GridConfigService } from "./grid-config.service";
import { Point } from "../utils/point";

@Injectable()
export class GridEventService {
  private nColumns: number = 0;
  private currentLocation: Point = new Point(-1, 0, -1);
  private selectedLocation = new Subject<Point>();
  private selectedLocationObservable = this.selectedLocation.asObservable();

  constructor(private gridConfigService: GridConfigService) {}

  setNColumns(nColumns: number) {
    this.nColumns = nColumns;
  }

  setSelectedLocation(location: Point) {
    console.log("GridEventService.setSelectedLocation: " + location.toString());
    if (this.currentLocation === null || !this.currentLocation.equals(location)) {
      this.currentLocation = location;
      this.selectedLocation.next(location);
    }
  }

  /**
   * Changes the current location based on the location passed to it plus the direction of the arrow key.  For example,
   * dx=-1 and dy=0 in the case of a left arrow click.  If the new location is greater than the number of columns, then
   * move to the next row down.  If the column is NOT visible, then keep iterating dx+1 until there is a visible one.
   *
   * TODO: Support row group cases (j > 0)
   *
   * @param location
   * @param dx
   * @param dy
   */
  arrowFrom(location: Point, dx: number, dy: number) {
    //console.log("GridEventService.arrowFrom: " + location.toString() + ":" + dx + ":" + dy);
    this.currentLocation = location;

    do {
      this.currentLocation.i = this.currentLocation.i + dy;
      this.currentLocation.k = this.currentLocation.k + dx;
      this.currentLocation.i = Math.max(0, this.currentLocation.i);
      this.currentLocation.k = Math.max(0, this.currentLocation.k);
      if (this.currentLocation.k === this.nColumns) {
        this.currentLocation.k = 0;
        this.currentLocation.i = this.currentLocation.i + 1;
      }
    } while (!this.gridConfigService.gridConfiguration.columnDefinitions[this.currentLocation.k].visible);

    console.log("GridEventService.arrowFrom Done " + this.currentLocation.toString());

    this.selectedLocation.next(this.currentLocation);
  }

  tabFrom(location: Point) {
    this.arrowFrom(location, 1, 0);
  }

  getSelectedLocationObservable(): Observable<Point> {
    return this.selectedLocationObservable;
  }
}
