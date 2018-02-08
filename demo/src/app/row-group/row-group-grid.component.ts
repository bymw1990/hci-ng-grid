import { Component } from "@angular/core";

import { Column } from "hci-ng-grid/index";
import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "group-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Row Grouping</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          Click on row header to change sort based on row group.
        </p>
        <p>
          <hci-ng-grid [title]="'Group Grid'"
                       [inputData]="groupData"
                       [columnDefinitions]="groupColumns"
                       [groupBy]="['firstName', 'lastName']"
                       [cellSelect]="true"
                       [pageSize]="10">
          </hci-ng-grid>
        </p>
        <div style="padding: 20px;">
          <span style="font-weight: bold;" (click)="showBound = !showBound">Click for Bound Data</span>
          <div *ngIf="showBound">
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
            <div *ngFor="let row of groupData">
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
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Row Grouping - {{bigDataSize}} Rows</h4>
      </div>
      <div class="card-body">
        <div class="card-text input-row">
          <input [ngModel]="bigDataSize" (ngModelChange)="setBigDataSize($event)" />
          <a class="btn btn-primary gap" (click)="generateBigData()">Re-generate Data</a>
        </div>
        <p class="card-text">
          Click on row header to change sort based on row group.
        </p>
        <p>
          <hci-ng-grid [inputData]="bigData"
                       [columnDefinitions]="columns2"
                       [groupBy]="['firstName', 'lastName']"
                       [cellSelect]="true"
                       [pageSize]="25">
          </hci-ng-grid>
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

  showBound: boolean = false;

  groupData: Array<Object> = [
    { "idPatient": 1, "firstName": "Zane", "lastName": "Zoe", "dob": "1970-01-01T00:00-07:00", "middleName": "C", "gender": "Female", "address": "111 Spooner St", "phone": "7131110005" },
    { "idPatient": 2, "firstName": "Rick", "lastName": "James", "dob": "1973-02-11T00:00-07:00", "middleName": "", "gender": "Male", "address": "123 Wood Ln", "phone": "7132220006" },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1975-03-11T00:00-07:00", "middleName": "B", "gender": "Other", "address": "1555 E 800 S", "phone": "71354440007" },
    { "idPatient": 4, "firstName": "Ragini", "lastName": "Kanth", "dob": "1976-04-21T00:00-07:00", "middleName": "Z", "gender": "Male", "address": "1 N Canyon Rd", "phone": "7136660008" },
    { "idPatient": 5, "firstName": "Bob", "lastName": "Smith", "dob": "1977-05-21T00:00-07:00", "middleName": "A", "gender": "Male", "address": "742 Evergreen Terace", "phone": "7135550001" },
    { "idPatient": 6, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1978-09-21T00:00-07:00", "middleName": "", "gender": "Male", "address": "9 S Canyon Rd", "phone": "7137770009" },
    { "idPatient": 7, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1977-08-11T00:00-07:00", "middleName": "K", "gender": "Male", "address": "8 N Canyon Rd", "phone": "7137770008" },
    { "idPatient": 8, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1976-07-21T00:00-07:00", "middleName": "J", "gender": "Male", "address": "7 S Canyon Rd", "phone": "7137770007" },
    { "idPatient": 9, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1975-06-11T00:00-07:00", "middleName": "I", "gender": "Male", "address": "6 N Canyon Rd", "phone": "7137770006" },
    { "idPatient": 10, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1974-05-21T00:00-07:00", "middleName": "", "gender": "Male", "address": "5 S Canyon Rd", "phone": "7137770005" },
    { "idPatient": 11, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1973-04-11T00:00-07:00", "middleName": "H", "gender": "Male", "address": "4 N Canyon Rd", "phone": "7137770004" },
    { "idPatient": 12, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1972-03-21T00:00-07:00", "middleName": "G", "gender": "Male", "address": "3 S Canyon Rd", "phone": "7137770003" },
    { "idPatient": 13, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1971-02-11T00:00-07:00", "middleName": "", "gender": "Male", "address": "2 N Canyon Rd", "phone": "7137770002" },
    { "idPatient": 14, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1970-01-21T00:00-07:00", "middleName": "E", "gender": "Male", "address": "1 S Canyon Rd", "phone": "7137770001" },
    { "idPatient": 15, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1960-01-21T00:00-07:00", "middleName": "D", "gender": "Male", "address": "1 E Canyon Rd", "phone": "7137770001" },
    { "idPatient": 16, "firstName": "Jimmy", "lastName": "Byrne", "dob": "1950-01-21T00:00-07:00", "middleName": "C", "gender": "Male", "address": "1 W Canyon Rd", "phone": "7137770001" }
  ];

  groupColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", visible: false }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "middleName", name: "Middle Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "address", name: "Address" }),
    new Column({ field: "phone", name: "Phone" })
  ];

  bigDataSize: number = 10000;

  bigData: Array<Object> = [];

  columns2: Column[] = [
    new Column({ field: "idPatient", name: "ID", visible: false }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "middleName", name: "Middle Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "gender", name: "Gender" }),
    new Column({ field: "address", name: "Address" }),
    new Column({ field: "phone", name: "Phone" })
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.generateBigData();
  }

  setBigDataSize(bigDataSize: number) {
    this.bigDataSize = bigDataSize;
  }

  generateBigData() {
    this.bigData = this.dataGeneratorService.getData(this.bigDataSize);
  }
}
