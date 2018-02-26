import { Component } from "@angular/core";

import { Column } from "hci-ng-grid/index";

@Component({
  selector: "copy-paste-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Copy Paste Demo</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          Cells can be selected as a 2d array and the data copied.  Columns will be delimited with a \t and rows will be
          delimited with \n.  Similarly, pasted data will be parsed with \n and then with \t.  This is how spreadsheet tools
          such as Excel expect data when copy/pasting multiple cells.
        </p>
        <div class="card-text">
          <span style="font-size: larger; font-weight: bold;">To copy</span>
          <ul>
            <li>Click on a cell and ctrl-click on another to select a range of cells</li>
            <li>Use ctrl-c to copy those cell data</li>
            <li>In Excel select cell and ctrl-v</li>
          </ul>
        </div>
        <div class="card-text">
          <span style="font-size: larger; font-weight: bold;">To paste</span>
          <ul>
            <li>In Excel ctrl-c an array of cells</li>
            <li>Click on a cell and ctrl-v</li>
            <li>Look at cell data and bound data change</li>
          </ul>
        </div>
        <p>
          <hci-grid [title]="'Copy Paste Grid'"
                    [data]="copyPasteData"
                    [columnDefinitions]="copyPasteColumns"
                    [cellSelect]="true">
          </hci-grid>
        </p>
        <div style="padding: 20px;">
          <span style="font-weight: bold;">Bound Data</span>
          <div style="font-weight: bold;">
            <span style="width: 100px; display: inline-block;">idPatient</span>
            <span style="width: 100px; display: inline-block;">firstName</span>
            <span style="width: 100px; display: inline-block;">lastName</span>
            <span style="width: 200px; display: inline-block;">dob</span>
            <span style="width: 100px; display: inline-block;">pcg.nLabs</span>
            <span style="width: 200px; display: inline-block;">pcg.nested.nLabPath</span>
          </div>
          <div *ngFor="let row of copyPasteData">
            <span style="width: 100px; display: inline-block;">{{row.idPatient}}</span>
            <span style="width: 100px; display: inline-block;">{{row.firstName}}</span>
            <span style="width: 100px; display: inline-block;">{{row.lastName}}</span>
            <span style="width: 200px; display: inline-block;">{{row.dob}}</span>
            <span style="width: 100px; display: inline-block;">{{row.pcg.nLabs}}</span>
            <span style="width: 200px; display: inline-block;">{{row.pcg.nested.nLabPath}}</span>
          </div>
        </div>
      </div>
    </div>
    `
})
export class CopyPasteGridComponent {

  copyPasteData: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1976-01-05T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1975-02-03T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1974-03-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1973-04-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1972-05-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1971-06-11T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  copyPasteColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", visible: false }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "pcg.nLabs", name: "# Labs" }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path" })
  ];

}
