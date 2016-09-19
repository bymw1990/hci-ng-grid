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
    return this._i === other.i && this._j === other.j && this._k === other.k;
  }

  equalsIJK(i: number, j: number, k: number): boolean {
    return this._i === i && this._j === j && this._k === k;
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
