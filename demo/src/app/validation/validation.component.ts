import {Component} from "@angular/core";

import {Column} from "hci-ng-grid";

@Component({
  selector: "validation-demo",
  template: `
    <div class="card-group flex-column">
      <div class="card m-3">
        <div class="card-header">
          <h4>Validation</h4>
        </div>
        <div class="card-body">
          <div class="card-text">
            Open the config to see the validation options on different columns.  Then edit a few columns.  Invalid changes
            are not saved.
          </div>
          <div class="card-text">
            <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
            <ng-template #config1>
              <pre>
                &lt;hci-grid
                  [title]="'Validation Grid'"
                  [data]="data"
                  [columnDefinitions]="columns"
                  [pageSize]="10"
                  [nVisibleRows]="10"&gt;
                &lt;/hci-grid&gt;
                
                Columns:
                field: "idPatient", name: "ID", visible: true
                field: "lastName", name: "Last Name", editConfig: required: true
                field: "firstName", name: "First Name", editConfig: maxlength: 35
                field: "dob", name: "Date of Birth", dataType: "date"
                field: "nLabs", name: "# Labs", editConfig: pattern: /^[0-9]1$/
                field: "nLabPath", name: "# Lab Path", editConfig: pattern: /^[0-9]1,2$/
              </pre>
            </ng-template>
            <button type="button" class="btn btn-outline-primary" [ngbPopover]="data1" popoverTitle="Bound Data" placement="right">Show Bound Data</button>
            <ng-template #data1>
              <div class="d-flex flex-nowrap" style="font-weight: bold;">
                <span style="width: 100px;">idPatient</span>
                <span style="width: 100px;">firstName</span>
                <span style="width: 100px;">lastName</span>
                <span style="width: 200px;">dob</span>
                <span style="width: 100px;">nLabs</span>
                <span style="width: 200px;">nPathLabs</span>
              </div>
              <div *ngFor="let row of editData" class="d-flex flex-nowrap">
                <span style="width: 100px;">{{row.idPatient}}</span>
                <span style="width: 100px;">{{row.firstName}}</span>
                <span style="width: 100px;">{{row.lastName}}</span>
                <span style="width: 200px;">{{row.dob}}</span>
                <span style="width: 100px;">{{row.nLabs}}</span>
                <span style="width: 200px;">{{row.nPathLabs}}</span>
              </div>
            </ng-template>
          </div>
          <div>
            <hci-grid [title]="'Validation Grid'"
                      [data]="data"
                      [columnDefinitions]="columns"
                      [pageSize]="10"
                      [nVisibleRows]="10">
            </hci-grid>
          </div>
        </div>
      </div>
    </div>
  `, host: {class: "outlet"}
})
export class ValidationComponent {

  data: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1970-11-21T00:00-07:00", "nLabs": 1, "nLabPath": 12 },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1960-12-11T00:00-07:00", "nLabs": 2, "nLabPath": 23 },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1940-01-03T00:00-07:00", "nLabs": 3, "nLabPath": 4 },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1950-06-06T00:00-07:00", "nLabs": 1, "nLabPath": 93 },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1980-02-08T00:00-07:00", "nLabs": 4, "nLabPath": 45 },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1930-01-17T00:00-07:00", "nLabs": 5, "nLabPath": 56 },
    { "idPatient": 7, "firstName": "Ragini", "lastName": "Kanth", "dob": "1980-02-08T00:00-07:00", "nLabs": 4, "nLabPath": 45 },
    { "idPatient": 8, "firstName": "Jenny", "lastName": "White", "dob": "1940-05-29T00:00-07:00", "nLabs": 9, "nLabPath": 13 },
    { "idPatient": 9, "firstName": "Sam", "lastName": "Black", "dob": "1930-02-22T00:00-07:00", "nLabs": 2, "nLabPath": 5 },
    { "idPatient": 10, "firstName": "Tim", "lastName": "Lewis", "dob": "1920-06-08T00:00-07:00", "nLabs": 9, "nLabPath": 11 },
    { "idPatient": 11, "firstName": "Ben", "lastName": "Brown", "dob": "1977-08-12T00:00-07:00", "nLabs": 3, "nLabPath": 87 },
    { "idPatient": 12, "firstName": "Leslie", "lastName": "Pink", "dob": "1980-11-03T00:00-07:00", "nLabs": 4, "nLabPath": 13 },
    { "idPatient": 13, "firstName": "Jimmy", "lastName": "Smith", "dob": "1933-04-05T00:00-07:00", "nLabs": 7, "nLabPath": 2 },
    { "idPatient": 14, "firstName": "Bob", "lastName": "White", "dob": "1944-05-13T00:00-07:00", "nLabs": 8, "nLabPath": 27 },
    { "idPatient": 15, "firstName": "Jane", "lastName": "Black", "dob": "1955-06-23T00:00-07:00", "nLabs": 6, "nLabPath": 73 }
  ];

  columns: Column[] = [
    new Column({ field: "idPatient", name: "ID", visible: true }),
    new Column({ field: "lastName", name: "Last Name", editConfig: {required: true} }),
    new Column({ field: "firstName", name: "First Name", editConfig: {maxlength: 35} }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date" }),
    new Column({ field: "nLabs", name: "# Labs", editConfig: {pattern: /^[0-9]{1}$/} }),
    new Column({ field: "nLabPath", name: "# Lab Path", editConfig: {pattern: /^[0-9]{1,2}$/} })
  ];

}
