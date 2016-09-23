import { Component, OnInit } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column, DateCell, LabelCell, InputCell } from "hci-ng2-grid/index";

@Component({
  selector: "external-grid",
  template: `
    <div style="padding: 20px;">
      <h2>External Grid</h2>
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'External Grid'"
                [columnDefinitions]="columns"
                [externalDataCall]="boundDataCall"
                [externalFiltering]="true"
                [externalSorting]="true"
                [externalPaging]="true">
      </hci-grid>
    </div>
    `
})
export class ExternalGridComponent implements OnInit {

  dataSize: number = 250;

  public boundDataCall: Function;

  columns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: LabelCell }),
    new Column({ field: "lastName", name: "Last Name", template: InputCell, filterType: "input" }),
    new Column({ field: "middleName", name: "Middle Name", template: InputCell }),
    new Column({ field: "firstName", name: "First Name", template: InputCell, filterType: "input" }),
    new Column({ field: "dob", name: "Date of Birth", template: DateCell }),
    new Column({ field: "gender", name: "Gender", template: LabelCell, filterType: "select", filterOptions: [ "", "Female", "Male" ] }),
    new Column({ field: "address", name: "Address", template: LabelCell })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    console.log("ExternalGridComponent.ngOnInit");
    this.boundDataCall = this.dataCall.bind(this);
    this.dataGeneratorService.generateExternalData(this.dataSize);
  }

  public dataCall(externalInfo: Object): Array<Object> {
    console.log("dataCall");
    console.log(externalInfo);
    return this.dataGeneratorService.getExternalData(externalInfo);
  }
}
