import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column } from "hci-ng-grid/index";

@Component({
    selector: "paging-grid",
    template: `
    <div style="padding: 20px;">
      <h4>Paging Grid</h4>
    </div>
    <div style="padding-left: 20px;">
      <a (click)="initData();">Re-generate Data</a><br />
      <span>Size: </span><input [(ngModel)]="dataSize" />
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Paging Grid'"
                [inputData]="pagingData"
                [columnDefinitions]="pagingColumns"
                [pageSize]="10"
                [pageSizes]="[ 10, 25, 100 ]">
      </hci-grid>
    </div>
    `
})
export class PagingGridComponent {

    dataSize: number = 250;
    pagingData: Array<Object>;

    pagingColumns: Column[] = [
        new Column({ field: "idPatient", name: "ID", template: "LabelCell" }),
        new Column({ field: "lastName", name: "Last Name", template: "InputCell" }),
        new Column({ field: "middleName", name: "Middle Name", template: "InputCell" }),
        new Column({ field: "firstName", name: "First Name", template: "InputCell" }),
        new Column({ field: "dob", name: "Date of Birth", template: "DatePickerCell" }),
        new Column({ field: "gender", name: "Gender", template: "LabelCell" }),
        new Column({ field: "address", name: "Address", template: "LabelCell" })
    ];

    constructor(private dataGeneratorService: DataGeneratorService) {}

    ngOnInit() {
        this.initData();
    }

    initData() {
        this.dataGeneratorService.generatePagingData(this.dataSize);
        this.pagingData = this.dataGeneratorService.getPagingData(null, null, null);
    }
}
