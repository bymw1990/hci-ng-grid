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

  arrowFrom(location: Point, dx: number, dy: number) {
    //console.log("GridEventService.arrowFrom: " + location.toString() + ":" + dx + ":" + dy);
    this.currentLocation = location;
    //console.log(this.currentLocation);
    this.currentLocation.i = this.currentLocation.i + dy;
    //this.currentLocation.j = this.currentLocation.j;
    this.currentLocation.k = this.currentLocation.k + dx;
    this.currentLocation.i = Math.max(0, this.currentLocation.i);
    this.currentLocation.k = Math.max(0, this.currentLocation.k);

    if (this.currentLocation.k === this.nColumns) {
      this.currentLocation.k = 0;
      this.currentLocation.i = this.currentLocation.i + 1;
    }

    this.selectedLocation.next(this.currentLocation);
    //console.log("GridEventService.arrowFrom Done");
  }

  tabFrom(location: Point) {
    let i: number = location.i;
    let j: number = location.j;
    let k: number = location.k;

    k = k + 1;
    if (k === this.nColumns) {
      k = 0;
      i = i + 1;
    }
    this.currentLocation = new Point(i, j, k);
    this.selectedLocation.next(this.currentLocation);
  }

  addSelectedLocationObserver(observer: (location: Point) => void) {
    //console.log("GridEventService.addSelectedLocationObserver");
    this.selectedLocationObservable.subscribe(observer);
  }

  getSelectedLocationObservable(): Observable<Point> {
    return this.selectedLocationObservable;
  }
}
