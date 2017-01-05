import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column } from "hci-ng-grid/index";

@Component({
  selector: "filter-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Filter Grid</h2>
    </div>
    <div style="padding-left: 20px;">
      <a (click)="initData();">Re-generate Data</a><br />
      <span>Size: </span><input [(ngModel)]="dataSize" />
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Filter Grid'"
                [inputData]="filteredData"
                [columnDefinitions]="filteredColumns">
      </hci-grid>
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
    new Column({ field: "dob", name: "Date of Birth", template: "DateCelltCell" }),
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
