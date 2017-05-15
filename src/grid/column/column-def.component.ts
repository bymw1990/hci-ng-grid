import { Component, ContentChildren, Input, QueryList } from "@angular/core";

@Component({
    selector: "column-def",
    template: ""
})
export class ColumnDefComponent {
    @Input() field: string;
    @Input() name: string = null;
    @Input() width: number = 100;
    @Input() visible: boolean = true;
    @Input() template: string = "LabelCell";

    @ContentChildren("template") templates: QueryList<any>;

    component: any = null;

    ngAfterContentInit() {
        if (this.templates && this.templates.length === 1) {
            this.component = this.templates.toArray()[0];
        }
    }
}
