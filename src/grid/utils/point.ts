export class Point {
  private _i: number;
  private _j: number;

  static getPoint(id: string): Point {
    try {
      let regex: RegExp = new RegExp("[a-z]+-(-?[0-9]+)-(-?[0-9]+)");
      let groups = regex.exec(id);

      return new Point(+groups[1], +groups[2]);
    } catch (e) {
      return undefined;
    }
  }

  constructor(i: number, j: number) {
    this._i = i;
    this._j = j;
  }

  isNegative(allowNegativeI?: boolean) {
    if (allowNegativeI) {
      return this._i < -1 || this._j === -1;
    } else {
      return this._i === -1 || this._j === -1;
    }
  }

  isNew() {
    return this._i === -1 && this._j >= 0;
  }

  isNotNegative() {
    return this._i >= 0 && this._j >= 0;
  }

  equals(other: Point): boolean {
    if (other === null) {
      return false;
    } else {
      return this._i === other.i && this._j === other.j;
    }
  }

  equalsIJ(i: number, j: number): boolean {
    return this._i === i && this._j === j;
  }

  greaterThan(other: Point) {
    if (this._j > other.j) {
      return this._i >= other.i;
    } else if (this._i > other.i) {
      return this._j >= other.j;
    } else {
      return false;
    }
  }

  greaterThanOrEqual(other: Point) {
    return this.greaterThan(other) || this.equals(other);
  }

  lessThan(other: Point) {
    if (this._j < other.j) {
      return this._i <= other.i;
    } else if (this._i < other.i) {
      return this._j <= other.j;
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

  public toString(): string {
    return "Point(" + this._i + "," + this._j + ")";
  }
}
