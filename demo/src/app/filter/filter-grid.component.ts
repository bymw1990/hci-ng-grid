import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column, DateCell, LabelCell, InputCell } from "hci-ng2-grid/index";

@Component({
  selector: "filter-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Filter Grid</h2>
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

  filteredData: Array<Object>;

  filteredColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: LabelCell }),
    new Column({ field: "lastName", name: "Last Name", template: InputCell, filterType: "input" }),
    new Column({ field: "middleName", name: "Middle Name", template: InputCell }),
    new Column({ field: "firstName", name: "First Name", template: InputCell, filterType: "input" }),
    new Column({ field: "dob", name: "Date of Birth", template: DateCell }),
    new Column({ field: "gender", name: "Gender", template: LabelCell }),
    new Column({ field: "address", name: "Address", template: LabelCell })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.dataGeneratorService.generateFilteredData(250);
    this.filteredData = this.dataGeneratorService.getFilteredData(null, null, null);
  }

}
