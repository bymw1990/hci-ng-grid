import { Component } from "@angular/core";

import { Column } from "hci-ng-grid/index";

@Component({
  selector: "group-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Group Grid</h2>
    </div>
    <div style="padding: 20px;">
      <div>Click on row header to change sort based on row group.</div>
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Group Grid'"
                [inputData]="groupData"
                [hci-grid-config]
                [columnDefinitions]="groupColumns"
                [groupBy]="['firstName', 'lastName']"
                [cellSelect]="true">
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
    `
})
export class GroupGridComponent {

  groupData: Array<Object> = [
    { "idPatient": 1, "firstName": "Zane", "lastName": "Zoe", "dob": 111110000000, "middleName": "C", "gender": "Female", "address": "111 Spooner St", "phone": "7131110005" },
    { "idPatient": 2, "firstName": "Rick", "lastName": "James", "dob": 321110000000, "middleName": "", "gender": "Male", "address": "123 Wood Ln", "phone": "7132220006" },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "middleName": "B", "gender": "Other", "address": "1555 E 800 S", "phone": "71354440007" },
    { "idPatient": 4, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "middleName": "Z", "gender": "Male", "address": "1 N Canyon Rd", "phone": "7136660008" },
    { "idPatient": 5, "firstName": "Bob", "lastName": "Smith", "dob": 51110000000, "middleName": "A", "gender": "Male", "address": "742 Evergreen Terace", "phone": "7135550001" },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 741110000000, "middleName": "", "gender": "Male", "address": "9 S Canyon Rd", "phone": "7137770009" }
  ];

  groupColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: "LabelCell", visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: "InputCell" }),
    new Column({ field: "middleName", name: "Middle Name", template: "InputCell" }),
    new Column({ field: "firstName", name: "First Name", template: "InputCell" }),
    new Column({ field: "dob", name: "Date of Birth", template: "DateCell" }),
    new Column({ field: "gender", name: "Gender", template: "LabelCell" }),
    new Column({ field: "address", name: "Address", template: "LabelCell" }),
    new Column({ field: "phone", name: "Phone", template: "InputCell" })
  ];
}
