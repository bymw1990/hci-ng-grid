export class Point {
    private _i: number;
    private _j: number;

    constructor(i: number, j: number) {
        this._i = i;
        this._j = j;
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
