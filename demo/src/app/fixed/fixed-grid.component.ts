import {Component, HostBinding} from "@angular/core";

import {CompareFilterRenderer, TextEditRenderer, TextFilterRenderer} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";

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
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="config1">Show Config</button>
          <mat-menu #config1="matMenu">
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
              field: "dob", name: "Date of Birth", dataType: "date", editRenderer: TextEditRenderer, filterRenderer: CompareFilterRenderer
              field: "gender", name: "Gender"
              field: "address", name: "Address", minWidth: 300, filterRenderer: TextFilterRenderer
              field: "citystatezip", name: "City, State Zip", minWidth: 300
              field: "phone", name: "Phone", filterRenderer: TextFilterRenderer
            </pre>
          </mat-menu>
          <button type="button" class="btn btn-outline-primary" [matMenuTriggerFor]="data1">Show Bound Data</button>
          <mat-menu #data1="matMenu">
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
          </mat-menu>
        </div>
        <p>
          <hci-grid [title]="'Fixed Grid'"
                    [data]="fixedData"
                    [columns]="fixedColumns"
                    [fixedColumns]="['firstName', 'lastName']"
                    [nVisibleRows]="15">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class FixedGridComponent {

  @HostBinding("class") classList: string = "demo-component";

  fixedData: Object[];

  fixedColumns: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name" },
    { field: "middleName", name: "Middle Name" },
    { field: "firstName", name: "First Name", filterRenderer: TextFilterRenderer },
    { field: "dob", name: "Date of Birth", dataType: "date", editRenderer: TextEditRenderer, filterRenderer: CompareFilterRenderer },
    { field: "gender", name: "Gender" },
    { field: "address", name: "Address", minWidth: 300, filterRenderer: TextFilterRenderer },
    { field: "citystatezip", name: "City, State Zip", minWidth: 300 },
    { field: "phone", name: "Phone", filterRenderer: TextFilterRenderer }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.dataGeneratorService.generateFixedData(100);
    this.fixedData = this.dataGeneratorService.getFixedData(null, null, null);
  }

}
