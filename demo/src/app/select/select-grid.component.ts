import { Component } from "@angular/core";

import { Column } from "hci-ng-grid/index";

@Component({
  selector: "select-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Row Select</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          Double click on a row.
          <span *ngIf="clickedData !== null" style="margin-left: 40px; font-weight: bold;">Double Clicked Key: <span style="color: red;">{{ clickedData }}</span></span>
        </p>
        <p>
          <hci-grid [inputData]="data1"
                    [columnDefinitions]="columns1"
                    [onRowDoubleClick]="onRowDoubleClick">
          </hci-grid>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Multiple Row Select</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          Click on check boxes.
          <span>Selected Row IDs:</span>
          <span *ngIf="selectedRows.length === 0">None</span>
          <span *ngFor="let selectedRow of selectedRows" style="padding-left: 5px;">
           {{selectedRow}}
         </span>
        </p>
        <p>
          <hci-grid [inputData]="data2"
                    [columnDefinitions]="columns2"
                    [rowSelect]="true"
                    [cellSelect]="true"
                    (selectedRows)="setSelectedRows($event)">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class SelectGridComponent {

  selectedRows: any[] = [];
  clickedData: Object = null;

  public onRowDoubleClick: Function;

  data1: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1970-01-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1973-01-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1972-01-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1976-01-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1973-01-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1977-01-11T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns1: Column[] = [
    new Column({ isKey: true, field: "idPatient", name: "ID", template: "LabelCell", visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: "LabelCell" }),
    new Column({ field: "firstName", name: "First Name", template: "LabelCell" }),
    new Column({ field: "dob", name: "Date of Birth", template: "LabelCell", format: "date:shortDate" }),
    new Column({ field: "pcg.nLabs", name: "# Labs", template: "LabelCell" }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path", template: "LabelCell" })
  ];

  data2: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1970-04-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1971-05-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1972-06-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1973-07-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1974-08-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1975-09-21T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns2: Column[] = [
    new Column({ isKey: true, field: "idPatient", name: "ID", template: "LabelCell", visible: false }),
    new Column({ field: "lastName", name: "Last Name", template: "LabelCell" }),
    new Column({ field: "firstName", name: "First Name", template: "LabelCell" }),
    new Column({ field: "dob", name: "Date of Birth", template: "LabelCell", format: "date:shortDate" }),
    new Column({ field: "pcg.nLabs", name: "# Labs", template: "LabelCell" }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path", template: "LabelCell" })
  ];

  ngOnInit() {
    this.onRowDoubleClick = this.handleRowDoubleClick.bind(this);
  }

  public handleRowDoubleClick(id: Object): void {
    this.clickedData = id;
  }

  setSelectedRows(selectedRows: any[]) {
    this.selectedRows = selectedRows;
  }
}
