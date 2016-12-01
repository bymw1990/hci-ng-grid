import { Point } from "./point";

export class Range {
  private _min: Point;
  private _max: Point;

  constructor(min: Point, max: Point) {
    this._min = min;
    this._max = max;
  }

  contains(point: Point): boolean {
    return this._min.lessThanOrEqual(point) && this._max.greaterThanOrEqual(point);
  }

  setInitial(point: Point) {
    this._min = point;
    this._max = point;
  }

  toString(): string {
    return "Min." + this._min + ", Max." + this._max;
  }

  update(point: Point) {
    if (point.lessThan(this._min)) {
      this._min = point;
    } else if (point.greaterThan(this._max)) {
      this._max = point;
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
