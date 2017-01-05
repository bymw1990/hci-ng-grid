import { Component } from "@angular/core";

import { Column } from "hci-ng-grid/index";

@Component({
  selector: "simple-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Simple Grid</h2>
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Simple Grid'"
                [inputData]="simpleData1"
                [columnDefinitions]="simpleColumns1">
      </hci-grid>
    </div>
    <div style="padding: 20px;">
      <h2>More Simple Grid</h2>
    </div>
    <div style="padding: 20px;">
      Here we pass the data array and column definitions.  The column definitions specify the complex data path and the
      template type and that is all.  There is no filtering, header, sorting or paging.
    </div>
    <div style="padding: 20px;">
      <hci-grid [inputData]="simpleData2">
        <column-def [field]="'lastName'"></column-def>
        <column-def [field]="'firstName'"></column-def>
        <column-def [field]="'dob'" [template]="'DateCell'"></column-def>
        <column-def [field]="'pcg.nLabs'"></column-def>
        <column-def [field]="'pcg.nested.nLabPath'"></column-def>
      </hci-grid>
    </div>
    <div style="padding: 20px;">
      <h2>Even More Simple Grid</h2>
    </div>
    <div style="padding: 20px;">
      Here the only thing passed in is the data.  Visible label columns are created automatically based on every key
      in the object.
    </div>
    <div style="padding: 20px;">
      <hci-grid [inputData]="simpleData3">
      </hci-grid>
    </div>
  `
})
export class SimpleGridComponent {

  simpleData1: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  simpleColumns1: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: "LabelCell", visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: "LabelCell" }),
    new Column({ field: "firstName", name: "First Name", template: "LabelCell" }),
    new Column({ field: "dob", name: "Date of Birth", template: "DateCell" }),
    new Column({ field: "pcg.nLabs", name: "# Labs", template: "LabelCell" }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path", template: "LabelCell" })
  ];

  simpleData2: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  simpleData3: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith" },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe" },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James" },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James"},
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth" },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne" }
  ];

}
