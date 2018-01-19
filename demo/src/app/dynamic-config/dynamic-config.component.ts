import {Component} from "@angular/core";

@Component({
  selector: "dynamic-config-grid",
  template: `
    <div style="padding: 20px;">
      <h2>Dynamic Config Grid</h2>
    </div>
    <div style="padding: 20px;">
      <button class="btn btn-primary" (click)="setColumns1()">Columns 1</button>
      <button class="btn btn-primary" (click)="setColumns2()">Columns 2</button>
    </div>
    <div style="padding: 20px;">
      <hci-grid [title]="'Dynamic Config Grid'"
                [inputData]="data"
                [columnDefinitions]="columns">
      </hci-grid>
    </div>
    `
})
export class DynamicConfigGridComponent {

  data: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "middleName": "A", "dob": 101110000000 },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "middleName": "B", "dob": 111110000000 },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "middleName": "C", "dob": 121110000000 },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "middleName": "D", "dob": 999990000000 },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "middleName": "E", "dob": 131110000000 },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "middleName": "F", "dob": 141110000000 },
    { "idPatient": 7, "firstName": "Jimmy", "lastName": "Zephod", "middleName": "F", "dob": 141110000000 }
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
