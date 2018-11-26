import {Component} from "@angular/core";

import {Column} from "hci-ng-grid";

@Component({
  selector: "alerts-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Capture Warnings</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          Try copying a 2x2 range of cells with ctrl-c.  Then select the bottom row, first column.  Hit escape to stop edit mode.
          Then ctrl-v to paste.  In the console, see the warning that was captured.
          used.<br />
          Open the console to see the warning.
        </p>
        <p>
          <hci-grid [data]="data1"
                    [columnDefinitions]="columns1"
                    (warning)="showWarning($event)">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class AlertsGridComponent {

  data1: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1971-01-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1972-04-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1973-05-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1974-06-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1975-08-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1976-09-11T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns1: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: "LabelCell" }),
    new Column({ field: "lastName", name: "Last Name", template: "LabelCell" }),
    new Column({ field: "middleName", name: "Middle Name", template: "LabelCell" }),
    new Column({ field: "firstName", name: "First Name", template: "LabelCell" }),
    new Column({ field: "gender", name: "Gender", template: "LabelCell" }),
    new Column({ field: "address", name: "Address", template: "LabelCell" })
  ];

  showWarning(warning: string) {
    console.warn(warning);
  }
}
