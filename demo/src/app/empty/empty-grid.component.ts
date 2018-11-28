import { Component, OnInit } from "@angular/core";
import { Column } from "hci-ng-grid";

import { DataGeneratorService } from "../services/data-generator.service";

@Component({
  selector: "empty-grid",
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Empty Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          What a grid with no data looks like.
        </p>
        <p>
          <hci-grid [title]="'Empty Grid'"
                    [data]="data1"
                    [columns]="[
                      { field: 'lastName', name: 'Last Name' },
                      { field: 'firstName', name: 'First Name' },
                      { field: 'dob', name: 'Date of Birth', dataType: 'date' }
                    ]">
          </hci-grid>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h4>Populate Null Grid</h4>
      </div>
      <div class="card-body">
        <p class="card-text">
          What a grid with no data and no columns.
          <button class="btn btn-primary" (click)="populate()">Populate</button>
        </p>
        <p>
          <hci-grid [title]="'Empty Grid'"
                    [data]="data2"
                    [columns]="columns2">
          </hci-grid>
        </p>
      </div>
    </div>
  `
})
export class EmptyGridComponent {

  data1: Object[] = [];

  data2: Object[] = [];
  columns2: Column[] = [];

  populate() {
    this.data2 = [
      {lastName: "Anne", firstName: "Smith", dob: "1970-11-21T00:00-07:00"},
      {lastName: "Bob", firstName: "Smith", dob: "1971-11-21T00:00-07:00"},
      {lastName: "Charlie", firstName: "Smith", dob: "1972-11-21T00:00-07:00"},
      {lastName: "Delta", firstName: "Smith", dob: "1973-11-21T00:00-07:00"},
      {lastName: "Echo", firstName: "Smith", dob: "1974-11-21T00:00-07:00"}
    ];
    this.columns2 = [
      new Column({field: "lastName", name: "Last Name"}),
      new Column({field: "firstName", name: "First Name"}),
      new Column({field: "dob", name: "Date of Birth", dataType: "date"})
    ];
  }
}
