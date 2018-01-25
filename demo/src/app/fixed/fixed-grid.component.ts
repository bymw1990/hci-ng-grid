import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column } from "hci-ng-grid/index";

@Component({
  selector: "fixed-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Fixed Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          &lt;tab&gt; through cells<br />
          click on cells<br />
          up/down/left/right on selected cell<br />
          modify input cell values and check bound data changes<br />
        </p>
        <p>
          <hci-grid [title]="'Fixed Grid'"
                    [inputData]="fixedData"
                    [columnDefinitions]="fixedColumns"
                    [fixedColumns]="['firstName', 'lastName']">
          </hci-grid>
        </p>
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
      </div>
    </div>
    `
})
export class FixedGridComponent {

  fixedData: Array<Object>;

  fixedColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: "LabelCell", visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: "InputCell" }),
    new Column({ field: "middleName", name: "Middle Name", template: "InputCell" }),
    new Column({ field: "firstName", name: "First Name", template: "InputCell" }),
    new Column({ field: "dob", name: "Date of Birth", template: "DateCell" }),
    new Column({ field: "gender", name: "Gender", template: "LabelCell" }),
    new Column({ field: "address", name: "Address", template: "LabelCell", minWidth: 300 }),
    new Column({ field: "citystatezip", name: "City, State Zip", template: "LabelCell", minWidth: 300 }),
    new Column({ field: "phone", name: "Phone", template: "InputCell" })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.dataGeneratorService.generateFixedData(100);
    this.fixedData = this.dataGeneratorService.getFixedData(null, null, null);
  }

}
