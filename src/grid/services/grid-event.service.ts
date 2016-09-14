import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Rx";

import { Point } from "../utils/point";

@Injectable()
export class GridEventService {
  private nColumns: number = 0;
  private currentLocation: Point = new Point(-1, -1, -1);
  private selectedLocation = new Subject<Point>();
  private selectedLocationObservable = this.selectedLocation.asObservable();

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

  arrowFrom(location: Point, dx: number, dy: number) {
    console.log("GridEventService.arrowFrom: " + location.toString() + ":" + dx + ":" + dy);
    this.currentLocation = location;
    console.log(this.currentLocation);
    this.currentLocation.i = this.currentLocation.i + dy;
    this.currentLocation.j = this.currentLocation.j + dx;
    this.currentLocation.i = Math.max(0, this.currentLocation.i);
    this.currentLocation.j = Math.max(0, this.currentLocation.j);
    this.currentLocation.j = Math.min(this.nColumns - 1, this.currentLocation.j);
    this.selectedLocation.next(this.currentLocation);
    console.log("GridEventService.arrowFrom Done");
  }

  tabFrom(location: Point) {
    let i: number = location.i;
    let j: number = location.j;
    let k: number = location.k;

    j = j + 1;
    if (j === this.nColumns) {
      j = 0;
      i = i + 1;
    }
    this.currentLocation = new Point(i, j, k);
    this.selectedLocation.next(this.currentLocation);
  }

  addSelectedLocationObserver(observer: (location: Point) => void) {
    console.log("GridEventService.addSelectedLocationObserver");
    this.selectedLocationObservable.subscribe(observer);
  }
}
