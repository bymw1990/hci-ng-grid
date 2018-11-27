import {Component} from "@angular/core";

import {Column} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "group-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Row Grouping</h4>
      </div>
      <div class="card-body">
        <div class="card-text input-row">
          <input [ngModel]="dataSize" (ngModelChange)="setDataSize($event)" />
          <a class="btn btn-primary gap" (click)="generateData()">Re-generate Data</a>
        </div>
        <div class="card-text">
          Create a new column that is an aggregate of other columns.  In this case first and last name.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [title]="'Group Grid'"
                [data]="groupData"
                [columns]="groupColumns"
                [groupBy]="['firstName', 'lastName']"
                [pageSize]="10"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "middleName", name: "Middle Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date"
              field: "gender", name: "Gender"
              field: "address", name: "Address"
              field: "phone", name: "Phone"
            </pre>
          </ng-template>
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="bound1" popoverTitle="Bound Data" placement="right">Show Bound Data</button>
          <ng-template #bound1>
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
            <div *ngFor="let row of groupData" class="d-flex flex-nowrap">
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
          <hci-grid [data]="data1"
                    [columns]="columns1"
                    [groupBy]="['firstName', 'lastName']"
                    [pageSize]="25">
          </hci-grid>
        </p>
      </div>
    </div>
  `,
  styles: [`
  
    .input-row {
      height: 40px;
      display: flex;
    }
    
    .gap {
      margin-left: 20px;
    }
    
  `]
})
export class RowGroupGridComponent {

  dataSize: number = 1000;

  data1: Array<Object> = [];

  columns1: Column[] = [
    new Column({ field: "idPatient", name: "ID", visible: false }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "middleName", name: "Middle Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "address", name: "Address" }),
    new Column({ field: "phone", name: "Phone" })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.generateData();
  }

  setDataSize(dataSize: number) {
    this.dataSize = dataSize;
  }

  generateData() {
    this.data1 = this.dataGeneratorService.getData(this.dataSize);
  }
}
