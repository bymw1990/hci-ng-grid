import { Component, ContentChildren, Input, QueryList } from "@angular/core";

//import { CellTemplate } from "../cell/cell-template.component";
import { DateCell } from "../cell/date-cell.component";

@Component({
    selector: "column-def",
    template: ""
})
export class ColumnDefComponent {
    @Input() field: string;
    @Input() name: string = null;
    @Input() width: number = 100;
    @Input() template: string = "LabelCell";

    /*@ContentChildren(DateCell) templates: QueryList<any>;

    ngAfterContentInit() {
        console.log(this.templates);
        if (this.templates && this.templates.length === 1) {
            this.template = this.templates[0];
        }
    }*/
}
