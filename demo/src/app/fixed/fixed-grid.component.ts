import { Component } from "@angular/core";

import { DataGeneratorService } from "../services/data-generator.service";
import { Column } from "hci-ng-grid";
import {CompareFilterRenderer, DateEditRenderer, TextFilterRenderer} from "hci-ng-grid";

@Component({
  selector: "fixed-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Fixed Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          &lt;tab&gt; through cells<br />
          click on cells<br />
          up/down/left/right on selected cell<br />
          modify input cell values and check bound data changes<br />
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [title]="'Fixed Grid'"
                [data]="fixedData"
                [columns]="fixedColumns"
                [fixedColumns]="['firstName', 'lastName']&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer
              field: "dob", name: "Date of Birth", dataType: "date", editRenderer: DateEditRenderer, filterRenderer: CompareFilterRenderer
              field: "gender", name: "Gender"
              field: "address", name: "Address", minWidth: 300, filterRenderer: TextFilterRenderer
              field: "citystatezip", name: "City, State Zip", minWidth: 300
              field: "phone", name: "Phone", filterRenderer: TextFilterRenderer
            </pre>
          </ng-template>
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="data1" popoverTitle="Bound Data" placement="right">Show Bound Data</button>
          <ng-template #data1>
            <div class="d-flex flex-nowrap" style="font-weight: bold;">
              <span style="width: 100px;">idPatient</span>
              <span style="width: 100px;">firstName</span>
              <span style="width: 100px;">middleName</span>
              <span style="width: 100px;">lastName</span>
              <span style="width: 150px;">dob</span>
              <span style="width: 150px;">gender</span>
              <span style="width: 150px;">address</span>
              <span style="width: 150px;">phone</span>
            </div>
            <div *ngFor="let row of fixedData" class="d-flex flex-nowrap">
              <span style="width: 100px;">{{row.idPatient}}</span>
              <span style="width: 100px;">{{row.firstName}}</span>
              <span style="width: 100px;">{{row.middleName}}</span>
              <span style="width: 100px;">{{row.lastName}}</span>
              <span style="width: 150px;">{{row.dob}}</span>
              <span style="width: 100px;">{{row.gender}}</span>
              <span style="width: 150px;">{{row.address}}</span>
              <span style="width: 150px;">{{row.phone}}</span>
            </div>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Fixed Grid'"
                    [data]="fixedData"
                    [columns]="fixedColumns"
                    [fixedColumns]="['firstName', 'lastName']">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class FixedGridComponent {

  fixedData: Array<Object>;

  fixedColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", visible: false }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "middleName", name: "Middle Name" }),
    new Column({ field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", editRenderer: DateEditRenderer, filterRenderer: CompareFilterRenderer }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "address", name: "Address", minWidth: 300, filterRenderer: TextFilterRenderer }),
    new Column({ field: "citystatezip", name: "City, State Zip", minWidth: 300 }),
    new Column({ field: "phone", name: "Phone", filterRenderer: TextFilterRenderer })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.dataGeneratorService.generateFixedData(100);
    this.fixedData = this.dataGeneratorService.getFixedData(null, null, null);
  }

}
