import { Component } from "@angular/core";

import { Column, LabelCell, InputCell, DateCell } from "hci-ng2-grid/index";

@Component({
  selector: "dragdrop-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Drag n Drop Grid</h2>
    </div>
    <div style="margin: 20px; padding: 5px; border: black 1px solid; background-color: #ddddff; border-radius: 10px;">
      <div style="font-weight: bold;">
        Drag Some Data
      </div>
      <div style="margin-left: 10px;"
           [dragula]="'dnd1'"
           [dragulaModel]="dragSource">
        <div *ngFor="let row of dragSource" style="background-color: #aaaadd; border: black 1px solid; margin: 2px; padding: 2px; border-radius: 4px; width: 333px;">
            <span style="width: 100px; display: inline-block;">{{row.idPatient}}</span>
            <span style="width: 100px; display: inline-block;">{{row.firstName}}</span>
            <span style="width: 100px; display: inline-block;">{{row.lastName}}</span>
        </div>
      </div>
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Drag Drop Grid'"
                [inputData]="dragdropData"
                [columnDefinitions]="dragdropColumns"
                [dragula]="'dnd1'"
                [dragulaModel]="dragdropData">
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
      <div *ngFor="let row of dragdropData">
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
export class DragDropGridComponent {

  dragSource: Array<Object> = [
    { "idPatient": 10, "firstName": "Bob", "lastName": "Zzz", "dob": 14410000000, "pcg": { "qmatm": "What?", "nLabs": 9, "nested": { "nLabPath": 99 } } },
    { "idPatient": 11, "firstName": "Mary", "lastName": "Yyy", "dob": 166110000000, "pcg": { "qmatm": "Huh?", "nLabs": 9, "nested": { "nLabPath": 99 } } }
  ];

  dragdropData: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  dragdropColumns: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: LabelCell, visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: InputCell }),
    new Column({ field: "firstName", name: "First Name", template: InputCell }),
    new Column({ field: "dob", name: "Date of Birth", template: DateCell }),
    new Column({ field: "pcg.nLabs", name: "# Labs", template: LabelCell }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path", template: InputCell })
  ];

}
