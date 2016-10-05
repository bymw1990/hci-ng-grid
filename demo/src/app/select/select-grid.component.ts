import { Component } from "@angular/core";

import { Column, LabelCell } from "hci-ng2-grid/index";

@Component({
  selector: "select-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Row Select</h2>
    </div>
    <div style="padding: 20px;">
      Double click on a row.
      <span *ngIf="clickedData !== null" style="margin-left: 40px; font-weight: bold;">Double Clicked Key: <span style="color: red;">{{ clickedData }}</span></span>
    </div>
    <div style="padding: 20px;">
      <hci-grid [inputData]="data1"
                [columnDefinitions]="columns1"
                [onRowDoubleClick]="onRowDoubleClick">
      </hci-grid>
    </div>
    <div style="min-height: 10px; background-color: red; border: black 1px solid; border-radius: 5px; margin: 20px;"></div>
    <div style="padding: 20px;">
      <span style="font-size: 28px; font-weight: bold;">Multiple Row Select</span>
    </div>
    <div style="padding: 20px;">
      <hci-grid [inputData]="data2"
                [columnDefinitions]="columns2"
                [rowSelect]="true">
      </hci-grid>
    </div>
    `
})
export class SelectGridComponent {

  clickedData: Object = null;

  public onRowDoubleClick: Function;

  data1: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns1: Column[] = [
    new Column({ isKey: true, field: "idPatient", name: "ID", template: LabelCell, visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: LabelCell }),
    new Column({ field: "firstName", name: "First Name", template: LabelCell }),
    new Column({ field: "dob", name: "Date of Birth", template: LabelCell, format: "date:shortDate" }),
    new Column({ field: "pcg.nLabs", name: "# Labs", template: LabelCell }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path", template: LabelCell })
  ];

  data2: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns2: Column[] = [
    new Column({ isKey: true, field: "idPatient", name: "ID", template: LabelCell, visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: LabelCell }),
    new Column({ field: "firstName", name: "First Name", template: LabelCell }),
    new Column({ field: "dob", name: "Date of Birth", template: LabelCell, format: "date:shortDate" }),
    new Column({ field: "pcg.nLabs", name: "# Labs", template: LabelCell }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path", template: LabelCell })
  ];

  ngOnInit() {
    this.onRowDoubleClick = this.handleRowDoubleClick.bind(this);
  }

  public handleRowDoubleClick(id: Object): void {
    console.log("SelectGridComponent.handleRowDoubleClick");
    this.clickedData = id;
  }
}
