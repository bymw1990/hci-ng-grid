import {Component} from "@angular/core";
import {CheckRowSelectView, Column} from "hci-ng-grid";
import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "dynamic-config-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>User Config Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Sets configurable to true.  Click the cog to pull up the config dropdown and modify values.
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config0" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config0>
            <pre>
              &lt;hci-grid
                [data]="data1"
                [configurable]="true"
                [columnDefinitions]="columns1"
                (onConfigChange)="configChange($event)"
                [pageSize]="5"
                [pageSizes]="[5, 10, 25]"&gt;
              &lt;/hci-grid&gt;
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data1"
                    [configurable]="true"
                    [columnDefinitions]="columns1"
                    (onConfigChange)="configChange($event)"
                    [pageSize]="5"
                    [pageSizes]="[5, 10, 25]">
          </hci-grid>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Dynamic Config Grid</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          The grid starts with two columns.  Clicking the buttons toggles between two sets of column definitions.  The
          second one adds a third column.  When the columns change, the grid refreshes.
        </div>
        <div class="card-text">
          <button class="btn btn-primary" (click)="setColumnsA1()">Columns 1</button>
          <button class="btn btn-primary" (click)="setColumnsA2()">Columns 2</button>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [title]="'Dynamic Columns'"
                [data]="data"
                [columnDefinitions]="columnsA"&gt;
              &lt;/hci-grid&gt;
              
              Columns1:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              
              Columns2:
              field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              field: "middleName", name: "Middle Name"
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Dynamic Columns'"
                    [data]="data"
                    [columnDefinitions]="columnsA">
          </hci-grid>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Dynamic Grid Row Select</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          The grid starts with two columns.  Clicking the buttons toggles between two sets of column definitions.  The
          second one adds a third column.  When the columns change, the grid refreshes.
        </div>
        <div class="card-text">
          <button class="btn btn-primary" (click)="setColumnsB1()">Columns 1</button>
          <button class="btn btn-primary" (click)="setColumnsB2()">Columns 2</button>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config2" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config2>
            <pre>
              &lt;hci-grid
                [title]="'Dynamic Columns Row Select'"
                [data]="data"
                [columnDefinitions]="columnsB"&gt;
              &lt;/hci-grid&gt;
              
              Columns1:
              field: "idPatient", name: "ID", visible: false
              field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              
              Columns2:
              field: "idPatient", name: "ID", visible: false
              field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              field: "middleName", name: "Middle Name"
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [title]="'Dynamic Columns Row Select'"
                    [data]="data"
                    [columnDefinitions]="columnsB">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class DynamicConfigGridComponent {

  data1: any[];
  columns1: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name", widthPercent: 50 },
    { field: "middleName", name: "Middle Name", widthPercent: 10 },
    { field: "firstName", name: "First Name" },
    { field: "dob", name: "Date of Birth", dataType: "date" },
    { field: "gender", name: "Gender" },
    { field: "nLabs", name: "# Labs", dataType: "number" },
  ];

  data: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "middleName": "A", "dob": "1952-01-03T00:00-07:00" },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "middleName": "B", "dob": "1971-11-01T00:00-07:00" },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "middleName": "C", "dob": "1980-05-21T00:00-07:00" },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "middleName": "D", "dob": "1976-02-11T00:00-07:00" },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "middleName": "E", "dob": "1955-08-21T00:00-07:00" },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "middleName": "F", "dob": "1950-09-11T00:00-07:00" },
    { "idPatient": 7, "firstName": "Jimmy", "lastName": "Zephod", "middleName": "F", "dob": "1960-01-17T00:00-07:00" }
  ];

  columnsA1: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" }
  ];

  columnsA2: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "middleName", name: "Middle Name" }
  ];

  columnsB1: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30 },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" }
  ];

  columnsB2: any[] = [
    { field: "idPatient", name: "ID", visible: false },
    { field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30 },
    { field: "lastName", name: "Last Name" },
    { field: "firstName", name: "First Name" },
    { field: "middleName", name: "Middle Name" }
  ];

  columnsA: any = this.columnsA1;
  columnsB: any = this.columnsB1;

  constructor(private dataGeneratorService: DataGeneratorService) {}

  ngOnInit() {
    this.data1 = this.dataGeneratorService.getData(123);
  }

  setColumnsA1() {
    this.columnsA = this.columnsA1;
  }

  setColumnsA2() {
    this.columnsA = this.columnsA2;
  }

  setColumnsB1() {
    this.columnsB = this.columnsB1;
  }

  setColumnsB2() {
    this.columnsB = this.columnsB2;
  }

  configChange(config: any) {
    console.debug("configChange");
    console.debug(config);
  }
}
