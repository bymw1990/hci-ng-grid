import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs/Rx";

import { GridConfigService } from "./grid-config.service";
import { GridDataService } from "./grid-data.service";
import { Point } from "../utils/point";
import { Range } from "../utils/range";
import { EventMeta } from "../utils/event-meta";

@Injectable()
export class GridEventService {
  private nColumns: number = 0;
  private currentLocation: Point = new Point(-1, 0, -1);
  private selectedLocation = new Subject<Point>();
  private selectedLocationObservable = this.selectedLocation.asObservable();

  private _currentRange: Range = null;
  private selectedRange = new Subject<Range>();
  private selectedRangeObservable = this.selectedRange.asObservable();

  constructor(private gridConfigService: GridConfigService, private gridDataService: GridDataService) {}

  get currentRange(): Range {
    return this._currentRange;
  }

  setNColumns(nColumns: number) {
    this.nColumns = nColumns;
  }

  setSelectedLocation(location: Point, eventMeta: EventMeta) {
    if (!this.gridConfigService.gridConfiguration.cellSelect) {
      return;
    }
    console.log("GridEventService.setSelectedLocation: " + location + " " + eventMeta);

    /*if (location === null) {
      this.currentLocation = location;
      this.selectedLocation.next(location);
    } else if (this.currentLocation === null || !this.currentLocation.equals(location)) {
      this.currentLocation = location;
      this.selectedLocation.next(location);
    }*/

    if (this._currentRange == null) {
      this._currentRange = new Range(location, location);
      this.selectedRange.next(this._currentRange);
    } else if (eventMeta == null || eventMeta.isNull()) {
      this._currentRange.setInitial(location);
      this.selectedRange.next(this._currentRange);
    } else if (eventMeta.ctrl) {
      this._currentRange.update(location);
      this.selectedRange.next(this._currentRange);
    }
  }

  setSelectedRange(location: Point, eventMeta: EventMeta) {
    if (!this.gridConfigService.gridConfiguration.cellSelect) {
      return;
    }
    console.log("GridEventService.setSelectedRange: Update " + this._currentRange + " With " + location + ", " + eventMeta);

    if (this._currentRange == null) {
      this._currentRange = new Range(location, location);
      this.selectedRange.next(this._currentRange);
    } else if (eventMeta == null || eventMeta.isNull()) {
      this._currentRange.setInitial(location);
      this.selectedRange.next(this._currentRange);
    } else if (eventMeta.ctrl) {
      this._currentRange.update(location);
      this.selectedRange.next(this._currentRange);
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
  arrowFrom(location: Point, dx: number, dy: number, eventMeta: EventMeta) {
    if (!this.gridConfigService.gridConfiguration.cellSelect) {
      return;
    }
    console.log("GridEventService.arrowFrom: " + location.toString() + ":" + dx + ":" + dy);
    this.currentLocation = location;

    do {
      if (dy > 0 && this.gridDataService.getRowGroup(this.currentLocation.i).length() === this.currentLocation.j + dy) {
        this.currentLocation.i = this.currentLocation.i + dy;
        this.currentLocation.j = 0;
      } else if (dy > 0) {
        this.currentLocation.j = this.currentLocation.j + dy;
      } else if (dy < 0 && this.currentLocation.j > 0) {
        this.currentLocation.j = this.currentLocation.j + dy;
      } else if (dy < 0 && this.currentLocation.j === 0) {
        this.currentLocation.i = this.currentLocation.i + dy;
        if (this.currentLocation.i < 0) {
          this.currentLocation = new Point(-1, 0, -1);
        } else {
          this.currentLocation.j = this.gridDataService.getRowGroup(this.currentLocation.i).length() - 1;
        }
      } else if (dx !== 0) {
        this.currentLocation.k = this.currentLocation.k + dx;
        this.currentLocation.i = Math.max(0, this.currentLocation.i);
        this.currentLocation.j = Math.max(0, this.currentLocation.j);
        this.currentLocation.k = Math.max(0, this.currentLocation.k);

        if (this.currentLocation.k === this.nColumns) {
          this.currentLocation.k = 0;

          if (this.gridDataService.getRowGroup(this.currentLocation.i).length() === this.currentLocation.j + 1) {
            this.currentLocation.i = this.currentLocation.i + 1;
            this.currentLocation.j = 0;
          } else {
            this.currentLocation.j = this.currentLocation.j + 1;
          }
        }
      }
    } while (this.currentLocation.k >= 0 && !this.gridConfigService.gridConfiguration.columnDefinitions[this.currentLocation.k].visible);

    if (this.gridDataService.getRowGroup(this.currentLocation.i) === null) {
      this.currentLocation = new Point(-1, 0, -1);
    }

    this.selectedLocation.next(this.currentLocation);
  }

  tabFrom(location: Point, eventMeta: EventMeta) {
    this.arrowFrom(location, 1, 0, eventMeta);
  }

  getSelectedLocationObservable(): Observable<Point> {
    return this.selectedLocationObservable;
  }

  getSelecetdRangeObservable(): Observable<Range> {
    return this.selectedRangeObservable;
  }
}
