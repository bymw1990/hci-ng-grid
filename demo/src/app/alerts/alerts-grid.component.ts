import { Component, OnInit, ViewChild } from "@angular/core";

import { Column } from "hci-ng-grid/index";

@Component({
  selector: "alerts-grid",
  template: `
    <div style="padding: 20px;">
      <span style="font-size: 28px; font-weight: bold;">Alert Popup</span>
    </div>
    <div style="padding: 20px;">
        Try copying a range of cells and pasting in the bottom right corner.  There will be a toast warning indicating
        that the paste is not valid.  This type of logging of errors and warnings is how I see the messaging service being
        used.<br />
        Here we use a basic toast with a four second hide delay to post errors and warnings.
    </div>
    <div style="padding: 20px;">
      <hci-grid [inputData]="data1"
                [columnDefinitions]="columns1"
                [level]="'WARN'"
                [onAlert]="onWarningOrError"
                [cellSelect]="true">
      </hci-grid>
      <div style="position: fixed; top: 0px; left: 50%; width: 50%;">
        <div *ngFor="let message of messages"
             style="font-weight: bold; padding: 8px; border: black 1px solid; background-color: #ffeeee; border-radius: 8px;">
           {{ message }}
        </div>
      </div>
    </div>
    <div style="min-height: 10px; background-color: red; border: black 1px solid; border-radius: 5px; margin: 20px;"></div>
    <div style="padding: 20px;">
      <span style="font-size: 28px; font-weight: bold;">Logging Grid</span>
    </div>
    <div style="padding: 20px;">
        Here we set the level to debug and add any new message to the top of a text area.  This won't be used in the full
        release.  Will plan to just use the messaging service to broadcast errors and warnings.
    </div>
    <div style="padding: 20px; margin-bottom: 100px;">
      <hci-grid [inputData]="data2"
                [columnDefinitions]="columns2"
                [level]="'DEBUG'"
                [onAlert]="onDebug"
                [cellSelect]="true">
      </hci-grid>
      <div style="margin-top: 20px;">
        <span style="font-weight: bold;">Log</span>
        <br />
        <textarea #log style="width: 100%; height: 200px; font-size: 12px;"></textarea>
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
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
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
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": 101110000000, "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": 111110000000, "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": 121110000000, "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": 999990000000, "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": 131110000000, "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": 141110000000, "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
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
