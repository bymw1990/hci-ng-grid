import { Component } from "@angular/core";

import { Column } from "hci-ng-grid/index";

@Component({
  selector: "edit-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Edit Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
        &lt;tab&gt; through cells<br />
          click on cells<br />
          up/down/left/right on selected cell<br />
          modify input cell values and check bound data changes<br />
        </p>
        <p>
          <hci-grid [title]="'Edit Grid'"
                    [inputData]="editData"
                    [columnDefinitions]="editColumns"
                    [cellSelect]="true"
                    [pageSize]="25"
                    [nVisibleRows]="10">
          </hci-grid>
        </p>
        <div style="padding: 20px;">
          <span style="font-weight: bold;">Bound Data</span>
          <div style="font-weight: bold;">
            <span style="width: 100px; display: inline-block;">idPatient</span>
            <span style="width: 100px; display: inline-block;">firstName</span>
            <span style="width: 100px; display: inline-block;">lastName</span>
            <span style="width: 150px; display: inline-block;">dob</span>
            <span style="width: 100px; display: inline-block;">nLabs</span>
            <span style="width: 150px; display: inline-block;">nLabPath</span>
          </div>
          <div *ngFor="let row of editData">
            <span style="width: 100px; display: inline-block;">{{row.idPatient}}</span>
            <span style="width: 100px; display: inline-block;">{{row.firstName}}</span>
            <span style="width: 100px; display: inline-block;">{{row.lastName}}</span>
            <span style="width: 150px; display: inline-block;">{{row.dob}}</span>
            <span style="width: 100px; display: inline-block;">{{row.nLabs}}</span>
            <span style="width: 150px; display: inline-block;">{{row.nLabPath}}</span>
          </div>
        </div>
      </div>
    </div>
    `
})
export class EditGridComponent {

  editData: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1970-11-21T00:00-07:00", "nLabs": 1, "nLabPath": 12 },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1960-12-11T00:00-07:00", "nLabs": 2, "nLabPath": 23 },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1940-01-03T00:00-07:00", "nLabs": 3, "nLabPath": 34 },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1950-06-06T00:00-07:00", "nLabs": 99, "nLabPath": 9 },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1980-02-08T00:00-07:00", "nLabs": 4, "nLabPath": 45 },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1930-01-17T00:00-07:00", "nLabs": 5, "nLabPath": 56 },
    { "idPatient": 7, "firstName": "Ragini", "lastName": "Kanth", "dob": "1980-02-08T00:00-07:00", "nLabs": 4, "nLabPath": 45 },
    { "idPatient": 8, "firstName": "Jenny", "lastName": "White", "dob": "1940-05-29T00:00-07:00", "nLabs": 9, "nLabPath": 13 },
    { "idPatient": 9, "firstName": "Sam", "lastName": "Black", "dob": "1930-02-22T00:00-07:00", "nLabs": 2, "nLabPath": 65 },
    { "idPatient": 10, "firstName": "Tim", "lastName": "Lewis", "dob": "1920-06-08T00:00-07:00", "nLabs": 9, "nLabPath": 111 },
    { "idPatient": 11, "firstName": "Ben", "lastName": "Brown", "dob": "1977-08-12T00:00-07:00", "nLabs": 3, "nLabPath": 87 },
    { "idPatient": 12, "firstName": "Leslie", "lastName": "Pink", "dob": "1980-11-03T00:00-07:00", "nLabs": 4, "nLabPath": 13 },
    { "idPatient": 13, "firstName": "Jimmy", "lastName": "Smith", "dob": "1933-04-05T00:00-07:00", "nLabs": 7, "nLabPath": 32 },
    { "idPatient": 14, "firstName": "Bob", "lastName": "White", "dob": "1944-05-13T00:00-07:00", "nLabs": 8, "nLabPath": 27 },
    { "idPatient": 15, "firstName": "Jane", "lastName": "Black", "dob": "1955-06-23T00:00-07:00", "nLabs": 6, "nLabPath": 73 }
  ];

  editColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: "LabelCell", visible: true }),
    new Column({ field: "lastName", name: "Last Name", template: "InputCell" }),
    new Column({ field: "firstName", name: "First Name", template: "InputCell" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "nLabs", name: "# Labs", template: "LabelCell" }),
    new Column({ field: "nLabPath", name: "# Lab Path", template: "InputCell" })
  ];

}
