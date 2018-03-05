import {Component, ViewChild} from "@angular/core";

import {Column, GridComponent, CheckRowSelectView, RowDblClickListener} from "hci-ng-grid/index";

@Component({
  selector: "select-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Row Select</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Double click on a row.
          <div class="d-flex flex-nowrap" style="align-items: center; font-size: larger; font-weight: bold;">
            Double Clicked Key: <span style="margin-left: 10px; color: red;">{{clickedRow}}</span>
          </div>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config1" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config1>
            <pre>
              &lt;hci-grid
                [data]="data1"
                [columnDefinitions]="columns1"
                [eventListeners]="listeners1"
                (rowDblClick)="rowDblClick($event)"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              isKey: true, field: "idPatient", name: "ID", visible: false
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY"
              field: "pcg.nLabs", name: "# Labs"
              field: "pcg.nested.nLabPath", name: "# Lab Path"
              
              Listeners:
              listeners1: Array&lt;any&gt; = [
                {{"{"}} type: RowDblClickListener {{"}"}}
              ];
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid [data]="data1"
                    [columnDefinitions]="columns1"
                    [eventListeners]="listeners1"
                    (rowDblClick)="rowDblClick($event)">
          </hci-grid>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Multiple Row Select</h4>
      </div>
      <div class="card-body">
        <div class="card-text">
          Click on check boxes.
          <span>Selected Row IDs:</span>
          <span *ngIf="selectedRows.length === 0">None</span>
          <span *ngFor="let selectedRow of selectedRows" style="padding-left: 5px;">
           {{selectedRow}}
         </span>
        </div>
        <div class="card-text">
          <a class="btn btn-primary" (click)="clearSelectedRows()">Clear Selected Rows</a>
          <a class="btn btn-primary" (click)="deleteSelectedRows()" style="margin-left: 10px;">Delete Selected Rows</a>
        </div>
        <div class="card-text">
          <button type="button" class="btn btn-outline-primary" [ngbPopover]="config2" popoverTitle="Config" placement="right">Show Config</button>
          <ng-template #config2>
            <pre>
              &lt;hci-grid
                #grid2
                [data]="data2"
                [columnDefinitions]="columns2"
                (selectedRows)="setSelectedRows($event)"
                [pageSize]="5"
                [pageSizes]="[5, 10]"&gt;
              &lt;/hci-grid&gt;
              
              Columns:
              field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30
              isKey: true, field: "idPatient", name: "ID", visible: true
              field: "lastName", name: "Last Name"
              field: "firstName", name: "First Name"
              field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY"
              field: "pcg.nLabs", name: "# Labs"
              field: "pcg.nested.nLabPath", name: "# Lab Path"
              
              setSelectedRows(selectedRows: any[]) {{"{"}}
                this.selectedRows = selectedRows;
              {{"}"}}
            
              clearSelectedRows() {{"{"}}
                this.grid2.clearSelectedRows();
              {{"}"}}
            
              deleteSelectedRows() {{"{"}}
                this.grid2.deleteSelectedRows();
              {{"}"}}
            </pre>
          </ng-template>
        </div>
        <p>
          <hci-grid #grid2
                    [data]="data2"
                    [columnDefinitions]="columns2"
                    (selectedRows)="setSelectedRows($event)"
                    [pageSize]="5"
                    [pageSizes]="[5, 10]">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class SelectGridComponent {

  @ViewChild("grid2") grid2: GridComponent;

  selectedRows: any[] = [];
  clickedRow: any;

  listeners1: Array<any> = [
    { type: RowDblClickListener }
  ];

  data1: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1970-01-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1973-01-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1972-01-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1976-01-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1973-01-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1977-01-11T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns1: Column[] = [
    new Column({ isKey: true, field: "idPatient", name: "ID", visible: false }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "pcg.nLabs", name: "# Labs" }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path" })
  ];

  data2: Array<Object> = [
    { "idPatient": 1, "firstName": "Bob", "lastName": "Smith", "dob": "1970-04-01T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 1, "nested": { "nLabPath": 12 } } },
    { "idPatient": 2, "firstName": "Jane", "lastName": "Doe", "dob": "1971-05-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 2, "nested": { "nLabPath": 23 } } },
    { "idPatient": 3, "firstName": "Rick", "lastName": "James", "dob": "1972-06-11T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 3, "nested": { "nLabPath": 34 } } },
    { "idPatient": 4, "firstName": "Rick", "lastName": "James", "dob": "1973-07-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 99, "nested": { "nLabPath": 9 } } },
    { "idPatient": 5, "firstName": "Ragini", "lastName": "Kanth", "dob": "1974-08-21T00:00-07:00", "pcg": { "qmatm": "What?", "nLabs": 4, "nested": { "nLabPath": 45 } } },
    { "idPatient": 6, "firstName": "Sameer", "lastName": "Byrne", "dob": "1975-09-21T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } },
    { "idPatient": 7, "firstName": "Mike", "lastName": "Jones", "dob": "1971-09-21T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } },
    { "idPatient": 8, "firstName": "Grey", "lastName": "White", "dob": "1979-09-21T00:00-07:00", "pcg": { "qmatm": "Huh?", "nLabs": 5, "nested": { "nLabPath": 56 } } }
  ];

  columns2: Column[] = [
    new Column({ field: "select", viewRenderer: CheckRowSelectView, width: 30, minWidth: 30, maxWidth: 30 }),
    new Column({ isKey: true, field: "idPatient", name: "ID", visible: true }),
    new Column({ field: "lastName", name: "Last Name" }),
    new Column({ field: "firstName", name: "First Name" }),
    new Column({ field: "dob", name: "Date of Birth", dataType: "date", format: "MM/DD/YYYY" }),
    new Column({ field: "pcg.nLabs", name: "# Labs" }),
    new Column({ field: "pcg.nested.nLabPath", name: "# Lab Path" })
  ];

  setSelectedRows(selectedRows: any[]) {
    this.selectedRows = selectedRows;
  }

  clearSelectedRows() {
    this.grid2.clearSelectedRows();
  }

  deleteSelectedRows() {
    this.grid2.deleteSelectedRows();
  }

  rowDblClick(event: any) {
    this.clickedRow = +event;
  }
}
