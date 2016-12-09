import { Component, OnInit } from "@angular/core";

import { Column, LabelCell } from "hci-ng2-grid/index";

@Component({
  selector: "alerts-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Alert Popup</h2>
    </div>
    <div style="padding: 20px;">
        TODO
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Alerts Grid'"
                [inputData]="data1"
                [columnDefinitions]="columns1"
                [onAlert]="onAlertCall1"
                [cellSelect]="true">
      </hci-grid>
      <div>
        {{ message1 }}
      </div>
    </div>
    <div style="min-height: 10px; background-color: red; border: black 1px solid; border-radius: 5px; margin: 20px;"></div>
    <div style="padding: 20px;">
      <span style="font-size: 28px; font-weight: bold;">Logging Grid</span>
    </div>
    <div style="padding: 20px;">
        The previous example had alerts filter/sort/page.  Here we have alerts filter and sort, but paging is left
        to the grid.  So our service applies filters and sorts to the data and always returns the full remaining dataset
        which leaves the paging to the grid.
    </div>
    <div style="padding: 20px; margin-bottom: 100px;">
      <hci-grid [title]="'Alerts Grid'"
                [inputData]="data2"
                [columnDefinitions]="columns2"
                [level]="DEBUG"
                [onAlert]="onAlertCall2">
      </hci-grid>
      <div>
        {{ message2 }}
      </div>
    </div>
    `
})
export class AlertsGridComponent implements OnInit {

  message1: string = "";
  message2: string = "";

  public onAlertCall1: Function;
  public onAlertCall2: Function;

  data1: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns1: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: LabelCell }),
    new Column({ field: "lastName", name: "Last Name", template: LabelCell }),
    new Column({ field: "middleName", name: "Middle Name", template: LabelCell }),
    new Column({ field: "firstName", name: "First Name", template: LabelCell }),
    new Column({ field: "gender", name: "Gender", template: LabelCell }),
    new Column({ field: "address", name: "Address", template: LabelCell })
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
    new Column({ field: "idPatient", name: "ID", template: LabelCell }),
    new Column({ field: "lastName", name: "Last Name", template: LabelCell }),
    new Column({ field: "middleName", name: "Middle Name", template: LabelCell }),
    new Column({ field: "firstName", name: "First Name", template: LabelCell }),
    new Column({ field: "gender", name: "Gender", template: LabelCell }),
    new Column({ field: "address", name: "Address", template: LabelCell })
  ];

  ngOnInit() {
    console.log("AlertsGridComponent.ngOnInit");
    this.onAlertCall1 = this.handleAlertCall1.bind(this);
    this.onAlertCall2 = this.handleAlertCall2.bind(this);
  }

  public handleAlertCall1(message: string): void {
    console.log("handleAlertCall1");
    this.message1 = message;
  }

  public handleAlertCall2(message: string): void {
    console.log("handleAlertCall2");
    this.message2 = message;
  }
}
