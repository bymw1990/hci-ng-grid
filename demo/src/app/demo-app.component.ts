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
      <div>after click, ctrl-click on other cells</div>
      <div>up/down/left/right on selected cell</div>
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Test Grid'" [inputData]="dataGrid" [columnDefinitions]="dataGridColumns"></hci-grid>
    </div>
    `
})
export class DemoAppComponent {
  dataGridOld: Object[] = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 111110000000, "pcg": { "lastUpdatedDttm": 100000000, "nLabs": 5 } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 999990000000, "pcg": { "lastUpdatedDttm": 200000000, "nLabs": 2 } }
  ];
  dataGrid: Object[] = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000 },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000 },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000 },
    { "idPatient": 4, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000 },
    { "idPatient": 5, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000 }
  ];

  dataGridColumns: Column[] = [
    new Column("idPatient", "ID", DefaultCell),
    new Column("lastName", "Last Name", InputCell),
    new Column("firstName", "First Name", InputCell),
    new Column("dob", "Date of Birth", DateCell)
    //new Column("pcg.nLabs", "# Labs", "BoldCell")
  ];
}
