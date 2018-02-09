import { Component, OnInit, ViewChild } from "@angular/core";

import { Column } from "hci-ng-grid/index";

@Component({
  selector: "alerts-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Alert Popup</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          Try copying a range of cells and pasting in the bottom right corner.  There will be a toast warning indicating
          that the paste is not valid.  This type of logging of errors and warnings is how I see the messaging service being
          used.<br />
          Here we use a basic toast with a four second hide delay to post errors and warnings.
        </p>
        <p>
          <hci-ng-grid [inputData]="data1"
                       [columnDefinitions]="columns1"
                       [onAlert]="onWarningOrError"
                       [cellSelect]="true">
          </hci-ng-grid>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Logging Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          Here we set the level to debug and add any new message to the top of a text area.  This won't be used in the full
          release.  Will plan to just use the messaging service to broadcast errors and warnings.
        </p>
        <p>
          <hci-ng-grid [inputData]="data2"
                       [columnDefinitions]="columns2"
                       [onAlert]="onDebug"
                       [cellSelect]="true">
          </hci-ng-grid>
        </p>
        <p>
          <span style="font-weight: bold;">Log</span>
          <br />
          <textarea #log style="width: 100%; height: 200px; font-size: 12px;"></textarea>
        </p>
      </div>
    </div>
    `
})
export class AlertsGridComponent implements OnInit {

  @ViewChild("log") log: any;

  messages: Array<string> = new Array<string>();

  public onWarningOrError: Function;
  public onDebug: Function;

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

  data2: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1960-01-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1961-11-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1972-02-15T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1976-03-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1945-04-18T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1988-05-21T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns2: Column[] = [
    new Column({ field: "idPatient", name: "ID", template: "LabelCell" }),
    new Column({ field: "lastName", name: "Last Name", template: "LabelCell" }),
    new Column({ field: "middleName", name: "Middle Name", template: "LabelCell" }),
    new Column({ field: "firstName", name: "First Name", template: "LabelCell" }),
    new Column({ field: "gender", name: "Gender", template: "LabelCell" }),
    new Column({ field: "address", name: "Address", template: "LabelCell" })
  ];

  ngOnInit() {
    this.onWarningOrError = this.handleWarningOrError.bind(this);
    this.onDebug = this.handleDebug.bind(this);
  }

  public handleWarningOrError(message: string): void {
    this.messages.splice(0, 0, message);

    this.trimMessages();

    setTimeout(() => {
      this.removeMessage(message);
    }, 4000);
  }

  public trimMessages() {
    if (this.messages.length > 6) {
      this.messages.splice(6, this.messages.length - 6);
    }
  }

  public removeMessage(message: string) {
    let i: number = null;

    for (i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i] === message) {
        break;
      }
    }
    if (i === 0) {
      this.messages = new Array<string>();
    } else {
      this.messages.splice(i, 1);
    }
  }

  public handleDebug(message: string): void {
    this.log.nativeElement.value = message + "\n" + this.log.nativeElement.value;
  }
}
