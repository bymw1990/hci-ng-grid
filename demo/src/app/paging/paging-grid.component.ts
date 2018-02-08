import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column } from "hci-ng-grid/index";

@Component({
    selector: "paging-grid",
    template: `
      <div class="card">
        <div class="card-header">
          <h4>Paging Grid</h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            <a class="btn btn-primary" (click)="initData();">Re-generate Data</a><br />
            <span>Size: </span><input [(ngModel)]="dataSize" />
          </p>
          <p>
            <hci-ng-grid [title]="'Paging Grid'"
                         [inputData]="pagingData"
                         [columnDefinitions]="pagingColumns"
                         [pageSize]="10"
                         [pageSizes]="[ 10, 25, 100 ]">
            </hci-ng-grid>
          </p>
        </div>
      </div>
    `
})
export class PagingGridComponent {

    dataSize: number = 250;
    pagingData: Array<Object>;

    pagingColumns: Column[] = [
        new Column({ field: "idPatient", name: "ID", visible: false }),
        new Column({ field: "lastName", name: "Last Name" }),
        new Column({ field: "middleName", name: "Middle Name" }),
        new Column({ field: "firstName", name: "First Name" }),
        new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
        new Column({ field: "gender", name: "Gender" }),
        new Column({ field: "address", name: "Address" })
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
