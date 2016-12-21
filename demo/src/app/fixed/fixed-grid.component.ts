import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column, LabelCell, InputCell, DateCell } from "hci-ng-grid/index";

@Component({
  selector: "fixed-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Fixed Grid</h2>
    </div>
    <div style="padding: 20px;">
      <div>&lt;tab&gt; through cells</div>
      <div>click on cells</div>
      <div>up/down/left/right on selected cell</div>
      <div>modify input cell values and check bound data changes</div>
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Fixed Grid'"
                [inputData]="fixedData"
                [columnDefinitions]="fixedColumns"
                [fixedColumns]="['firstName', 'lastName']"
                [externalFiltering]="true"
                (onExternalFilter)="callExternalFilter()">
      </hci-grid>
    </div>
    <div style="padding: 20px;">
      <span style="font-weight: bold;">Bound Data</span>
      <div style="font-weight: bold;">
        <span style="width: 100px; display: inline-block;">idPatient</span>
        <span style="width: 100px; display: inline-block;">firstName</span>
        <span style="width: 100px; display: inline-block;">middleName</span>
        <span style="width: 100px; display: inline-block;">lastName</span>
        <span style="width: 150px; display: inline-block;">dob</span>
        <span style="width: 150px; display: inline-block;">gender</span>
        <span style="width: 150px; display: inline-block;">address</span>
        <span style="width: 150px; display: inline-block;">phone</span>
      </div>
      <div *ngFor="let row of fixedData">
        <span style="width: 100px; display: inline-block;">{{row.idPatient}}</span>
        <span style="width: 100px; display: inline-block;">{{row.firstName}}</span>
        <span style="width: 100px; display: inline-block;">{{row.middleName}}</span>
        <span style="width: 100px; display: inline-block;">{{row.lastName}}</span>
        <span style="width: 150px; display: inline-block;">{{row.dob}}</span>
        <span style="width: 100px; display: inline-block;">{{row.gender}}</span>
        <span style="width: 150px; display: inline-block;">{{row.address}}</span>
        <span style="width: 150px; display: inline-block;">{{row.phone}}</span>
      </div>
    </div>
    `
})
export class FixedGridComponent {

  fixedData: Array<Object>;

  fixedColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: LabelCell, visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: InputCell }),
    new Column({ field: "middleName", name: "Middle Name", template: InputCell }),
    new Column({ field: "firstName", name: "First Name", template: InputCell }),
    new Column({ field: "dob", name: "Date of Birth", template: DateCell }),
    new Column({ field: "gender", name: "Gender", template: LabelCell }),
    new Column({ field: "address", name: "Address", template: LabelCell, minWidth: 300 }),
    new Column({ field: "citystatezip", name: "City, State Zip", template: LabelCell, minWidth: 300 }),
    new Column({ field: "phone", name: "Phone", template: InputCell })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.dataGeneratorService.generateFixedData(100);
    this.fixedData = this.dataGeneratorService.getFixedData(null, null, null);
  }

  callExternalFilter() {
    console.log("DemoAppComponent.callExternalFilter");
  }
}
