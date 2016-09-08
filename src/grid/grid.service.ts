import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Rx";

import { IJ } from "./row-column";

@Injectable()
export class GridService {
  private MAXI: number = 5;
  private MAXJ: number = 4;
  private currentLocation: IJ = new IJ(-1, -1);
  private selectedLocation = new Subject<IJ>();
  private selectedLocationObservable = this.selectedLocation.asObservable();

  setSelectedLocation(location: IJ) {
    console.log("GridService.setSelectedLocation: " + location.i + "." + location.j);
    if (this.currentLocation === null || this.currentLocation.i !== location.i || this.currentLocation.j !== location.j) {
      this.currentLocation = location;
      this.selectedLocation.next(location);
    }
  }

  tabFrom(location: IJ) {
    let i: number = location.i;
    let j: number = location.j;

    j = j + 1;
    if (j === this.MAXJ) {
      j = 0;
      i = i + 1;
    }
    if (i === this.MAXI) {
      i = -1;
      j = -1;
    }
    this.currentLocation = new IJ(i, j);
    this.selectedLocation.next(this.currentLocation);
  }

  addSelectedLocationObserver(observer: (location: IJ) => void) {
    console.log("GridService.addSelectedLocationObserver");
    this.selectedLocationObservable.subscribe(observer);
  }
}
