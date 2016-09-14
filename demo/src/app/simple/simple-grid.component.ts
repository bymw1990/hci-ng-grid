import { Component } from "@angular/core";

import { Column, LabelCell } from "hci-ng2-grid/index";

@Component({
  selector: "simple-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Simple Grid</h2>
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Simple Grid'"
                [inputData]="simpleData"
                [columnDefinitions]="simpleColumns">
      </hci-grid>
    </div>
    `
})
export class SimpleGridComponent {

  simpleData: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  simpleColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: LabelCell, visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: LabelCell }),
    new Column({ field: "firstName", name: "First Name", template: LabelCell }),
    new Column({ field: "dob", name: "Date of Birth", template: LabelCell }),
    new Column({ field: "pcg.nLabs", name: "# Labs", template: LabelCell }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path", template: LabelCell })
  ];

}
