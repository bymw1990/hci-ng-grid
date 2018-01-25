import {Component} from "@angular/core";

@Component({
  selector: "dynamic-config-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Dynamic Config Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          <button class="btn btn-primary" (click)="setColumns1()">Columns 1</button>
          <button class="btn btn-primary" (click)="setColumns2()">Columns 2</button>
        </p>
        <p>
          <hci-grid [title]="'Dynamic Config Grid'"
                    [inputData]="data"
                    [columnDefinitions]="columns">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class DynamicConfigGridComponent {

  data: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "middleName": "A", "dob": "1952-01-03T00:00-07:00" },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "middleName": "B", "dob": "1971-11-01T00:00-07:00" },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "middleName": "C", "dob": "1980-05-21T00:00-07:00" },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "middleName": "D", "dob": "1976-02-11T00:00-07:00" },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "middleName": "E", "dob": "1955-08-21T00:00-07:00" },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "middleName": "F", "dob": "1950-09-11T00:00-07:00" },
    { "idPatient": 7, "firstName": "Jimmy", "lastName": "Zephod", "middleName": "F", "dob": "1960-01-17T00:00-07:00" }
  ];

  columns1: any[] = [
    { field: "idPatient", name: "ID", template: "LabelCell", visible: false },
    { field: "lastName", name: "Last Name", template: "InputCell" },
    { field: "firstName", name: "First Name", template: "InputCell" }
  ];

  columns2: any[] = [
    { field: "idPatient", name: "ID", template: "LabelCell", visible: false },
    { field: "lastName", name: "Last Name", template: "InputCell" },
    { field: "firstName", name: "First Name", template: "InputCell" },
    { field: "middleName", name: "Middle Name", template: "InputCell" }
  ]

  columns: any = this.columns1;

  setColumns1() {
    this.columns = this.columns1;
  }

  setColumns2() {
    this.columns = this.columns2;
  }
}
