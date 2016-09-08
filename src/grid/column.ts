export class Column {
    private _field: string;
    private _name: string;
    private _template: any;

    constructor(field: string, name: string, template: any) {
        this._field = field;
        this._name = name;
        this._template = template;
    }

    get field(): string {
        return this._field;
    }

    set field(field: string) {
        this._field = field;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get template(): any {
        return this._template;
    }

    set template(template: any) {
        this._template = template;
    }

}
