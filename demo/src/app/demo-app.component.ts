import { Component } from "@angular/core";

import { Column, DefaultCell, InputCell, DateCell } from "hci-ng2-grid/index";

@Component({
  selector: "app",
  template: `
    <div style="padding: 20px;">
      <h1>hci-ng2-grid-demo</h1>
    </div>
    <div style="padding: 20px;">
      <div>&lt;tab&gt; through cells</div>
      <div>click on cells</div>
      <div>up/down/left/right on selected cell</div>
      <div>modify input cell values and check bound data changes</div>
      <div>!IP REDOING! after click, ctrl-click on other cells</div>
    </div>
    <div style="padding: 20px;">
      {{dataGridHtml}}
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Test Grid'"
                [inputData]="dataGrid"
                [columnDefinitions]="dataGridColumns"
                [externalFiltering]="true"
                (onExternalFilter)="callExternalFilter()">
      </hci-grid>
    </div>
    <div style="padding: 20px;">
      <span style="font-weight: bold;">Bound Data</span>
      <div style="font-weight: bold;">
        <span style="width: 100px; display: inline-block;">idPatient</span>
        <span style="width: 100px; display: inline-block;">firstName</span>
        <span style="width: 100px; display: inline-block;">lastName</span>
        <span style="width: 150px; display: inline-block;">dob</span>
        <span style="width: 100px; display: inline-block;">pcg.nLabs</span>
        <span style="width: 150px; display: inline-block;">pcg.nested.nLabPath</span>
      </div>
      <div *ngFor="let row of dataGrid">
        <span style="width: 100px; display: inline-block;">{{row.idPatient}}</span>
        <span style="width: 100px; display: inline-block;">{{row.firstName}}</span>
        <span style="width: 100px; display: inline-block;">{{row.lastName}}</span>
        <span style="width: 150px; display: inline-block;">{{row.dob}}</span>
        <span style="width: 100px; display: inline-block;">{{row.pcg.nLabs}}</span>
        <span style="width: 150px; display: inline-block;">{{row.pcg.nested.nLabPath}}</span>
      </div>
    </div>
    `
})
export class DemoAppComponent {

  dataGridHtml: string = `<hci-grid [title]="'Test Grid'" [inputData]="dataGrid" [columnDefinitions]="dataGridColumns" [externalFiltering]="true" (onExternalFilter)="callExternalFilter()"></hci-grid>`;

  dataGrid: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "what": "WHAT?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "what": "WHAT?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "what": "WHAT?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "what": "WHAT?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 5, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "what": "WHAT?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  dataGridColumns: Column[] = [
    new Column("idPatient", "ID", DefaultCell),
    new Column("lastName", "Last Name", InputCell),
    new Column("firstName", "First Name", InputCell),
    new Column("dob", "Date of Birth", DateCell),
    new Column("pcg.nLabs", "# Labs", DefaultCell),
    new Column("pcg.nested.nLabPath", "# Lab Path", InputCell)
  ];

  callExternalFilter() {
    console.log("DemoAppComponent.callExternalFilter: New data from http request.");
    console.log(this.dataGrid);
    if (this.dataGrid) {
       this.dataGrid = this.dataGrid.sort((o1: Object, o2: Object): number => {
       return o1["firstName"].localeCompare(o2["firstName"]);
       });
    }
    console.log("DemoAppComponent.callExternalFilter: Done.");
  }
}
