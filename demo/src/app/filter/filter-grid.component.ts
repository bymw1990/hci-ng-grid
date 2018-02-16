import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column } from "hci-ng-grid/index";

@Component({
  selector: "filter-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Filter Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          <div class="d-flex flex-nowrap" style="align-items: center;">
            <a class="btn btn-primary" (click)="initData();">Re-generate Data</a><br />
            <span style="margin-left: 20px; font-size: 1.5em;">Size: </span>
            <input [(ngModel)]="dataSize" style="margin-left: 10px; font-size: 1.5em;" />
          </div>
        </div>
        <p>
          <hci-grid [title]="'Filter Grid'"
                    [data]="filteredData"
                    [columnDefinitions]="filteredColumns"
                    [pageSizes]="[10, 25, 100]"
                    [cellSelect]="true"
                    [keyNavigation]="true">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class FilterGridComponent {

  dataSize: number = 250;
  filteredData: Array<Object>;

  filteredColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: "LabelCell" }),
    new Column({ field: "lastName", name: "Last Name", template: "InputCell", filterType: "input" }),
    new Column({ field: "middleName", name: "Middle Name", template: "InputCell" }),
    new Column({ field: "firstName", name: "First Name", template: "InputCell", filterType: "input" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "gender", name: "Gender", template: "LabelCell", filterType: "select", filterOptions: [ "", "Female", "Male" ] }),
    new Column({ field: "address", name: "Address", template: "LabelCell" })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.dataGeneratorService.generateFilteredData(this.dataSize);
    this.filteredData = this.dataGeneratorService.getFilteredData(null, null, null);
  }
}
