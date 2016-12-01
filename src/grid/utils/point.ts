export class Point {
  private _i: number;
  private _j: number;
  private _k: number;

  constructor(i: number, j: number, k: number) {
    this._i = i;
    this._j = j;
    this._k = k;
  }

  equals(other: Point): boolean {
    if (other === null) {
      return false;
    } else {
      return this._i === other.i && this._j === other.j && this._k === other.k;
    }
  }

  equalsIJK(i: number, j: number, k: number): boolean {
    return this._i === i && this._j === j && this._k === k;
  }

  greaterThan(other: Point) {
    if (this._k > other.k) {
      if (this._i === other.i) {
        return this._j >= other.j;
      } else {
        return this._i >= other.i;
      }
    } else if (this._i > other.i) {
      return this._k >= other.k;
    } else if (this._i === other.i && this._j > other.j) {
      return this._k >= other.k;
    } else {
      return false;
    }
  }

  greaterThanOrEqual(other: Point) {
    return this.greaterThan(other) || this.equals(other);
  }

  lessThan(other: Point) {
    if (this._k < other.k) {
      if (this._i === other.i) {
        return this._j <= other.j;
      } else {
        return this._i <= other.i;
      }
    } else if (this._i < other.i) {
      return this._k <= other.k;
    } else if (this._i === other.i && this._j < other.j) {
      return this._k <= other.k;
    } else {
      return false;
    }
  }

  lessThanOrEqual(other: Point) {
    return this.lessThan(other) || this.equals(other);
  }

  get i(): number {
    return this._i;
  }

  set i(i: number) {
    this._i = i;
  }

  get j(): number {
    return this._j;
  }

  set j(j: number) {
    this._j = j;
  }

  get k(): number {
    return this._k;
  }

  set k(k: number) {
    this._k = k;
  }

  public toString(): string {
    return "Point(" + this._i + "," + this._j + "," + this._k + ")";
  }
}
