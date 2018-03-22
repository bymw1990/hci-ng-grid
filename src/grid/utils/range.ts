import {Point} from "./point";

export class Range {
  private _min: Point;
  private _max: Point;

  constructor(min: Point, max: Point) {
    this._min = min;
    this._max = new Point(max.i, max.j);
  }

  contains(point: Point): boolean {
    return this._min.lessThanOrEqual(point) && this._max.greaterThanOrEqual(point);
  }

  setInitial(point: Point) {
    this._min = new Point(point.i, point.j);
    this._max = new Point(point.i, point.j);
  }

  toString(): string {
    return "Min." + this._min + ", Max." + this._max;
  }

  update(point: Point) {
    if (point.i < this._min.i) {
      this._min.i = point.i;
    } else if (point.i > this._max.i) {
      this._max.i = point.i;
    }
    if (point.j < this._min.j) {
      this._min.j = point.j;
    } else if (point.j > this._max.j) {
      this._max.j = point.j;
    }
  }

  get min(): Point {
    return this._min;
  }

  set min(min: Point) {
    this._min = min;
  }

  get max(): Point {
    return this._max;
  }

  set max(max: Point) {
    this._max = max;
  }

}
