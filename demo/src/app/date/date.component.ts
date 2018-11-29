import {Component} from "@angular/core";

import {CompareFilterRenderer, DateEditRenderer} from "hci-ng-grid";

import {DataGeneratorService} from "../services/data-generator.service";

@Component({
  selector: "alerts-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Show Dates</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          This shows the date of birth where the original data is in two different formats.  In both columns, we format
          the data to the same format.  The two dataTypes are "iso8601-date" and "ms-date".  The dataType "date" defaults
          to "iso8601-date".  Both columns use the same @ng-bootstrap datepicker.  When the datepicker selection is saved,
          the NgbDateStruct is parsed in to the original date format.
        </p>
        <p class="card-text">
          Click on a date, change the value, hit enter to save, then click the button below to view the updated data in
          the console.
        </p>
        <p class="card-text">
          <button (click)="showData()">Show Data in Console</button>
        </p>
        <p>
          <hci-grid [data]="data1"
                    [columns]="columns1"
                    [mode]="'spreadsheet'">
          </hci-grid>
        </p>
      </div>
    </div>
    `
})
export class DateDemoComponent {

  data1: any[];

  columns1: any[] = [
    { field: "idPatient", name: "ID", template: "LabelCell" },
    { field: "lastName", name: "Last Name", template: "LabelCell" },
    { field: "firstName", name: "First Name", template: "LabelCell" },
    { field: "dob", name: "DoB ISO8601", dataType: "date", editRenderer: DateEditRenderer, filterRenderer: CompareFilterRenderer },
    { field: "dobms", name: "DoB MS", dataType: "ms-date", editRenderer: DateEditRenderer, filterRenderer: CompareFilterRenderer }
  ];

  constructor(private dataGeneratorService: DataGeneratorService) {
    this.data1 = this.dataGeneratorService.getData(10);
  }

  showData() {
    console.info(this.data1);
  }
}
