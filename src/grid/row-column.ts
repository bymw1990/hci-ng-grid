export class IJ {
    private _i: number;
    private _j: number;

    constructor(i: number, j: number) {
        this._i = i;
        this._j = j;
    }

    get i(): number {
        return this._i;
    }

    get j(): number {
        return this._j;
    }

}
