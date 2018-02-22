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
          <div class="card-text">
              <div class="d-flex flex-nowrap" style="align-items: center;">
                <a class="btn btn-primary" (click)="initData()">Re-generate Data</a><br />
                <span style="margin-left: 20px; font-size: 1.5em;">Size: </span>
                <input [(ngModel)]="dataSize" style="margin-left: 10px; font-size: 1.5em;" />
              </div>
          </div>
          <div>
            <hci-grid [title]="'Paging Grid'"
                      [data]="pagingData"
                      [columnDefinitions]="pagingColumns"
                      [pageSize]="10"
                      [pageSizes]="[ 10, 25, 100 ]">
            </hci-grid>
          </div>
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
