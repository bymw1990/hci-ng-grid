import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column, DateCell, LabelCell, InputCell } from "hci-ng2-grid/index";

@Component({
  selector: "external-grid",
  template: `
    <div style="padding: 20px;">
      <h2>External Grid</h2>
    </div>
    <div style="padding-left: 20px;">
      <a (click)="initData();">Re-generate Data</a><br />
      <span>Size: </span><input [(ngModel)]="dataSize" />
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'External Grid'"
                [inputData]="externalData"
                [columnDefinitions]="externalColumns"
                [externalFiltering]="true"
                (onExternalFilter)="callExternalFilter($event)">
      </hci-grid>
    </div>
    `
})
export class ExternalGridComponent {

  dataSize: number = 250;
  externalData: Array<Object>;

  externalColumns: Column[] = [
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
    this.initData();
  }

  initData() {
    this.dataGeneratorService.generateExternalData(this.dataSize);
    this.externalData = this.dataGeneratorService.getExternalData(null);
  }

  callExternalFilter(externalInfo: Object) {
    console.log("DemoAppComponent.callExternalFilter: New data from http request.");
    console.log(externalInfo);
    this.externalData = this.dataGeneratorService.getExternalData(externalInfo);
  }
}
